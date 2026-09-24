from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from database import Base

class UserFile(Base):
    __tablename__ = "user_files"
    __table_args__ = {"extend_existing": True}

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=True)
    storage_path = Column(String(500), nullable=True)
    file_size = Column(Integer, nullable=True, default=0)
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="files")

    def __init__(self, **kwargs):
        if "filepath" in kwargs and "storage_path" not in kwargs:
            kwargs["storage_path"] = kwargs.pop("filepath")
        elif "filepath" in kwargs:
            kwargs.pop("filepath")
        if "original_filename" not in kwargs:
            kwargs["original_filename"] = kwargs.get("filename", "file")
        if "file_size" not in kwargs:
            kwargs["file_size"] = 0
        super().__init__(**kwargs)

FileUpload = UserFile
