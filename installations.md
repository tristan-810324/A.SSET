# A.SSET Installation Guide

## 1. Mga kailangang i-install

I-install muna ang mga sumusunod sa development computer:

| Software | Inirerekomendang bersyon | Gamit |
| --- | --- | --- |
| Node.js | LTS, may kasamang npm | Pagpapatakbo ng frontend at backend |
| npm | `11.18.0` o compatible sa Node.js LTS | Pag-install ng JavaScript dependencies |
| MySQL Server | 8.x o compatible | Database ng A.SSET |
| MySQL Workbench | Latest compatible version | Paglikha at pamamahala ng database |
| Git | Latest version | Pagkuha at pamamahala ng project files |
| VS Code | Latest version | Code editor |

Kailangan din ng Gmail account na may **App Password** para sa pagpapadala ng
OTP emails. Hindi dapat gamitin ang regular Gmail password.

## 2. Mga bersyon na ginagamit ng project

### Frontend

- Angular `22.2.0`
- Angular CLI `22.2.0`
- TypeScript `6.0.x`
- Tailwind CSS `4.1.x`
- RxJS `7.8.x`
- Vitest `5.x`

### Backend

- Express `5.x`
- TypeScript `6.x`
- Prisma `6.19.x`
- Prisma Client `6.19.x`
- `tsx`
- `nodemon`
- MySQL database

Hindi kailangang i-install nang mano-mano ang mga npm package sa listahan.
Awtomatikong mai-install ang mga ito gamit ang `npm install` sa kani-kanilang
folder dahil nasa `package.json` at `package-lock.json` na ang dependencies.

## 3. I-check ang installations

Buksan ang PowerShell o terminal at patakbuhin:

```powershell
node --version
npm --version
mysql --version
git --version
```

Kung hindi gumagana ang `mysql --version`, siguraduhing naka-add sa system
`PATH` ang MySQL `bin` folder, karaniwang:

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

## 4. I-install ang frontend dependencies

```powershell
cd frontend
npm install
```

## 5. I-install ang backend dependencies

Sa ibang terminal, mula sa project root:

```powershell
cd backend
npm install
```

## 6. I-prepare ang MySQL database

1. Buksan ang MySQL Workbench o MySQL command line.
2. Gumawa ng dalawang database:

```sql
CREATE DATABASE asset_db;
CREATE DATABASE asset_shadow_db;
```

3. Tiyaking tumatakbo ang MySQL Server.
4. Tiyaking tama ang username, password, host, port, at database name sa
   `backend\.env`.

Ang backend ay gumagamit ng:

- Main database: `asset_db`
- Prisma shadow database: `asset_shadow_db`
- Default MySQL port: `3306`

## 7. I-configure ang backend environment variables

May existing na `backend\.env` file sa project. Kung wala ito sa bagong copy ng
project, gumawa ng kopya mula sa template:

```powershell
cd backend
Copy-Item .env.example .env
```

Siguraduhing may tamang values ang mga sumusunod sa `backend\.env`:

```text
NODE_ENV=development
PORT=3000
FRONTEND_ORIGIN=http://localhost:4200
DATABASE_URL=your-mysql-connection-string
SHADOW_DATABASE_URL=your-mysql-shadow-connection-string
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=15m
OTP_EXPIRES_MINUTES=10
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-gmail-address
SMTP_PASS=your-gmail-app-password
SMTP_FROM=your-sender-address
```

Huwag i-upload o i-commit ang `backend\.env` dahil naglalaman ito ng database,
JWT, at email credentials.

## 8. I-generate ang Prisma Client at i-apply ang migration

Mula sa `backend` folder:

```powershell
npm run prisma:generate
npm run prisma:migrate -- --name init_auth
```

Kung kailangan ng default admin at custodian accounts:

```powershell
npm run seed
```

Default seed accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gmail.com` | `Admin123` |
| Custodian | `custodian@gmail.com` | `Admin123` |

Palitan ang default passwords pagkatapos ng unang login, lalo na sa production.

## 9. Patakbuhin ang application

### Backend

Sa terminal na nasa `backend` folder:

```powershell
npm run dev
```

Backend address:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

### Frontend

Sa ibang terminal, mula sa project root:

```powershell
cd frontend
npm start
```

Frontend address:

```text
http://localhost:4200
```

Kailangang sabay na tumatakbo ang backend at frontend para gumana ang login,
registration, OTP, at profile flows.

## 10. Mga useful na command

### Frontend

```powershell
cd frontend
npm start
npm run build
npm test
```

### Backend

```powershell
cd backend
npm run dev
npm run build
npm start
npm test
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

## 11. Karaniwang problema

### `npm` o `node` ay hindi recognized

I-install ang Node.js LTS at i-restart ang terminal o VS Code pagkatapos ng
installation.

### Hindi makakonekta sa MySQL

Tiyaking:

- tumatakbo ang MySQL Server;
- tama ang MySQL username at password;
- tama ang port na `3306`;
- umiiral ang `asset_db` at `asset_shadow_db`;
- tama ang `DATABASE_URL` at `SHADOW_DATABASE_URL` sa `backend\.env`.

### Hindi nagpapadala ang OTP email

Tiyaking:

- naka-enable ang 2-Step Verification ng Gmail account;
- gumawa ng Gmail App Password;
- App Password ang nasa `SMTP_PASS`, hindi ang regular Gmail password;
- tama ang `SMTP_USER`, `SMTP_HOST`, `SMTP_PORT`, at `SMTP_SECURE`.

### CORS o API connection error sa frontend

Tiyaking parehong tumatakbo ang frontend sa `http://localhost:4200` at backend
sa `http://localhost:3000`, at tugma ang `FRONTEND_ORIGIN` sa `backend\.env`.
