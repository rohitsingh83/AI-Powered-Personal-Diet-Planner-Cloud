from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from config import settings

from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.diet import router as diet_router
from routes.storage import router as storage_router
from routes.dashboard import router as dashboard_router

app = FastAPI(title="AI-Powered Personal Diet Planner API")

# Configure CORS
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    return {"status": "healthy", "service": "diet-planner-api"}

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Personal Diet Planner API. Visit /docs for documentation."}
