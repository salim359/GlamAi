# 💄 GlamAI 
**AI-Powered Makeup Recommendation & Virtual Try-On App**

GlamAI is a mobile application that combines **AI**, **facial recognition**, and **Augmented Reality (AR)** to deliver hyper-personalized makeup recommendations and real-time virtual try-on experiences. Built with **React Native** and a **serverless AWS architecture**, GlamAI allows users to upload a selfie, receive AI-curated makeup suggestions, and instantly try them on using AR

---

## 🧠 Overview

**Flow:**
Selfie Upload → Facial Analysis (AWS Rekognition) → AI Recommendations (OpenAI) → AR Virtual Try-On → Save or Buy

GlamAI analyzes facial features and skin tone to recommend suitable makeup products and enables users to preview these looks live using AR technology.

---

## 🎯 Business Goals
1. **Accept selfie uploads securely**
2. **Analyze face data (Rekognition)**
3. **Generate AI makeup recommendations (OpenAI)**
4. **Store & retrieve user look data (DynamoDB)**
5. **Return AR-ready presets + product links**

---

## 👩‍💻 Target Users
* **Beauty Enthusiasts** – Explore personalized looks with AR
* **Beginners** – Get AI guidance on shades and styles
* **Makeup Artists** – Preview and share looks with clients
* **Online Shoppers** – Try before buying, directly in-app
### Base URL

---
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

