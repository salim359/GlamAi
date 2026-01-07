import { analyzeFace } from "./utils/rekognition";
import { generateLook } from "./utils/openai";
import { saveLook } from "./utils/dynamodb";

export const handler = async (event: any) => {
  const { userId, uploadId } = JSON.parse(event.body);

  const faceData = await analyzeFace(process.env.BUCKET!, `selfies/${uploadId}.jpg`);
  const look = await generateLook(faceData);

  await saveLook({
    userId,
    uploadId,
    ...faceData,
    recommendedLook: look,
    arPresetId: look.arPresetId,
    createdAt: new Date().toISOString(),
  });

  return {
    statusCode: 200,
    body: JSON.stringify(look),
  };
};
