# Zero Trust Enterprise Architecture

A simulated corporate network architecture designed to demonstrate the **Zero Trust** security model (*"Never Trust, Always Verify"*). This project enforces strict identity verification, role-based access control, and network micro-segmentation to secure resources and detect threats in real-time.

## 🚀 Key Features

* **Identity Verification & Authentication:** Enforces strong authentication using cryptographically signed JWTs (HS256) and Multi-Factor Authentication (MFA) via PyOTP.
* **Policy Engine (PEP/PDP):** A custom backend engine that intercepts every HTTP request, evaluating the user's role against strict RBAC rules before routing.
* **Micro-Segmentation (Assume Breach):** Network zones (Employee, HR, Finance, Admin) are isolated. The Policy Engine prevents lateral movement even if an account is compromised.
* **Real-time Audit Logging:** A Security Monitor dashboard logs every ALLOW and DENY decision to track network behavior and detect anomalies.
* **Threat Simulator:** Built-in tools to simulate External Brute-Force attacks and Insider Lateral Movement, proving the robustness of the architecture.

## 💻 Tech Stack

* **Frontend:** React.js, Vite, Vanilla CSS (Glassmorphism UI)
* **Backend:** Python, FastAPI
* **Database:** SQLite (via SQLAlchemy ORM)
* **Security:** JWT, PyOTP, bcrypt

## 🛠️ Quick Start (Windows)

This is a Full-Stack application. The easiest way to boot the entire system is to use the provided Windows batch script:

1. Clone the repository:
   ```bash
   git clone https://github.com/nishant1siddharth/zero-trust-enterprise.git
   cd zero-trust-enterprise
   ```

2. Run the startup script:
   ```cmd
   .\start_windows.bat
   ```
   *This script will automatically install all Python and Node.js dependencies, spin up the backend API on port 8008, and launch the React frontend on port 5173.*

3. Open your browser and navigate to:
   **http://localhost:5173**

## 👨‍💻 Author

**Siddharth Kumar**  
*B.Tech Computer Science and Engineering Student*  
Netaji Subhas Institute of Technology (NSIT), Patna  
Contact: [nishant.1.siddharth@gmail.com](mailto:nishant.1.siddharth@gmail.com)
