import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

logger = logging.getLogger("uvicorn.error")

# Handle PostgreSQL URI prefix normalization (some providers supply postgres:// instead of postgresql://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Configure connection parameters based on engine type
if "sqlite" in db_url:
    connect_args = {"check_same_thread": False}
    engine_kwargs = {"connect_args": connect_args}
else:
    # PostgreSQL cloud settings (Render, Supabase)
    # connect_timeout prevents indefinite hangs if DNS/IPv6 issues occur
    connect_args = {"connect_timeout": 10}
    engine_kwargs = {
        "connect_args": connect_args,
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

engine = create_engine(db_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Safely initialize database tables on startup.
    Wrapped in try-except to ensure server boots up even during network delays.
    """
    try:
        from models import user, diet_plan, user_file
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified and initialized successfully.")
    except Exception as e:
        logger.error(f"Database initialization warning: {e}")
