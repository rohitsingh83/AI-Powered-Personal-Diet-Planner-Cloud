"""
Diet Service — Business logic for diet plan generation and management.
Orchestrates AI engine, database persistence, and plan retrieval.
"""

import sys
import os
import json
from sqlalchemy.orm import Session
from models.diet_plan import DietPlan
from models.user import User
from config import settings

# Import AI Engine from project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
from ai_engine.diet_engine import generate_diet_plan


def generate_plan(db: Session, user: User, preferences_dict: dict) -> DietPlan:
    """
    Generate a personalized diet plan using the AI engine.
    Uses user profile data + form preferences to build the plan.
    Saves the generated plan to the database.
    """
    # Extract allergy input safely
    raw_allergies = preferences_dict.get("allergies")
    if raw_allergies:
        if isinstance(raw_allergies, str):
            allergies = [a.strip() for a in raw_allergies.split(",") if a.strip()]
        else:
            allergies = list(raw_allergies)
    elif user.allergies:
        try:
            allergies = json.loads(user.allergies)
            if isinstance(allergies, str):
                allergies = [a.strip() for a in allergies.split(",") if a.strip()]
        except Exception:
            allergies = [a.strip() for a in user.allergies.split(",") if a.strip()]
    else:
        allergies = []

    plan_result = generate_diet_plan(
        dietary_preference=preferences_dict.get("dietary_preference") or user.dietary_preference or "vegetarian",
        goal=preferences_dict.get("goal") or user.goal or "maintenance",
        activity_level=preferences_dict.get("activity_level") or user.activity_level or "moderate",
        allergies=allergies,
        weight_kg=preferences_dict.get("weight") or user.weight or 70,
        height_cm=preferences_dict.get("height") or user.height or 170,
        age=preferences_dict.get("age") or user.age or 25,
        sex=preferences_dict.get("gender") or getattr(user, "gender", "male") or "male",
        days_count=preferences_dict.get("days_count", 1),
        api_key=settings.GEMINI_API_KEY if settings.GEMINI_API_KEY else None,
    )

    # Extract metadata from the generated plan
    title = plan_result.get("title", f"Diet Plan — {preferences_dict.get('goal', 'General').replace('_', ' ').title()}")
    target_calories = plan_result.get("target_calories_per_day", 0)
    generated_by = plan_result.get("generated_by", "rule_based_engine")

    # Create database record
    db_plan = DietPlan(
        user_id=user.id,
        title=title,
        goal=preferences_dict.get("goal", ""),
        dietary_preference=preferences_dict.get("dietary_preference", ""),
        target_calories=target_calories,
        plan_data=json.dumps(plan_result),
        generated_by=generated_by,
    )

    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


def get_user_plans(db: Session, user_id: str):
    """Get all diet plans for a specific user, newest first."""
    return (
        db.query(DietPlan)
        .filter(DietPlan.user_id == user_id)
        .order_by(DietPlan.created_at.desc())
        .all()
    )


def get_plan_by_id(db: Session, plan_id: str, user_id: str) -> DietPlan | None:
    """
    Get a specific plan by ID, scoped to the user.
    User isolation: a user can only access their own plans.
    """
    return (
        db.query(DietPlan)
        .filter(DietPlan.id == plan_id, DietPlan.user_id == user_id)
        .first()
    )


def delete_plan(db: Session, plan_id: str, user_id: str) -> bool:
    """Delete a plan. Returns True if deleted, False if not found."""
    plan = get_plan_by_id(db, plan_id, user_id)
    if plan:
        db.delete(plan)
        db.commit()
        return True
    return False
