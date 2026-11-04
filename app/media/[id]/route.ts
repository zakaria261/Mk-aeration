import { GetObjectCommand } from "@aws-sdk/client-s3";
import { cmsDb } from "@/lib/cms-db";
import { currentMember } from "@/lib/cms-access";
import { mediaStorage, MEDIA_BUCKET } from "@/lib/cms-storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[\da-f-]{36}$/.test(id)) return new Response(null, { status: 404 });
  try {
    const rows =
      await cmsDb()`SELECT m.object_key,m.owner_email,p.published,EXISTS(SELECT 1 FROM cms_site_settings s WHERE s.key='site' AND m.id=ANY(s.published_media)) AS site_public FROM cms_media m LEFT JOIN cms_posts p ON p.id=m.post_id WHERE m.id=${id} AND m.ready=true`;
    const item = rows[0];
    if (!item) return new Response(null, { status: 404 });
    const isPublic = Boolean(
      item.site_public ||
        item.published?.media?.some((m: { id: string }) => m.id === id),
    );
    if (!isPublic) {
      const member = await currentMember();
      if (
        !member ||
        (member.role !== "admin" && member.email !== item.owner_email)
      )
        return new Response(null, {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        });
    }
    const w = new URL(request.url).searchParams.get("w");
    if (w && !["480", "800"].includes(w))
      return new Response(null, { status: 400 });
    const key = w
      ? item.object_key.replace(".webp", `-${w}.webp`)
      : item.object_key;
    const object = await mediaStorage().send(
      new GetObjectCommand({ Bucket: MEDIA_BUCKET, Key: key }),
    );
    return new Response(object.Body!.transformToWebStream(), {
      headers: {
        "Content-Type": "image/webp",
        "Content-Length": String(object.ContentLength),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": isPublic
          ? "public, max-age=60, s-maxage=60"
          : "private, no-store",
      },
    });
  } catch {
    return new Response(null, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
