from cryptography.fernet import Fernet
import base64
import hashlib
from app.core.config import settings

# Deriving Fernet key from SECRET_KEY
key = base64.urlsafe_b64encode(hashlib.sha256(settings.SECRET_KEY.encode()).digest())
fernet = Fernet(key)

def encrypt_data(plain_text: str) -> str:
    if not plain_text:
        return ""
    return fernet.encrypt(plain_text.encode()).decode()

def decrypt_data(cipher_text: str) -> str:
    if not cipher_text:
        return ""
    try:
        return fernet.decrypt(cipher_text.encode()).decode()
    except Exception:
        return "[Decryption Error]"
