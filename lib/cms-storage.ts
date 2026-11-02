import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export const MEDIA_BUCKET = "chantier-medias";
let client: S3Client | undefined;
export function mediaStorage() {
  const {
    AWS_REGION,
    AWS_ENDPOINT_URL_S3,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
  } = process.env;
  if (
    !AWS_REGION ||
    !AWS_ENDPOINT_URL_S3 ||
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY
  )
    throw new Error("CMS_STORAGE_UNAVAILABLE");
  return (client ??= new S3Client({
    region: AWS_REGION,
    endpoint: AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  }));
}
