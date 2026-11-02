import { randomUUID } from "node:crypto";
import {
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import { cmsDb } from "@/lib/cms-db";
import { mediaStorage, MEDIA_BUCKET } from "@/lib/cms-storage";
import {
  requireMember,
  checkMutationOrigin,
  readCmsJson,
  cmsErrorResponse,
  CmsError,
} from "@/lib/cms-access";
import { editablePost } from "@/lib/cms-posts";

export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    checkMutationOrigin(request);
    const member = await requireMember();
    const data = await readCmsJson(request);
    const post = await editablePost(String(data.postId), member);
    if (post.status === "archived")
      throw new CmsError(400, "Cette publication est archivée.");
    const sql = cmsDb();
    if (data.action === "presign") {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(data.mime) ||
        !Number.isInteger(data.size) ||
        data.size < 1 ||
        data.size > 12 * 1024 * 1024
      )
        throw new CmsError(
          400,
          "Choisissez une photo JPG, PNG ou WebP de moins de 12 Mo.",
        );
      const count =
        await sql`SELECT count(*)::int AS total FROM cms_media WHERE owner_email=${member.email} AND created_at>now()-interval '24 hours'`;
      if (count[0].total >= 150)
        throw new CmsError(
          429,
          "La limite quotidienne de photos est atteinte. Réessayez demain.",
        );
      const id = randomUUID();
      const key = `incoming/${post.id}/${id}`;
      await sql`INSERT INTO cms_media(id,post_id,owner_email,object_key,filename,mime,expected_size) VALUES(${id},${post.id},${member.email},${key},${String(data.filename || "photo").slice(0, 180)},${data.mime},${data.size})`;
      const command = new PutObjectCommand({
        Bucket: MEDIA_BUCKET,
        Key: key,
        ContentType: data.mime,
        ContentLength: data.size,
      });
      const url = await getSignedUrl(mediaStorage(), command, {
        expiresIn: 600,
      });
      return Response.json(
        { id, url },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (data.action !== "complete" || !/^[\da-f-]{36}$/.test(data.id))
      throw new CmsError(400, "Import non reconnu.");
    const rows =
      await sql`SELECT * FROM cms_media WHERE id=${data.id} AND post_id=${post.id}`;
    const media = rows[0];
    if (!media) throw new CmsError(404, "Photo introuvable.");
    if (media.ready)
      return Response.json({
        media: {
          id: media.id,
          width: media.width,
          height: media.height,
          type: "image",
          alt: "",
          caption: "",
        },
      });
    const head = await mediaStorage().send(
      new HeadObjectCommand({ Bucket: MEDIA_BUCKET, Key: media.object_key }),
    );
    if (
      head.ContentLength !== media.expected_size ||
      head.ContentLength! > 12 * 1024 * 1024
    )
      throw new CmsError(
        400,
        "Le transfert est incomplet. Réimportez la photo.",
      );
    const object = await mediaStorage().send(
      new GetObjectCommand({ Bucket: MEDIA_BUCKET, Key: media.object_key }),
    );
    const bytes = await object.Body!.transformToByteArray();
    let image: Buffer;
    let width: number, height: number;
    try {
      const converted = await sharp(bytes, { limitInputPixels: 45000000 })
        .rotate()
        .resize({
          width: 2200,
          height: 2200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 86 })
        .toBuffer({ resolveWithObject: true });
      image = converted.data;
      width = converted.info.width;
      height = converted.info.height;
    } catch {
      throw new CmsError(
        400,
        "Cette photo ne peut pas être lue. Exportez-la en JPG puis réessayez.",
      );
    }
    const key = `photos/${post.id}/${media.id}.webp`;
    await mediaStorage().send(
      new PutObjectCommand({
        Bucket: MEDIA_BUCKET,
        Key: key,
        Body: image,
        ContentType: "image/webp",
      }),
    );
    for (const size of [480, 800]) {
      const small = await sharp(image)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      await mediaStorage().send(
        new PutObjectCommand({
          Bucket: MEDIA_BUCKET,
          Key: key.replace(".webp", `-${size}.webp`),
          Body: small,
          ContentType: "image/webp",
        }),
      );
    }
    await sql`UPDATE cms_media SET object_key=${key},mime='image/webp',width=${width},height=${height},ready=true WHERE id=${media.id}`;
    await mediaStorage()
      .send(
        new DeleteObjectCommand({
          Bucket: MEDIA_BUCKET,
          Key: media.object_key,
        }),
      )
      .catch(() => {});
    return Response.json(
      {
        media: {
          id: media.id,
          width,
          height,
          type: "image",
          alt: "",
          caption: "",
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}
