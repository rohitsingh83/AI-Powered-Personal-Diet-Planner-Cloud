"""
=============================================================
Seed Demo Data Script — Cloud Computing Project
=============================================================
Populates the database with realistic demo accounts, sample
biometric profiles, AI-generated diet plans, and simulated cloud
storage files for instant presentation and evaluation.

Usage:
    python backend/seed_data.py
=============================================================
"""

import sys
import os
import json
from pathlib import Path

# Add backend and root to sys.path
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(PROJECT_ROOT))

from database import init_db, SessionLocal
from models.user import User
from models.diet_plan import DietPlan
from models.user_file import UserFile
from utils.security import hash_password
from ai_engine.diet_engine import generate_diet_plan
from cloud.storage_service import get_storage_backend

def seed():
    print("🌱 Initializing Database Schema...")
    init_db()
    db = SessionLocal()

    demo_email = "demo@example.com"
    demo_password = "Demo@12345"

    try:
        # 1. Check or Create Demo User
        existing_user = db.query(User).filter(User.email == demo_email).first()
        if existing_user:
            print(f"ℹ️ Demo user already exists: {demo_email}")
            user = existing_user
        else:
            print(f"👤 Creating Demo User: {demo_email}")
            user = User(
                name="Demo User",
                email=demo_email,
                hashed_password=hash_password(demo_password),
                age=25,
                height=175.0,
                weight=70.0,
                gender="male",
                activity_level="moderate",
                dietary_preference="vegetarian",
                goal="maintenance",
                allergies=json.dumps(["peanuts"]),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print("✅ User created successfully.")

        # 2. Seed Sample Diet Plans if none exist
        existing_plans = db.query(DietPlan).filter(DietPlan.user_id == user.id).all()
        if not existing_plans:
            print("🥗 Generating & Seeding Demo Diet Plans...")
            # Plan 1: Vegetarian Maintenance
            plan_data_1 = generate_diet_plan(
                dietary_preference="vegetarian",
                goal="maintenance",
                activity_level="moderate",
                allergies=["peanuts"],
                weight_kg=70,
                height_cm=175,
                age=25,
                sex="male",
                days_count=3,
            )
            plan_1 = DietPlan(
                user_id=user.id,
                title="🥗 3-Day Vegetarian Balanced Maintenance",
                goal="maintenance",
                dietary_preference="vegetarian",
                target_calories=plan_data_1.get("target_calories", 2150),
                plan_data=json.dumps(plan_data_1),
                generated_by="rule_based_engine",
            )
            db.add(plan_1)

            # Plan 2: Weight Loss Focus
            plan_data_2 = generate_diet_plan(
                dietary_preference="vegetarian",
                goal="weight_loss",
                activity_level="active",
                allergies=["peanuts"],
                weight_kg=70,
                height_cm=175,
                age=25,
                sex="male",
                days_count=1,
            )
            plan_2 = DietPlan(
                user_id=user.id,
                title="🔥 1-Day Active Deficit Plan",
                goal="weight_loss",
                dietary_preference="vegetarian",
                target_calories=plan_data_2.get("target_calories", 1850),
                plan_data=json.dumps(plan_data_2),
                generated_by="rule_based_engine",
            )
            db.add(plan_2)
            db.commit()
            print("✅ Seeded 2 demo diet plans.")
        else:
            print(f"ℹ️ Found {len(existing_plans)} existing diet plans.")

        # 3. Seed Sample Cloud Storage Files if none exist
        storage = get_storage_backend()
        existing_files = db.query(UserFile).filter(UserFile.user_id == user.id).all()
        if not existing_files:
            print("☁️ Seeding Demo Cloud Storage Objects...")
            # File 1: Mock Blood Report PDF
            pdf_content = b"%PDF-1.4 Mock Blood Test Report for Demo User\nCholesterol: 180 mg/dL\nGlucose: 90 mg/dL\nStatus: Healthy\n%%EOF"
            filename_1 = "blood_report_2026.pdf"
            storage_path_1 = storage.upload_file(pdf_content, filename_1, user.id)
            user_file_1 = UserFile(
                user_id=user.id,
                filename=filename_1,
                original_filename=filename_1,
                storage_path=storage_path_1,
                file_size=len(pdf_content),
            )
            db.add(user_file_1)

            # File 2: Mock Nutrition JSON log
            json_data = json.dumps({"week": 1, "avg_calories": 2100, "water_liters_daily": 2.5}).encode("utf-8")
            filename_2 = "nutrition_log_week1.json"
            storage_path_2 = storage.upload_file(json_data, filename_2, user.id)
            user_file_2 = UserFile(
                user_id=user.id,
                filename=filename_2,
                original_filename=filename_2,
                storage_path=storage_path_2,
                file_size=len(json_data),
            )
            db.add(user_file_2)
            db.commit()
            print("✅ Seeded 2 cloud storage objects in tenant bucket.")
        else:
            print(f"ℹ️ Found {len(existing_files)} existing stored files.")

        print("\n" + "=" * 55)
        print("  🎉 DEMO DATA SEEDING COMPLETE!")
        print("=" * 55)
        print("  Ready to demo and test:")
        print(f"  • Email:    {demo_email}")
        print(f"  • Password: {demo_password}")
        print("  • Profile:  Age 25, 70kg, 175cm, Vegetarian, Maintenance")
        print("=" * 55 + "\n")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
