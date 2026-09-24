@echo off
TITLE AI-Powered Personal Diet Planner — Cloud Computing Project
echo ============================================================
echo   Starting AI-Powered Personal Diet Planner (Dev Environment)
echo ============================================================

REM Check if venv exists
IF NOT EXIST "venv" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
) ELSE (
    call venv\Scripts\activate.bat
)

REM Seed demo data if database doesn't exist
IF NOT EXIST "diet_planner.db" (
    echo Seeding demo accounts and mock cloud files...
    python backend\seed_data.py
)

echo Starting FastAPI Backend on http://localhost:8000 ...
start "Diet Planner Backend" cmd /k "venv\Scripts\activate.bat && cd backend && uvicorn app:app --reload --port 8000"

echo Starting React Vite Frontend on http://localhost:5173 ...
start "Diet Planner Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo   Application Launched!
echo   • Frontend:  http://localhost:5173
echo   • Backend:   http://localhost:8000
echo   • API Docs:  http://localhost:8000/docs
echo   • Demo User: demo@example.com / Demo@12345
echo ============================================================
pause
