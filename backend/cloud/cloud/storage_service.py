"""
=============================================================
Cloud Storage Service — Abstraction Layer
=============================================================
Provides a consistent interface for file/object storage.
Local: Filesystem (./storage/) — simulates cloud bucket
Cloud: Can be swapped to GCS / S3 / Firebase Storage / Azure Blob

Cloud Computing Concepts Demonstrated:
  - Object Storage vs. Block Storage vs. Database Storage
  - Cloud buckets and object keys
  - User-scoped file isolation (multi-tenancy)
  - Pre-signed URLs (download links)
=============================================================
"""

import os
import shutil
import logging
import uuid
from pathlib import Path
from typing import Optional, BinaryIO

logger = logging.getLogger(__name__)


class StorageBackend:
    """
    Abstract base for storage backends.
    Demonstrates the Strategy Pattern — swap implementations
    without changing the rest of the application.
    """

    def save_file(self, user_id: str, filename: str, file_data: BinaryIO) -> str:
        raise NotImplementedError

    def get_file(self, user_id: str, filename: str) -> Optional[Path]:
        raise NotImplementedError

    def list_files(self, user_id: str) -> list:
        raise NotImplementedError

    def delete_file(self, user_id: str, filename: str) -> bool:
        raise NotImplementedError

    def get_storage_info(self) -> dict:
        raise NotImplementedError


class LocalStorageBackend(StorageBackend):
    """
    Local filesystem storage — simulates a cloud storage bucket.

    Directory structure mirrors cloud object storage:
      storage/
      ├── user_abc123/
      │   ├── diet_plan_2026-01-15.json
      │   └── meal_photo.jpg
      └── user_xyz789/
          └── diet_plan_2026-01-16.json

    Cloud Equivalent:
      gs://diet-planner-bucket/user_abc123/diet_plan_2026-01-15.json
      s3://diet-planner-bucket/user_abc123/diet_plan_2026-01-15.json
    """

    def __init__(self, base_path: Optional[str] = None):
        self.base_path = Path(base_path or os.getenv("STORAGE_PATH", "./storage"))
        self.base_path.mkdir(parents=True, exist_ok=True)
        logger.info(f"Local storage initialized at: {self.base_path.absolute()}")

    def _user_dir(self, user_id: str) -> Path:
        """Get or create user-specific storage directory (multi-tenancy)."""
        user_dir = self.base_path / f"user_{user_id}"
        user_dir.mkdir(parents=True, exist_ok=True)
        return user_dir

    def save_file(self, user_id: str, filename: str, file_data: BinaryIO) -> str:
        """
        Save a file to user's storage directory.

        Cloud Equivalent: Uploading an object to a cloud bucket
        e.g., gcs.upload_blob(bucket, source, destination)
        """
        # Sanitize filename to prevent path traversal attacks
        safe_filename = f"{uuid.uuid4().hex[:8]}_{Path(filename).name}"
        file_path = self._user_dir(user_id) / safe_filename

        with open(file_path, "wb") as f:
            shutil.copyfileobj(file_data, f)

        storage_path = f"user_{user_id}/{safe_filename}"
        logger.info(f"File saved: {storage_path}")
        return storage_path

    def get_file(self, user_id: str, filename: str) -> Optional[Path]:
        """
        Retrieve a file from user's storage.

        Cloud Equivalent: Downloading an object / generating a signed URL
        """
        file_path = self._user_dir(user_id) / filename
        if file_path.exists() and file_path.is_file():
            return file_path
        logger.warning(f"File not found: user_{user_id}/{filename}")
        return None

    def list_files(self, user_id: str) -> list:
        """
        List all files in user's storage.

        Cloud Equivalent: Listing objects in a bucket with a prefix
        e.g., gcs.list_blobs(bucket, prefix=f"user_{user_id}/")
        """
        user_dir = self._user_dir(user_id)
        files = []
        for item in user_dir.iterdir():
            if item.is_file() and item.name != ".gitkeep":
                stat = item.stat()
                files.append({
                    "filename": item.name,
                    "storage_path": f"user_{user_id}/{item.name}",
                    "size_bytes": stat.st_size,
                    "modified_at": stat.st_mtime,
                })
        return sorted(files, key=lambda x: x["modified_at"], reverse=True)

    def upload_file(self, content, filename: str, user_id: str) -> str:
        """Upload file content (bytes or stream) to user storage directory."""
        safe_filename = Path(filename).name
        file_path = self._user_dir(user_id) / safe_filename
        if isinstance(content, bytes):
            with open(file_path, "wb") as f:
                f.write(content)
        else:
            with open(file_path, "wb") as f:
                shutil.copyfileobj(content, f)
        storage_path = f"user_{user_id}/{safe_filename}"
        logger.info(f"File uploaded: {storage_path}")
        return storage_path

    def get_file_path(self, filename: str, user_id: str) -> Optional[str]:
        """Get absolute path to file in user storage."""
        file_path = self._user_dir(user_id) / Path(filename).name
        if file_path.exists() and file_path.is_file():
            return str(file_path.absolute())
        return None

    def delete_file(self, arg1: str, arg2: str) -> bool:
        """
        Delete a file from user's storage.
        Supports delete_file(user_id, filename) or delete_file(filename, user_id).
        """
        path1 = self._user_dir(arg1) / Path(arg2).name
        if path1.exists() and path1.is_file():
            path1.unlink()
            logger.info(f"File deleted: {path1}")
            return True
        path2 = self._user_dir(arg2) / Path(arg1).name
        if path2.exists() and path2.is_file():
            path2.unlink()
            logger.info(f"File deleted: {path2}")
            return True
        return False

    def get_storage_info(self) -> dict:
        """Get storage backend metadata."""
        total_size = sum(
            f.stat().st_size
            for f in self.base_path.rglob("*")
            if f.is_file()
        )
        return {
            "backend": "local_filesystem",
            "base_path": str(self.base_path.absolute()),
            "total_size_bytes": total_size,
            "cloud_equivalent": "Google Cloud Storage / AWS S3 / Azure Blob Storage",
        }


