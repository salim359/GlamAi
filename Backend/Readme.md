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
## 5. Architecture Overview
![My Screenshot](glamai_arch.png)

## 6. Components

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

