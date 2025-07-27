"""
Production Configuration for MEWAYZ V2
"""

import os
from typing import List
from pydantic import BaseSettings, validator


class ProductionSettings(BaseSettings):
    """Production-specific settings"""
    
    # Environment
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    LOG_LEVEL: str = "INFO"
    
    # Security
    SECRET_KEY: str = os.environ.get("SECRET_KEY")
    ALLOWED_HOSTS: List[str] = [
        "mewayz.com",
        "www.mewayz.com",
        "test.mewayz.com",
        "api.mewayz.com"
    ]
    
    # Database
    MONGO_URL: str = os.environ.get("MONGO_URL")
    MONGO_DATABASE: str = "mewayz_production"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "https://mewayz.com",
        "https://www.mewayz.com",
        "https://test.mewayz.com"
    ]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Monitoring
    SENTRY_DSN: str = os.environ.get("SENTRY_DSN", "")
    ENABLE_METRICS: bool = True
    
    # Email
    SMTP_HOST: str = os.environ.get("SMTP_HOST", "")
    SMTP_PORT: int = 587
    SMTP_USER: str = os.environ.get("SMTP_USER", "")
    SMTP_PASSWORD: str = os.environ.get("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = "noreply@mewayz.com"
    
    # Stripe
    STRIPE_SECRET_KEY: str = os.environ.get("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf"
    ]
    
    # Cache
    REDIS_URL: str = os.environ.get("REDIS_URL", "")
    CACHE_TTL: int = 300  # 5 minutes
    
    # SSL/TLS
    SSL_CERT_FILE: str = os.environ.get("SSL_CERT_FILE", "")
    SSL_KEY_FILE: str = os.environ.get("SSL_KEY_FILE", "")
    
    # Logging
    LOG_FILE: str = "/var/log/mewayz/app.log"
    LOG_MAX_SIZE: int = 10 * 1024 * 1024  # 10MB
    LOG_BACKUP_COUNT: int = 5
    
    @validator("SECRET_KEY")
    def validate_secret_key(cls, v):
        if not v or len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v
    
    @validator("MONGO_URL")
    def validate_mongo_url(cls, v):
        if not v:
            raise ValueError("MONGO_URL is required for production")
        return v
    
    @validator("STRIPE_SECRET_KEY")
    def validate_stripe_key(cls, v):
        if not v:
            raise ValueError("STRIPE_SECRET_KEY is required for production")
        return v
    
    class Config:
        env_file = ".env.production"


# Production settings instance
production_settings = ProductionSettings() 