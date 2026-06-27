# User & Authentication API Specification 🔐

This document catalogs the API endpoints, HTTP methods, responsibilities, and implementation status for the User and Authentication modules.

---

## 1. User Module
Manages registration, credentials, profile updates, and active session details.

| API Endpoint | Method | Description / Responsibility | Status |
| :--- | :--- | :--- | :--- |
| `/api/user` | `POST` | Create a new user profile | `DONE` |
| `/api/user/profile` | `GET` | Fetch details of the logged-in user | `DONE` |
| `/api/user/profile` | `PUT` | Update details of the logged-in user profile | `DONE` |

---

## 2. Authentication Module
Handles multi-factor OTP generation, credentials verification, session issuance, and revocation.

| API Endpoint | Method | Description / Responsibility | Status |
| :--- | :--- | :--- | :--- |
| `/api/auth/otp/send` | `POST` | Request single-use OTP code to email (Step 1 of OTP login) | `TODO` |
| `/api/auth/otp/verify` | `POST` | Verify OTP code and issue session cookie (Step 2 of OTP login) | `TODO` |
| `/api/auth/login` | `POST` | Authenticate with email & password and issue session cookie (Password login) | `TODO` |
| `/api/auth/logout` | `POST` | Revoke active session token in DB and clear login cookie | `TODO` |
