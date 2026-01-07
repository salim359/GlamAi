import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function generateLook(faceData: any) {
  const prompt = `
User facial profile:
Skin tone: ${faceData.skinTone}
Face shape: ${faceData.faceShape}

Generate:
- Look name
- Foundation shade
- Lipstick shade
- Eyeshadow colors
- AR preset ID
- Product links
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content!);
}
