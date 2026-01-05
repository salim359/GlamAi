# 💄 GlamAI

**AI-Powered Makeup Recommendation & Virtual Try-On App**

GlamAI is a mobile application that combines **AI**, **facial recognition**, and **Augmented Reality (AR)** to deliver hyper-personalized makeup recommendations and real-time virtual try-on experiences. Built with **React Native** and a **serverless AWS architecture**, GlamAI allows users to upload a selfie, receive AI-curated makeup suggestions, and instantly try them on using AR.

---

## 🧠 Overview

**Flow:**
Selfie Upload → Facial Analysis (AWS Rekognition) → AI Recommendations (OpenAI) → AR Virtual Try-On → Save or Buy

GlamAI analyzes facial features and skin tone to recommend suitable makeup products and enables users to preview these looks live using AR technology.

---

## 🎯 Business Goals

* Deliver **personalized, AI-driven makeup recommendations**
* Enable **real-time AR try-on** to improve user confidence
* Connect recommendations directly to **purchase options**
* Build a **scalable, serverless architecture** using AWS CDK

---

## 👩‍💻 Target Users

* **Beauty Enthusiasts** – Explore personalized looks with AR
* **Beginners** – Get AI guidance on shades and styles
* **Makeup Artists** – Preview and share looks with clients
* **Online Shoppers** – Try before buying, directly in-app

---

## ⚙️ Core Features

* 📸 **Selfie Upload** (Camera or Gallery)
* 🧑‍🦰 **Facial Analysis** using AWS Rekognition
* 🤖 **AI Makeup Recommendations** via OpenAI
* 💄 **AR Virtual Try-On** (Real-time overlays)
* 🎨 **Look Filters** (Natural, Glam, Bold)
* 🛍️ **Product Links** for direct purchase
* ❤️ **Saved Looks & User Profiles**

---

## 🧱 System Architecture

### 📱 Frontend (React Native)

* React Native (iOS & Android)
* AR SDK: Banuba / ModiFace / Snap AR
* Camera: Expo Camera / Vision Camera
* Styling: Tailwind RN / React Native Paper
* Navigation: Expo Router

### ☁️ Backend (AWS Serverless via CDK)

* **AWS Lambda** – Core business logic
* **AWS Rekognition** – Facial analysis
* **OpenAI API** – AI-powered recommendations
* **Amazon DynamoDB** – User & look data
* **Amazon S3** – Selfie & AR asset storage
* **API Gateway** – Secure REST APIs
* **CloudWatch** – Monitoring & logging

---

## 🧬 DynamoDB Data Model (UserFaces)

| Attribute       | Type   | Description        |
| --------------- | ------ | ------------------ |
| userId          | PK     | Unique user ID     |
| uploadId        | SK     | Selfie session ID  |
| skinTone        | String | Detected skin tone |
| facialFeatures  | Map    | Rekognition data   |
| recommendedLook | Map    | AI-generated look  |
| arPresetId      | String | Linked AR preset   |
| productLinks    | List   | Purchase URLs      |
| createdAt       | String | Timestamp          |

---

## 💋 AR Virtual Try-On

* Uses **ARKit (iOS)** / **ARCore (Android)**
* Live facial tracking with digital makeup overlays
* Users can switch looks, capture photos, and share

```js
import { ARView } from 'banuba-react-native-sdk';

export default function TryOnScreen({ route }) {
  const { recommendedLook } = route.params;
  return <ARView preset={recommendedLook.arPresetId} style={{ flex: 1 }} />;
}
```

---

## 🧭 User Flow

1. Onboard / Sign In
2. Upload Selfie
3. AI Analysis (Rekognition + OpenAI)
4. View Recommended Looks & Products
5. AR Try-On
6. Save, Share, or Buy

---

## 🔐 Security & Privacy

* Private S3 buckets for image storage
* Facial data anonymized (only derived metrics stored)
* HTTPS enforced via API Gateway
* Optional authentication with AWS Cognito
* GDPR / CCPA compliant design

---

## 🧰 Tech Stack Summary

**Frontend:** React Native, Expo, Tailwind RN, AR SDK
**Backend:** AWS Lambda, Rekognition, DynamoDB, API Gateway
**Infrastructure:** AWS CDK
**AI:** OpenAI API
**Storage:** Amazon S3
**Monitoring:** CloudWatch

---

## 🗓️ Development Roadmap

* Phase 1: AWS CDK Infrastructure
* Phase 2: React Native App & API Integration
* Phase 3: AI Pipeline (Rekognition + OpenAI)
* Phase 4: AR Virtual Try-On
* Phase 5: Product & E-commerce Integration
* Phase 6: Optimization & Release

---

## 💡 Future Enhancements

* Multi-face try-on
* AI “Look of the Day”
* Skincare recommendations
* Third-party e-commerce integrations

---

## 🎨 Inspiration

* Dior AR Makeup Experience
* Banuba Makeup AR Platform

---

## ✅ Summary

**GlamAI** delivers an intelligent, immersive beauty experience by combining **AI recommendations**, **AR virtual try-on**, and a **scalable AWS serverless backend**—all in one modern mobile app.
