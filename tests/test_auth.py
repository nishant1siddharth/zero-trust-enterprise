def test_correct_login(client):
    response = client.post("/auth/login", data={"username": "admin_test", "password": "pass123"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_incorrect_password(client):
    response = client.post("/auth/login", data={"username": "admin_test", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_unknown_user(client):
    response = client.post("/auth/login", data={"username": "nobody", "password": "password"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"

def test_disabled_account(client):
    response = client.post("/auth/login", data={"username": "disabled_test", "password": "pass123"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Inactive user"

def test_unauthorized_request(client):
    # Missing token
    response = client.get("/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_valid_token_request(client):
    login_res = client.post("/auth/login", data={"username": "admin_test", "password": "pass123"})
    token = login_res.json()["access_token"]
    
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["username"] == "admin_test"
    assert response.json()["role"] == "ADMIN"

def test_invalid_token(client):
    response = client.get("/auth/me", headers={"Authorization": "Bearer invalid.token.here"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

import pyotp

def test_mfa_correct_password_no_mfa(client):
    # MFA required account without MFA = restricted
    response = client.post("/auth/login", data={"username": "mfa_user", "password": "pass123"})
    assert response.status_code == 401
    assert response.json()["detail"] == "MFA challenge required"

def test_mfa_correct_password_wrong_mfa(client):
    # Correct password + incorrect MFA = denied
    response = client.post("/auth/login", data={
        "username": "mfa_user", 
        "password": "pass123",
        "totp_code": "111111"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid MFA code"

def test_mfa_correct_password_correct_mfa(client):
    # Correct password + correct MFA = success
    totp = pyotp.TOTP("JBSWY3DPEHPK3PXP")
    code = totp.now()
    response = client.post("/auth/login", data={
        "username": "mfa_user", 
        "password": "pass123",
        "totp_code": code
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_mfa_incorrect_password_correct_mfa(client):
    # Incorrect password + correct MFA = denied (fails early at password stage)
    totp = pyotp.TOTP("JBSWY3DPEHPK3PXP")
    code = totp.now()
    response = client.post("/auth/login", data={
        "username": "mfa_user", 
        "password": "wrongpassword",
        "totp_code": code
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"
