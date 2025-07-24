# Temporarily disabled email functionality for MVP
def send_email(*args, **kwargs):
    """Mock email function for development"""
    print(f"Mock email: {args}, {kwargs}")
    return True

def send_test_email(*args, **kwargs):
    """Mock test email function"""
    print(f"Mock test email: {args}, {kwargs}")
    return True

def send_web_contact_email(*args, **kwargs):
    """Mock web contact email function"""
    print(f"Mock web contact email: {args}, {kwargs}")
    return True

def send_magic_login_email(*args, **kwargs):
    """Mock magic login email function"""
    print(f"Mock magic login email: {args}, {kwargs}")
    return True

def send_reset_password_email(*args, **kwargs):
    """Mock reset password email function"""
    print(f"Mock reset password email: {args}, {kwargs}")
    return True

def send_new_account_email(*args, **kwargs):
    """Mock new account email function"""
    print(f"Mock new account email: {args}, {kwargs}")
    return True

def send_email_validation_email(*args, **kwargs):
    """Mock email validation function"""
    print(f"Mock email validation: {args}, {kwargs}")
    return True
