# 💄 GlamAI Backend — Practical Implementation Guide

## 🧱 1. Backend Responsibilities 

Your backend should do **only 5 core jobs**:

1. **Accept selfie uploads securely**
2. **Analyze face data (Rekognition)**
3. **Generate AI makeup recommendations (OpenAI)**
4. **Store & retrieve user look data (DynamoDB)**
5. **Return AR-ready presets + product links**

Everything else (AR rendering, UI, camera) stays **frontend-only**.

---

## 🧩 2. Backend API Design (REST)

### Base URL

```
https://api.glamai.app
```

### Endpoints

| Method | Endpoint           | Purpose                  |
| ------ | ------------------ | ------------------------ |
| POST   | `/upload-url`      | Get pre-signed S3 URL    |
| POST   | `/analyze`         | Run Rekognition + OpenAI |
| GET    | `/looks/{userId}`  | Get saved looks          |
| POST   | `/looks/save`      | Save a look              |
| GET    | `/look/{uploadId}` | Fetch one look           |

---

## ☁️ 3. AWS Resources (CDK Stack)

### Core Services

```
S3 (selfies)
Lambda (API handlers)
API Gateway (REST)
Rekognition
DynamoDB (UserFaces)
Secrets Manager (OpenAI key)
CloudWatch
```

---

## 📁 4. Project Structure (Recommended)

```
glamai-backend/
├── cdk/
│   └── glamai-stack.ts
├── lambdas/
│   ├── upload-url.ts
│   ├── analyze-face.ts
│   ├── get-looks.ts
│   ├── save-look.ts
│   └── utils/
│       ├── rekognition.ts
│       ├── openai.ts
│       └── dynamodb.ts
├── package.json
└── tsconfig.json
```

---

## 🧠 5. Data Model (DynamoDB)

### Table: `UserFaces`

**PK:** `userId`
**SK:** `uploadId`

```ts
{
  userId: "user-123",
  uploadId: "upload-456",
  skinTone: "medium-warm",
  faceShape: "oval",
  facialFeatures: {
    lips: "full",
    eyes: "almond"
  },
  recommendedLook: {
    name: "Soft Glam",
    products: [...]
  },
  arPresetId: "soft_glam_v1",
  productLinks: [...],
  createdAt: "2025-01-01T10:00:00Z"
}
```

---

## 📸 6. Selfie Upload (Secure S3)

### Lambda: `upload-url.ts`

```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
```

Frontend uploads **directly to S3** — no backend image handling 🔒

---

## 👁️ 7. Facial Analysis (AWS Rekognition)

### `utils/rekognition.ts`

```ts
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
    faceShape: "oval", // derived logic
    landmarks: face?.Landmarks,
  };
}
```

👉 **Store derived data only**, never raw biometric data.

---

## 🤖 8. AI Recommendations (OpenAI)

### `utils/openai.ts`

```ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
});

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
- Reasoning
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(res.choices[0].message.content!);
}
```

---

## 🔁 9. Main AI Pipeline Lambda

### `analyze-face.ts`

```ts
import { analyzeFace } from "./utils/rekognition";
import { generateLook } from "./utils/openai";
import { saveLook } from "./utils/dynamodb";

export const handler = async (event) => {
  const { userId, uploadId } = JSON.parse(event.body);

  const faceData = await analyzeFace(
    process.env.BUCKET!,
    `selfies/${uploadId}.jpg`
  );

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
```

---

## 🪞 10. AR Integration (Backend’s Role)

Backend **only returns**:

```json
{
  "lookName": "Soft Glam",
  "arPresetId": "soft_glam_v1",
  "products": [...]
}
```

Frontend maps `arPresetId` → Banuba / ModiFace preset.

✔ No AR logic on backend
✔ Keeps system scalable

---

## 🔐 11. Security Best Practices

* ✅ S3 bucket **private**
* ✅ Pre-signed URLs only
* ✅ Cognito (optional) for auth
* ✅ OpenAI key in **Secrets Manager**
* ✅ No raw face images in DB
* ✅ TLS enforced via API Gateway

---

## 📦 12. CDK Stack (Minimal Example)

```ts
new lambda.Function(this, "AnalyzeFace", {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: "analyze-face.handler",
  code: lambda.Code.fromAsset("lambdas"),
  environment: {
    BUCKET: bucket.bucketName,
    OPENAI_KEY: secret.secretValue.toString(),
  },
});
```
## 13. Architecture Overview
![My Screenshot](glamai_arch.png)

## 14. Components

# User / Frontend AR SDK

Logs in → gets JWT from Cognito.

Requests recommendations → fetches AR overlays for try-on.

# Authentication (Cognito)

Provides JWT tokens for secure API access.

# API Layer (API Gateway + Lambda)

Endpoint 1: /get-presigned-url → Lambda generates pre-signed S3 URL for selfie upload.

Endpoint 2: /get-recommendation → Lambda fetches recommendation metadata from DynamoDB.

# Selfie Bucket (S3)

Users upload selfies here via pre-signed URL.

S3 Event → Lambda triggers:

Analyze face with Rekognition

Call OpenAI → generate makeup recommendation

Store metadata in DynamoDB

# AR Assets Bucket (S3)

Stores pre-made AR overlay templates (lipstick, eyeshadow, blush).

Frontend fetches templates via pre-signed URLs (or CloudFront).

# DynamoDB

Stores recommendation metadata (colors, products, template references).

# Monitoring (CloudWatch + X-Ray)

Logs API and Lambda execution.

Traces full request flow for debugging.

