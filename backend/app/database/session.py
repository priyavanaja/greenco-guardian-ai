import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from app.core.logging import logger

# Attempt PostgreSQL connection, fall back to local SQLite on failure
try:
    if settings.DATABASE_URL.startswith("postgresql"):
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20
        )
        # Test connection actively
        connection = engine.connect()
        connection.close()
        logger.info("Connected successfully to PostgreSQL database server.")
    else:
        engine = create_engine(settings.DATABASE_URL)
except Exception as e:
    logger.warning(f"PostgreSQL server connection failed: {e}. Falling back to local SQLite database.")
    sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "greenco_guardian.db"))
    engine = create_engine(
        f"sqlite:///{sqlite_path}",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

