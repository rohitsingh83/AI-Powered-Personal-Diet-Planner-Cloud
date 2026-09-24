# Deployment Guide

This project can be deployed using two approaches depending on your budget and requirements.

## Local vs Cloud Comparison

| Feature | Local Environment | Cloud Environment |
|---------|-------------------|-------------------|
| Database | SQLite (File-based) | PostgreSQL (Managed Service) |
| Storage | Local Disk (/uploads) | Object Storage (AWS S3 / GCS) |
| Compute | Local `localhost:8000` | Cloud Run / Render (Scalable) |
| Security | Basic local CORS | HTTPS / SSL Certificates |
| Uptime | 0% (When PC is off) | 99.9% (Always On) |

---

## Approach A: Student-Friendly Free Tier (Render / Railway)

This approach is entirely free and great for portfolios.

### 1. Database Setup
- Create an account on [Render.com](https://render.com) or [Railway.app](https://railway.app).
- Create a new PostgreSQL database.
- Copy the External Database URL.

### 2. Backend Deployment
- On Render, create a new **Web Service**.
- Connect your GitHub repository.
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `DATABASE_URL`: (Paste the Postgres URL from step 1)
  - `SECRET_KEY`: (Generate a random string)
  - `GEMINI_API_KEY`: (Your Gemini API Key)

*Screenshot Placeholder: [Render Web Service Config]*

### 3. Frontend Deployment
- Create a new **Static Site** on Render.
- Connect the same repository.
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- **Environment Variables:**
  - `VITE_API_URL`: (The URL of your deployed backend)

*Screenshot Placeholder: [Frontend Deployment Success]*

---

## Approach B: Google Cloud Platform (Enterprise)

### 1. Database (Cloud SQL)
```bash
gcloud sql instances create diet-db --database-version=POSTGRES_14 --tier=db-f1-micro
gcloud sql databases create planner_db --instance=diet-db
```

### 2. Storage (Cloud Storage)
```bash
gcloud storage buckets create gs://diet-planner-uploads --location=us-central1
```

### 3. Backend (Cloud Run)
Create a `Dockerfile` in the backend directory, then deploy:
```bash
gcloud builds submit --tag gcr.io/your-project/backend
gcloud run deploy diet-backend --image gcr.io/your-project/backend --platform managed --allow-unauthenticated
```
Set environment variables securely using Google Secret Manager during deployment.

### 4. Frontend (Firebase Hosting or Cloud Storage)
```bash
npm run build
firebase deploy --only hosting
```

*Screenshot Placeholder: [GCP Console Dashboard showing deployed services]*
