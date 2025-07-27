#!/usr/bin/env python3
"""
Production Startup Script for MEWAYZ V2
Comprehensive production deployment with all necessary checks and configurations
"""

import os
import sys
import logging
import subprocess
import uvicorn
from pathlib import Path
from core.production_config import production_settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(production_settings.LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


def check_dependencies():
    """Check if all required dependencies are installed"""
    logger.info("🔍 Checking dependencies...")
    
    required_packages = [
        "fastapi",
        "uvicorn",
        "motor",
        "odmantic",
        "pydantic",
        "stripe",
        "python-jose",
        "passlib"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
            logger.info(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            logger.error(f"❌ {package} - MISSING")
    
    if missing_packages:
        logger.error(f"Missing packages: {', '.join(missing_packages)}")
        return False
    
    logger.info("✅ All dependencies are installed")
    return True


def validate_environment():
    """Validate environment variables and configuration"""
    logger.info("🔍 Validating environment...")
    
    required_vars = [
        "SECRET_KEY",
        "MONGO_URL",
        "STRIPE_SECRET_KEY"
    ]
    
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
            logger.error(f"❌ {var} - NOT SET")
        else:
            logger.info(f"✅ {var}")
    
    if missing_vars:
        logger.error(f"Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    logger.info("✅ Environment validation passed")
    return True


def check_database_connection():
    """Test database connection"""
    logger.info("🔍 Testing database connection...")
    
    try:
        from db.session import ping
        import asyncio
        
        # Run ping in event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(ping())
        loop.close()
        
        logger.info("✅ Database connection successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False


def create_directories():
    """Create necessary directories"""
    logger.info("📁 Creating directories...")
    
    directories = [
        "/var/log/mewayz",
        "/tmp/mewayz",
        "/var/cache/mewayz"
    ]
    
    for directory in directories:
        try:
            Path(directory).mkdir(parents=True, exist_ok=True)
            logger.info(f"✅ Created {directory}")
        except Exception as e:
            logger.error(f"❌ Failed to create {directory}: {e}")
            return False
    
    return True


def check_ssl_certificates():
    """Check SSL certificates if configured"""
    logger.info("🔒 Checking SSL certificates...")
    
    if production_settings.SSL_CERT_FILE and production_settings.SSL_KEY_FILE:
        cert_file = Path(production_settings.SSL_CERT_FILE)
        key_file = Path(production_settings.SSL_KEY_FILE)
        
        if not cert_file.exists():
            logger.error(f"❌ SSL certificate file not found: {cert_file}")
            return False
        
        if not key_file.exists():
            logger.error(f"❌ SSL key file not found: {key_file}")
            return False
        
        logger.info("✅ SSL certificates found")
    else:
        logger.info("ℹ️ SSL certificates not configured (using HTTP)")
    
    return True


def run_security_checks():
    """Run security checks"""
    logger.info("🔒 Running security checks...")
    
    # Check for weak secret key
    secret_key = os.getenv("SECRET_KEY", "")
    if len(secret_key) < 32:
        logger.error("❌ SECRET_KEY is too short (minimum 32 characters)")
        return False
    
    # Check for default passwords
    if os.getenv("FIRST_SUPERUSER_PASSWORD") == "changethis":
        logger.warning("⚠️ Default superuser password detected")
    
    logger.info("✅ Security checks passed")
    return True


def check_file_permissions():
    """Check file permissions"""
    logger.info("📄 Checking file permissions...")
    
    log_dir = Path("/var/log/mewayz")
    if log_dir.exists():
        try:
            # Check if we can write to log directory
            test_file = log_dir / "test_write"
            test_file.write_text("test")
            test_file.unlink()
            logger.info("✅ Log directory is writable")
        except Exception as e:
            logger.error(f"❌ Cannot write to log directory: {e}")
            return False
    
    return True


def start_monitoring():
    """Start monitoring services"""
    logger.info("📊 Starting monitoring...")
    
    try:
        # Initialize Sentry if configured
        if production_settings.SENTRY_DSN:
            import sentry_sdk
            from sentry_sdk.integrations.fastapi import FastApiIntegration
            
            sentry_sdk.init(
                dsn=production_settings.SENTRY_DSN,
                integrations=[FastApiIntegration()],
                traces_sample_rate=0.1,
                environment="production"
            )
            logger.info("✅ Sentry monitoring initialized")
        else:
            logger.info("ℹ️ Sentry monitoring not configured")
        
        # Start metrics collection if enabled
        if production_settings.ENABLE_METRICS:
            logger.info("✅ Metrics collection enabled")
        
    except Exception as e:
        logger.error(f"❌ Failed to start monitoring: {e}")
        return False
    
    return True


def main():
    """Main production startup function"""
    logger.info("🚀 Starting MEWAYZ V2 in production mode...")
    
    # Create directories
    if not create_directories():
        logger.error("❌ Directory creation failed")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        logger.error("❌ Dependency check failed")
        sys.exit(1)
    
    # Validate environment
    if not validate_environment():
        logger.error("❌ Environment validation failed")
        sys.exit(1)
    
    # Run security checks
    if not run_security_checks():
        logger.error("❌ Security checks failed")
        sys.exit(1)
    
    # Check file permissions
    if not check_file_permissions():
        logger.error("❌ File permission check failed")
        sys.exit(1)
    
    # Check SSL certificates
    if not check_ssl_certificates():
        logger.error("❌ SSL certificate check failed")
        sys.exit(1)
    
    # Check database connection
    if not check_database_connection():
        logger.error("❌ Database connection failed")
        sys.exit(1)
    
    # Start monitoring
    if not start_monitoring():
        logger.warning("⚠️ Monitoring startup failed, but continuing...")
    
    # Production server configuration
    config = uvicorn.Config(
        "main:app",
        host=production_settings.HOST,
        port=production_settings.PORT,
        workers=production_settings.WORKERS,
        log_level=production_settings.LOG_LEVEL.lower(),
        access_log=True,
        reload=False,  # Disable reload in production
        loop="asyncio",
        http="httptools",
        ws="websockets",
        lifespan="on",
        server_header=False,  # Hide server header for security
        date_header=False,    # Disable date header
        forwarded_allow_ips="*",  # Allow forwarded headers
        proxy_headers=True,   # Trust proxy headers
    )
    
    # Add SSL configuration if available
    if production_settings.SSL_CERT_FILE and production_settings.SSL_KEY_FILE:
        config.ssl_certfile = production_settings.SSL_CERT_FILE
        config.ssl_keyfile = production_settings.SSL_KEY_FILE
        logger.info("🔒 SSL/TLS enabled")
    
    # Start server
    server = uvicorn.Server(config)
    logger.info(f"🌐 Server starting on {production_settings.HOST}:{production_settings.PORT}")
    logger.info(f"📊 Workers: {production_settings.WORKERS}")
    logger.info(f"🔒 Environment: {production_settings.ENVIRONMENT}")
    logger.info(f"📝 Log level: {production_settings.LOG_LEVEL}")
    
    try:
        server.run()
    except KeyboardInterrupt:
        logger.info("🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 