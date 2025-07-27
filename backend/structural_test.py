#!/usr/bin/env python3
"""
Structural Test Script for MEWAYZ V2
Tests code structure, imports, and configuration without requiring a running server
"""

import os
import sys
import importlib
from pathlib import Path

def test_imports():
    """Test all critical imports"""
    print("🔍 Testing imports...")
    
    imports_to_test = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("motor", "Motor (MongoDB driver)"),
        ("odmantic", "Odmantic (ODM)"),
        ("pydantic", "Pydantic"),
        ("requests", "Requests"),
        ("stripe", "Stripe"),
        ("celery", "Celery"),
        ("cryptography", "Cryptography"),
        ("python-jose", "Python-Jose (JWT)"),
        ("email-validator", "Email Validator"),
        ("python-multipart", "Python Multipart"),
        ("pillow", "Pillow (PIL)"),
        ("qrcode", "QR Code"),
        ("pandas", "Pandas"),
        ("numpy", "NumPy")
    ]
    
    passed = 0
    total = len(imports_to_test)
    
    for module_name, description in imports_to_test:
        try:
            importlib.import_module(module_name)
            print(f"✅ {description}: Available")
            passed += 1
        except ImportError as e:
            print(f"❌ {description}: Missing - {e}")
    
    print(f"\nImport Test Results: {passed}/{total} passed")
    return passed == total

def test_project_structure():
    """Test project structure and files"""
    print("\n🔍 Testing project structure...")
    
    required_files = [
        "main.py",
        "requirements.txt",
        "core/config.py",
        "db/session.py",
        "models/__init__.py",
        "crud/__init__.py",
        "api/__init__.py",
        "services/__init__.py",
        "middleware/production_middleware.py"
    ]
    
    passed = 0
    total = len(required_files)
    
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}: Exists")
            passed += 1
        else:
            print(f"❌ {file_path}: Missing")
    
    print(f"\nStructure Test Results: {passed}/{total} passed")
    return passed == total

def test_configuration():
    """Test configuration and environment"""
    print("\n🔍 Testing configuration...")
    
    # Test environment variables
    env_vars = {
        "SECRET_KEY": "Secret key for JWT",
        "MONGO_URL": "MongoDB connection URL",
        "ENVIRONMENT": "Environment (development/production)"
    }
    
    passed = 0
    total = len(env_vars)
    
    for var_name, description in env_vars.items():
        value = os.getenv(var_name)
        if value:
            print(f"✅ {description}: Set")
            passed += 1
        else:
            print(f"⚠️ {description}: Not set")
    
    print(f"\nConfiguration Test Results: {passed}/{total} variables set")
    return passed >= total * 0.5  # At least 50% should be set

def test_app_creation():
    """Test app creation and basic functionality"""
    print("\n🔍 Testing app creation...")
    
    try:
        # Set required environment variables if not set
        if not os.getenv("SECRET_KEY"):
            os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
        if not os.getenv("MONGO_URL"):
            os.environ["MONGO_URL"] = "mongodb://localhost:27017"
        if not os.getenv("ENVIRONMENT"):
            os.environ["ENVIRONMENT"] = "development"
        
        # Import and create app
        from main import app
        
        print("✅ App created successfully")
        print(f"✅ App title: {app.title}")
        print(f"✅ App version: {app.version}")
        print(f"✅ Routes count: {len(app.routes)}")
        
        # Test route registration
        routes = [route.path for route in app.routes if hasattr(route, 'path')]
        print(f"✅ Available routes: {len(routes)}")
        
        return True
        
    except Exception as e:
        print(f"❌ App creation failed: {e}")
        return False

def test_crud_availability():
    """Test CRUD module availability"""
    print("\n🔍 Testing CRUD modules...")
    
    crud_modules = [
        "crud.users",
        "crud.products", 
        "crud.orders",
        "crud.biolinks",
        "crud.messages",
        "crud.comments",
        "crud.notifications"
    ]
    
    passed = 0
    total = len(crud_modules)
    
    for module_name in crud_modules:
        try:
            importlib.import_module(module_name)
            print(f"✅ {module_name}: Available")
            passed += 1
        except ImportError as e:
            print(f"❌ {module_name}: Missing - {e}")
    
    print(f"\nCRUD Test Results: {passed}/{total} passed")
    return passed >= total * 0.8  # At least 80% should be available

def test_models_availability():
    """Test model availability"""
    print("\n🔍 Testing models...")
    
    try:
        from models import User, Product, Order, BioLinkPage, Message, Comment, Notification
        print("✅ All core models available")
        return True
    except ImportError as e:
        print(f"❌ Models import failed: {e}")
        return False

def test_api_endpoints():
    """Test API endpoint modules"""
    print("\n🔍 Testing API endpoints...")
    
    api_modules = [
        "api.api_v1.endpoints.users",
        "api.api_v1.endpoints.ecommerce", 
        "api.api_v1.endpoints.messages",
        "api.api_v1.endpoints.comments",
        "api.api_v1.endpoints.notifications",
        "api.api_v1.endpoints.analytics"
    ]
    
    passed = 0
    total = len(api_modules)
    
    for module_name in api_modules:
        try:
            importlib.import_module(module_name)
            print(f"✅ {module_name}: Available")
            passed += 1
        except ImportError as e:
            print(f"⚠️ {module_name}: Missing - {e}")
    
    print(f"\nAPI Test Results: {passed}/{total} passed")
    return passed >= total * 0.7  # At least 70% should be available

def test_middleware():
    """Test middleware availability"""
    print("\n🔍 Testing middleware...")
    
    try:
        from middleware.production_middleware import (
            RateLimitMiddleware,
            SecurityHeadersMiddleware,
            RequestLoggingMiddleware,
            ErrorHandlingMiddleware
        )
        print("✅ All production middleware available")
        return True
    except ImportError as e:
        print(f"❌ Middleware import failed: {e}")
        return False

def main():
    """Run all structural tests"""
    print("🚀 MEWAYZ V2 Structural Test Suite")
    print("=" * 60)
    print("Testing code structure, imports, and configuration...")
    print("=" * 60)
    
    tests = [
        ("Import Dependencies", test_imports),
        ("Project Structure", test_project_structure),
        ("Configuration", test_configuration),
        ("App Creation", test_app_creation),
        ("CRUD Modules", test_crud_availability),
        ("Models", test_models_availability),
        ("API Endpoints", test_api_endpoints),
        ("Middleware", test_middleware)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results[test_name] = False
    
    # Generate summary
    print("\n" + "=" * 60)
    print("📊 STRUCTURAL TEST RESULTS")
    print("=" * 60)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print("\n" + "-" * 60)
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    print("-" * 60)
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        print("✅ MEWAYZ V2 code structure is solid")
    elif passed >= total * 0.8:
        print("✅ MOST TESTS PASSED!")
        print("⚠️ Some minor issues found")
    else:
        print("❌ MANY TESTS FAILED!")
        print("🔧 Significant issues need attention")
    
    print("=" * 60)
    
    return passed >= total * 0.8

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 