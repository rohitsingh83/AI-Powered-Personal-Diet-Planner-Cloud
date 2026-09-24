# Cloud Computing Concepts Applied

This document maps theoretical cloud computing concepts to actual implementations within this project.

## 1. Cloud Service Models
- **SaaS (Software as a Service):** The entire Diet Planner web app functions as a SaaS. Users consume the software over the internet without worrying about underlying infrastructure.
- **PaaS (Platform as a Service):** The backend (FastAPI) and frontend (React) are designed to be deployed on platforms like Render, Heroku, or Google Cloud Run, abstracting away OS management.
- **IaaS (Infrastructure as a Service):** If deployed on AWS EC2 or GCP Compute Engine, we are utilizing raw virtual machines, storage, and networking layers.

## 2. Cloud Storage vs Cloud Database vs Object Storage
- **Cloud Database:** Relational structured data (Users, Profiles, Plans history). Implemented locally as SQLite, maps to **Google Cloud SQL (PostgreSQL)** or AWS RDS in production. Reference: `backend/database.py`.
- **Object/Cloud Storage:** Unstructured data (User PDFs, Medical Reports). Implemented locally as filesystem storage in `backend/storage.py`, designed to seamlessly transition to **Amazon S3** or **Google Cloud Storage**.

## 3. Authentication & Authorization
- **Concept:** Secure identity verification in distributed systems.
- **Implementation:** Stateless JWT (JSON Web Tokens) are used. The server doesn't need to store session state, making it highly scalable (a core cloud computing requirement).
- **Code:** `backend/auth.py`.

## 4. REST API & Client-Server Architecture
- **Concept:** Decoupling front-end user interfaces from back-end logic, communicating over stateless protocols (HTTP).
- **Implementation:** React acts as the Client. FastAPI is the Server. They exchange JSON over HTTP.
- **Code:** `frontend/src/api` and `backend/main.py`.

## 5. Serverless Computing Concepts
- **Concept:** Executing code without provisioning servers.
- **Implementation:** The AI Engine module acts as a stateless function. It takes an input (user profile) and returns an output (diet plan). This is ripe for migration to **AWS Lambda** or **Google Cloud Functions**.

## 6. Scalability, Availability, Elasticity
- **Scalability:** The stateless JWT auth and separate database/storage tiers allow the FastAPI backend to be scaled horizontally (running 10 copies behind a load balancer).
- **Elasticity:** Cloud PaaS providers can automatically spin up more instances of the API during heavy traffic (e.g., post-New Year resolutions).
- **Availability:** Using managed databases (Cloud SQL) ensures the database survives individual node failures.

## 7. Load Balancing, API Gateway
- **Concept:** Distributing traffic across servers.
- **Implementation:** When deployed to Google Cloud Run or Render, an implicit load balancer routes incoming HTTPS requests to the active containers. Our frontend talks to a single API URL (`VITE_API_URL`), acting as the gateway.

## 8. Environment Variables & Secrets Management
- **Concept:** Keeping sensitive credentials out of source code.
- **Implementation:** The `.env` files manage `SECRET_KEY`, `DATABASE_URL`, and `GEMINI_API_KEY`. In production, this maps to **AWS Secrets Manager** or **Google Secret Manager**.

## 9. Cloud Security, Logging, Monitoring
- **Concept:** Securing data at rest and in transit; auditing system behavior.
- **Implementation:** Passwords are hashed using `bcrypt` before hitting the database. Cross-Origin Resource Sharing (CORS) policies are enforced. Standard logging is configured in FastAPI to track endpoint usage.

## 10. Deployment, CI/CD
- **Concept:** Automated testing and release pipelines.
- **Implementation:** GitHub Actions (`.github/workflows/ci.yml`) runs automated tests on every push. In cloud scenarios, this triggers an automatic deployment to the PaaS provider if tests pass.