# ── Factory function ────────────────────────────────────────

def get_storage_backend() -> StorageBackend:
    """
    Factory: returns the appropriate storage backend.

    Cloud Computing Concept: Factory pattern + environment-based
    configuration allows seamless switching between local and
    cloud storage without code changes.
    """
    # In a real cloud deployment, you would check for GCS/S3 config:
    # if os.getenv("GCS_BUCKET"):
    #     return GCSStorageBackend(os.getenv("GCS_BUCKET"))
    # if os.getenv("S3_BUCKET"):
    #     return S3StorageBackend(os.getenv("S3_BUCKET"))

    return LocalStorageBackend()


# ── Cloud Deployment Notes ──────────────────────────────────
#
# To switch to Google Cloud Storage:
#
# class GCSStorageBackend(StorageBackend):
#     def __init__(self, bucket_name):
#         from google.cloud import storage
#         self.client = storage.Client()
#         self.bucket = self.client.bucket(bucket_name)
#
#     def save_file(self, user_id, filename, file_data):
#         blob = self.bucket.blob(f"user_{user_id}/{filename}")
#         blob.upload_from_file(file_data)
#         return blob.name
#
#     def get_file(self, user_id, filename):
#         blob = self.bucket.blob(f"user_{user_id}/{filename}")
#         # Generate signed URL for secure temporary access
#         url = blob.generate_signed_url(expiration=3600)
#         return url
#
# Cloud Storage Concepts:
#   - Buckets: top-level containers (like folders)
#   - Objects: files stored in buckets (like files)
#   - Object keys: path within the bucket (user_123/file.json)
#   - Signed URLs: temporary secure download links
#   - IAM: access control at bucket and object level
#   - Lifecycle policies: auto-delete old files to save cost
