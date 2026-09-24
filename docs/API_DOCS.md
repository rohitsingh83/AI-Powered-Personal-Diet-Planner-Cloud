# API Documentation

Base URL: `http://localhost:8000/api`

## Authentication (`/auth`)

### Register User
- **Method:** `POST`
- **Path:** `/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response Body (201 Created):**
  ```json
  {
    "access_token": "eyJhb...",
    "token_type": "bearer"
  }
  ```
- **Example cURL:**
  ```bash
  curl -X POST "http://localhost:8000/api/auth/register" -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"strongpassword123"}'
  ```

### Login
- **Method:** `POST`
- **Path:** `/auth/login`
- **Auth Required:** No
- **Request Body:** `application/x-www-form-urlencoded`
  - `username`: john@example.com
  - `password`: strongpassword123
- **Response Body (200 OK):**
  ```json
  {
    "access_token": "eyJhb...",
    "token_type": "bearer"
  }
  ```

### Get Current User
- **Method:** `GET`
- **Path:** `/auth/me`
- **Auth Required:** Yes (Bearer Token)
- **Response Body (200 OK):**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

---

## Profile (`/profile`)

### Get Profile
- **Method:** `GET`
- **Path:** `/profile/`
- **Auth Required:** Yes
- **Response Body (200 OK):** User's full profile details (height, weight, etc.)

### Update Profile
- **Method:** `PUT`
- **Path:** `/profile/`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "age": 30,
    "weight": 75,
    "height": 180,
    "gender": "male",
    "dietary_preference": "vegetarian",
    "allergies": "peanuts",
    "activity_level": "moderate",
    "goal": "weight loss"
  }
  ```
- **Response Body (200 OK):** Updated profile JSON.

---

## Diet Plans (`/diet`)

### Generate Diet Plan
- **Method:** `POST`
- **Path:** `/diet/generate`
- **Auth Required:** Yes
- **Request Body:** User profile stats (same as Update Profile).
- **Response Body (201 Created):**
  ```json
  {
    "id": 1,
    "target_calories": 2200,
    "meals": {
      "breakfast": "Oatmeal...",
      "lunch": "Salad...",
      "dinner": "Tofu..."
    },
    "source": "rule_based"
  }
  ```

### Get All Plans
- **Method:** `GET`
- **Path:** `/diet/plans`
- **Auth Required:** Yes
- **Response Body (200 OK):** List of diet plan objects for the current user.

### Get Specific Plan
- **Method:** `GET`
- **Path:** `/diet/plans/{id}`
- **Auth Required:** Yes

### Delete Plan
- **Method:** `DELETE`
- **Path:** `/diet/plans/{id}`
- **Auth Required:** Yes

---

## Storage (`/storage`)

### Upload File
- **Method:** `POST`
- **Path:** `/storage/upload`
- **Auth Required:** Yes
- **Request Body:** `multipart/form-data` with a `file` field.
- **Response Body (201 Created):**
  ```json
  {
    "file_id": 1,
    "filename": "report.pdf",
    "message": "File uploaded successfully"
  }
  ```

### List Files
- **Method:** `GET`
- **Path:** `/storage/files`
- **Auth Required:** Yes

### Download File
- **Method:** `GET`
- **Path:** `/storage/download/{file_id}`
- **Auth Required:** Yes
- **Response:** File stream (Binary data)

### Delete File
- **Method:** `DELETE`
- **Path:** `/storage/files/{file_id}`
- **Auth Required:** Yes

---

## Dashboard (`/dashboard`)

### Get Stats
- **Method:** `GET`
- **Path:** `/dashboard/stats`
- **Auth Required:** Yes
- **Response Body (200 OK):** 
  ```json
  {
    "total_plans": 3,
    "total_files": 2,
    "last_generated_plan_date": "2023-10-05T12:00:00"
  }
  ```
