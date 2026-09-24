from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.diet_plan import DietPlan
from models.user_file import UserFile
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_plans = db.query(DietPlan).filter(DietPlan.user_id == current_user.id).count()
    total_files = db.query(UserFile).filter(UserFile.user_id == current_user.id).count()
    
    latest_plan = db.query(DietPlan).filter(DietPlan.user_id == current_user.id).order_by(DietPlan.created_at.desc()).first()
    latest_plan_summary = None
    if latest_plan:
        latest_plan_summary = {
            "title": latest_plan.title,
            "goal": latest_plan.goal,
            "created_at": latest_plan.created_at
        }
        
    return {
        "user_name": current_user.name,
        "user_goal": current_user.goal,
        "user_preference": current_user.dietary_preference,
        "total_plans": total_plans,
        "total_files": total_files,
        "latest_plan_summary": latest_plan_summary
    }
