import pytest


def get_token_for(client, username, password="password123"):
    response = client.post("/auth/login", data={"username": username, "password": password, "totp_code": "000000"})
    return response.json().get("access_token")

def test_admin_access(client):
    token = get_token_for(client, "admin")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Admin should access everything
    assert client.get("/admin/system", headers=headers).status_code == 200
    assert client.get("/hr/data", headers=headers).status_code == 200
    assert client.get("/finance/reports", headers=headers).status_code == 200
    assert client.get("/employee/portal", headers=headers).status_code == 200

def test_hr_manager_access(client):
    token = get_token_for(client, "hr_manager")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Allowed
    assert client.get("/hr/data", headers=headers).status_code == 200
    assert client.get("/employee/portal", headers=headers).status_code == 200
    
    # Denied
    assert client.get("/finance/reports", headers=headers).status_code == 403
    assert client.get("/admin/system", headers=headers).status_code == 403

def test_finance_manager_access(client):
    token = get_token_for(client, "finance_manager")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Allowed
    assert client.get("/finance/reports", headers=headers).status_code == 200
    assert client.get("/employee/portal", headers=headers).status_code == 200
    
    # Denied
    assert client.get("/hr/data", headers=headers).status_code == 403
    assert client.get("/admin/system", headers=headers).status_code == 403

def test_employee_access(client):
    token = get_token_for(client, "employee01")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Allowed
    assert client.get("/employee/portal", headers=headers).status_code == 200
    
    # Denied
    assert client.get("/hr/data", headers=headers).status_code == 403
    assert client.get("/finance/reports", headers=headers).status_code == 403
    assert client.get("/admin/system", headers=headers).status_code == 403

def test_unauthenticated_access(client):
    # Missing token
    assert client.get("/employee/portal").status_code == 401
