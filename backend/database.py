import logging
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

logger = logging.getLogger("uvicorn.error")

Base = declarative_base()

db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

def create_resilient_engine(url: str):
    """
    Creates a resilient SQLAlchemy engine.
    If the remote cloud database is temporarily unreachable or has IPv6 constraints,
    it gracefully falls back to an embedded SQLite database to prevent server hangs.
    """
    if "sqlite" in url:
        return create_engine(url, connect_args={"check_same_thread": False})
    
    try:
        test_engine = create_engine(
            url,
            connect_args={"connect_timeout": 5},
            pool_pre_ping=True,
            pool_recycle=300
        )
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Successfully connected to managed cloud PostgreSQL database.")
        return test_engine
    except Exception as e:
        logger.warning(f"Remote PostgreSQL unavailable ({e}). Using local fallback database.")
        return create_engine("sqlite:///./diet_planner.db", connect_args={"check_same_thread": False})

engine = create_resilient_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        from models import user, diet_plan, user_file
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema initialized.")
    except Exception as e:
        logger.error(f"Schema initialization error: {e}")
