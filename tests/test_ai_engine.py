import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from ai_engine.diet_engine import (
    calculate_bmr, calculate_tdee, calculate_target_calories,
    generate_plan_rule_based, generate_diet_plan
)

def test_calculate_bmr_male():
    # BMR = 10*weight + 6.25*height - 5*age + 5
    # For weight=70, height=175, age=30: 700 + 1093.75 - 150 + 5 = 1648.75
    bmr = calculate_bmr(weight=70, height=175, age=30, gender="male")
    assert round(bmr) == 1649

def test_calculate_bmr_female():
    # BMR = 10*weight + 6.25*height - 5*age - 161
    # For weight=60, height=165, age=25: 600 + 1031.25 - 125 - 161 = 1345.25
    bmr = calculate_bmr(weight=60, height=165, age=25, gender="female")
    assert round(bmr) == 1345

def test_calculate_tdee():
    bmr = 1500
    tdee = calculate_tdee(bmr, activity_level="moderate")
    assert round(tdee) == round(1500 * 1.55)
    
def test_calculate_target_calories_weight_loss():
    tdee = 2000
    target = calculate_target_calories(tdee, goal="weight loss")
    assert target < 2000

def test_calculate_target_calories_muscle_gain():
    tdee = 2000
    target = calculate_target_calories(tdee, goal="muscle gain")
    assert target > 2000

def test_generate_plan_rule_based_vegetarian():
    plan = generate_plan_rule_based(2000, "vegetarian", "")
    assert "Vegetarian" in plan["meals"]["breakfast"] or "Vegetarian" in plan["meals"]["lunch"]

def test_generate_plan_rule_based_vegan():
    plan = generate_plan_rule_based(2000, "vegan", "")
    assert "Vegan" in plan["meals"]["breakfast"] or "Vegan" in plan["meals"]["dinner"]

def test_generate_plan_rule_based_nonveg():
    plan = generate_plan_rule_based(2000, "non-vegetarian", "")
    assert "Chicken" in plan["meals"]["lunch"] or "Eggs" in plan["meals"]["breakfast"] or "Meat" in plan["meals"]["dinner"]

def test_allergy_filtering():
    plan = generate_plan_rule_based(2000, "vegetarian", "peanuts")
    # Rule based engine might just append a note about allergies
    assert "peanuts" in plan.get("allergy_notes", "").lower() or "Avoid peanuts" in plan["meals"].get("notes", "")

def test_fallback_when_no_api_key():
    os.environ["GEMINI_API_KEY"] = ""
    req_data = {
        "age": 30, "weight": 70, "height": 175, "gender": "male",
        "dietary_preference": "vegetarian", "allergies": "dairy",
        "activity_level": "active", "goal": "maintain"
    }
    plan = generate_diet_plan(req_data)
    assert plan["source"] == "rule_based"

def test_plan_structure_has_required_fields():
    req_data = {
        "age": 30, "weight": 70, "height": 175, "gender": "male",
        "dietary_preference": "vegetarian", "allergies": "",
        "activity_level": "active", "goal": "maintain"
    }
    plan = generate_diet_plan(req_data)
    assert "target_calories" in plan
    assert "meals" in plan
    assert "breakfast" in plan["meals"]
    assert "lunch" in plan["meals"]
    assert "dinner" in plan["meals"]
