from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import json
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from services.auth_service import get_current_user
from services.diet_service import generate_plan, get_user_plans, get_plan_by_id, delete_plan

router = APIRouter(prefix="/api/diet", tags=["diet"])

from typing import Optional, List, Union

class DietPlanRequest(BaseModel):
    dietary_preference: Optional[str] = "vegetarian"
    goal: Optional[str] = "maintenance"
    activity_level: Optional[str] = "moderate"
    allergies: Optional[Union[List[str], str]] = []
    days_count: Optional[int] = 1
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = None

@router.post("/generate", status_code=status.HTTP_201_CREATED)
def create_diet_plan(req: DietPlanRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    raw_allergies = req.allergies
    if isinstance(raw_allergies, str):
        parsed_allergies = [a.strip() for a in raw_allergies.split(",") if a.strip()] if raw_allergies else []
    elif isinstance(raw_allergies, (list, tuple)):
        parsed_allergies = list(raw_allergies)
    else:
        parsed_allergies = []

    preferences_dict = {
        "dietary_preference": req.dietary_preference or "vegetarian",
        "goal": req.goal or "maintenance",
        "activity_level": req.activity_level or "moderate",
        "allergies": parsed_allergies,
        "days_count": req.days_count or 1,
        "age": req.age,
        "weight": req.weight,
        "height": req.height,
        "gender": req.gender,
    }
    plan = generate_plan(db, current_user, preferences_dict)
    loaded_data = json.loads(plan.plan_data)
    first_day_meals = loaded_data.get("days", [{}])[0].get("meals", {})
    top_meals = loaded_data.get("meals", first_day_meals)

    # Format meal text for easy search
    meals_text = str(top_meals)

    return {
        "id": plan.id,
        "message": "Diet plan generated successfully",
        "plan_data": loaded_data,
        "plan_json": loaded_data,
        "meals": meals_text if isinstance(top_meals, str) else meals_text,
        "meals_dict": top_meals,
        "total_calories": plan.target_calories,
        "target_calories": plan.target_calories,
        "dietary_preference": plan.dietary_preference,
        "goal": plan.goal,
    }


@router.get("/plans")
def list_diet_plans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plans = get_user_plans(db, current_user.id)
    return [{
        "id": p.id,
        "title": p.title,
        "goal": p.goal,
        "dietary_preference": p.dietary_preference,
        "target_calories": p.target_calories,
        "generated_by": p.generated_by,
        "created_at": p.created_at
    } for p in plans]

@router.get("/plans/{plan_id}")
def get_diet_plan(plan_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = get_plan_by_id(db, plan_id, current_user.id)
    if not plan:
        raise HTTPException(status_code=404, detail="Diet plan not found")
    
    parsed_data = json.loads(plan.plan_data) if isinstance(plan.plan_data, str) else plan.plan_data
    return {
        "id": plan.id,
        "title": plan.title,
        "goal": plan.goal,
        "dietary_preference": plan.dietary_preference,
        "target_calories": plan.target_calories,
        "generated_by": plan.generated_by,
        "created_at": plan.created_at,
        "plan_data": parsed_data,
        "plan_json": parsed_data
    }


@router.delete("/plans/{plan_id}")
def remove_diet_plan(plan_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = delete_plan(db, plan_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Diet plan not found")
    return {"message": "Diet plan deleted successfully"}
