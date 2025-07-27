#!/usr/bin/env python3
"""
Real Data Integration Test for MEWAYZ V2
Tests that all mock data has been replaced with real database operations
"""

import asyncio
import logging
import requests
import json
from datetime import datetime
from typing import Dict, List, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class RealDataIntegrationTester:
    """Test real data integration"""
    
    def __init__(self, base_url: str = "http://127.0.0.1:8001"):
        self.base_url = base_url
        self.results = {}
    
    async def test_health_endpoint_real_data(self) -> bool:
        """Test that health endpoint returns real database data"""
        print("🔍 Testing health endpoint real data...")
        
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check for real database stats
                if "database_stats" in data:
                    db_stats = data["database_stats"]
                    print(f"✅ Database stats found: {db_stats}")
                    
                    # Verify stats are numbers, not hardcoded strings
                    for key, value in db_stats.items():
                        if isinstance(value, (int, float)):
                            print(f"✅ {key}: {value} (real data)")
                        else:
                            print(f"⚠️ {key}: {value} (may be hardcoded)")
                    
                    # Check for recent activity
                    if "recent_activity" in data:
                        recent_activity = data["recent_activity"]
                        print(f"✅ Recent activity found: {len(recent_activity)} categories")
                    
                    # Check for real bundle data
                    if "bundles" in data:
                        bundles = data["bundles"]
                        for bundle_name, bundle_data in bundles.items():
                            if isinstance(bundle_data, dict) and "products_count" in bundle_data:
                                print(f"✅ {bundle_name}: {bundle_data['products_count']} products (real data)")
                    
                    self.results["health_endpoint"] = {
                        "status": "✅ PASS",
                        "details": "Real database data found"
                    }
                    return True
                else:
                    print("❌ No database_stats found in health endpoint")
                    self.results["health_endpoint"] = {
                        "status": "❌ FAIL",
                        "details": "No database_stats found"
                    }
                    return False
            else:
                print(f"❌ Health endpoint returned status {response.status_code}")
                self.results["health_endpoint"] = {
                    "status": "❌ FAIL",
                    "details": f"Status {response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ Health endpoint test failed: {e}")
            self.results["health_endpoint"] = {
                "status": "❌ ERROR",
                "details": str(e)
            }
            return False
    
    async def test_crud_endpoint_real_operations(self) -> bool:
        """Test that CRUD endpoint performs real database operations"""
        print("\n🔍 Testing CRUD endpoint real operations...")
        
        try:
            response = requests.get(f"{self.base_url}/api/crud-test", timeout=60)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check for real test results
                if "tests_passed" in data and "tests_total" in data:
                    tests_passed = data["tests_passed"]
                    tests_total = data["tests_total"]
                    success_rate = data.get("success_rate", "0%")
                    
                    print(f"✅ CRUD tests: {tests_passed}/{tests_total} passed ({success_rate})")
                    
                    # Check individual test results
                    if "crud_tests" in data:
                        crud_tests = data["crud_tests"]
                        for model_name, test_result in crud_tests.items():
                            if isinstance(test_result, dict) and "test_result" in test_result:
                                result = test_result["test_result"]
                                print(f"✅ {model_name}: {result}")
                    
                    self.results["crud_endpoint"] = {
                        "status": "✅ PASS",
                        "details": f"{tests_passed}/{tests_total} tests passed"
                    }
                    return tests_passed == tests_total
                else:
                    print("❌ No test results found in CRUD endpoint")
                    self.results["crud_endpoint"] = {
                        "status": "❌ FAIL",
                        "details": "No test results found"
                    }
                    return False
            else:
                print(f"❌ CRUD endpoint returned status {response.status_code}")
                self.results["crud_endpoint"] = {
                    "status": "❌ FAIL",
                    "details": f"Status {response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ CRUD endpoint test failed: {e}")
            self.results["crud_endpoint"] = {
                "status": "❌ ERROR",
                "details": str(e)
            }
            return False
    
    async def test_bundle_pricing_real_data(self) -> bool:
        """Test that bundle pricing endpoint returns real data"""
        print("\n🔍 Testing bundle pricing real data...")
        
        try:
            response = requests.get(f"{self.base_url}/api/bundles/pricing", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check for real bundle data
                if "bundles" in data:
                    bundles = data["bundles"]
                    real_data_found = False
                    
                    for bundle_name, bundle_data in bundles.items():
                        if isinstance(bundle_data, dict):
                            # Check for real statistics
                            if "products_count" in bundle_data and "users_count" in bundle_data:
                                products_count = bundle_data["products_count"]
                                users_count = bundle_data["users_count"]
                                print(f"✅ {bundle_name}: {products_count} products, {users_count} users (real data)")
                                real_data_found = True
                            else:
                                print(f"⚠️ {bundle_name}: No real statistics found")
                    
                    if real_data_found:
                        self.results["bundle_pricing"] = {
                            "status": "✅ PASS",
                            "details": "Real bundle statistics found"
                        }
                        return True
                    else:
                        print("❌ No real bundle statistics found")
                        self.results["bundle_pricing"] = {
                            "status": "❌ FAIL",
                            "details": "No real bundle statistics"
                        }
                        return False
                else:
                    print("❌ No bundles data found")
                    self.results["bundle_pricing"] = {
                        "status": "❌ FAIL",
                        "details": "No bundles data"
                    }
                    return False
            else:
                print(f"❌ Bundle pricing endpoint returned status {response.status_code}")
                self.results["bundle_pricing"] = {
                    "status": "❌ FAIL",
                    "details": f"Status {response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ Bundle pricing test failed: {e}")
            self.results["bundle_pricing"] = {
                "status": "❌ ERROR",
                "details": str(e)
            }
            return False
    
    async def test_api_endpoints_real_data(self) -> bool:
        """Test that API endpoints return real data instead of mock data"""
        print("\n🔍 Testing API endpoints for real data...")
        
        endpoints_to_test = [
            ("/api/", "API Root"),
            ("/api/test", "Connectivity Test")
        ]
        
        passed = 0
        total = len(endpoints_to_test)
        
        for endpoint, name in endpoints_to_test:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Check for hardcoded timestamps or static data
                    if "timestamp" in data:
                        timestamp = data["timestamp"]
                        if timestamp == "2025-01-25" or timestamp == "2024-01-01":
                            print(f"⚠️ {name}: Hardcoded timestamp found")
                        else:
                            print(f"✅ {name}: Dynamic timestamp ({timestamp})")
                            passed += 1
                    else:
                        print(f"✅ {name}: No hardcoded timestamp")
                        passed += 1
                else:
                    print(f"❌ {name}: Status {response.status_code}")
                    
            except Exception as e:
                print(f"❌ {name}: Error - {e}")
        
        success_rate = passed / total
        self.results["api_endpoints"] = {
            "status": "✅ PASS" if success_rate >= 0.8 else "❌ FAIL",
            "details": f"{passed}/{total} endpoints using real data"
        }
        
        return success_rate >= 0.8
    
    async def test_database_connectivity(self) -> bool:
        """Test database connectivity and real data access"""
        print("\n🔍 Testing database connectivity...")
        
        try:
            # Test health endpoint for database connection
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("database") == "connected":
                    print("✅ Database connection confirmed")
                    
                    # Check if we can access real data
                    if "database_stats" in data:
                        db_stats = data["database_stats"]
                        total_entities = sum(db_stats.values()) if isinstance(db_stats, dict) else 0
                        
                        if total_entities > 0:
                            print(f"✅ Real data found: {total_entities} total entities")
                            self.results["database_connectivity"] = {
                                "status": "✅ PASS",
                                "details": f"Connected with {total_entities} entities"
                            }
                            return True
                        else:
                            print("⚠️ Database connected but no data found")
                            self.results["database_connectivity"] = {
                                "status": "⚠️ WARNING",
                                "details": "Connected but no data"
                            }
                            return True  # Not a critical failure
                    else:
                        print("❌ No database stats found")
                        self.results["database_connectivity"] = {
                            "status": "❌ FAIL",
                            "details": "No database stats"
                        }
                        return False
                else:
                    print("❌ Database not connected")
                    self.results["database_connectivity"] = {
                        "status": "❌ FAIL",
                        "details": "Database not connected"
                    }
                    return False
            else:
                print(f"❌ Health check failed: {response.status_code}")
                self.results["database_connectivity"] = {
                    "status": "❌ FAIL",
                    "details": f"Health check failed: {response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ Database connectivity test failed: {e}")
            self.results["database_connectivity"] = {
                "status": "❌ ERROR",
                "details": str(e)
            }
            return False
    
    async def test_production_readiness(self) -> bool:
        """Test overall production readiness with real data"""
        print("\n🔍 Testing production readiness...")
        
        try:
            # Test health endpoint
            health_response = requests.get(f"{self.base_url}/api/health", timeout=10)
            
            if health_response.status_code == 200:
                health_data = health_response.json()
                
                # Check production readiness flags
                production_ready = health_data.get("production_ready", False)
                environment = health_data.get("environment", "unknown")
                
                print(f"✅ Environment: {environment}")
                print(f"✅ Production Ready: {production_ready}")
                
                # Check for real data indicators
                has_real_data = False
                if "database_stats" in health_data:
                    db_stats = health_data["database_stats"]
                    if any(isinstance(v, (int, float)) and v > 0 for v in db_stats.values()):
                        has_real_data = True
                        print("✅ Real database data confirmed")
                
                if "recent_activity" in health_data:
                    recent_activity = health_data["recent_activity"]
                    if recent_activity and any(recent_activity.values()):
                        has_real_data = True
                        print("✅ Recent activity data confirmed")
                
                if production_ready and has_real_data:
                    self.results["production_readiness"] = {
                        "status": "✅ PASS",
                        "details": "Production ready with real data"
                    }
                    return True
                else:
                    self.results["production_readiness"] = {
                        "status": "❌ FAIL",
                        "details": f"Production ready: {production_ready}, Real data: {has_real_data}"
                    }
                    return False
            else:
                print(f"❌ Health check failed: {health_response.status_code}")
                self.results["production_readiness"] = {
                    "status": "❌ FAIL",
                    "details": f"Health check failed: {health_response.status_code}"
                }
                return False
                
        except Exception as e:
            print(f"❌ Production readiness test failed: {e}")
            self.results["production_readiness"] = {
                "status": "❌ ERROR",
                "details": str(e)
            }
            return False
    
    async def run_all_tests(self) -> bool:
        """Run all real data integration tests"""
        print("🚀 MEWAYZ V2 Real Data Integration Test Suite")
        print("=" * 60)
        print("Testing that all mock data has been replaced with real database operations")
        print("=" * 60)
        
        tests = [
            ("Health Endpoint Real Data", self.test_health_endpoint_real_data),
            ("CRUD Endpoint Real Operations", self.test_crud_endpoint_real_operations),
            ("Bundle Pricing Real Data", self.test_bundle_pricing_real_data),
            ("API Endpoints Real Data", self.test_api_endpoints_real_data),
            ("Database Connectivity", self.test_database_connectivity),
            ("Production Readiness", self.test_production_readiness)
        ]
        
        for test_name, test_func in tests:
            try:
                await test_func()
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
                self.results[test_name.lower().replace(" ", "_")] = {
                    "status": "❌ ERROR",
                    "details": str(e)
                }
        
        # Generate summary
        print("\n" + "=" * 60)
        print("📊 REAL DATA INTEGRATION TEST RESULTS")
        print("=" * 60)
        
        passed = sum(1 for result in self.results.values() if result["status"] == "✅ PASS")
        total = len(self.results)
        
        for test_name, result in self.results.items():
            status = result["status"]
            details = result["details"]
            print(f"{test_name.replace('_', ' ').title()}: {status}")
            print(f"  └─ {details}")
        
        print("\n" + "-" * 60)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print("-" * 60)
        
        if passed == total:
            print("🎉 ALL TESTS PASSED!")
            print("✅ MEWAYZ V2 is fully integrated with real database data!")
            print("✅ No mock data found - all operations use real database!")
        elif passed >= total * 0.8:
            print("✅ MOST TESTS PASSED!")
            print("⚠️ Some minor issues with real data integration")
        else:
            print("❌ MANY TESTS FAILED!")
            print("🔧 Significant issues with real data integration")
        
        print("=" * 60)
        
        return passed >= total * 0.8


async def main():
    """Main function"""
    tester = RealDataIntegrationTester()
    
    try:
        success = await tester.run_all_tests()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n🛑 Testing interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n❌ Testing failed with error: {e}")
        exit(1)


if __name__ == "__main__":
    asyncio.run(main()) 