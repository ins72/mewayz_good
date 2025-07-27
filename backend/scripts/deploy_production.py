#!/usr/bin/env python3
"""
Production Deployment Script for MEWAYZ V2
Comprehensive deployment automation with all necessary production configurations
"""

import os
import sys
import subprocess
import logging
import shutil
from pathlib import Path
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ProductionDeployer:
    """Production deployment orchestrator"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.deploy_dir = Path("/opt/mewayz")
        self.backup_dir = Path("/opt/mewayz/backups")
        self.log_dir = Path("/var/log/mewayz")
        
    def create_backup(self):
        """Create backup of current deployment"""
        logger.info("📦 Creating backup...")
        
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"mewayz_backup_{timestamp}"
            backup_path = self.backup_dir / backup_name
            
            if self.deploy_dir.exists():
                shutil.copytree(self.deploy_dir, backup_path, dirs_exist_ok=True)
                logger.info(f"✅ Backup created: {backup_path}")
            else:
                logger.info("ℹ️ No existing deployment to backup")
            
            return True
        except Exception as e:
            logger.error(f"❌ Backup failed: {e}")
            return False
    
    def setup_directories(self):
        """Setup production directories"""
        logger.info("📁 Setting up directories...")
        
        directories = [
            self.deploy_dir,
            self.backup_dir,
            self.log_dir,
            Path("/var/cache/mewayz"),
            Path("/tmp/mewayz"),
            Path("/opt/mewayz/uploads"),
            Path("/opt/mewayz/static")
        ]
        
        for directory in directories:
            try:
                directory.mkdir(parents=True, exist_ok=True)
                logger.info(f"✅ Created {directory}")
            except Exception as e:
                logger.error(f"❌ Failed to create {directory}: {e}")
                return False
        
        return True
    
    def install_dependencies(self):
        """Install Python dependencies"""
        logger.info("📦 Installing dependencies...")
        
        try:
            # Upgrade pip
            subprocess.run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"], 
                         check=True, capture_output=True)
            
            # Install requirements
            requirements_file = self.project_root / "requirements.txt"
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
            ], check=True, capture_output=True)
            
            logger.info("✅ Dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Dependency installation failed: {e}")
            return False
    
    def copy_files(self):
        """Copy application files to production directory"""
        logger.info("📋 Copying application files...")
        
        try:
            # Copy backend files
            backend_src = self.project_root
            backend_dst = self.deploy_dir / "backend"
            
            if backend_dst.exists():
                shutil.rmtree(backend_dst)
            
            shutil.copytree(backend_src, backend_dst, dirs_exist_ok=True)
            
            # Set proper permissions
            for root, dirs, files in os.walk(backend_dst):
                for d in dirs:
                    os.chmod(os.path.join(root, d), 0o755)
                for f in files:
                    os.chmod(os.path.join(root, f), 0o644)
            
            logger.info("✅ Application files copied")
            return True
        except Exception as e:
            logger.error(f"❌ File copy failed: {e}")
            return False
    
    def setup_environment(self):
        """Setup production environment variables"""
        logger.info("🔧 Setting up environment...")
        
        env_file = self.deploy_dir / "backend" / ".env.production"
        
        env_content = f"""# MEWAYZ V2 Production Environment
ENVIRONMENT=production
DEBUG=false

# Security
SECRET_KEY={os.getenv('SECRET_KEY', 'your-super-secret-production-key-change-this')}
TOTP_SECRET_KEY={os.getenv('TOTP_SECRET_KEY', 'your-totp-secret-key-change-this')}

# Database
MONGO_URL={os.getenv('MONGO_URL', 'mongodb://localhost:27017')}
MONGO_DATABASE=mewayz_production

# Stripe
STRIPE_SECRET_KEY={os.getenv('STRIPE_SECRET_KEY', '')}
STRIPE_WEBHOOK_SECRET={os.getenv('STRIPE_WEBHOOK_SECRET', '')}

# Email
SMTP_HOST={os.getenv('SMTP_HOST', '')}
SMTP_PORT=587
SMTP_USER={os.getenv('SMTP_USER', '')}
SMTP_PASSWORD={os.getenv('SMTP_PASSWORD', '')}
EMAILS_FROM_EMAIL=noreply@mewayz.com

# Monitoring
SENTRY_DSN={os.getenv('SENTRY_DSN', '')}

# Redis (optional)
REDIS_URL={os.getenv('REDIS_URL', '')}

# SSL (optional)
SSL_CERT_FILE={os.getenv('SSL_CERT_FILE', '')}
SSL_KEY_FILE={os.getenv('SSL_KEY_FILE', '')}
"""
        
        try:
            with open(env_file, 'w') as f:
                f.write(env_content)
            
            logger.info("✅ Environment file created")
            return True
        except Exception as e:
            logger.error(f"❌ Environment setup failed: {e}")
            return False
    
    def setup_systemd_service(self):
        """Setup systemd service for automatic startup"""
        logger.info("🔧 Setting up systemd service...")
        
        service_content = f"""[Unit]
Description=MEWAYZ V2 Production Server
After=network.target

