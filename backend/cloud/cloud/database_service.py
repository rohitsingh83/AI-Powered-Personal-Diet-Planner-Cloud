"""
=============================================================
Cloud Database Service — Abstraction Layer
=============================================================
Provides a consistent interface for database operations.
Local: SQLite via SQLAlchemy (zero-config, no cloud needed)
Cloud: Can be swapped to PostgreSQL / Firestore / Supabase
       by changing the DATABASE_URL environment variable.

This abstraction demonstrates the cloud computing concept of
Database-as-a-Service (DBaaS) — the application code doesn't
need to know whether the database is local or cloud-hosted.
=============================================================
"""

import os
import logging

logger = logging.getLogger(__name__)


def get_database_url() -> str:
    """
    Get the database connection URL.
    Supports SQLite (local) and PostgreSQL (cloud).

    Cloud Computing Concept: Environment-based configuration
    allows the same code to run locally or in the cloud by
    simply changing an environment variable.
    """
    url = os.getenv("DATABASE_URL", "sqlite:///./diet_planner.db")
    logger.info(f"Database backend: {'SQLite (local)' if 'sqlite' in url else 'Cloud PostgreSQL'}")
    return url


def check_database_health(db_url: str) -> dict:
    """
    Check if the database is reachable and healthy.

    Cloud Computing Concept: Health checks are essential for
    cloud deployments — load balancers and orchestrators use
    them to route traffic and restart unhealthy instances.
    """
    try:
        from sqlalchemy import create_engine, text
        engine = create_engine(db_url)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "backend": db_url.split("://")[0]}
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}


# ── Cloud Deployment Notes ──────────────────────────────────
#
# To switch from SQLite to a cloud database:
#
# 1. Google Cloud SQL (PostgreSQL):
#    DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/PROJECT:REGION:INSTANCE
#
# 2. Supabase (PostgreSQL):
#    DATABASE_URL=postgresql://postgres:pass@db.xxxx.supabase.co:5432/postgres
#
# 3. Firebase Firestore:
#    Would require rewriting the data layer to use Firestore SDK
#    instead of SQLAlchemy. The route/service layer stays the same.
#
# 4. AWS RDS (PostgreSQL):
#    DATABASE_URL=postgresql://user:pass@instance.region.rds.amazonaws.com:5432/dbname
#
# The application code does NOT change — only the environment variable.
# This is the power of cloud abstraction!
