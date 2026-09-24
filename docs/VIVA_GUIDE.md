# Viva Preparation Guide: Zero Trust Enterprise Security

This guide is designed to help you confidently present and defend your project during your college viva or project presentation.

## 1. Project Pitch (The "Elevator Pitch")
**"What is your project about?"**
*Answer:* "My project is a simulated Enterprise Security Architecture built entirely on Zero Trust principles. Instead of traditional perimeter security (like a VPN), where anyone inside the network is trusted, my system assumes the network is always hostile. It continuously verifies the identity, role, and context of every request using a centralized Policy Decision Point before granting access to micro-segmented resources."

## 2. Core Concepts You Must Know

### What is Zero Trust?
"Never Trust, Always Verify." It means removing implicit trust. Even if a user is logged in, their access to a specific resource is constantly re-evaluated based on policies.

### What is micro-segmentation?
Dividing the network into small, isolated zones. In this project, we simulated this using Docker Networks. For example, the HR service and Finance service cannot communicate directly; they are logically air-gapped.

### What is the PDP and PEP?
- **PDP (Policy Decision Point):** The brain. It reads `policies.json` and decides if the request should be allowed (e.g., `policy_engine.py`).
- **PEP (Policy Enforcement Point):** The bouncer. It intercepts the user's request, asks the PDP for a decision, and either lets the user through or blocks them with a 403 Forbidden (e.g., `pep.py`).

## 3. Anticipated Viva Questions

**Q: Why use JWT instead of session cookies?**
*A:* JWTs are stateless, meaning the backend doesn't need to query a database to verify the user is logged in for every request, which is highly scalable for microservices.

**Q: How is the password stored in the database?**
*A:* Passwords are never stored in plain text. They are hashed using `bcrypt` with a salt. Even if the database is leaked, the passwords cannot be easily reversed.

**Q: What happens if an Employee tries to access the Finance portal?**
*A:* The React frontend will send a request to the Finance microservice. The PEP intercepts the request, asks the PDP. The PDP checks `policies.json`, sees that `EMPLOYEE` does not have access to `/finance*`, and returns a `DENY`. The PEP blocks the request, logs the event to the Audit Database, and the frontend displays a red "Access Denied" screen.

**Q: How do you handle insider threats?**
*A:* Through micro-segmentation and strict Role-Based Access Control mapped to Zero Trust policies. Even if a malicious employee has valid credentials, they are cryptographically restricted from accessing zones they don't have explicit permission for.

## 4. How to Demo the Project
1. Run `docker-compose up --build`.
2. Open the React Dashboard.
3. Login as `employee01` / `password123`.
4. Click on the **Employee Portal** (Success).
5. Click on **HR Management** (Blocked - Zero Trust Policy Denied).
6. Logout.
7. Login as `admin` / `password123`.
8. Click on **Security Monitor** and show the professor the Audit Logs proving the Employee was blocked in real-time.
9. Run `python scripts/simulate_attack.py` to show automated attack detection.

Good luck! You've got this.
