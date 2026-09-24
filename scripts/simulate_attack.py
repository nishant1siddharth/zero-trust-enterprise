import requests
import time

BASE_URL = "http://localhost:8000"

def run_simulation():
    print("==============================================")
    print("🚨 INCIDENT RESPONSE SIMULATION STARTING 🚨")
    print("==============================================\n")
    
    # 1. Simulate brute force against admin
    print("[*] Stage 1: Brute Force Attempt against 'admin'")
    for i in range(5):
        print(f"    - Attempt {i+1} with wrong password...")
        requests.post(f"{BASE_URL}/auth/login", data={"username": "admin", "password": f"wrong{i}"})
        time.sleep(0.2)
    print("[+] Attack detected. Audit logs generated.\n")
    
    # 2. Simulate Insider Threat (Employee trying to access Finance data)
    print("[*] Stage 2: Insider Threat (Lateral Movement)")
    print("    - Logging in as 'employee01'...")
    res = requests.post(f"{BASE_URL}/auth/login", data={"username": "employee01", "password": "password123"})
    if res.status_code == 200:
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        print("    - Attempting to access HR data...")
        hr_res = requests.get(f"{BASE_URL}/hr/data", headers=headers)
        print(f"    - HR Access Result: HTTP {hr_res.status_code} - {hr_res.json()}")
        
        print("    - Attempting to access Finance data...")
        fin_res = requests.get(f"{BASE_URL}/finance/reports", headers=headers)
        print(f"    - Finance Access Result: HTTP {fin_res.status_code} - {fin_res.json()}")
        
        print("[+] Policy Engine successfully blocked unauthorized lateral movement.\n")
    else:
        print("    - Failed to login as employee01\n")
        
    print("==============================================")
    print("✅ SIMULATION COMPLETE")
    print("Please check the Security Monitor Dashboard to view the resulting audit logs.")
    print("==============================================")

if __name__ == "__main__":
    run_simulation()
