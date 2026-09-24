def test_register_new_user(test_app):
    response = test_app.post(
        "/api/auth/register",
        json={"email": "newuser@example.com", "name": "New User", "password": "Password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_register_duplicate_email(test_app, test_user):
    response = test_app.post(
        "/api/auth/register",
        json={"email": "test@example.com", "name": "Duplicate User", "password": "Password123"}
    )
    assert response.status_code == 409
    assert "already registered" in response.json()["detail"].lower()

def test_login_valid_credentials(test_app, test_user):
    response = test_app.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "TestPass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password(test_app, test_user):
    response = test_app.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "WrongPassword"}
    )
    assert response.status_code == 401

def test_login_nonexistent_email(test_app):
    response = test_app.post(
        "/api/auth/login",
        data={"username": "unknown@example.com", "password": "TestPass123"}
    )
    assert response.status_code == 401

def test_get_current_user_authenticated(test_app, auth_headers):
    response = test_app.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"

def test_get_current_user_no_token(test_app):
    response = test_app.get("/api/auth/me")
    assert response.status_code == 401
