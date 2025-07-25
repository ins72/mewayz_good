#!/usr/bin/env python3
"""
MEWAYZ V2 Authentication & Critical Fixes Testing Suite
Tests the specific authentication fixes mentioned in the review request:
1. JWT token validation for workspace creation endpoint
2. ObjectId string conversion fixes in deps.py
3. Invitation system endpoints
4. Core authentication flow
"""

import requests
import json
import sys
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from frontend environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

print(f"🔧 Testing MEWAYZ V2 Authentication & Critical Fixes")
print(f"📍 Backend URL: {BACKEND_URL}")
print(f"📍 API Base: {API_BASE}")
print("=" * 80)

# Global variables to store test data
access_token = None
test_user_credentials = None
test_workspace_data = None
test_invitation_token = None

def test_user_registration():
    """Test POST /api/v1/users/ - User registration"""
    print("\n🧪 Testing User Registration (POST /api/v1/users/)")
    global test_user_credentials
    
    try:
        # Create realistic test user data
        test_user = {
            "email": f"sarah.johnson+test{datetime.now().strftime('%Y%m%d%H%M%S')}@mewayz.com",
            "password": "SecurePassword123!",
            "full_name": "Sarah Johnson"
        }
        
        response = requests.post(f"{API_BASE}/v1/users/", json=test_user, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ User registered successfully")
            print(f"   📝 User ID: {data.get('id', 'N/A')}")
            print(f"   📝 Email: {data.get('email', 'N/A')}")
            print(f"   📝 Full Name: {data.get('full_name', 'N/A')}")
            
            # Store credentials for OAuth2 login test
            test_user_credentials = {
                "username": test_user["email"],
                "password": test_user["password"]
            }
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_oauth2_login():
    """Test POST /api/v1/login/oauth - OAuth2 login (CRITICAL FIX TEST)"""
    print("\n🧪 Testing OAuth2 Login (POST /api/v1/login/oauth) - CRITICAL FIX")
    global access_token
    
    try:
        if not test_user_credentials:
            print(f"   ⚠️  No test user available, skipping OAuth2 login test")
            return False
        
        # OAuth2 login requires form data, not JSON
        login_data = {
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"]
        }
        
        response = requests.post(f"{API_BASE}/v1/login/oauth", data=login_data, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ OAuth2 login successful")
            print(f"   📝 Token Type: {data.get('token_type', 'N/A')}")
            print(f"   📝 Access Token: {data.get('access_token', 'N/A')[:50]}...")
            print(f"   📝 Refresh Token: {'Present' if data.get('refresh_token') else 'None'}")
            
            # Store access token for authenticated requests
            access_token = data.get('access_token')
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_get_current_user():
    """Test GET /api/v1/users/ - Get current user (JWT validation test)"""
    print("\n🧪 Testing Get Current User (GET /api/v1/users/) - JWT Validation")
    
    try:
        if not access_token:
            print(f"   ⚠️  No access token available, skipping authenticated user test")
            return False
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{API_BASE}/v1/users/", headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ JWT token validation successful")
            print(f"   📝 User ID: {data.get('id', 'N/A')}")
            print(f"   📝 Email: {data.get('email', 'N/A')}")
            print(f"   📝 Full Name: {data.get('full_name', 'N/A')}")
            print(f"   📝 Active: {data.get('is_active', 'N/A')}")
            return True
        elif response.status_code == 403:
            print(f"   ❌ JWT validation failed - 'Could not validate credentials' error")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_workspace_creation():
    """Test POST /api/v1/workspaces/ - Create workspace (CRITICAL FIX TEST)"""
    print("\n🧪 Testing Workspace Creation (POST /api/v1/workspaces/) - CRITICAL FIX")
    global test_workspace_data
    
    try:
        if not access_token:
            print(f"   ⚠️  No access token available, skipping workspace creation test")
            return False
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Realistic workspace data
        workspace_data = {
            "name": "Digital Marketing Agency",
            "industry": "marketing",
            "team_size": "medium",
            "main_goals": ["social_media", "content_creation", "client_management"],
            "selected_bundles": ["creator", "social_media", "business"],
            "payment_method": "monthly"
        }
        
        response = requests.post(f"{API_BASE}/v1/workspaces/", json=workspace_data, headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Workspace created successfully - ObjectId conversion working!")
            print(f"   📝 Workspace ID: {data.get('id', 'N/A')}")
            print(f"   📝 Name: {data.get('name', 'N/A')}")
            print(f"   📝 Industry: {data.get('industry', 'N/A')}")
            print(f"   📝 Team Size: {data.get('team_size', 'N/A')}")
            print(f"   📝 Selected Bundles: {data.get('selected_bundles', [])}")
            print(f"   📝 Owner ID: {data.get('owner_id', 'N/A')}")
            print(f"   📝 Status: {data.get('status', 'N/A')}")
            
            # Store workspace data for other tests
            test_workspace_data = data
            return True
        elif response.status_code == 403:
            print(f"   ❌ CRITICAL ISSUE: 'Could not validate credentials' error still present!")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_get_workspaces():
    """Test GET /api/v1/workspaces/ - Get user workspaces (JWT validation test)"""
    print("\n🧪 Testing Get User Workspaces (GET /api/v1/workspaces/) - JWT Validation")
    
    try:
        if not access_token:
            print(f"   ⚠️  No access token available, skipping get workspaces test")
            return False
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{API_BASE}/v1/workspaces/", headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Workspaces retrieved successfully")
            print(f"   📝 Number of workspaces: {len(data)}")
            
            if data:
                workspace = data[0]
                print(f"   📝 First workspace: {workspace.get('name', 'N/A')}")
                print(f"   📝 Workspace ID: {workspace.get('id', 'N/A')}")
                print(f"   📝 Owner ID: {workspace.get('owner_id', 'N/A')}")
            
            return True
        elif response.status_code == 403:
            print(f"   ❌ JWT validation failed - 'Could not validate credentials' error")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_create_invitation():
    """Test POST /api/v1/invitations/create - Create invitation (NEW FEATURE TEST)"""
    print("\n🧪 Testing Create Invitation (POST /api/v1/invitations/create) - NEW FEATURE")
    global test_invitation_token
    
    try:
        if not access_token or not test_workspace_data:
            print(f"   ⚠️  No access token or workspace available, skipping invitation creation test")
            return False
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Realistic invitation data
        invitation_data = {
            "email": f"team.member+test{datetime.now().strftime('%Y%m%d%H%M%S')}@mewayz.com",
            "workspace_id": test_workspace_data["id"],
            "role": "member",
            "message": "Join our digital marketing team! We're excited to have you on board."
        }
        
        response = requests.post(f"{API_BASE}/v1/invitations/create", json=invitation_data, headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Invitation created successfully")
            print(f"   📝 Invitation ID: {data.get('invitation_id', 'N/A')}")
            print(f"   📝 Invitation Token: {data.get('invitation_token', 'N/A')[:50]}...")
            print(f"   📝 Invitation URL: {data.get('invitation_url', 'N/A')}")
            print(f"   📝 Expires At: {data.get('expires_at', 'N/A')}")
            print(f"   📝 Message: {data.get('message', 'N/A')}")
            
            # Store invitation token for validation test
            test_invitation_token = data.get('invitation_token')
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_validate_invitation():
    """Test POST /api/v1/invitations/validate - Validate invitation token (NEW FEATURE TEST)"""
    print("\n🧪 Testing Validate Invitation (POST /api/v1/invitations/validate) - NEW FEATURE")
    
    try:
        if not test_invitation_token:
            print(f"   ⚠️  No invitation token available, skipping validation test")
            return False
        
        validation_data = {
            "invitation_token": test_invitation_token
        }
        
        response = requests.post(f"{API_BASE}/v1/invitations/validate", json=validation_data, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Invitation validated successfully")
            print(f"   📝 Invitation ID: {data.get('id', 'N/A')}")
            print(f"   📝 Email: {data.get('email', 'N/A')}")
            print(f"   📝 Workspace ID: {data.get('workspace_id', 'N/A')}")
            print(f"   📝 Workspace Name: {data.get('workspace_name', 'N/A')}")
            print(f"   📝 Role: {data.get('role', 'N/A')}")
            print(f"   📝 Inviter Name: {data.get('inviter_name', 'N/A')}")
            print(f"   📝 Status: {data.get('status', 'N/A')}")
            print(f"   📝 Expires At: {data.get('expires_at', 'N/A')}")
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_list_invitations():
    """Test GET /api/v1/invitations/ - List invitations (NEW FEATURE TEST)"""
    print("\n🧪 Testing List Invitations (GET /api/v1/invitations/) - NEW FEATURE")
    
    try:
        if not access_token:
            print(f"   ⚠️  No access token available, skipping list invitations test")
            return False
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{API_BASE}/v1/invitations/", headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Invitations listed successfully")
            print(f"   📝 Number of invitations: {len(data)}")
            
            if data:
                invitation = data[0]
                print(f"   📝 First invitation email: {invitation.get('email', 'N/A')}")
                print(f"   📝 Workspace: {invitation.get('workspace_name', 'N/A')}")
                print(f"   📝 Role: {invitation.get('role', 'N/A')}")
                print(f"   📝 Status: {invitation.get('status', 'N/A')}")
            
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            if response.text:
                try:
                    error_data = response.json()
                    print(f"   📝 Error: {error_data.get('detail', response.text)}")
                except:
                    print(f"   📝 Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_unauthenticated_workspace_access():
    """Test workspace endpoints without authentication - Should return 401"""
    print("\n🧪 Testing Unauthenticated Workspace Access - Should Return 401")
    
    try:
        # Test workspace creation without token
        workspace_data = {
            "name": "Unauthorized Workspace",
            "industry": "test",
            "team_size": "small",
            "main_goals": ["test"],
            "selected_bundles": ["creator"],
            "payment_method": "monthly"
        }
        
        response = requests.post(f"{API_BASE}/v1/workspaces/", json=workspace_data, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print(f"   ✅ Correctly rejected unauthenticated request")
            try:
                error_data = response.json()
                print(f"   📝 Error: {error_data.get('detail', 'Unauthorized')}")
            except:
                print(f"   📝 Error: Unauthorized access")
            return True
        else:
            print(f"   ❌ Unexpected status code: {response.status_code}")
            print(f"   📝 Expected 401 for unauthenticated request")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def test_invalid_jwt_token():
    """Test workspace endpoints with invalid JWT token - Should return 403"""
    print("\n🧪 Testing Invalid JWT Token - Should Return 403")
    
    try:
        headers = {
            "Authorization": "Bearer invalid_jwt_token_12345",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{API_BASE}/v1/users/", headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 403:
            print(f"   ✅ Correctly rejected invalid JWT token")
            try:
                error_data = response.json()
                print(f"   📝 Error: {error_data.get('detail', 'Could not validate credentials')}")
            except:
                print(f"   📝 Error: Could not validate credentials")
            return True
        else:
            print(f"   ❌ Unexpected status code: {response.status_code}")
            print(f"   📝 Expected 403 for invalid JWT token")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def run_all_tests():
    """Run all authentication and critical fix tests"""
    print("\n🚀 Starting MEWAYZ V2 Authentication & Critical Fixes Test Suite")
    print("=" * 80)
    
    tests = [
        ("User Registration", test_user_registration),
        ("OAuth2 Login (Critical Fix)", test_oauth2_login),
        ("Get Current User (JWT Validation)", test_get_current_user),
        ("Workspace Creation (Critical Fix)", test_workspace_creation),
        ("Get User Workspaces (JWT Validation)", test_get_workspaces),
        ("Create Invitation (New Feature)", test_create_invitation),
        ("Validate Invitation (New Feature)", test_validate_invitation),
        ("List Invitations (New Feature)", test_list_invitations),
        ("Unauthenticated Access Test", test_unauthenticated_workspace_access),
        ("Invalid JWT Token Test", test_invalid_jwt_token),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            if result:
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"   ❌ Test '{test_name}' crashed: {str(e)}")
            failed += 1
    
    print("\n" + "=" * 80)
    print(f"🎯 AUTHENTICATION & CRITICAL FIXES TEST RESULTS")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
    
    if failed == 0:
        print(f"🎉 ALL CRITICAL AUTHENTICATION FIXES ARE WORKING!")
        print(f"✅ ObjectId string conversion fix is successful")
        print(f"✅ JWT token validation is working properly")
        print(f"✅ Workspace creation 'Could not validate credentials' error is resolved")
        print(f"✅ Invitation system is fully functional")
    else:
        print(f"⚠️  Some critical issues remain - see failed tests above")
        if failed > passed:
            print(f"🚨 CRITICAL: More tests failed than passed - major issues present")
    
    print("=" * 80)
    return failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)