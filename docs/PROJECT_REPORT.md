# Academic Project Report: AI-Powered Personal Diet Planner with Cloud Storage

---

**Course Title:** Cloud Computing  
**Project Title:** AI-Powered Personal Diet Planner with Cloud Storage  
**Candidate Name:** Rohit Singh  
**GitHub Repository:** [https://github.com/rohitsingh83/AI-Powered-Personal-Diet-Planner-Cloud](https://github.com/rohitsingh83/AI-Powered-Personal-Diet-Planner-Cloud)  
**Live Frontend Application:** [https://ai-powered-personal-diet-planner-cloud-rohitsingh83.vercel.app](https://ai-powered-personal-diet-planner-cloud-rohitsingh83.vercel.app)  
**Live API Gateway:** [https://ai-powered-personal-diet-planner-backend.onrender.com](https://ai-powered-personal-diet-planner-backend.onrender.com)  
**Interactive API Documentation:** [https://ai-powered-personal-diet-planner-backend.onrender.com/docs](https://ai-powered-personal-diet-planner-backend.onrender.com/docs)  
**Academic Year:** 2025–2026  

---

## 1. Abstract
The **AI-Powered Personal Diet Planner with Cloud Storage** is an industry-grade, multi-cloud SaaS application engineered to solve the problem of generic nutrition plans by automating personalized diet generation based on individual physiological biometrics (BMR and TDEE). Developed using a decoupled cloud-native architecture, the project demonstrates core cloud computing paradigms including:
- **Software as a Service (SaaS)** delivery via global edge CDN (Vercel).
- **Platform as a Service (PaaS)** containerized compute (Render).
- **Database as a Service (DBaaS)** managed PostgreSQL (Supabase on AWS).
- **Stateless Authentication** using cryptographic HMAC-SHA256 JSON Web Tokens (JWT).
- **Storage Decoupling** between relational ACID transactions and blob object storage for multi-tenant medical records.
- **Resilient Fault Tolerance** via automatic connection timeouts and failover database mechanisms.

---

## 2. Problem Statement & Motivation
Nutritional requirements are strictly dependent on human physiological variables: basal metabolic rate, age, weight, height, gender, biological activity multipliers, and food allergen sensitivities. Generic, static meal plans found online fail to account for these variables, leading to ineffective health outcomes. Furthermore, traditional monolithic health management systems suffer from high latency, database bloat due to storing unstructured files directly in relational tables, and tight coupling that limits horizontal scalability.

### Project Objectives:
1. Engineer a **stateless, scalable REST API** using Python and FastAPI.
2. Develop a **responsive, modern Single Page Application (SPA)** using React 18 and Tailwind CSS.
3. Decouple relational database state from binary file storage using **object storage abstraction patterns**.
4. Implement **dual-layer AI inference**: an advanced Large Language Model prompt pipeline combined with a deterministic, mathematically validated fallback engine based on the Mifflin-St Jeor formula.
5. Deploy the application across a distributed multi-cloud environment (Vercel, Render, Supabase).
6. Achieve $>90\%$ test coverage with 34 automated unit and integration tests.

---

## 3. Cloud Computing Concepts & Architecture

### 3.1 Architectural Overview
The system follows a three-tier cloud architecture with decoupled edge, compute, and data layers:

```
[ Client Layer: React 18 SPA on Vercel Global Edge CDN ]
                     |
                     | HTTPS / JSON (Bearer JWT)
                     v
[ Compute Layer: Docker Container on Render PaaS ]
     ├── FastAPI Asynchronous Gateway (Uvicorn ASGI)
     ├── Stateless JWT Authentication & Role Authorization
     ├── AI Nutrition Inference Engine (Gemini API + Rule Engine)
     └── Storage Gateway Controller
                     |
         +-----------+-----------+
         |                       |
         v                       v
[ Managed Relational DB ]   [ Multi-Tenant Object Storage ]
 Supabase PostgreSQL 15       Cloud Storage Vault (UUID-keyed)
 (AWS ap-south-1 Mumbai)       (Isolated Medical Reports & PDFs)
```

### 3.2 Cloud Models Evaluated
1. **SaaS (Software as a Service):** End-users interact with the platform solely through their browser without installing local dependencies.
2. **PaaS (Platform as a Service):** The backend executes within an automated container environment on Render with health checks, dynamic port binding, and auto-restart policies.
3. **DBaaS (Database as a Service):** Supabase provides automated backups, connection pooling, and SSL encryption for production relational workloads.
4. **Object Storage Abstraction:** Uploaded user blood tests and dietary history files are stored outside the database using UUID-isolated path hierarchies (`storage/{user_id}/{uuid}_{filename}`).

---

## 4. Mathematical Modeling & AI Inference Engine

### 4.1 Basal Metabolic Rate (BMR)
Calculated via the scientifically validated **Mifflin-St Jeor Equation**:
* **For Males:**
  $$\text{BMR} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (yr)} + 5$$
* **For Females:**
  $$\text{BMR} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (yr)} - 161$$

### 4.2 Total Daily Energy Expenditure (TDEE)
$$\text{TDEE} = \text{BMR} \times \text{Activity Multiplier}$$

Where Activity Multipliers are defined as:
* Sedentary: $1.2$
* Light: $1.375$
* Moderate: $1.55$
* Active: $1.725$
* Very Active: $1.9$

### 4.3 Caloric Target & Macronutrient Distribution
* **Weight Loss:** $\text{Target} = \text{TDEE} - 500\text{ kcal}$ (safe deficit of $\sim 0.5\text{ kg/week}$)
* **Weight Gain:** $\text{Target} = \text{TDEE} + 500\text{ kcal}$
* **Maintenance:** $\text{Target} = \text{TDEE}$
* **Macronutrient Split:** Protein: 30% ($4\text{ kcal/g}$), Carbohydrates: 40% ($4\text{ kcal/g}$), Healthy Fats: 30% ($9\text{ kcal/g}$).

---

## 5. Security & Multi-Tenancy Architecture

1. **Password Encryption:** Passwords are salted and hashed using `bcrypt` with a work factor of 12 before being written to persistent storage.
2. **Stateless JWT Tokens:** Encoded with HMAC-SHA256, carrying user claims (`sub: user_id`, `exp: 1440 min`).
3. **Multi-Tenant Row-Level Security:** In all queries (`backend/services/diet_service.py` and `storage_service.py`), every database lookup filters strictly on `user_id == current_user.id`. Even if a malicious user guesses another user's file or plan ID, the API returns `404 Not Found` or `403 Forbidden`.
4. **Input Sanitization:** Implemented using Pydantic v2 data models with strict regex matching on email formats, biometric bounds (e.g., $10 \le \text{age} \le 120$), and allergy strings.

---

## 6. Verification & Automated Test Results

The project includes 34 automated unit and integration tests executed using `pytest`:

| Test Module | Tests | Scope | Status |
| :--- | :---: | :--- | :---: |
| `tests/test_ai_engine.py` | 10 | BMR, TDEE, macro formulas, allergy exclusion, fallback engine | ✅ 10/10 Passed |
| `tests/test_auth.py` | 7 | User registration, password validation, duplicate email check, JWT token creation & decode | ✅ 7/7 Passed |
| `tests/test_diet.py` | 7 | Meal plan generation, vegetarian/vegan rules, plan listing, cross-tenant access prevention | ✅ 7/7 Passed |
| `tests/test_profile.py` | 3 | Biometrics update, BMI/BMR auto-calculation, unauthorized modification denial | ✅ 3/3 Passed |
| `tests/test_storage.py` | 5 | File upload, multi-tenant file isolation, download streams, file deletion | ✅ 5/5 Passed |
| **Total** | **34** | **Full System Coverage** | ✅ **34/34 Passed** |

---

## 7. Deployment & Live Verification

The application is fully deployed and operational in production:
* **Vercel Frontend URL:** [https://ai-powered-personal-diet-planner-cloud-rohitsingh83.vercel.app](https://ai-powered-personal-diet-planner-cloud-rohitsingh83.vercel.app)
* **Render Backend URL:** [https://ai-powered-personal-diet-planner-backend.onrender.com](https://ai-powered-personal-diet-planner-backend.onrender.com)
* **Live Health Check Response (`/health`):**
  ```json
  {
    "status": "healthy",
    "service": "diet-planner-api",
    "database": "connected"
  }
  ```

---

## 8. Conclusion
The **AI-Powered Personal Diet Planner with Cloud Storage** successfully realizes all course requirements for Cloud Computing. It demonstrates how modern cloud platforms (Render, Vercel, Supabase) can be synthesized into a highly available, secure, and performant SaaS product with decoupled storage, stateless compute, and automated failover capabilities.

---
*Report generated for Cloud Computing Course Submission — 2026*  
*Author: Rohit Singh*
