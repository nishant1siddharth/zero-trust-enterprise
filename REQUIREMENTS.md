# Project Requirements: Zero Trust Architecture for Enterprise Security

## 1. Project Scope
The project involves building a simulated enterprise environment to demonstrate Zero Trust security principles. It focuses on validating continuous verification, least privilege, assumed breach, explicit authentication, and context-based authorization. The system will simulate different enterprise departments (HR, Finance, Admin) and enforce access controls at both identity and network layers.

## 2. Functional Requirements
- **User Authentication**: Secure login mechanism with password hashing (Argon2id/bcrypt).
- **Multi-Factor Authentication (MFA)**: TOTP-based (Time-Based One-Time Password) challenge after password verification.
- **Role-Based Access Control (RBAC)**: Fine-grained roles dictating access to specific services.
- **Centralized Policy Engine**: A Policy Decision Point (PDP) that evaluates every resource request based on identity, role, and action before granting access.
- **Audit Logging**: Comprehensive logging of security events (login attempts, access grants, access denials, role changes).
- **Security Dashboard**: An interface for Security Analysts to view audit logs and monitor suspicious activities.
- **Enterprise Dashboard**: A centralized frontend portal for users to interact with services they are authorized to access.

## 3. Non-Functional Requirements
- **Security**: No plaintext passwords, secure storage of secrets via environment variables, HTTPS/TLS for simulated secure transit, and mitigation against common web vulnerabilities.
- **Modularity**: Separation of concerns between Identity, Policy Engine, and Resource Services.
- **Maintainability**: Clear folder structure, well-documented code, and use of modern simple technologies (Python FastAPI/Node.js for backend, React/Vite for frontend).
- **Demonstrability**: The system must be easily spun up locally using Docker and Docker Compose for presentation purposes.

## 4. Users and Roles
- **ADMIN**: Full administrative privileges across all system components.
- **HR_MANAGER**: Access to HR resources. No access to Finance or Admin resources.
- **FINANCE_MANAGER**: Access to Finance resources. No access to HR or Admin resources.
- **EMPLOYEE**: General access to the Employee Portal. No access to HR/Finance administration.
- **SECURITY_ANALYST**: Read-only access to audit logs and security monitoring dashboards. No modification of business data.
- **GUEST**: Extremely limited access, generally denied from all sensitive or administrative endpoints.

## 5. System Components
1. **Identity & Authentication Service**: Handles user login, session generation (JWT), and MFA verification.
2. **Policy Engine (Authorization Service)**: The central brain that evaluates access requests against Zero Trust rules.
3. **Employee Portal**: A simulated service for general employee resources.
4. **HR Service**: A simulated service for human resources management.
5. **Finance Service**: A simulated service for financial data.
6. **Admin Service**: A simulated service for administrative controls.
7. **Security Monitoring / Audit Service**: A simulated service that collects and displays security logs.
8. **Frontend Dashboard**: A React/Vite UI connecting all services.

## 6. Final Demonstration Scenario
The demonstration will walk through various access attempts by different user roles to visually prove the Policy Engine's enforcement of Zero Trust:
1. Employee logging in and being denied access to HR/Finance.
2. HR Manager successfully accessing HR but being denied Finance access.
3. Successful MFA vs. Failed MFA challenges.
4. An attacker (or unauthorized user) attempting direct endpoint access and being blocked.
5. A Security Analyst reviewing the audit logs of these denied attempts.
