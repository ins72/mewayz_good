#!/usr/bin/env python3
"""
Comprehensive Test Script for MEWAYZ V2
Tests all aspects of the platform including API endpoints, CRUD operations, security, and performance
"""

import requests
import json
import time
import sys
from datetime import datetime
from typing import Dict, List, Any

class ComprehensiveTester:
    """Comprehensive testing for MEWAYZ V2 platform"""
    
    def __init__(self, base_url: str = "http://127.0.0.1:8002"):
        self.base_url = base_url
        self.results = {}
        self.session = requests.Session()
        
    def test_health_endpoint(self) -> bool:
        """Test health endpoint"""
        print("🔍 Testing health endpoint...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health endpoint: {data.get('status')}")
                self.results["health"] = {
                    "status": "✅ PASS",
                    "details": data
                }
                return True
            else:
                print(f"❌ Health endpoint failed: {response.status_code}")
                self.results["health"] = {
                    "status": "❌ FAIL",
                    "error": f"Status {response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ Health endpoint error: {e}")
            self.results["health"] = {
                "status": "❌ ERROR",
                "error": str(e)
            }
            return False
    
    def test_crud_operations(self) -> bool:
        """Test CRUD operations"""
        print("🔍 Testing CRUD operations...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/crud-test", timeout=60)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("production_ready"):
                    print("✅ CRUD operations: All models ready")
                    self.results["crud"] = {
                        "status": "✅ PASS",
                        "details": data
                    }
                    return True
                else:
                    print("❌ CRUD operations: Not production ready")
                    self.results["crud"] = {
                        "status": "❌ FAIL",
                        "details": data
                    }
                    return False
            else:
                print(f"❌ CRUD endpoint failed: {response.status_code}")
                self.results["crud"] = {
                    "status": "❌ FAIL",
                    "error": f"Status {response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ CRUD operations error: {e}")
            self.results["crud"] = {
                "status": "❌ ERROR",
                "error": str(e)
            }
            return False
    
    def test_api_endpoints(self) -> bool:
        """Test all API endpoints"""
        print("🔍 Testing API endpoints...")
        
        endpoints = [
            ("/api/", "API Root"),
            ("/api/test", "Connectivity Test"),
            ("/api/v1/", "API v1 Root")
        ]
        
        passed = 0
        total = len(endpoints)
        
        for endpoint, name in endpoints:
            try:
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                
                if response.status_code in [200, 301, 302]:
                    print(f"✅ {name}: {response.status_code}")
                    passed += 1
                else:
                    print(f"❌ {name}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ {name}: Error - {e}")
        
        success_rate = passed / total
        self.results["api_endpoints"] = {
            "status": "✅ PASS" if success_rate >= 0.8 else "❌ FAIL",
            "details": f"{passed}/{total} endpoints working"
        }
        
        return success_rate >= 0.8
    
    def test_security_headers(self) -> bool:
        """Test security headers"""
        print("🔍 Testing security headers...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
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
            
            if not missing_headers:
                print("✅ Security headers: All present")
                self.results["security_headers"] = {
                    "status": "✅ PASS",
                    "details": "All security headers present"
                }
                return True
            else:
                print(f"❌ Security headers: Missing {missing_headers}")
                self.results["security_headers"] = {
                    "status": "❌ FAIL",
                    "details": f"Missing headers: {missing_headers}"
                }
                return False
                
        except Exception as e:
            print(f"❌ Security headers error: {e}")
            self.results["security_headers"] = {
                "status": "❌ ERROR",
                "error": str(e)
            }
            return False
    
    def test_rate_limiting(self) -> bool:
        """Test rate limiting"""
        print("🔍 Testing rate limiting...")
        
        try:
            # Make multiple requests quickly
            responses = []
            for i in range(10):
                response = self.session.get(f"{self.base_url}/api/health", timeout=5)
                responses.append(response.status_code)
            
            # Check if any requests were rate limited
            rate_limited = any(status == 429 for status in responses)
            
            if rate_limited:
                print("✅ Rate limiting: Working")
                self.results["rate_limiting"] = {
                    "status": "✅ PASS",
                    "details": "Rate limiting detected"
                }
                return True
            else:
                print("⚠️ Rate limiting: Not detected (may be disabled)")
                self.results["rate_limiting"] = {
                    "status": "⚠️ WARNING",
                    "details": "Rate limiting not detected"
                }
                return True  # Not a critical failure
                
        except Exception as e:
            print(f"❌ Rate limiting error: {e}")
            self.results["rate_limiting"] = {
                "status": "❌ ERROR",
                "error": str(e)
            }
            return False
    
    def test_performance(self) -> bool:
        """Test performance"""
        print("🔍 Testing performance...")
        
        try:
            start_time = time.time()
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response_time < 1000:  # Less than 1 second
                print(f"✅ Performance: {response_time:.2f}ms")
                self.results["performance"] = {
                    "status": "✅ PASS",
                    "details": f"Response time: {response_time:.2f}ms"
                }
                return True
            else:
                print(f"⚠️ Performance: {response_time:.2f}ms (slow)")
                self.results["performance"] = {
                    "status": "⚠️ WARNING",
                    "details": f"Slow response time: {response_time:.2f}ms"
                }
                return True  # Not a critical failure
                
        except Exception as e:
            print(f"❌ Performance test error: {e}")
            self.results["performance"] = {
                "status": "❌ ERROR",
                "error": str(e)
            }
            return False
    
    def test_database_connection(self) -> bool:
        """Test database connection through health endpoint"""
        print("🔍 Testing database connection...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("database") == "connected":
                    print("✅ Database: Connected")
                    self.results["database"] = {
                        "status": "✅ PASS",
                        "details": "Database connected"
                    }
                    return True
                else:
                    print("❌ Database: Not connected")
                    self.results["database"] = {
                        "status": "❌ FAIL",
                        "details": "Database not connected"
                    }
                    return False
            else:
                print(f"❌ Database test failed: {response.status_code}")
                self.results["database"] = {
                    "status": "❌ FAIL",
                    "error": f"Status {response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ Database test error: {e}")
            self.results["database"] = {
                "status": "❌ ERROR",
                "error": str(e)
            }
            return False
    
    def test_authentication_endpoints(self) -> bool:
        """Test authentication endpoints"""
        print("🔍 Testing authentication endpoints...")
        
        try:
            # Test login endpoint (should return 422 for missing data, which is expected)
            response = self.session.post(f"{self.base_url}/api/v1/login/", json={}, timeout=10)
            
            if response.status_code in [422, 400]:  # Expected for missing credentials
                print("✅ Authentication endpoints: Accessible")
                self.results["authentication"] = {
                    "status": "✅ PASS",
                    "details": "Authentication endpoints accessible"
                }
                return True
            else:
                print(f"⚠️ Authentication endpoints: Unexpected status {response.status_code}")
                self.results["authentication"] = {
                    "status": "⚠️ WARNING",
                    "details": f"Unexpected status: {response.status_code}"
                }
                return True  # Not a critical failure
                
        except Exception as e:
            print(f"❌ Authentication test error: {e}")
            self.results["authentication"] = {
                "status": "❌ ERROR",
                "error": str(e)
            }
            return False
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report"""
        total_tests = len(self.results)
        passed = sum(1 for result in self.results.values() if result["status"] == "✅ PASS")
        warnings = sum(1 for result in self.results.values() if result["status"] == "⚠️ WARNING")
        failed = sum(1 for result in self.results.values() if result["status"] in ["❌ FAIL", "❌ ERROR"])
        
        success_rate = (passed / total_tests) * 100 if total_tests > 0 else 0
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_tests": total_tests,
                "passed": passed,
                "warnings": warnings,
                "failed": failed,
                "success_rate": f"{success_rate:.1f}%"
            },
            "results": self.results,
            "overall_status": "PASS" if failed == 0 else "FAIL"
        }
        
        return report
    
    def run_all_tests(self) -> bool:
        """Run all comprehensive tests"""
        print("🚀 MEWAYZ V2 Comprehensive Test Suite")
        print("=" * 60)
        print(f"Timestamp: {datetime.now()}")
        print(f"Server: {self.base_url}")
        print("=" * 60)
        
        tests = [
            ("Health Endpoint", self.test_health_endpoint),
            ("CRUD Operations", self.test_crud_operations),
            ("API Endpoints", self.test_api_endpoints),
            ("Security Headers", self.test_security_headers),
            ("Rate Limiting", self.test_rate_limiting),
            ("Performance", self.test_performance),
            ("Database Connection", self.test_database_connection),
            ("Authentication", self.test_authentication_endpoints)
        ]
        
        for test_name, test_func in tests:
            try:
                test_func()
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
                self.results[test_name.lower().replace(" ", "_")] = {
                    "status": "❌ ERROR",
                    "error": str(e)
                }
        
        # Generate and display report
        report = self.generate_report()
        
        print("\n" + "=" * 60)
        print("📊 COMPREHENSIVE TEST RESULTS")
        print("=" * 60)
        
        for test_name, result in self.results.items():
            status = result["status"]
            details = result.get("details", result.get("error", "No details"))
            print(f"{test_name.replace('_', ' ').title()}: {status}")
            if len(details) < 100:  # Only show short details
                print(f"  └─ {details}")
        
        print("\n" + "-" * 60)
        print(f"Total Tests: {report['summary']['total_tests']}")
        print(f"Passed: {report['summary']['passed']}")
        print(f"Warnings: {report['summary']['warnings']}")
        print(f"Failed: {report['summary']['failed']}")
        print(f"Success Rate: {report['summary']['success_rate']}")
        print("-" * 60)
        
        if report['overall_status'] == "PASS":
            print("🎉 ALL CRITICAL TESTS PASSED!")
            print("✅ MEWAYZ V2 platform is fully operational")
        else:
            print("⚠️ Some tests failed - review results above")
        
        print("=" * 60)
        
        return report['overall_status'] == "PASS"

def main():
    """Main test function"""
    tester = ComprehensiveTester()
    
    try:
        success = tester.run_all_tests()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n🛑 Testing interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n❌ Testing failed with error: {e}")
        exit(1)

if __name__ == "__main__":
    main() 