from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Union, List
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from services.auth_service import get_current_user
import json

router = APIRouter(prefix="/api/profile", tags=["profile"])

class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    gender: Optional[str] = None
    activity_level: Optional[str] = None
    dietary_preference: Optional[str] = None
    goal: Optional[str] = None
    allergies: Optional[Union[List[str], str]] = None

@router.get("/")
def get_profile(current_user: User = Depends(get_current_user)):
    allergies_list = []
    if current_user.allergies:
        try:
            parsed = json.loads(current_user.allergies)
            if isinstance(parsed, list):
                allergies_list = parsed
            elif isinstance(parsed, str):
                allergies_list = [a.strip() for a in parsed.split(",") if a.strip()]
        except Exception:
            allergies_list = [a.strip() for a in current_user.allergies.split(",") if a.strip()]
            
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "age": current_user.age,
        "height": current_user.height,
        "weight": current_user.weight,
        "gender": getattr(current_user, "gender", "male") or "male",
        "activity_level": current_user.activity_level,
        "dietary_preference": current_user.dietary_preference,
        "goal": current_user.goal,
        "allergies": allergies_list
    }

@router.put("/")
def update_profile(profile_in: ProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if profile_in.age is not None: current_user.age = profile_in.age
    if profile_in.height is not None: current_user.height = profile_in.height
    if profile_in.weight is not None: current_user.weight = profile_in.weight
    if profile_in.gender is not None: current_user.gender = profile_in.gender
    if profile_in.activity_level is not None: current_user.activity_level = profile_in.activity_level
    if profile_in.dietary_preference is not None: current_user.dietary_preference = profile_in.dietary_preference
    if profile_in.goal is not None: current_user.goal = profile_in.goal
    if profile_in.allergies is not None: 
        if isinstance(profile_in.allergies, str):
            allergies_list = [a.strip() for a in profile_in.allergies.split(",") if a.strip()]
        else:
            allergies_list = profile_in.allergies
        current_user.allergies = json.dumps(allergies_list)
        
    db.commit()
    db.refresh(current_user)

    allergies_result = []
    if current_user.allergies:
        try:
            allergies_result = json.loads(current_user.allergies)
        except Exception:
            allergies_result = []

    return {
        "message": "Profile updated successfully",
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "age": current_user.age,
        "height": current_user.height,
        "weight": current_user.weight,
        "gender": getattr(current_user, "gender", "male") or "male",
        "activity_level": current_user.activity_level,
        "dietary_preference": current_user.dietary_preference,
        "goal": current_user.goal,
        "allergies": allergies_result
    }
