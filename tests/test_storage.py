from io import BytesIO

def test_upload_file(test_app, auth_headers):
    file_data = b"dummy file content"
    files = {"file": ("test.txt", BytesIO(file_data), "text/plain")}
    response = test_app.post("/api/storage/upload", headers=auth_headers, files=files)
    assert response.status_code == 201
    data = response.json()
    assert "file_id" in data
    assert data["filename"] == "test.txt"

def test_list_files(test_app, auth_headers):
    # Upload first
    test_upload_file(test_app, auth_headers)
    response = test_app.get("/api/storage/files", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_download_file(test_app, auth_headers):
    # Upload first
    file_data = b"download test content"
    files = {"file": ("dl.txt", BytesIO(file_data), "text/plain")}
    up_resp = test_app.post("/api/storage/upload", headers=auth_headers, files=files)
    file_id = up_resp.json()["file_id"]

    response = test_app.get(f"/api/storage/download/{file_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.content == file_data

def test_delete_file(test_app, auth_headers):
    files = {"file": ("del.txt", BytesIO(b"del"), "text/plain")}
    up_resp = test_app.post("/api/storage/upload", headers=auth_headers, files=files)
    file_id = up_resp.json()["file_id"]

    response = test_app.delete(f"/api/storage/files/{file_id}", headers=auth_headers)
    assert response.status_code == 200

def test_access_other_users_file(test_app, auth_headers, test_db):
    from backend.models import User, FileUpload
    other_user = User(email="other3@example.com", name="Other3", hashed_password="pw")
    test_db.add(other_user)
    test_db.commit()
    test_db.refresh(other_user)
    
    file_record = FileUpload(user_id=other_user.id, filename="secret.txt", filepath="/tmp/secret.txt")
    test_db.add(file_record)
    test_db.commit()
    test_db.refresh(file_record)
    
    response = test_app.get(f"/api/storage/download/{file_record.id}", headers=auth_headers)
    assert response.status_code == 404
