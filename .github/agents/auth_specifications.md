# Project A.SSET - Authentication, Role Governance & Dashboard Specifications

## Overview
Ang dokumentong ito ay nagtatakda ng teknikal na detalye para sa Authentication System, Role Governance, at Dashboard Redirection ng Project A.SSET. Ang system ay gumagamit ng mga karaniwang Gmail accounts (halimbawa: `tristanivanbautista81@gmail.com`) at dadaan sa **Nodemailer Service** para sa pagpapadala ng One-Time Passwords (OTP) sa inbox ng mga user.

---

## Supported Email Formats
Gagamit ang system ng Zod schema validation para masigurong valid na email address (tulad ng Gmail) ang i-e-enter ng user:

* **Supported Format:** Valid email addresses (halimbawa: `tristanivanbautista81@gmail.com`)

---

## Account Provisioning & Role Governance

* **Self-Registration (Default Role: `FACULTY`):** 
  Lahat ng magre-register sa pampublikong Registration Form ay awtomatikong mabibigyan ng default role na `FACULTY` (Department Heads / Teachers) pagkatapos ng OTP verification.
* **Admin-Provisioned Accounts (`CUSTODIAN` & `ADMIN`):**
  Ang mga accounts para sa `CUSTODIAN` (Property & Lab Managers) at karagdagang `ADMIN` ay likha at pinamamahalaan lamang ng System Administrator sa pamamagitan ng User Governance Module upang mapanatili ang seguridad at katumpakan ng inventory control.

---

## Complete User Flows & Architecture

### 1. User Registration, OTP & Admin Approval Flow

#### Step 1: User Registration Form (Frontend UI)
Sasagutan ng user ang paunang registration form sa Angular app gamit ang kanyang basic credentials:
* Email Address (halimbawa: `tristanivanbautista81@gmail.com`)
* Create Password at Confirm Password
* Iki-click ang **"Continue to Email Verification"** button.

#### Step 2: Email Validation & OTP Verification (Backend & Mailer)
* Iva-validate ng Zod schema sa backend ang format ng email address.
* Io-check sa **MySQL** database gamit ang Prisma kung may umiiral nang account sa parehong email address.
* I-ha-hash ang napiling password ng user gamit ang `bcrypt`.
* Mag-ge-generate ang Express backend ng random 6-digit OTP code (halimbawa: `849201`).
* Isasave ang OTP record sa `Otp` table na may `type: "VERIFY_ACCOUNT"` at expiration timestamp (10 minuto).
* Gagamitin ng backend ang Nodemailer Service para magpadala ng OTP email notification na ididirekta sa inbox ni `tristanivanbautista81@gmail.com`.
* Bubuksan ng user ang kanyang email inbox, kukunin ang 6-digit OTP, at ita-type ito sa Angular application interface.
* Kapag verified, i-a-update ng Prisma ang user record sa `isVerified: true` at buburahin ang nagamit nang OTP record.

#### Step 3: Quick Profile Setup (Required Onboarding Metadata)
Pagkatapos ma-verify ang OTP, ididirekta ang user sa **Quick Profile Setup** screen bago papasukin sa main workflow upang ma-encode ang kanyang eksaktong pagkakakilanlan:
* **Full Name:** Complete Official Name
* **Department / Office (Dropdown Selection):** 
  * College of Information Technology
  * College of Education
  * Senior High School Department
  * Registrar's Office
  * Guidance & Student Affairs Office
  * Physical Plant & Facilities Operations
* **Designation / Position (Dropdown Selection):**
  * Dean / Principal
  * Program Chair / Coordinator
  * Administrative Office Head
  * Regular Faculty / Class Adviser

#### Step 4: Admin Approval Queue ("Pending Activation" Mode)
* Pagka-submit ng Quick Profile Setup, ang account record sa MySQL database ay magkakaroon ng status na `status: "PENDING_APPROVAL"`.
* Makakakita ang user ng notification prompt: *"Account Profile Submitted! Your account is currently pending verification by the System Administrator. You will be notified once activated."*
* Lalabas ang kanyang account sa **Admin Dashboard Queue (`/dashboard/admin`)** sa ilalim ng User Governance Table.
* Suriing mabuti ng System Admin ang kanyang ipinasok na Profile Details. Kapag in-approve ng Admin, i-a-update ng Prisma ang account status sa **`status: "ACTIVE"`**.
* Pag naging `ACTIVE` na ang account, maaari na siyang mag-login at opisyal na mag-request ng gamit sa kanyang `/dashboard/faculty`.

---

### 2. Forgot Password & Password Reset Flow

#### Password Reset Request (Frontend)
Pupunta ang user sa "Forgot Password" page sa Angular at ita-type ang kanyang nakarehistrong email address (halimbawa: `tristanivanbautista81@gmail.com`).

#### Account Existence Check (Backend)
Io-check ng backend sa **MySQL** database kung umiiral ang account.

#### Reset OTP Generation & Nodemailer Dispatch
* Mag-ge-generate ng bagong 6-digit OTP code ang server.
* Isasave ito sa `Otp` model na may `type: "RESET_PASSWORD"` (may 10-minute validity period).
* Magpapadala ang backend ng "Password Reset Request" email gamit ang Nodemailer Service papunta sa inbox ng user.

