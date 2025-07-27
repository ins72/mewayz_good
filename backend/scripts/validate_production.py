#!/usr/bin/env python3
"""
Production Validation Script for MEWAYZ V2
Comprehensive validation of all production components
"""

import asyncio
import requests
import logging
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ProductionValidator:
    """Production validation orchestrator"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.results = {}
        
    async def validate_database_connection(self) -> bool:
        """Validate database connection"""
        logger.info("🔍 Validating database connection...")
        
        try:
            from db.session import ping
            await ping()
            logger.info("✅ Database connection successful")
            self.results["database"] = "✅ Connected"
            return True
        except Exception as e:
            logger.error(f"❌ Database connection failed: {e}")
            self.results["database"] = f"❌ Failed: {e}"
            return False
    
    def validate_health_endpoint(self) -> bool:
        """Validate health check endpoint"""
        logger.info("🔍 Validating health endpoint...")
        
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    logger.info("✅ Health endpoint working")
                    self.results["health_endpoint"] = "✅ Healthy"
                    return True
                else:
                    logger.error(f"❌ Health check returned unhealthy status")
                    self.results["health_endpoint"] = "❌ Unhealthy"
                    return False
            else:
                logger.error(f"❌ Health endpoint returned status {response.status_code}")
                self.results["health_endpoint"] = f"❌ Status {response.status_code}"
                return False
                
        except Exception as e:
            logger.error(f"❌ Health endpoint validation failed: {e}")
            self.results["health_endpoint"] = f"❌ Error: {e}"
            return False
    
    def validate_crud_endpoint(self) -> bool:
        """Validate CRUD test endpoint"""
        logger.info("🔍 Validating CRUD endpoint...")
        
        try:
            response = requests.get(f"{self.base_url}/api/crud-test", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("production_ready"):
                    logger.info("✅ CRUD operations validated")
                    self.results["crud_operations"] = "✅ Ready"
                    return True
                else:
                    logger.error("❌ CRUD operations not ready")
                    self.results["crud_operations"] = "❌ Not Ready"
                    return False
            else:
                logger.error(f"❌ CRUD endpoint returned status {response.status_code}")
                self.results["crud_operations"] = f"❌ Status {response.status_code}"
                return False
                
        except Exception as e:
            logger.error(f"❌ CRUD validation failed: {e}")
            self.results["crud_operations"] = f"❌ Error: {e}"
            return False
    
    def validate_api_endpoints(self) -> bool:
        """Validate all API endpoints"""
        logger.info("🔍 Validating API endpoints...")
        
        endpoints = [
            "/api/",
            "/api/v1/",
            "/api/docs",
            "/api/redoc"
        ]
        
        working_endpoints = 0
        
        for endpoint in endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                if response.status_code in [200, 301, 302]:
                    working_endpoints += 1
                    logger.info(f"✅ {endpoint} - {response.status_code}")
                else:
                    logger.warning(f"⚠️ {endpoint} - {response.status_code}")
            except Exception as e:
                logger.error(f"❌ {endpoint} - Error: {e}")
        
        success_rate = working_endpoints / len(endpoints)
        if success_rate >= 0.75:
            logger.info(f"✅ API endpoints validation passed ({working_endpoints}/{len(endpoints)})")
            self.results["api_endpoints"] = f"✅ {working_endpoints}/{len(endpoints)} Working"
            return True
        else:
            logger.error(f"❌ API endpoints validation failed ({working_endpoints}/{len(endpoints)})")
            self.results["api_endpoints"] = f"❌ {working_endpoints}/{len(endpoints)} Working"
            return False
    
    def validate_security_headers(self) -> bool:
        """Validate security headers"""
        logger.info("🔍 Validating security headers...")
        
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            headers = response.headers
            
            security_headers = {
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": "DENY",
                "X-XSS-Protection": "1; mode=block"
            }
            
            missing_headers = []
            for header, expected_value in security_headers.items():
                if header not in headers:
                    missing_headers.append(header)
                elif headers[header] != expected_value:
                    logger.warning(f"⚠️ {header} has unexpected value: {headers[header]}")
            
            if not missing_headers:
                logger.info("✅ Security headers present")
                self.results["security_headers"] = "✅ Present"
                return True
            else:
                logger.error(f"❌ Missing security headers: {missing_headers}")
                self.results["security_headers"] = f"❌ Missing: {missing_headers}"
                return False
                
        except Exception as e:
            logger.error(f"❌ Security headers validation failed: {e}")
            self.results["security_headers"] = f"❌ Error: {e}"
            return False
    
    def validate_rate_limiting(self) -> bool:
        """Validate rate limiting"""
        logger.info("🔍 Validating rate limiting...")
        
        try:
            # Make multiple requests quickly
            responses = []
            for i in range(70):  # More than the 60/minute limit
                response = requests.get(f"{self.base_url}/api/health", timeout=5)
                responses.append(response.status_code)
            
            # Check if any requests were rate limited
            rate_limited = any(status == 429 for status in responses)
            
            if rate_limited:
                logger.info("✅ Rate limiting working")
                self.results["rate_limiting"] = "✅ Working"
                return True
            else:
                logger.warning("⚠️ Rate limiting not detected")
                self.results["rate_limiting"] = "⚠️ Not Detected"
                return True  # Not a critical failure
                
        except Exception as e:
            logger.error(f"❌ Rate limiting validation failed: {e}")
            self.results["rate_limiting"] = f"❌ Error: {e}"
            return False
    
    def validate_environment_variables(self) -> bool:
        """Validate environment variables"""
        logger.info("🔍 Validating environment variables...")
        
        required_vars = [
            "SECRET_KEY",
            "MONGO_URL",
            "STRIPE_SECRET_KEY"
        ]
        
        missing_vars = []
        for var in required_vars:
            if not os.getenv(var):
                missing_vars.append(var)
        
        if not missing_vars:
            logger.info("✅ Environment variables configured")
            self.results["environment"] = "✅ Configured"
            return True
        else:
            logger.error(f"❌ Missing environment variables: {missing_vars}")
            self.results["environment"] = f"❌ Missing: {missing_vars}"
            return False
    
    def validate_file_permissions(self) -> bool:
        """Validate file permissions"""
        logger.info("🔍 Validating file permissions...")
        
        try:
            # Check if we can write to log directory
            log_dir = Path("/var/log/mewayz")
            if log_dir.exists():
                test_file = log_dir / "test_write"
                test_file.write_text("test")
                test_file.unlink()
                logger.info("✅ File permissions correct")
                self.results["file_permissions"] = "✅ Correct"
                return True
            else:
                logger.warning("⚠️ Log directory not found")
                self.results["file_permissions"] = "⚠️ Log Dir Missing"
                return True  # Not critical
                
        except Exception as e:
            logger.error(f"❌ File permissions validation failed: {e}")
            self.results["file_permissions"] = f"❌ Error: {e}"
            return False
    
    def validate_dependencies(self) -> bool:
        """Validate Python dependencies"""
        logger.info("🔍 Validating dependencies...")
        
        required_packages = [
            "fastapi",
            "uvicorn",
            "motor",
            "odmantic",
            "pydantic",
            "stripe"
        ]
        
        missing_packages = []
        for package in required_packages:
            try:
                __import__(package.replace("-", "_"))
            except ImportError:
                missing_packages.append(package)
        
        if not missing_packages:
            logger.info("✅ Dependencies installed")
            self.results["dependencies"] = "✅ Installed"
            return True
        else:
            logger.error(f"❌ Missing dependencies: {missing_packages}")
            self.results["dependencies"] = f"❌ Missing: {missing_packages}"
            return False
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate validation report"""
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results.values() if result.startswith("✅"))
        failed_tests = sum(1 for result in self.results.values() if result.startswith("❌"))
        warning_tests = sum(1 for result in self.results.values() if result.startswith("⚠️"))
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_tests": total_tests,
                "passed": passed_tests,
                "failed": failed_tests,
                "warnings": warning_tests,
                "success_rate": f"{success_rate:.1f}%"
            },
            "results": self.results,
            "production_ready": success_rate >= 90.0
        }
        
        return report
    
    async def run_validation(self) -> bool:
        """Run all validation tests"""
        logger.info("🚀 Starting production validation...")
        
        tests = [
            ("Database Connection", self.validate_database_connection),
            ("Environment Variables", self.validate_environment_variables),
            ("Dependencies", self.validate_dependencies),
            ("File Permissions", self.validate_file_permissions),
            ("Health Endpoint", self.validate_health_endpoint),
            ("CRUD Operations", self.validate_crud_endpoint),
            ("API Endpoints", self.validate_api_endpoints),
            ("Security Headers", self.validate_security_headers),
            ("Rate Limiting", self.validate_rate_limiting)
        ]
        
        for test_name, test_func in tests:
            logger.info(f"📋 Running {test_name}...")
            try:
                if asyncio.iscoroutinefunction(test_func):
                    await test_func()
                else:
                    test_func()
            except Exception as e:
                logger.error(f"❌ {test_name} failed with exception: {e}")
                self.results[test_name.lower().replace(" ", "_")] = f"❌ Exception: {e}"
        
        # Generate report
        report = self.generate_report()
        
        # Print results
        logger.info("\n" + "="*50)
        logger.info("📊 PRODUCTION VALIDATION RESULTS")
        logger.info("="*50)
        
        for test, result in self.results.items():
            logger.info(f"{test.replace('_', ' ').title()}: {result}")
        
        logger.info("\n" + "-"*50)
        logger.info(f"Total Tests: {report['summary']['total_tests']}")
        logger.info(f"Passed: {report['summary']['passed']}")
        logger.info(f"Failed: {report['summary']['failed']}")
        logger.info(f"Warnings: {report['summary']['warnings']}")
        logger.info(f"Success Rate: {report['summary']['success_rate']}")
        logger.info("-"*50)
        
        if report['production_ready']:
            logger.info("🎉 PRODUCTION READY! ✅")
        else:
            logger.error("❌ NOT PRODUCTION READY")
        
        return report['production_ready']


async def main():
    """Main validation function"""
    import os
    
    # Get base URL from environment or use default
    base_url = os.getenv("VALIDATION_BASE_URL", "http://localhost:8000")
    
    validator = ProductionValidator(base_url)
    
    try:
        success = await validator.run_validation()
        
        if success:
            logger.info("🚀 Platform is ready for production deployment!")
            sys.exit(0)
        else:
            logger.error("❌ Platform needs fixes before production deployment")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("🛑 Validation interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Validation failed with error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main()) 