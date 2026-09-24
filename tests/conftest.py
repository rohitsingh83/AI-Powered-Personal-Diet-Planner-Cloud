import sys
import os

# Add root and backend to python path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BACKEND_DIR = os.path.join(PROJECT_ROOT, 'backend')
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import app
from database import Base, get_db
import models
import models.user
import models.diet_plan
import models.user_file
import utils.security
from models.user import User
from utils.security import hash_password, create_access_token

# Alias backend submodules into sys.modules to prevent duplicate class registrations in tests
sys.modules["backend.models"] = models
sys.modules["backend.models.user"] = models.user
sys.modules["backend.models.diet_plan"] = models.diet_plan
sys.modules["backend.models.user_file"] = models.user_file
sys.modules["backend.auth"] = utils.security

# In-memory SQLite database for isolated test execution
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables once for the test engine
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def test_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Clean up data between test runs while keeping table schema intact
        with engine.begin() as conn:
            for table in reversed(Base.metadata.sorted_tables):
                conn.execute(table.delete())

@pytest.fixture(scope="function")
def test_app(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(test_db):
    user = User(
        email="test@example.com",
        name="Test User",
        hashed_password=hash_password("TestPass123"),
        age=25,
        height=175.0,
        weight=70.0,
        activity_level="moderate",
        dietary_preference="vegetarian",
        goal="maintenance"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user

@pytest.fixture(scope="function")
def auth_headers(test_user):
    access_token = create_access_token(data={"sub": test_user.id})
    return {"Authorization": f"Bearer {access_token}"}
