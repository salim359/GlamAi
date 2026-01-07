import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({});

export const handler = async () => {
  const uploadId = crypto.randomUUID();
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET!,
    Key: `selfies/${uploadId}.jpg`,
    ContentType: "image/jpeg",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadId, url }),
  };
};