[Service]
Type=exec
User=mewayz
Group=mewayz
WorkingDirectory={self.deploy_dir}/backend
Environment=PATH={self.deploy_dir}/backend/venv/bin
ExecStart={self.deploy_dir}/backend/venv/bin/python scripts/production_start.py
Restart=always
RestartSec=10

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths={self.log_dir} /tmp/mewayz /var/cache/mewayz

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=mewayz

[Install]
WantedBy=multi-user.target
"""
        
        try:
            service_file = Path("/etc/systemd/system/mewayz.service")
            with open(service_file, 'w') as f:
                f.write(service_content)
            
            # Reload systemd and enable service
            subprocess.run(["systemctl", "daemon-reload"], check=True)
            subprocess.run(["systemctl", "enable", "mewayz"], check=True)
            
            logger.info("✅ Systemd service configured")
            return True
        except Exception as e:
            logger.error(f"❌ Systemd service setup failed: {e}")
            return False
    
    def setup_nginx(self):
        """Setup nginx reverse proxy"""
        logger.info("🌐 Setting up nginx...")
        
        nginx_config = f"""server {{
    listen 80;
    server_name mewayz.com www.mewayz.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}}

server {{
    listen 443 ssl http2;
    server_name mewayz.com www.mewayz.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/mewayz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mewayz.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy to FastAPI
    location / {{
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }}
    
    # Static files
    location /static/ {{
        alias {self.deploy_dir}/backend/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}
    
    # Health check
    location /api/health {{
        proxy_pass http://127.0.0.1:8000;
        access_log off;
    }}
}}
"""
        
        try:
            nginx_file = Path("/etc/nginx/sites-available/mewayz")
            with open(nginx_file, 'w') as f:
                f.write(nginx_config)
            
            # Enable site
            if not Path("/etc/nginx/sites-enabled/mewayz").exists():
                subprocess.run(["ln", "-s", "/etc/nginx/sites-available/mewayz", 
                              "/etc/nginx/sites-enabled/"], check=True)
            
            # Test nginx config
            subprocess.run(["nginx", "-t"], check=True)
            
            logger.info("✅ Nginx configured")
            return True
        except Exception as e:
            logger.error(f"❌ Nginx setup failed: {e}")
            return False
    
    def run_tests(self):
        """Run production tests"""
        logger.info("🧪 Running production tests...")
        
        try:
            # Change to backend directory
            os.chdir(self.deploy_dir / "backend")
            
            # Run health check
            result = subprocess.run([
                sys.executable, "-c", 
                "import asyncio; from main import app; print('App loaded successfully')"
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info("✅ Application tests passed")
                return True
            else:
                logger.error(f"❌ Application tests failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Tests failed: {e}")
            return False
    
    def start_services(self):
        """Start production services"""
        logger.info("🚀 Starting services...")
        
        try:
            # Start nginx
            subprocess.run(["systemctl", "start", "nginx"], check=True)
            logger.info("✅ Nginx started")
            
            # Start MEWAYZ service
            subprocess.run(["systemctl", "start", "mewayz"], check=True)
            logger.info("✅ MEWAYZ service started")
            
            return True
        except Exception as e:
            logger.error(f"❌ Service startup failed: {e}")
            return False
    
    def verify_deployment(self):
        """Verify deployment is working"""
        logger.info("🔍 Verifying deployment...")
        
        try:
            import requests
            import time
            
            # Wait for service to start
            time.sleep(10)
            
            # Test health endpoint
            response = requests.get("http://localhost:8000/api/health", timeout=30)
            
            if response.status_code == 200:
                health_data = response.json()
                if health_data.get("status") == "healthy":
                    logger.info("✅ Deployment verified successfully")
                    return True
                else:
                    logger.error(f"❌ Health check failed: {health_data}")
                    return False
            else:
                logger.error(f"❌ Health check returned status {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Deployment verification failed: {e}")
            return False
    
    def deploy(self):
        """Main deployment process"""
        logger.info("🚀 Starting MEWAYZ V2 production deployment...")
        
        steps = [
            ("Creating backup", self.create_backup),
            ("Setting up directories", self.setup_directories),
            ("Installing dependencies", self.install_dependencies),
            ("Copying files", self.copy_files),
            ("Setting up environment", self.setup_environment),
            ("Setting up systemd service", self.setup_systemd_service),
            ("Setting up nginx", self.setup_nginx),
            ("Running tests", self.run_tests),
            ("Starting services", self.start_services),
            ("Verifying deployment", self.verify_deployment)
        ]
        
        for step_name, step_func in steps:
            logger.info(f"📋 {step_name}...")
            if not step_func():
                logger.error(f"❌ Deployment failed at: {step_name}")
                return False
        
        logger.info("🎉 MEWAYZ V2 production deployment completed successfully!")
        logger.info(f"🌐 Application available at: https://mewayz.com")
        logger.info(f"📊 Health check: https://mewayz.com/api/health")
        logger.info(f"📝 Logs: {self.log_dir}")
        
        return True


def main():
    """Main deployment function"""
    if os.geteuid() != 0:
        logger.error("❌ This script must be run as root")
        sys.exit(1)
    
    deployer = ProductionDeployer()
    
    if not deployer.deploy():
        logger.error("❌ Deployment failed")
        sys.exit(1)


if __name__ == "__main__":
    main() 