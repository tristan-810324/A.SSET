# Project A.SSET - Remaining Setup and Work Checklist

Ang file na ito ang checklist para sa mga kailangan pang gawin pagkatapos ng
initial authentication backend implementation.

## Importanteng sequence / tamang order

Sundin ang order na ito. Huwag munang mag-Prisma migration kung hindi pa
running ang MySQL Server at hindi pa tama ang `backend/.env`.

```text
MySQL setup
  ↓
.env setup
  ↓
Prisma migration
  ↓
Backend auth testing
  ↓
Profile Setup page
  ↓
Admin approval API and page
  ↓
Faculty/Custodian/Admin dashboard pages
  ↓
Inventory and borrowing modules
```

### Exact command order

Pagkatapos ng MySQL Workbench setup at pag-save ng local `backend/.env`,
patakbuhin mula sa repository root:

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate -- --name init_auth
npm run dev
```

Habang tumatakbo ang backend, i-check ang:

```text
http://localhost:3000/health
```

Kapag ang response ay `{"status":"ok"}`, saka gawin ang backend auth testing
(registration, Gmail OTP verification, at login). Pagkatapos lamang nito
itutuloy ang Profile Setup, Admin Approval, dashboards, at inventory modules.

## 1. MySQL Server at MySQL Workbench

### 1.1 Siguraduhing naka-install at running ang MySQL Server

Kailangan ang MySQL Server, hindi lamang ang MySQL Workbench. Ang Workbench ay
GUI lamang para kumonekta at magpatakbo ng SQL commands.

Sa MySQL Workbench:

1. Buksan ang local MySQL connection.
2. Gamitin ang:
   - Host: `127.0.0.1` o `localhost`
   - Port: `3306`
   - User: `root`
3. I-enter ang MySQL root password na ginawa noong nag-install ng MySQL Server.
4. Siguraduhing successful ang connection.

### 1.2 Gumawa ng database at application user

Sa MySQL Workbench SQL Editor, i-run:

```sql
CREATE DATABASE IF NOT EXISTS asset_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'asset_user'@'localhost'
  IDENTIFIED BY 'CHANGE_THIS_MYSQL_PASSWORD';

GRANT ALL PRIVILEGES ON asset_db.*
  TO 'asset_user'@'localhost';

FLUSH PRIVILEGES;
```

Kung makakita ng `P3014` o `P1010` na nagsasabing hindi makagawa ng
`prisma_migrate_shadow_db`, gawin ang sumusunod sa MySQL Workbench. Kailangan
ng Prisma ng hiwalay na shadow database habang tina-test at bina-build ang
migration history.

```sql
CREATE DATABASE IF NOT EXISTS asset_shadow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON asset_shadow_db.*
  TO 'asset_user'@'localhost';

FLUSH PRIVILEGES;
```

Pagkatapos, siguraduhing pareho ang MySQL password sa `DATABASE_URL` at
`SHADOW_DATABASE_URL` sa `backend/.env`:

```env
DATABASE_URL=mysql://asset_user:YOUR_MYSQL_PASSWORD@localhost:3306/asset_db
SHADOW_DATABASE_URL=mysql://asset_user:YOUR_MYSQL_PASSWORD@localhost:3306/asset_shadow_db
```

Ang `asset_shadow_db` ay development-only database. Huwag gamitin ito bilang
application database at huwag ilagay ang production data rito.

Palitan ang `CHANGE_THIS_MYSQL_PASSWORD` ng sariling local MySQL password.

Ang MySQL password ay iba sa Gmail App Password.

### 1.3 I-check ang database

Sa Workbench, i-refresh ang **SCHEMAS** panel. Dapat makita ang:

```text
asset_db
```

Wala pang tables bago patakbuhin ang Prisma migration. Si Prisma ang gagawa ng
tables base sa [schema.prisma](../backend/prisma/schema.prisma).

## 2. Gmail SMTP App Password

Gagamit ang backend ng Gmail SMTP para sa registration OTP at password-reset OTP.

### 2.1 Gmail account requirements

Sa Gmail account na gagamitin bilang sender:

1. I-on ang **2-Step Verification** sa Google Account.
2. Pumunta sa **Google Account > Security**.
3. Hanapin ang **App passwords**.
4. Gumawa ng bagong app password:
   - App: `Mail`
   - Device: `Other (Custom name)`
   - Name: `Project A.SSET`
5. Kopyahin ang 16-character App Password.

Hindi dapat gamitin ang normal Gmail password. Hindi rin dapat ilagay ang App
Password sa Git, source code, screenshots, o chat.

### 2.2 Ilagay ang secrets sa local `.env`

Sa `backend/`, gumawa ng local file na eksaktong pangalan:

```text
.env
```

Kopyahin ang values mula sa [.env.example](../backend/.env.example), pagkatapos
palitan ang placeholders:

```env
NODE_ENV=development
PORT=3000
FRONTEND_ORIGIN=http://localhost:4200

DATABASE_URL=mysql://asset_user:CHANGE_THIS_MYSQL_PASSWORD@localhost:3306/asset_db
SHADOW_DATABASE_URL=mysql://asset_user:CHANGE_THIS_MYSQL_PASSWORD@localhost:3306/asset_shadow_db

JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
JWT_EXPIRES_IN=15m
OTP_EXPIRES_MINUTES=10

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="Project A.SSET <your-gmail-address@gmail.com>"
```

Palitan ang:

- `CHANGE_THIS_MYSQL_PASSWORD` ng password ng `asset_user`
- `your-gmail-address@gmail.com` ng Gmail sender account
- `your-gmail-app-password` ng Gmail App Password
- `JWT_SECRET` ng random secret na hindi bababa sa 32 characters

Ang `.env` ay dapat manatiling local lamang. Huwag itong i-commit.

## 3. Prisma at database migration

Buksan ang terminal sa repository root at patakbuhin:

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate -- --name init_auth
```

Kapag successful, dapat may tables na:

```text
users
otps
_prisma_migrations
```

I-refresh ang `asset_db` schema sa MySQL Workbench para makita ang tables.

Kung may migration error:

1. Tingnan kung running ang MySQL Server.
2. I-check ang username, password, host, port, at database name sa
   `DATABASE_URL`.
3. Huwag mag-delete ng database o mag-reset ng migration history nang walang
   backup.

## 4. Paandarin ang backend

Sa unang terminal:

```powershell
cd backend
npm run dev
```

Expected log:

```text
A.SSET API listening on port 3000
```

Health check:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## 5. Paandarin ang Angular frontend

Sa ibang terminal:

```powershell
cd frontend
npm start
```

Buksan sa browser:

```text
http://localhost:4200
```

Ang Angular environment ay gumagamit ng:

```text
http://localhost:3000/api/v1
```

mula sa [environment.ts](../frontend/src/environments/environment.ts).

## 6. Basic authentication test

Pagkatapos patakbuhin ang frontend at backend:

1. Pumunta sa Register page.
2. Gumamit ng valid na email.
3. Gumamit ng password na may hindi bababa sa 8 characters.
4. I-check ang Gmail inbox.
5. I-enter ang 6-digit OTP.
6. Tingnan sa MySQL Workbench kung:
   - `users.is_verified` ay naging `1`
   - nag-delete ang consumed OTP sa `otps`
7. Subukang mag-login.

Ang login ay dapat hindi magtagumpay hangga't hindi:

- verified ang email;
- may completed profile;
- `ACTIVE` ang account status.

## 7. Current implementation gaps

Ang mga sumusunod ay kailangan pa ng code implementation:

### 7.1 Profile setup frontend

May initial implementation na ang Angular page para sa:

- Full name
- Department
- Designation

Pag-submit nito, nagiging `PENDING_APPROVAL` ang account.

### 7.2 Admin approval module

May initial implementation na para sa:

- Admin-only authentication middleware
- Role-based middleware
- Pending users API
- Approve user API
- Deactivate user API
- Admin user governance table

Ang `CUSTODIAN` at `ADMIN` accounts ay dapat admin-provisioned lamang.

Para gumawa ng unang development admin, kailangan munang may verified user at
profile. Pagkatapos mag-submit ng profile, gamitin ang MySQL Workbench bilang
database administrator:

```sql
UPDATE users
SET role = 'ADMIN',
    status = 'ACTIVE'
WHERE email = 'your-admin-email@example.com'
  AND is_verified = 1;
```

Mag-login gamit ang account na iyon at buksan:

```text
/dashboard/admin
```

Ang temporary SQL bootstrap na ito ay para sa local development lamang. Sa
production, dapat may secured admin provisioning/migration procedure.

### 7.3 Angular guards at auth state

Kailangan pa ng hardening para sa:

- Auth guard
- Role guard
- Persistent auth state service
- Automatic dashboard redirect
- Logout flow
- Token expiration handling

### 7.4 Password reset completion

May request-reset OTP foundation na, pero kailangan pa ang endpoint at UI para:

1. Mag-verify ng reset OTP.
2. Tumanggap ng bagong password.
3. Mag-hash ng bagong password.
4. Mag-update ng `users.password_hash`.
5. Mag-delete ng consumed OTP.

### 7.5 Role-based dashboards

Kailangan pa ang initial pages para sa:

- Faculty dashboard
- Custodian dashboard
- Admin dashboard

### 7.6 Inventory and operations modules

Hindi pa implemented ang:

- Assets
- Asset categories
- Asset serial numbers
- Borrowing requests
- Check-in/check-out
- Overdue tracking
- Maintenance tickets
- Preventive maintenance
- Disposal workflow
- Reports and exports

Ang database design para sa mga ito ay dapat gawin pagkatapos ma-finalize ang
business rules at approval workflow.

## 8. Security and production requirements

Bago i-deploy sa production, kailangan pa ang:

- Login rate limiting
- OTP resend rate limiting
- Account lockout or abuse protection
- Secure HTTP-only cookie strategy or documented token storage strategy
- Production CORS origin
- HTTPS
- Centralized structured logging
- Database backup policy
- Secret management
- Automated backend tests
- Automated frontend tests
- Error monitoring

## 9. Useful commands

### Backend

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate -- --name migration_name
npm run build
npm run dev
```

### Frontend

```powershell
cd frontend
npm start
npm run build
npm test
```

## 10. Files related to this setup

- [AuthArchitecture.md](./agents/AuthArchitecture.md)
- [auth_specifications.md](./agents/auth_specifications.md)
- [backend README](../backend/README.md)
- [backend .env.example](../backend/.env.example)
- [Prisma schema](../backend/prisma/schema.prisma)
- [Angular auth service](../frontend/src/app/services/auth.service.ts)
