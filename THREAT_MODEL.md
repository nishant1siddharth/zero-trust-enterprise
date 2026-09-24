# Threat Model & Security Requirements

## 1. Zero Trust Principles Adopted
- **Assume Breach**: We assume the internal network (even inside the Docker deployment) is already compromised or cannot be trusted. Internal traffic requires the same authentication as external traffic.
- **Least Privilege**: Users and services are given only the minimum permissions necessary to perform their functions.
- **Continuous Verification**: Access is not granted just because a token is valid; every request is checked against the policy engine to ensure the role and context are still permitted.
- **Explicit Authentication**: Strong identity validation via Password + MFA is required before any session is established.

## 2. Threat Scenarios & Mitigations
| Threat Category | Scenario | Mitigation Strategy |
| :--- | :--- | :--- |
| **Spoofing** | Attacker tries to forge a JWT or steal another user's session token. | Enforce strong JWT signing algorithms (HS256/RS256) with a secret key. Use short-lived tokens and validate token signatures on every request. |
| **Tampering** | User attempts to modify their role inside the HTTP request or JWT payload to gain administrative access. | The backend Policy Engine dictates the role from the trusted database or verified JWT signature, ignoring client-submitted role parameters. |
| **Repudiation** | A malicious insider deletes a file and denies doing it. | Comprehensive Audit Logging records every access and action along with the identity, timestamp, and context, stored centrally. |
| **Information Disclosure** | An employee accesses the HR or Finance endpoints to view sensitive salaries. | Role-Based Access Control (RBAC) enforced by the Policy Engine explicitly DENIES the request because the `EMPLOYEE` role lacks `VIEW_HR_DATA` or `VIEW_FINANCE_DATA` permissions. |
| **Denial of Service** | An attacker repeatedly guesses passwords (Brute Force). | Rate limiting and logging of failed authentication attempts to alert the Security Analyst via the dashboard. |
| **Elevation of Privilege** | A compromised service (e.g., Employee Portal) attempts to directly call the Admin Service database. | Micro-segmentation via Docker networks isolates services. The Employee Portal service cannot communicate with the Admin database directly. |

## 3. Project Limitations
- **Simulated Environment**: The Docker-based micro-segmentation simulates physical network boundaries and enterprise firewalls but is not a production-grade firewall solution.
- **Local Secrets**: For the sake of the project, development keys (like JWT secrets) might be stored in `.env` files locally rather than a dedicated Key Management Service (KMS) or HashiCorp Vault.
- **TLS/HTTPS**: While TLS/HTTPS principles will be documented and perhaps simulated via self-signed certs or reverse proxy (e.g., NGINX/Caddy), managing real CA-signed certificates for local environments is outside the immediate scope unless necessary.
- **Database**: Using SQLite is for simplicity and demonstration; a real enterprise would use a robust database cluster (like PostgreSQL/MySQL) with encryption at rest.

## 4. Security Requirements (Checklist)
- [ ] No plaintext passwords stored in the database.
- [ ] No secrets exposed in the frontend code.
- [ ] No hardcoded secrets in the source code (use `.env`).
- [ ] Backend must perform all authorization checks (no client-side only enforcement).
- [ ] Audit logs must never contain passwords, tokens, or MFA secrets.
- [ ] All security simulations must be kept strictly local and controlled.
