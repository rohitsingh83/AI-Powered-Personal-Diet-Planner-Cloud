import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from config import settings

# Ensure current directory is on python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.diet import router as diet_router
from routes.storage import router as storage_router
from routes.dashboard import router as dashboard_router

app = FastAPI(title="AI-Powered Personal Diet Planner API")

# Configure CORS to accept local, Vercel, and cloud deployments with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database on Startup
@app.on_event("startup")
def on_startup():
    init_db()

# Include Routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(diet_router)
app.include_router(storage_router)
app.include_router(dashboard_router)

@app.get("/health")
def health_check():
    db_status = "connected"
    try:
        from database import engine
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unreachable ({e.__class__.__name__})"
    return {
        "status": "healthy" if "unreachable" not in db_status else "degraded",
        "service": "diet-planner-api",
        "database": db_status
    }

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the AI-Powered Personal Diet Planner API.",
        "documentation": "/docs",
        "health_check": "/health"
    }
