# Setup Guide: AI-Powered Personal Diet Planner

Follow this step-by-step guide to set up, run, and test the AI-Powered Personal Diet Planner locally.

## Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Git**
- SQLite (included with Python)

---

## Step 1: Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/yourusername/AI-Powered-Personal-Diet-Planner-Cloud.git
cd AI-Powered-Personal-Diet-Planner-Cloud
```

## Step 2: Create a Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

## Step 3: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

## Step 4: Configure Backend Environment Variables
Inside the `backend` folder, create a `.env` file:
```env
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here # Optional: Leave blank to use Rule-Based fallback
```

## Step 5: Start the Backend Server
```bash
cd backend
uvicorn app:app --reload --port 8000
```
*The backend API is now running at `http://localhost:8000`.*

## Step 6: Install Frontend Dependencies
Open a NEW terminal window and navigate to the `frontend` folder:
```bash
cd frontend
npm install
```

## Step 7: Configure Frontend Environment Variables
Inside the `frontend` folder, create a `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

## Step 8: Start the Frontend Development Server
```bash
npm run dev
```
*The frontend is now running at `http://localhost:5173`.*

## Step 9: Register a New User
1. Open `http://localhost:5173` in your browser.
2. Click on "Register" or "Sign Up".
3. Enter your Name, Email, and Password, then submit.

## Step 10: Complete Your Profile
1. Log in with your new credentials.
2. Navigate to the "Profile" section.
3. Fill in your details (Age, Weight, Height, Gender, Dietary Preferences, Allergies).
4. Save your profile.

## Step 11: Generate a Diet Plan
1. Go to the "Diet Plan" or "Generate" section.
2. Click "Generate My Plan". 
3. The AI Engine (or rule-based fallback) will create a personalized plan based on your profile.

## Step 12: Save and View the Plan
1. Verify the plan looks correct.
2. It is automatically saved to the database. You can view it in the "My Plans" section anytime.

## Step 13: Upload a File (Simulating Cloud Storage)
1. Go to the "Documents" or "Storage" section.
2. Upload a relevant file (e.g., blood report, previous diet plan PDF).
3. The backend will save it and generate a downloadable link.

## Step 14: Download the Uploaded File
1. In the "Documents" list, click the download button next to your uploaded file.
2. Verify the file downloads correctly.

## Step 15: Run the Test Suite & Verify
Back in your terminal (with the python virtual environment activated):
```bash
# From the project root
pytest tests/
```
You should see output indicating all tests passed, proving the backend logic works perfectly!

---

## Troubleshooting Common Issues

**1. `ModuleNotFoundError: No module named 'fastapi'`**
Ensure your virtual environment is activated before running pip install or starting the server.

**2. Port 8000 is already in use**
Run uvicorn on a different port: `uvicorn backend.main:app --reload --port 8001` and update your frontend `.env` to match.

**3. Frontend won't connect to Backend (CORS errors)**
Ensure `http://localhost:5173` is added to the CORS origins list in `backend/main.py`.

**4. No AI API Key?**
The system will automatically fallback to the rule-based engine. No errors will occur!
