from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import json
import uuid
from database import Base

class DietPlan(Base):
    __tablename__ = "diet_plans"
    __table_args__ = {"extend_existing": True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    goal = Column(String(20), nullable=False)
    dietary_preference = Column(String(20), nullable=False)
    target_calories = Column(Integer, nullable=False)
    plan_data = Column(Text, nullable=False) # JSON string with full plan
    generated_by = Column(String(20), nullable=False) # rule_based or gemini_ai
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="diet_plans")

    def __init__(self, **kwargs):
        if "title" not in kwargs:
            kwargs["title"] = "Sample Diet Plan"
        if "goal" not in kwargs:
            kwargs["goal"] = "maintenance"
        if "dietary_preference" not in kwargs:
            kwargs["dietary_preference"] = "vegetarian"
        if "target_calories" not in kwargs:
            kwargs["target_calories"] = 2000
        if "generated_by" not in kwargs:
            kwargs["generated_by"] = "rule_based"
        if "plan_data" in kwargs and isinstance(kwargs["plan_data"], (dict, list)):
            kwargs["plan_data"] = json.dumps(kwargs["plan_data"])
        super().__init__(**kwargs)
