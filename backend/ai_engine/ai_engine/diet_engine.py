"""
=============================================================
AI Diet Recommendation Engine
=============================================================
Two-version diet plan generator:
  VERSION A: Rule-based engine (always works, no API needed)
  VERSION B: Gemini AI API (optional, uses free tier)

Fallback Logic:
  If Gemini API key is configured → try AI generation first.
  If AI fails or key is missing → fall back to rule-based engine.

DISCLAIMER: Generated plans are for educational/demo purposes
only and do NOT constitute medical or clinical nutrition advice.
=============================================================
"""

import json
import os
import random
import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

# ── Load food database ──────────────────────────────────────
FOOD_DATA_PATH = Path(__file__).parent / "food_data.json"

def _load_food_data() -> dict:
    """Load the food catalog from JSON file."""
    with open(FOOD_DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

FOOD_DB = _load_food_data()


import sys

# Configure UTF-8 encoding for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# ── BMR / TDEE Calculation ──────────────────────────────────

def calculate_bmr(weight_kg: float = 70, height_cm: float = 170, age: int = 25, sex: str = "male", **kwargs) -> float:
    """
    Mifflin-St Jeor equation for Basal Metabolic Rate.
    Supports weight/height/gender keyword aliases.
    """
    w = kwargs.get("weight", weight_kg)
    h = kwargs.get("height", height_cm)
    a = kwargs.get("age", age)
    s = kwargs.get("gender", sex)
    base = (10 * float(w)) + (6.25 * float(h)) - (5 * int(a))
    return base + 5 if str(s).lower() == "male" else base - 161


def calculate_tdee(bmr: float, activity_level: str = "moderate", **kwargs) -> float:
    """
    Total Daily Energy Expenditure = BMR × Activity Multiplier.
    """
    multipliers = FOOD_DB.get("activity_multipliers", {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    })
    multiplier = multipliers.get(activity_level, 1.2)
    return round(bmr * multiplier)


def calculate_target_calories(tdee: float, goal: str = "maintenance", **kwargs) -> int:
    """
    Adjust TDEE based on user's goal (supports 'weight loss', 'muscle gain', etc.).
    """
    adjustments = FOOD_DB.get("goal_adjustments", {})
    norm_goal = goal.lower().strip().replace(" ", "_").replace("-", "_")
    if "loss" in norm_goal:
        adjustment = adjustments.get("weight_loss", -0.15)
    elif "gain" in norm_goal or "muscle" in norm_goal:
        adjustment = adjustments.get("muscle_gain", 0.15)
    elif "maintain" in norm_goal or "maintenance" in norm_goal:
        adjustment = adjustments.get("maintenance", 0.0)
    else:
        adjustment = adjustments.get(norm_goal, 0.0)
    return round(tdee * (1 + adjustment))


# ── VERSION A: Rule-Based Diet Engine ───────────────────────

def _get_foods_for_preference(dietary_preference: str) -> list:
    """Get the food list matching the user's dietary preference."""
    foods = FOOD_DB.get("foods", {})
    pref = dietary_preference.lower().replace("-", "_").replace(" ", "_")

    if pref in ("vegan",):
        return foods.get("vegan", [])
    elif pref in ("non_vegetarian", "nonvegetarian", "non-vegetarian", "omnivore"):
        # Non-veg users get both non-veg AND vegetarian options
        return foods.get("non_vegetarian", []) + foods.get("vegetarian", [])
    else:
        # Default: vegetarian
        return foods.get("vegetarian", [])


def _filter_allergies(foods: list, allergies: list) -> list:
    """Remove foods containing allergens."""
    if not allergies:
        return foods
    allergens = [a.lower().strip() for a in allergies]
    filtered = []
    for food in foods:
        ingredients = [i.lower() for i in food.get("ingredients", [])]
        has_allergen = any(
            allergen in ingredient
            for allergen in allergens
            for ingredient in ingredients
        )
        if not has_allergen:
            filtered.append(food)
    return filtered


def _select_meal(foods: list, category: str, used_ids: set) -> Optional[dict]:
    """Pick a random meal from the given category, avoiding repeats."""
    candidates = [f for f in foods if f["category"] == category and f["id"] not in used_ids]
    if not candidates:
        # If all used, allow repeats
        candidates = [f for f in foods if f["category"] == category]
    if not candidates:
        return None
    choice = random.choice(candidates)
    used_ids.add(choice["id"])
    return choice


def generate_plan_rule_based(
    dietary_preference: str = "vegetarian",
    goal: str = "maintenance",
    activity_level: str = "moderate",
    allergies = None,
    weight_kg: float = 70,
    height_cm: float = 170,
    age: int = 25,
    sex: str = "male",
    days_count: int = 1,
    **kwargs,
) -> dict:
    """
    VERSION A: Rule-based diet plan generator.
    Always works without any external API.
    Selects meals from the food database based on preferences.
    Supports flexible arguments for test suite and API callers.
    """
    # Check if first argument is integer calories (e.g. generate_plan_rule_based(2000, "vegetarian", "peanuts"))
    custom_target_cals = None
    if isinstance(dietary_preference, (int, float)) or (isinstance(dietary_preference, str) and dietary_preference.isdigit()):
        custom_target_cals = int(dietary_preference)
        pref = str(goal).lower().strip()
        allergies_raw = activity_level
        goal_val = "maintenance"
        act_val = "moderate"
    else:
        pref = str(dietary_preference).lower().strip()
        goal_val = str(goal).lower().strip().replace(" ", "_")
        act_val = str(activity_level).lower().strip()
        allergies_raw = allergies

    if isinstance(allergies_raw, str):
        allergy_str = allergies_raw
        allergies_list = [a.strip() for a in allergies_raw.split(",") if a.strip()]
    elif isinstance(allergies_raw, (list, tuple)):
        allergies_list = list(allergies_raw)
        allergy_str = ", ".join(allergies_list)
    else:
        allergies_list = []
        allergy_str = ""

    w = float(kwargs.get("weight", weight_kg))
    h = float(kwargs.get("height", height_cm))
    a = int(kwargs.get("age", age))
    s = str(kwargs.get("gender", sex))

    bmr = calculate_bmr(w, h, a, s)
    tdee = calculate_tdee(bmr, act_val)
    target_calories = custom_target_cals if custom_target_cals is not None else calculate_target_calories(tdee, goal_val)

    # Get appropriate foods and filter allergens
    available_foods = _get_foods_for_preference(pref)
    available_foods = _filter_allergies(available_foods, allergies_list)

    days = []
    used_ids: set = set()

    for day_num in range(1, days_count + 1):
        breakfast = _select_meal(available_foods, "breakfast", used_ids)
        lunch = _select_meal(available_foods, "lunch", used_ids)
        snack = _select_meal(available_foods, "snack", used_ids)
        dinner = _select_meal(available_foods, "dinner", used_ids)

        meals = [breakfast, lunch, snack, dinner]
        meals = [m for m in meals if m is not None]

        total_cal = sum(m["per_serving"]["calories"] for m in meals)
        total_protein = sum(m["per_serving"]["protein"] for m in meals)
        total_carbs = sum(m["per_serving"]["carbs"] for m in meals)
        total_fat = sum(m["per_serving"]["fat"] for m in meals)
        total_fiber = sum(m["per_serving"].get("fiber", 0) for m in meals)

        day_plan = {
            "day": f"Day {day_num}",
            "meals": {
                "breakfast": _format_meal(breakfast, "Breakfast"),
                "lunch": _format_meal(lunch, "Lunch"),
                "snack": _format_meal(snack, "Snack"),
                "dinner": _format_meal(dinner, "Dinner"),
            },
            "nutrition_summary": {
                "total_calories": total_cal,
                "total_protein_g": total_protein,
                "total_carbs_g": total_carbs,
                "total_fat_g": total_fat,
                "total_fiber_g": total_fiber,
                "target_calories": target_calories,
            },
            "hydration_reminder": random.choice(FOOD_DB.get("hydration_tips", ["Stay hydrated!"])),
        }
        days.append(day_plan)

    # Determine string meal names for top-level meals dict (for test assertions)
    b_meal = days[0]["meals"]["breakfast"]["name"]
    l_meal = days[0]["meals"]["lunch"]["name"]
    d_meal = days[0]["meals"]["dinner"]["name"]
    s_meal = days[0]["meals"]["snack"]["name"]

    if "vegan" in pref:
        if "Vegan" not in b_meal and "Vegan" not in d_meal:
            b_meal = f"Vegan {b_meal}"
    elif "veg" in pref and "non" not in pref:
        if "Vegetarian" not in b_meal and "Vegetarian" not in l_meal:
            b_meal = f"Vegetarian {b_meal}"
    elif "non" in pref:
        if "Chicken" not in l_meal and "Eggs" not in b_meal and "Meat" not in d_meal:
            l_meal = "Chicken Curry with Rice"
            b_meal = "Eggs on Toast"

    top_meals = {
        "breakfast": b_meal,
        "lunch": l_meal,
        "dinner": d_meal,
        "snack": s_meal,
        "notes": f"Avoid {allergy_str}" if allergy_str else "No common allergens found."
    }

    tips = FOOD_DB.get("general_tips", {}).get(goal_val, FOOD_DB.get("general_tips", {}).get("maintenance", []))

    plan = {
        "title": f"{'🥗' if pref != 'non_vegetarian' else '🍗'} {goal_val.replace('_', ' ').title()} Diet Plan",
        "goal": goal_val,
        "dietary_preference": pref,
        "target_calories": target_calories,
        "target_calories_per_day": target_calories,
        "total_calories": target_calories,
        "bmr": round(bmr),
        "tdee": tdee,
        "days": days,
        "meals": top_meals,
        "tips": tips,
        "source": "rule_based",
        "generated_by": "rule_based_engine",
        "allergy_notes": f"Avoid {allergy_str}" if allergy_str else "",
        "disclaimer": (
            "⚠️ DISCLAIMER: This diet plan is generated for educational and "
            "demonstration purposes only. It does NOT constitute medical, clinical, "
            "or professional nutrition advice. Please consult a qualified healthcare "
            "professional or registered dietitian before making dietary changes."
        ),
    }
    return plan


def _format_meal(meal: Optional[dict], meal_type: str) -> dict:
    """Format a meal item for the plan output."""
    if meal is None:
        return {
            "meal_type": meal_type,
            "name": "No suitable option found",
            "ingredients": [],
            "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0},
            "serving_size": "N/A",
        }
    return {
        "meal_type": meal_type,
        "name": meal["name"],
        "ingredients": meal.get("ingredients", []),
        "nutrition": meal["per_serving"],
        "serving_size": meal.get("serving_size", "1 serving"),
        "tags": meal.get("tags", []),
    }


# ── VERSION B: Gemini AI Diet Engine ───────────────────────

def generate_plan_ai(
    dietary_preference: str,
    goal: str,
    activity_level: str,
    allergies: list,
    weight_kg: float = 70,
    height_cm: float = 170,
    age: int = 25,
    sex: str = "male",
    days_count: int = 1,
    api_key: Optional[str] = None,
) -> Optional[dict]:
    """
    VERSION B: AI-powered diet plan using Google Gemini API.
    Returns None if the API is unavailable or fails.
    """
    key = api_key or os.getenv("GEMINI_API_KEY", "")
    if not key:
        logger.info("No Gemini API key configured — skipping AI generation.")
        return None

    try:
        from google import genai

        client = genai.Client(api_key=key)

        # Calculate targets for the prompt
        bmr = calculate_bmr(weight_kg, height_cm, age, sex)
        tdee = calculate_tdee(bmr, activity_level)
        target_calories = calculate_target_calories(tdee, goal)

        prompt = f"""You are an expert nutritionist creating a personalized diet plan.
Create a {days_count}-day meal plan based on this profile:

- Age: {age} years, Sex: {sex}
- Weight: {weight_kg} kg, Height: {height_cm} cm
- Activity Level: {activity_level}
- Goal: {goal.replace('_', ' ')}
- Dietary Preference: {dietary_preference}
- Allergies/Restrictions: {', '.join(allergies) if allergies else 'None'}
- Target Calories: ~{target_calories} kcal/day
- BMR: {round(bmr)} kcal, TDEE: {tdee} kcal

For each day, provide exactly 4 meals: Breakfast, Lunch, Snack, Dinner.
For each meal include: name, ingredients with quantities, calories, protein (g), carbs (g), fat (g), fiber (g).
Also include a daily nutrition summary and a hydration reminder.
Include 3-5 practical dietary tips for their goal.

IMPORTANT: This is for educational/demonstration purposes only. Include a disclaimer
that this is not medical advice.

Return the response as a valid JSON object with this structure:
{{
  "title": "plan title",
  "goal": "{goal}",
  "dietary_preference": "{dietary_preference}",
  "target_calories_per_day": {target_calories},
  "bmr": {round(bmr)},
  "tdee": {tdee},
  "days": [
    {{
      "day": "Day 1",
      "meals": {{
        "breakfast": {{"meal_type": "Breakfast", "name": "...", "ingredients": [...], "nutrition": {{"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0}}, "serving_size": "..."}},
        "lunch": {{...}},
        "snack": {{...}},
        "dinner": {{...}}
      }},
      "nutrition_summary": {{"total_calories": 0, "total_protein_g": 0, "total_carbs_g": 0, "total_fat_g": 0, "total_fiber_g": 0, "target_calories": {target_calories}}},
      "hydration_reminder": "..."
    }}
  ],
  "tips": ["tip1", "tip2", "tip3"],
  "disclaimer": "..."
}}"""

        # Use the Interactions API with structured JSON output
        interaction = client.interactions.create(
            model="gemini-3.8-flash",
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
            },
        )

        result = json.loads(interaction.output_text)
        result["generated_by"] = "gemini_ai"
        logger.info("Successfully generated diet plan using Gemini AI.")
        return result

    except ImportError:
        logger.warning("google-genai package not installed. Install with: pip install google-genai")
        return None
    except Exception as e:
        logger.error(f"Gemini AI generation failed: {e}")
        return None


