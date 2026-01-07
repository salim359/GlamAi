import { RekognitionClient, DetectFacesCommand } from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({});

export async function analyzeFace(bucket: string, key: string) {
  const command = new DetectFacesCommand({
    Image: { S3Object: { Bucket: bucket, Name: key } },
    Attributes: ["ALL"],
  });

  const { FaceDetails } = await rekognition.send(command);
  const face = FaceDetails?.[0];

  return {
    skinTone: face?.Confidence! > 90 ? "medium-warm" : "unknown",
    faceShape: "oval",
    landmarks: face?.Landmarks,
  };
}
