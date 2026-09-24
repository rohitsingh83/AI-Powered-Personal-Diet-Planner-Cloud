from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from database import get_db
from models.user import User
from services.auth_service import get_current_user
from services.storage_service import upload_file, get_user_files, get_file_path, delete_user_file

router = APIRouter(prefix="/api/storage", tags=["storage"])

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_user_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_file = await upload_file(db, current_user, file)
    return {
        "id": db_file.id,
        "file_id": db_file.id,
        "filename": db_file.original_filename or db_file.filename,
        "original_filename": db_file.original_filename,
        "file_size": db_file.file_size,
        "uploaded_at": db_file.uploaded_at
    }

@router.get("/files")
def list_files(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    files = get_user_files(db, current_user.id)
    return [{
        "id": f.id,
        "filename": f.filename,
        "original_filename": f.original_filename,
        "file_size": f.file_size,
        "uploaded_at": f.uploaded_at
    } for f in files]

@router.get("/download/{file_id}")
def download_file(file_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    path = get_file_path(db, file_id, current_user.id)
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Need to return original filename, querying DB again quickly
    db_file = db.query(UserFile).filter(UserFile.id == file_id).first() # Imported dynamically below
    original_name = db_file.original_filename if db_file else "downloaded_file"

    return FileResponse(path=path, filename=original_name)

# Lazy import to avoid circular dependencies if any
from models.user_file import UserFile

@router.delete("/files/{file_id}")
def delete_file(file_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = delete_user_file(db, file_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}