#### OTP Verification & New Password Entry
* Bubuksan ng user ang kanyang email inbox, kukunin ang OTP code, at ita-type ito sa Angular UI.
* Kapag naging valid ang OTP sa backend, papayagan ang user na mag-set ng kanyang Bagong Password.

#### Password Update (Backend)
* I-ha-hash ng backend ang bagong password gamit ang `bcrypt`.
* I-a-update ang `password` field ng user sa **MySQL** database at buburahin ang nagamit na OTP record.

---

## Role-Based Automatic Dashboard Redirection

Pagkatapos ng matagumpay na login, babasahin ng Angular Frontend ang user `role` at `status` mula sa JWT payload at awtomatikong ididirekta ang user sa nararapat na dashboard nang walang manual selection.

### 1. Faculty / Department Head Dashboard (`/dashboard/faculty`)
* **Target Users:** Teachers, Advisers, at Department Heads (Default pagkatapos mag-register at ma-approve ng Admin).
* **Primary Function:** Equipment Borrowing Requests & Issue Reporting.
* **Dashboard Widgets & Components:**
  * **My Active Borrowings Widget:** Card view ng mga kasalukuyang hiniram na gamit na nagpapakita ng Item Name, Date Borrowed, at Return Due Date.
  * **Request Status Tracker:** Table view na nagpapakita ng real-time status ng mga borrowing requests (`Pending Approval`, `Approved`, `Declined`, `Completed`).
  * **My Submitted Maintenance Tickets:** Summary list ng mga inulat na sirang gamit sa mga silid-aralan/opisina kasama ang progress status nito (`Open`, `In Progress`, `Resolved`).

### 2. Custodian Dashboard (`/dashboard/custodian`)
* **Target Users:** Property, Laboratory, at Facility Custodians (Created by Admin).
* **Primary Function:** Master Asset Inventory, Daily Circulation, at Borrower Check-In/Check-Out.
* **Dashboard Widgets & Components:**
  * **Borrower Search & Quick Action Bar:** Prominent search bar para sa mabilisang lookup ng Student ID o Asset Serial Number para sa mabilis na Check-In / Check-Out.
  * **Daily Circulation Counter:** Metrics widget na nagpapakita ng:
    * Total Items Checked Out Today
    * Total Items Returned Today
    * Overdue / Unreturned Items
  * **Overdue & Liability List:** Talahanayan ng mga borrower (estudyante o staff) na lagpas na sa due date ang hiniram na gamit kasama ang contact details at Endorsing Faculty.

### 3. Admin & Facilities Dashboard (`/dashboard/admin`)
* **Target Users:** System Administrators, Facilities Managers, at Maintenance Leads.
* **Primary Function:** Campus Operations Overview, Maintenance Job Orders, at User Governance / Account Approval.
* **Dashboard Widgets & Components:**
  * **Campus Operations Overview:** High-level metrics ng Total Campus Assets, Asset Health Status (Operational, Under Maintenance, Decommissioned), at Total Active Users.
  * **User Governance & Pending Approvals Queue:** Talahanayan kung saan inililista ang mga bagong rehistradong faculty/heads (`PENDING_APPROVAL`) para sa 1-click Activation o Deactivation ng Admin.
  * **Maintenance Job Order Kanban Board:** Visual status columns (`Open`, `In Progress`, `Completed`, `For Disposal`) kung saan pwedeng i-drag o i-update ang status ng bawat repair ticket.
  * **Preventive Maintenance Calendar Widget:** Schedulers view na nagpapakita ng mga nakatakdang maintenance tasks ngayong linggo o buwan.
  * **Export Center:** Mabilis na button interface para sa pag-generate ng compliance/audit reports.

---

## Security & Anti-Fraud Verification Controls

1. **Strict Enum & Schema Validation (Zod & Prisma):** Ang Department at Designation inputs ay naka-lock sa predefined values na niva-validate sa Express backend para maiwasan ang payload manipulation.
2. **Admin Approval Gate:** Ang bawat bagong rehistradong faculty account ay nananatiling `PENDING_APPROVAL` at hindi makakapag-submit ng borrowing requests hangga't hindi sinusuri at ina-activate ng Admin.
3. **Counter Physical ID Check:** Bago ilabas ng Custodian ang anumang kagamitan sa counter, obligado nitong ibangga ang totoong Faculty/School ID ng borrower laban sa nakarehistrong profile information sa system.

---

## Technical Summary Notes

* **System Sender Service:** Ang system ay gumagamit ng Nodemailer Transporter para sa reliable at automated transactional email dispatch.
* **Recipients:** Lahat ng rehistradong users na may valid email address (tulad ng Gmail) na mag-re-register o magse-send ng reset request ay makakatanggap ng OTP sa kani-kanilang email inboxes.
* **Unified Database Tracking:** Iisang `Otp` model lamang ang gagamitin para sa parehong registration at password reset sa pamamagitan ng `OtpType` enum (`VERIFY_ACCOUNT` at `RESET_PASSWORD`).
* **Route & Status Protection:** Ang bawat dashboard route at API endpoint ay pinoprotektahan ng Express Auth Middlewares at Angular Role/Status Guards para masigurong `ACTIVE` accounts lang ang makakapagtransakyon.