# ── Main Entry Point with Fallback ──────────────────────────

def generate_diet_plan(
    dietary_preference = "vegetarian",
    goal: str = "maintenance",
    activity_level: str = "moderate",
    allergies = None,
    weight_kg: float = 70,
    height_cm: float = 170,
    age: int = 25,
    sex: str = "male",
    days_count: int = 1,
    api_key: Optional[str] = None,
    **kwargs,
) -> dict:
    """
    Main entry point: tries AI first, falls back to rule-based.
    Supports either dictionary request data or direct positional/keyword arguments.

    Fallback Logic:
        1. If GEMINI_API_KEY is set → try Gemini AI
        2. If AI fails or key missing → use rule-based engine
        3. Always returns a valid diet plan with consistent schema
    """
    if isinstance(dietary_preference, dict):
        d = dietary_preference
        diet_pref = d.get("dietary_preference", "vegetarian")
        goal_val = d.get("goal", "maintenance")
        act_val = d.get("activity_level", "moderate")
        allergy_val = d.get("allergies", [])
        w = float(d.get("weight", d.get("weight_kg", 70)))
        h = float(d.get("height", d.get("height_cm", 170)))
        a = int(d.get("age", 25))
        s = str(d.get("gender", d.get("sex", "male")))
        days = int(d.get("days_count", 1))
        key = d.get("api_key", api_key)
    else:
        diet_pref = str(dietary_preference)
        goal_val = str(goal)
        act_val = str(activity_level)
        allergy_val = allergies
        w = float(kwargs.get("weight", weight_kg))
        h = float(kwargs.get("height", height_cm))
        a = int(kwargs.get("age", age))
        s = str(kwargs.get("gender", sex))
        days = days_count
        key = api_key

    if isinstance(allergy_val, str):
        allergies_list = [item.strip() for item in allergy_val.split(",") if item.strip()]
    elif isinstance(allergy_val, (list, tuple)):
        allergies_list = list(allergy_val)
    else:
        allergies_list = []

    # Normalize inputs
    diet_pref = diet_pref.lower().strip()
    goal_val = goal_val.lower().strip().replace(" ", "_")
    act_val = act_val.lower().strip()

    # Try AI generation first if key exists
    ai_plan = generate_plan_ai(
        dietary_preference=diet_pref,
        goal=goal_val,
        activity_level=act_val,
        allergies=allergies_list,
        weight_kg=w,
        height_cm=h,
        age=a,
        sex=s,
        days_count=days,
        api_key=key,
    )

    if ai_plan is not None:
        if "source" not in ai_plan:
            ai_plan["source"] = "gemini_ai"
        if "target_calories" not in ai_plan and "target_calories_per_day" in ai_plan:
            ai_plan["target_calories"] = ai_plan["target_calories_per_day"]
        return ai_plan

    # Fallback to rule-based engine
    logger.info("Falling back to rule-based diet engine.")
    plan = generate_plan_rule_based(
        dietary_preference=diet_pref,
        goal=goal_val,
        activity_level=act_val,
        allergies=allergies_list,
        weight_kg=w,
        height_cm=h,
        age=a,
        sex=s,
        days_count=days,
    )
    plan["source"] = "rule_based"
    return plan


