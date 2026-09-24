import os
import sys
import uuid
from sqlalchemy.orm import Session
from fastapi import UploadFile
from models.user import User
from models.user_file import UserFile

# Import storage backend from local backend or parent directory
try:
    from cloud.storage_service import get_storage_backend
except ImportError:
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
    from cloud.storage_service import get_storage_backend

storage_backend = get_storage_backend()


async def upload_file(db: Session, user: User, file: UploadFile) -> UserFile:
    # Read file content
    content = await file.read()
    
    # Ensure unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    
    # Upload via cloud backend
    storage_path = storage_backend.upload_file(content, unique_filename, user.id)
    
    # Save to DB
    db_file = UserFile(
        user_id=user.id,
        filename=unique_filename,
        original_filename=file.filename,
        storage_path=storage_path,
        file_size=len(content)
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def get_user_files(db: Session, user_id: str):
    return db.query(UserFile).filter(UserFile.user_id == user_id).order_by(UserFile.uploaded_at.desc()).all()

def get_file_path(db: Session, file_id: str, user_id: str) -> str | None:
    db_file = db.query(UserFile).filter(UserFile.id == file_id, UserFile.user_id == user_id).first()
    if not db_file:
        return None
    # Use storage backend to get absolute path
    return storage_backend.get_file_path(db_file.filename, user_id)

def delete_user_file(db: Session, file_id: str, user_id: str) -> bool:
    db_file = db.query(UserFile).filter(UserFile.id == file_id, UserFile.user_id == user_id).first()
    if not db_file:
        return False
    
    # Delete from storage backend
    success = storage_backend.delete_file(db_file.filename, user_id)
    if success:
        # Delete from DB
        db.delete(db_file)
        db.commit()
        return True
    return False
