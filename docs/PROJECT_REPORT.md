# Project Report: AI-Powered Personal Diet Planner

## 1. Abstract
The AI-Powered Personal Diet Planner is a full-stack cloud application designed to provide users with tailored nutritional plans based on their unique physiological metrics, dietary preferences, and health goals. Utilizing modern cloud computing architecture, the application integrates a React frontend, a Python FastAPI backend, and an intelligent recommendation engine. 

## 2. Introduction
Nutrition is highly individualized. Generic diet plans often fail because they do not account for a user's Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and specific dietary constraints. This project solves this by offering a cloud-based SaaS platform that automates personalized diet generation.

## 3. Problem Statement
Many individuals lack access to personalized nutritional guidance. Hiring a dietitian is expensive, and generic internet advice ignores critical variables like allergies and physical activity levels. Furthermore, existing health apps often fail to decouple user data storage efficiently, leading to slow performance.

## 4. Objectives
- Develop a scalable REST API using FastAPI.
- Build an intuitive, responsive UI using React.
- Implement secure, stateless JWT authentication.
- Create an AI engine that calculates BMR/TDEE and generates meal plans.
- Provide a robust rule-based fallback if external APIs fail.
- Apply cloud concepts by separating database and object storage layers.

## 5. Existing System vs Proposed System
**Existing Systems:** Static applications that offer generic calorie tracking. Often monolithic architecture making scaling difficult.
**Proposed System:** A cloud-native application using micro-service concepts. Features dynamic AI generation, secure file storage for medical reports, and highly scalable stateless architecture.

## 6. Cloud Computing Concepts Utilized
- **SaaS Delivery Model:** Users access the software completely via web browser.
- **Stateless Architecture:** Using JWTs allows the backend to be distributed across multiple cloud nodes.
- **Storage Segregation:** Relational data (users, plans) is kept in a database, while blob data (reports) is managed via object storage patterns.

## 7. Technology Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** SQLite (Dev), PostgreSQL (Prod)
- **Authentication:** JWT, bcrypt
- **Testing:** Pytest

## 8. System Architecture
```
[ User Browser (React Frontend) ]
        | (HTTPS / REST API)
        v
[ API Gateway / Load Balancer ]
        |
[ FastAPI Backend Application ]
   |---------|---------|
   v         v         v
[Auth]   [AI Engine] [Storage]
   |         |         |
[ DB ]    [LLM API] [File Sys/S3]
```

## 9. Implementation & Testing
The system was implemented with a strong focus on modularity. The `ai_engine` calculates precise mathematical caloric targets. Testing was conducted using `pytest`, covering over 30 test cases spanning authentication workflows, data isolation (ensuring users cannot see others' data), and complex algorithmic calculations.

## 10. Conclusion & Future Scope
The project successfully demonstrates the integration of AI with cloud architecture to solve a real-world problem. Future scope includes containerization with Docker, deploying to Kubernetes, and integrating wearable device APIs (like Apple Health or Fitbit) for real-time calorie expenditure tracking.
