# A.SSET API foundation

## Technology decisions

- Express 5 + TypeScript
- Prisma ORM 6 with MySQL
- Zod request validation
- bcrypt password and OTP hashing
- JWT access tokens
- Nodemailer through Gmail SMTP

The API is intentionally separate from the Angular application. The server owns
validation, account status checks, role claims, OTP expiry, and persistence.

## Local setup

1. Copy `.env.example` to `.env`.
2. Create the MySQL database and application user in MySQL Workbench.
3. Set `DATABASE_URL` and the Gmail SMTP values in `.env`. Never commit `.env`.
4. Generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Apply the first migration after MySQL is running:

   ```bash
   npm run prisma:migrate -- --name init_auth
   ```

6. Start the API:

   ```bash
   npm run dev
   ```

Health check: `GET http://localhost:3000/health`.

## Auth API contract

All routes are under `/api/v1/auth`.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/register` | Public | Create a default `FACULTY` account and send verification OTP |
| POST | `/verify-otp` | Public | Verify `VERIFY_ACCOUNT` or `RESET_PASSWORD` OTP |
| POST | `/resend-otp` | Public | Replace and resend an OTP |
| POST | `/login` | Public | Return a short-lived JWT for an active account |
| POST | `/request-password-reset` | Public | Send a reset OTP without revealing account existence |
| POST | `/profile-setup` | Bearer JWT | Save onboarding metadata and set `PENDING_APPROVAL` |

Admin user governance is available under `/api/v1/users`:

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/pending` | Admin bearer JWT | List accounts pending approval |
| PATCH | `/:userId/approve` | Admin bearer JWT | Set an account to `ACTIVE` |
| PATCH | `/:userId/deactivate` | Admin bearer JWT | Set an account to `DEACTIVATED` |

The `CUSTODIAN` and `ADMIN` roles are not self-registrable. They must be
provisioned by an administrator in the user governance module.
