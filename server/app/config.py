import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-placeholder")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI") or "sqlite:///questlog.db"

    
    RAWG_API_KEY = "6744b8fd7cf2484b87174f26dfd242a3"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-placeholder")
