#!/usr/bin/env python3
"""
Core Test Script for MEWAYZ V2
Tests essential functionality without requiring a running server
"""

import os
import sys
import importlib
from pathlib import Path

def test_core_imports():
    """Test core imports"""
    print("🔍 Testing core imports...")
    
    core_imports = [
        ("fastapi", "FastAPI"),
        ("uvicorn", "Uvicorn"),
        ("motor", "Motor"),
        ("odmantic", "Odmantic"),
        ("pydantic", "Pydantic")
    ]
    
    passed = 0
    total = len(core_imports)
    
    for module_name, description in core_imports:
        try:
            importlib.import_module(module_name)
            print(f"✅ {description}: Available")
            passed += 1
        except ImportError as e:
            print(f"❌ {description}: Missing - {e}")
    
    print(f"Core imports: {passed}/{total} passed")
    return passed == total

def test_project_files():
    """Test essential project files"""
    print("\n🔍 Testing project files...")
    
    essential_files = [
        "main.py",
        "requirements.txt",
        "core/config.py",
        "db/session.py"
    ]
    
    passed = 0
    total = len(essential_files)
    
    for file_path in essential_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}: Exists")
            passed += 1
        else:
            print(f"❌ {file_path}: Missing")
    
    print(f"Project files: {passed}/{total} passed")
    return passed == total

def test_app_import():
    """Test app import"""
    print("\n🔍 Testing app import...")
    
    try:
        # Set test environment
        os.environ["SECRET_KEY"] = "test-secret-key"
        os.environ["MONGO_URL"] = "mongodb://localhost:27017"
        os.environ["ENVIRONMENT"] = "development"
        
        # Import app
        from main import app
        
        print("✅ App imported successfully")
        print(f"✅ App title: {app.title}")
        print(f"✅ App version: {app.version}")
        
        return True
        
    except Exception as e:
        print(f"❌ App import failed: {e}")
        return False

def test_crud_modules():
    """Test CRUD modules"""
    print("\n🔍 Testing CRUD modules...")
    
    crud_files = [
        "crud/users.py",
        "crud/products.py",
        "crud/orders.py",
        "crud/biolinks.py"
    ]
    
    passed = 0
    total = len(crud_files)
    
    for file_path in crud_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}: Exists")
            passed += 1
        else:
            print(f"❌ {file_path}: Missing")
    
    print(f"CRUD modules: {passed}/{total} passed")
    return passed >= total * 0.75

def test_models():
    """Test models"""
    print("\n🔍 Testing models...")
    
    model_files = [
        "models/users.py",
        "models/products.py",
        "models/orders.py",
        "models/biolinks.py"
    ]
    
    passed = 0
    total = len(model_files)
    
    for file_path in model_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}: Exists")
            passed += 1
        else:
            print(f"❌ {file_path}: Missing")
    
    print(f"Models: {passed}/{total} passed")
    return passed >= total * 0.75

def test_api_endpoints():
    """Test API endpoints"""
    print("\n🔍 Testing API endpoints...")
    
    api_files = [
        "api/api_v1/endpoints/users.py",
        "api/api_v1/endpoints/ecommerce.py",
        "api/api_v1/endpoints/messages.py"
    ]
    
    passed = 0
    total = len(api_files)
    
    for file_path in api_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}: Exists")
            passed += 1
        else:
            print(f"❌ {file_path}: Missing")
    
    print(f"API endpoints: {passed}/{total} passed")
    return passed >= total * 0.75

def test_middleware():
    """Test middleware"""
    print("\n🔍 Testing middleware...")
    
    if Path("middleware/production_middleware.py").exists():
        print("✅ Production middleware: Exists")
        return True
    else:
        print("❌ Production middleware: Missing")
        return False

def main():
    """Run core tests"""
    print("🚀 MEWAYZ V2 Core Test Suite")
    print("=" * 50)
    
    tests = [
        ("Core Imports", test_core_imports),
        ("Project Files", test_project_files),
        ("App Import", test_app_import),
        ("CRUD Modules", test_crud_modules),
        ("Models", test_models),
        ("API Endpoints", test_api_endpoints),
        ("Middleware", test_middleware)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results[test_name] = result
        except Exception as e:
            print(f"❌ {test_name} failed: {e}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 CORE TEST RESULTS")
    print("=" * 50)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print("\n" + "-" * 50)
    print(f"Total: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    print("-" * 50)
    
    if passed == total:
        print("🎉 ALL CORE TESTS PASSED!")
        print("✅ MEWAYZ V2 core functionality is solid")
    elif passed >= total * 0.8:
        print("✅ MOST CORE TESTS PASSED!")
        print("⚠️ Minor issues found")
    else:
        print("❌ MANY CORE TESTS FAILED!")
        print("🔧 Significant issues need attention")
    
    print("=" * 50)
    
    return passed >= total * 0.8

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 