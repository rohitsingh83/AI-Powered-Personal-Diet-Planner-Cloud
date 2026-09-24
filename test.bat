@echo off
TITLE Running Automated Cloud Diet Planner Tests
echo Running automated test suite with Pytest...
call venv\Scripts\activate.bat
pytest tests/ -v
pause