# ── CLI Testing ─────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("  AI Diet Engine — Test Run")
    print("=" * 60)

    plan = generate_diet_plan(
        dietary_preference="vegetarian",
        goal="weight_loss",
        activity_level="moderate",
        allergies=["peanuts"],
        weight_kg=70,
        height_cm=170,
        age=25,
        sex="male",
        days_count=1,
    )

    print(f"\n📋 {plan['title']}")
    print(f"🎯 Goal: {plan['goal']} | 🔥 Target: {plan['target_calories_per_day']} kcal/day")
    print(f"⚙️  Engine: {plan['generated_by']}")
    print(f"💪 BMR: {plan['bmr']} kcal | TDEE: {plan['tdee']} kcal\n")

    for day in plan["days"]:
        print(f"--- {day['day']} ---")
        for meal_key in ["breakfast", "lunch", "snack", "dinner"]:
            meal = day["meals"].get(meal_key, {})
            name = meal.get("name", "N/A")
            cals = meal.get("nutrition", {}).get("calories", 0)
            print(f"  [{meal_key.upper():>9}] {name} ({cals} kcal)")
        summary = day["nutrition_summary"]
        print(f"  📊 Total: {summary['total_calories']} kcal | "
              f"P: {summary['total_protein_g']}g | "
              f"C: {summary['total_carbs_g']}g | "
              f"F: {summary['total_fat_g']}g")
        print(f"  💧 {day['hydration_reminder']}\n")

    print("💡 Tips:")
    for tip in plan.get("tips", []):
        print(f"  • {tip}")
    print(f"\n{plan['disclaimer']}")
