# Interview Preparation & Resume Assets

## 10 Common Interview Questions & Answers

**1. Explain your project.**
*Answer:* I built an AI-Powered Personal Diet Planner, a full-stack cloud application that generates personalized meal plans. It uses a React frontend, a FastAPI Python backend, and integrates AI (Gemini API with a custom rule-based fallback). It allows users to register securely, track profiles, generate dietary plans, and upload health reports using cloud storage concepts.

**2. Why cloud computing?**
*Answer:* Cloud computing provides scalability, reliability, and abstraction. Instead of managing physical hardware, I designed this app using SaaS and PaaS concepts, making it easy to deploy, scale during high traffic, and integrate managed services like cloud databases and object storage.

**3. Cloud database vs cloud storage?**
*Answer:* I used a relational database for structured data (User accounts, Plan JSON data) because it requires ACID transactions and complex querying. I implemented cloud storage (object storage) for unstructured files like PDF medical reports because object storage is significantly cheaper and more scalable for binary files.

**4. How does the AI engine work?**
*Answer:* The engine takes user demographics and calculates their Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Based on their goal, it sets a caloric target. It then formats a prompt for an LLM API to generate the meals. If the API fails or is unavailable, a secondary rule-based engine dynamically constructs a plan using dietary templates and string matching for allergies.

**5. How did you secure user data?**
*Answer:* I used bcrypt for password hashing so raw passwords are never saved. For API security, I implemented stateless JWT (JSON Web Tokens). Users cannot access other users' diet plans or files because every endpoint verifies the JWT and validates ownership against the database.

**6. Role of REST APIs?**
*Answer:* REST APIs act as the bridge between my frontend and backend. They enforce a decoupled, client-server architecture. By keeping the API stateless, the backend can easily be deployed across multiple cloud instances behind a load balancer without worrying about session affinity.

**7. What if the AI API fails?**
*Answer:* I implemented a resilience pattern. My system catches the API timeout/error and gracefully degrades to a custom rule-based engine. This ensures high availability and continuous user experience even when third-party services are down.

**8. How would you scale this application?**
*Answer:* I would migrate the SQLite database to a managed Cloud SQL instance (PostgreSQL). The backend is completely stateless thanks to JWT, so I can deploy it to Kubernetes or Cloud Run to horizontally scale. Static frontend assets would be served via a CDN.

**9. How did you test the application?**
*Answer:* I wrote a comprehensive suite of unit and integration tests using `pytest` and `FastAPI TestClient`. I tested authentication flows, isolated user data access, mathematical BMR accuracy, and storage operations using an in-memory SQLite database.

**10. Future improvements?**
*Answer:* I would add OAuth (Google/GitHub login), integrate payment gateways (Stripe) for premium plans, add Docker support for containerization, and implement real-time progress tracking charts on the dashboard.

---

## Resume Assets

### 2-Line Resume Description
**AI-Powered Personal Diet Planner | Python, React, FastAPI, Cloud Architecture**
Developed a full-stack cloud application providing personalized AI-generated diet plans based on user biometrics. Implemented stateless JWT auth, REST APIs, dual AI/rule-based engine, and abstracted cloud storage/database layers.

### Resume Bullet Points (3)
- Designed and developed a full-stack diet recommendation SaaS using FastAPI and React, supporting secure user authentication, profile management, and file storage.
- Engineered a dual-layer recommendation system integrating a third-party LLM API alongside a custom mathematical rule-based fallback, ensuring 100% availability.
- Implemented robust cloud architecture principles, decoupling structured relational data (database) from unstructured document management (object storage) and establishing a CI/CD testing pipeline.

### LinkedIn Project Description
Excited to share my recent project: an AI-Powered Personal Diet Planner! 🍏💻
I built a full-stack cloud application that takes user biometrics and generates customized diet plans using AI.
Key tech: Python, FastAPI, React, SQLite/PostgreSQL, JWT Auth, and Cloud Storage concepts.
I implemented a robust fallback mechanism—if the AI API is down, a custom rule-based engine calculates BMR/TDEE and generates the plan offline!
Check out the code on GitHub: [Link]

### Technical Skills List
Python, Node.js, React, FastAPI, RESTful APIs, SQLite, PostgreSQL, JWT Authentication, Cloud Architecture (SaaS/PaaS), Object Storage, CI/CD, Git/GitHub, Pytest, CSS/Tailwind.

### GitHub Repo Description
A full-stack cloud SaaS application for generating personalized AI diet plans. Features secure JWT auth, a React UI, a FastAPI backend, and abstracted cloud storage layers. Includes an automated testing pipeline.
