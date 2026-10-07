Project-Asset/
├── backend/
│   ├── prisma/                             # MySQL Database Models & Migrations
│   │   ├── migrations/
│   │   └── schema.prisma                   # User, Otp (MySQL) + Enums (Role, AccountStatus, OtpType)
│   │
│   ├── src/
│   │   ├── config/                         # Configuration Files
│   │   │   ├── env.ts                      # Dotenv validation (JWT_SECRET, PORT, DB_URL, SMTP Configs)
│   │   │   └── prisma.ts                   # Singleton PrismaClient instance
│   │   │
│   │   ├── middlewares/                    # Custom Express Middlewares
│   │   │   ├── auth.middleware.ts          # Verification ng JWT Bearer token at Active Account Status
│   │   │   ├── role.middleware.ts          # Role-Based Access Control (FACULTY, CUSTODIAN, ADMIN)
│   │   │   ├── validate.middleware.ts      # Zod input validation middleware
│   │   │   └── errorHandler.middleware.ts  # Centralized error response handler
│   │   │
│   │   ├── utils/                          # Helper Functions
│   │   │   ├── jwt.util.ts                 # JWT Token sign & verify logic
│   │   │   ├── password.util.ts            # Bcrypt hashing & comparison helpers
│   │   │   └── mailer.util.ts              # 📧 NODEMAILER SERVICE (Transporter & Email Templates)
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/                       # PURE AUTHENTICATION MODULE
│   │   │   │   ├── auth.schema.ts          # Zod schemas (register, login, verify-otp, profile-setup, reset-password)
│   │   │   │   ├── auth.controller.ts      # HTTP Request Handlers (Bridge para sa Angular)
│   │   │   │   ├── auth.service.ts         # Business Logic (Bcrypt, JWT, Prisma + Nodemailer OTP calls)
│   │   │   │   └── auth.routes.ts          # Express Router (/api/v1/auth)
│   │   │   │
│   │   │   └── users/                      # USER GOVERNANCE & APPROVAL MODULE
│   │   │       ├── user.controller.ts      # Admin User Management & Pending Approvals
│   │   │       ├── user.service.ts         # Approve/Deactivate user logic
│   │   │       └── user.routes.ts          # Express Router (/api/v1/users)
│   │   │
│   │   ├── routes.ts                       # Main Router (Inia-attach ang /auth at /users routes)
│   │   └── app.ts                          # Express Application setup (CORS, Parsers, Error Handler)
│   │
│   ├── .env                                # Environment variables (DATABASE_URL, JWT_SECRET, SMTP_USER, SMTP_PASS)
│   ├── package.json
│   ├── tsconfig.json                       # TypeScript Configuration
│   └── server.ts                           # Server Entry Point (app.listen)
│
└── frontend/
    └── src/
        └── app/
            ├── components/                 # Shared Reusable UI Components (Navbar, Sidebar, Modals, Cards)
            ├── guards/                     # Angular Route & Role Guards
            │   ├── auth.guard.ts           # Route Protection (Checks if Logged In & Verified)
            │   └── role.guard.ts           # Role Access Control (FACULTY vs CUSTODIAN vs ADMIN)
            │
            ├── pages/                      # Page Level Views
            │   ├── about/                  # About Page Component
            │   ├── contact/                # Contact Page Component
            │   ├── hero/                   # Hero Landing Page Component
            │   │
            │   ├── auth/                   # Authentication & Onboarding Screens
            │   │   ├── login/              # Login Screen Component
            │   │   ├── register/           # Basic Registration Screen (Step 1)
            │   │   ├── otp-verification/   # OTP Verification Screen (Step 2)
            │   │   ├── profile-setup/      # Quick Profile Setup Screen (Step 3: Department & Position)
            │   │   └── pending-approval/   # Waiting Page for Admin Activation (Step 4)
            │   │
            │   └── dashboards/             # ROLE-BASED DASHBOARDS
            │       ├── faculty/            # Faculty / Borrower Dashboard (/dashboard/faculty)
            │       ├── custodian/          # Custodian Dashboard (/dashboard/custodian)
            │       └── admin/              # Admin Dashboard (/dashboard/admin)
            │
            ├── services/                   # Angular HTTP API Services
            │   ├── auth.service.ts         # Authentication API calls (Login, Register, OTP, Profile Setup)
            │   └── user.service.ts         # User Management & Approval API calls
            │
            ├── app.config.ts               # App Configuration (Providers, Interceptors)
            ├── app.routes.ts               # Angular Router Definitions (Role-Based Route Mapping)
            ├── app.css
            ├── app.html
            └── app.ts                      # Main Root Component