from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    age = Column(Integer, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    gender = Column(String(20), nullable=True, default="male")
    activity_level = Column(String(20), nullable=True)
    dietary_preference = Column(String(20), nullable=True)
    goal = Column(String(20), nullable=True)
    allergies = Column(Text, nullable=True) # JSON string
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    diet_plans = relationship("DietPlan", back_populates="user", cascade="all, delete-orphan")
    files = relationship("UserFile", back_populates="user", cascade="all, delete-orphan")
