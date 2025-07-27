import secrets
import os
from typing import Any, Dict, List, Union, Annotated

from pydantic import AnyHttpUrl, EmailStr, HttpUrl, field_validator, BeforeValidator
from pydantic_core.core_schema import ValidationInfo
from pydantic_settings import BaseSettings

def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    # Project Settings
    PROJECT_NAME: str = "MEWAYZ V2"
    API_V1_STR: str = "/api/v1"
    
    # Security Settings
    SECRET_KEY: str = os.environ.get("SECRET_KEY", secrets.token_urlsafe(32))
    TOTP_SECRET_KEY: str = os.environ.get("TOTP_SECRET_KEY", secrets.token_urlsafe(32))
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 60 * 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_SECONDS: int = 60 * 60 * 24 * 30  # 30 days
    JWT_ALGO: str = "HS256"
    TOTP_ALGO: str = "SHA-1"
    
    # Server Settings
    SERVER_NAME: str = "MEWAYZ V2"
    SERVER_HOST: str = "0.0.0.0:8001"
    SERVER_BOT: str = "MEWAYZ Bot"
    
    # CORS Settings - Allow both development and production origins
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://test.mewayz.com", 
        "https://preview-launch-1.emergent.host",
        "*"  # Keep wildcard for flexibility
    ]

    # Monitoring
    SENTRY_DSN: HttpUrl | None = None

    @field_validator("SENTRY_DSN", mode="before")
    def sentry_dsn_can_be_blank(cls, v: str) -> str | None:
        if isinstance(v, str) and len(v) == 0:
            return None
        return v

    # General Settings
    MULTI_MAX: int = 20

    # Database Settings
    MONGO_DATABASE: str = os.environ.get("MONGO_DATABASE", "mewayz")
    MONGO_DATABASE_URI: str = os.environ.get("MONGO_URL", "mongodb://localhost:5000")

    # Production Database Settings (with fallbacks)
    @field_validator("MONGO_DATABASE_URI", mode="before")
    def validate_mongo_uri(cls, v: str) -> str:
        if not v:
            # Try different common MongoDB URIs
            possible_uris = [
                "mongodb://localhost:5000",
                "mongodb://127.0.0.1:5000",
                "mongodb://localhost:27017",
                "mongodb://127.0.0.1:27017",
                "mongodb://mongo:27017",  # Docker container
                # MongoDB Atlas free tier (replace with your own connection string)
                "mongodb+srv://mewayz:mewayz123@cluster0.mongodb.net/mewayz?retryWrites=true&w=majority",
            ]
            for uri in possible_uris:
                try:
                    import motor.motor_asyncio
                    client = motor.motor_asyncio.AsyncIOMotorClient(uri)
                    # Test connection
                    import asyncio
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    try:
                        loop.run_until_complete(client.admin.command('ping'))
                        client.close()
                        return uri
                    except:
                        client.close()
                        continue
                except:
                    continue
            return "mongodb://localhost:27017"  # Default fallback
        return v

    # Email Settings
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: EmailStr | None = None
    EMAILS_FROM_NAME: str | None = None
    EMAILS_TO_EMAIL: EmailStr | None = None

    @field_validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: str | None, info: ValidationInfo) -> str:
        if not v:
            return "MEWAYZ V2"
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "/app/backend/email-templates/build"
    EMAILS_ENABLED: bool = False

    @field_validator("EMAILS_ENABLED", mode="before")
    def get_emails_enabled(cls, v: bool, info: ValidationInfo) -> bool:
        return bool(info.data.get("SMTP_HOST") and info.data.get("SMTP_PORT") and info.data.get("EMAILS_FROM_EMAIL"))

    # User Settings
    EMAIL_TEST_USER: EmailStr = "test@mewayz.app"
    FIRST_SUPERUSER: EmailStr = os.environ.get("FIRST_SUPERUSER", "admin@mewayz.app")
    FIRST_SUPERUSER_PASSWORD: str = os.environ.get("FIRST_SUPERUSER_PASSWORD", "changethis")
    USERS_OPEN_REGISTRATION: bool = True


settings = Settings()
