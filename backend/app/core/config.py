import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "GreenCo Guardian AI Backend"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = Field(default="supersecretenterprisekeyforgreencoguardianai2026", env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # DB
    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgrespassword@localhost:5432/greenco_guardian",
        env="DATABASE_URL"
    )
    
    # Cache & Celery
    REDIS_URL: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # File Storage S3 / MinIO
    AWS_ACCESS_KEY_ID: str = Field(default="minioadmin", env="AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str = Field(default="minioadmin", env="AWS_SECRET_ACCESS_KEY")
    S3_ENDPOINT_URL: str = Field(default="http://localhost:9000", env="S3_ENDPOINT_URL")
    S3_BUCKET_NAME: str = Field(default="greenco-evidence", env="S3_BUCKET_NAME")
    
    # AI Models
    OPENAI_API_BASE: str = Field(default="https://api.openai.com/v1", env="OPENAI_API_BASE")
    OPENAI_API_KEY: str = Field(default="mock-key", env="OPENAI_API_KEY")
    
    # Rate Limiting
    RATE_LIMIT_CALLS: int = 100
    RATE_LIMIT_PERIOD_SECONDS: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
