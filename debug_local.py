import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

try:
    from backend.models import User
    from backend.auth import get_password_hash, verify_password
    import pyotp
    import bcrypt
    print("Imports successful.")

    # Test bcrypt
    hashed = get_password_hash("password123")
    assert verify_password("password123", hashed)
    print("Bcrypt hash verification successful.")
    
except Exception as e:
    import traceback
    traceback.print_exc()
