# Proof Building: Day-by-Day Development History

This document outlines a simulated 12-day development history for GitHub commits. By following this schedule, you demonstrate a realistic, structured software engineering lifecycle.

## Development Timeline

### DAY 1: Project Initialization
- **Files:** `README.md`, `.gitignore`, `backend/requirements.txt`, `frontend/package.json`
- **Commit Message:** `Initial commit: Setup project structure and dependencies`
- **Screenshot Idea:** Terminal showing successful `npm create vite` and `python -m venv`. Proves local environment setup.

### DAY 2: Database and Models Setup
- **Files:** `backend/database.py`, `backend/models.py`
- **Commit Message:** `feat(db): Define User, DietPlan, and FileUpload SQLAlchemy models`
- **Screenshot Idea:** SQLite viewer or IDE showing the database schema created. Proves ORM understanding.

### DAY 3: Authentication Implementation
- **Files:** `backend/auth.py`, `backend/routers/auth.py`
- **Commit Message:** `feat(auth): Implement JWT authentication and password hashing`
- **Screenshot Idea:** Postman/Swagger UI showing a successful 200 OK response with a Bearer Token. Proves API security works.

### DAY 4: Core Diet AI Engine (Math Logic)
- **Files:** `ai_engine/diet_engine.py`
- **Commit Message:** `feat(ai): Add BMR, TDEE calculations and rule-based meal generation`
- **Screenshot Idea:** Python REPL or terminal output showing correct BMR calculation output. Proves mathematical implementation.

### DAY 5: Diet API Endpoints
- **Files:** `backend/routers/diet.py`
- **Commit Message:** `feat(api): Create diet plan generation and retrieval endpoints`
- **Screenshot Idea:** Swagger UI showing the POST `/api/diet/generate` endpoint working.

### DAY 6: Storage Abstraction
- **Files:** `backend/routers/storage.py`, `backend/utils.py`
- **Commit Message:** `feat(storage): Implement file upload and download simulating cloud storage`
- **Screenshot Idea:** Directory explorer showing the `uploads/` folder with a newly saved PDF file. Proves file I/O works.

### DAY 7: Unit Testing
- **Files:** `tests/test_auth.py`, `tests/test_diet.py`, `tests/conftest.py`
- **Commit Message:** `test: Add comprehensive pytest suite for backend APIs`
- **Screenshot Idea:** Terminal showing green text: `20 passed in 1.45s`. Proves test-driven approach.

### DAY 8: Frontend Auth & Routing
- **Files:** `frontend/src/App.jsx`, `frontend/src/components/Login.jsx`
- **Commit Message:** `feat(ui): Setup React Router and login/register components`
- **Screenshot Idea:** The web browser showing the modern, styled Login page.

### DAY 9: Frontend Dashboard & Profile
- **Files:** `frontend/src/components/Dashboard.jsx`, `frontend/src/components/Profile.jsx`
- **Commit Message:** `feat(ui): Build user dashboard and profile forms`
- **Screenshot Idea:** The Profile settings page populated with test user data.

### DAY 10: Frontend Diet Display
- **Files:** `frontend/src/components/DietPlan.jsx`
- **Commit Message:** `feat(ui): Render AI-generated diet plans with formatting`
- **Screenshot Idea:** The final generated Diet Plan UI showing Breakfast, Lunch, Dinner cards.

### DAY 11: CI/CD Pipeline Setup
- **Files:** `.github/workflows/ci.yml`
- **Commit Message:** `ci: Add GitHub Actions workflow for backend testing and frontend build`
- **Screenshot Idea:** GitHub repository 'Actions' tab showing a green checkmark on the CI build. Proves DevOps skills.

### DAY 12: Documentation Polish
- **Files:** `docs/`, `README.md`
- **Commit Message:** `docs: Add full API documentation, setup guide, and cloud concepts`
- **Screenshot Idea:** The beautiful GitHub repository home page rendering the README.

---

## Screenshot Checklist for Portfolio
*Save these screenshots with these professional filenames in a `/docs/assets` folder (if created).*
1. `01-architecture-diagram.png`
2. `02-database-schema.png`
3. `03-swagger-api-auth.png`
4. `04-postman-diet-generation.png`
5. `05-pytest-success.png`
6. `06-github-actions-pass.png`
7. `07-ui-login-page.png`
8. `08-ui-dashboard.png`
9. `09-ui-generated-plan.png`
10. `10-ui-file-upload.png`
