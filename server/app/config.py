import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Keeps their environment extraction style but restores your safe local testing placeholders
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-placeholder")

    # Restored your local SQLite database path fallback link so your data never disconnects
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI") or "sqlite:///questlog.db"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Restored safe fallback token key string for local JWT cookie decoding
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-placeholder")

    # Adopts their modern environment string for RAWG keys but drops a fallback if needed
    RAWG_API_KEY = os.getenv("RAWG_API_KEY", "6744b8fd7cf2484b87174f26dfd242a3")
