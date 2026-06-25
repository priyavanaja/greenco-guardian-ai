import os
import shutil
import hashlib
from typing import BinaryIO
from fastapi import UploadFile
from app.core.config import settings
from app.core.logging import logger

class StorageService:
    def __init__(self):
        self.local_upload_dir = "uploads"
        os.makedirs(self.local_upload_dir, exist_ok=True)
        
    def save_file(self, file: UploadFile, org_id: int) -> tuple[str, str, str]:
        """
        Saves the file to the local directory (S3/MinIO compatible mock).
        Returns: (file_path, file_hash, file_size)
        """
        # Create organization folder
        org_dir = os.path.join(self.local_upload_dir, f"org_{org_id}")
        os.makedirs(org_dir, exist_ok=True)
        
        file_path = os.path.join(org_dir, file.filename)
        sha256_hash = hashlib.sha256()
        
        # Write file and compute hash
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Re-read to compute hash and size
        size_bytes = os.path.getsize(file_path)
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
                
        file_size_str = f"{size_bytes / (1024 * 1024):.2f} MB"
        file_hash = sha256_hash.hexdigest()
        
        logger.info(f"Saved file {file.filename} for org {org_id} at {file_path}")
        return file_path, file_hash, file_size_str

    def get_secure_url(self, file_path: str) -> str:
        """
        Mock S3 Pre-signed URL or direct file download route URL.
        """
        return f"/api/v1/evidence/download?path={file_path}"

storage_service = StorageService()
