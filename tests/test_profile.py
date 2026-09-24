def test_get_empty_profile(test_app, auth_headers):
    response = test_app.get("/api/profile/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    # Expect empty fields initially or sensible defaults
    assert "weight" in data
    assert "height" in data
    assert "dietary_preference" in data

def test_update_profile(test_app, auth_headers):
    profile_data = {
        "age": 30,
        "weight": 70,
        "height": 175,
        "gender": "male",
        "dietary_preference": "vegetarian",
        "allergies": "peanuts",
        "activity_level": "moderate",
        "goal": "weight loss"
    }
    response = test_app.put("/api/profile/", headers=auth_headers, json=profile_data)
    assert response.status_code == 200
    data = response.json()
    assert data["age"] == 30
    assert data["dietary_preference"] == "vegetarian"

def test_update_profile_unauthorized(test_app):
    profile_data = {"age": 30}
    response = test_app.put("/api/profile/", json=profile_data)
    assert response.status_code == 401
