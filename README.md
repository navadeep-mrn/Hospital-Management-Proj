# 🏥 CarePoint - Hospital Management System (HMS)



## 🌟 Project Overview

**CarePoint Hospital Management System** connects patients, specialist doctors, and hospital administrators in a unified digital workflow:

- **Patients** can register, discover doctors by clinical department, book appointments without double-booking conflicts, reschedule visits, and access digital prescriptions.
- **Doctors** can manage their 7-day consultation schedule, examine daily patient visits, mark appointments as completed, and issue clinical diagnoses and prescriptions.
- **Administrators** have complete control over doctors, patient records, departmental specialties, and live operational hospital metrics.

Operational records are stored and calculated live in **MongoDB**. The project also includes static demo seed data, default availability schedules, and a few presentation metrics on the public homepage.

## 🖥️ Live Demo Screenshots

The screenshots below show the application running locally with the seeded demo data.

| Application View     | Screenshot                                                               |
| :------------------- | :----------------------------------------------------------------------- |
| Home page            | ![Live demo screen 1](screenshots/Screenshot%202026-09-14%20163459.png)  |
| Home page            | ![Live demo screen 2](screenshots/Screenshot%202026-09-14%20163515.png)  |
| Home page            | ![Live demo screen 3](screenshots/Screenshot%202026-09-14%20163534.png)  |
| Sign in              | ![Live demo screen 4](screenshots/Screenshot%202026-09-14%20163547.png)  |
| Patient registration | ![Live demo screen 5](screenshots/Screenshot%202026-09-14%20163559.png)  |
| Patient dashboard    | ![Live demo screen 6](screenshots/Screenshot%202026-09-14%20163810.png)  |
| Patient portal       | ![Live demo screen 8](screenshots/Screenshot%202026-09-14%20163843.png)  |
| Patient portal       | ![Live demo screen 9](screenshots/Screenshot%202026-09-14%20163923.png)  |
| Admin portal         | ![Live demo screen 10](screenshots/Screenshot%202026-09-14%20164014.png) |
| Admin portal         | ![Live demo screen 11](screenshots/Screenshot%202026-09-14%20164027.png) |
| Admin portal         | ![Live demo screen 12](screenshots/Screenshot%202026-09-14%20164039.png) |
| Admin portal         | ![Live demo screen 13](screenshots/Screenshot%202026-09-14%20164053.png) |
| Admin portal         | ![Live demo screen 14](screenshots/Screenshot%202026-09-14%20164102.png) |
| Doctor portal        | ![Live demo screen 15](screenshots/Screenshot%202026-09-14%20164159.png) |
| Doctor portal        | ![Live demo screen 16](screenshots/Screenshot%202026-09-14%20164210.png) |
| Doctor portal        | ![Live demo screen 17](screenshots/Screenshot%202026-09-14%20164221.png) |
| Doctor portal        | ![Live demo screen 18](screenshots/Screenshot%202026-09-14%20164233.png) |

---

## 👥 Key Features by Role

### 👑 1. Hospital Administrator (Superuser)

- **Automatic Initialization**: Super admin account is auto-created on initial database boot.
- **Live Analytics Dashboard**:
  - Total Doctors, Registered Patients, Total Appointments, and Today's Scheduled Visits.
  - Appointment status breakdown (Booked, Completed, Cancelled).
  - Chronological recent appointment activity table.
- **Doctor Management**:
  - Create new doctor profiles with temporary passwords.
  - Search doctors by name or medical specialty.
  - Edit qualifications, experience, and department affiliations.
  - Toggle doctor active/inactive status.
  - Permanently remove doctor accounts.
- **Patient Management**:
  - Search patient records by name, email, or telephone.
  - Review demographic details (age, gender, address, registration date).
  - Block or unblock patient login accounts.
- **Appointment Oversight**:
  - View all consultations across the entire hospital.
  - Filter by date, status, or search query.
  - Cancel appointments when necessary.
- **Department / Specialization Management**:
  - Add and delete hospital departments (Cardiology, Dermatology, Neurology, etc.).

---

### 👨‍⚕️ 2. Doctor Portal

- **Secure Authentication**: Dedicated login for hospital physicians.
- **Doctor Dashboard**:
  - Counts for Today's Visits, Upcoming Consultations, Completed Visits, and Unique Patients Treated.
  - Today's appointment schedule table with 1-click consultation completion.
- **Appointment Lifecycle**:
  - View assigned appointments filterable by status (Booked, Completed, Cancelled) and calendar date.
  - Mark appointments as "Completed" by recording diagnosis and prescription in a modal.
  - Cancel appointments and update the appointment status.
- **Patient Clinical File**:
  - Access patient records and complete chronological consultation history.
  - Review prior diagnoses, prescribed medications, and doctor notes.
- **7-Day Availability Manager**:
  - Configure daily consultation hours across the 7 days of the week (Monday through Sunday).
  - Toggle availability and add custom consultation time slots (e.g. `10:00 AM - 01:00 PM`).

---

### 👤 3. Patient Portal

- **Self Registration & Login**: Easy registration capturing age, gender, phone, and residential address.
- **Patient Dashboard**:
  - Prominent upcoming appointment alert banner with physician name, date, and time slot.
  - Counts for total visits, completed consultations, and available specialties.
  - Recent prescriptions preview.
- **Doctor Directory & Search**:
  - Search physicians by name or filter by department.
  - Inspect doctor profiles, degrees, clinical experience, and weekly schedule.
- **Conflict-Free Appointment Booking**:
  - Select doctor, consultation date, and available time slot.
  - Instant double-booking check: prevents booking if another patient already reserved that slot.
- **Appointment Management**:
  - View upcoming and past visits.
  - Reschedule active bookings to a new date and time slot (with conflict verification).
  - Cancel active bookings.
- **Digital Medical History**:
  - Review past clinical diagnoses, doctor prescriptions, and medical lifestyle notes anytime.
- **Profile Management**:
  - Update personal contact details, age, gender, and residential address.

---

## 💻 Technology Stack

| Layer                 | Technology                | Description                                                                 |
| :-------------------- | :------------------------ | :-------------------------------------------------------------------------- |
| **Frontend**          | React (Vite)              | Fast, modern component-based single-page user interface                     |
| **Routing**           | React Router DOM (v6)     | Declarative client-side routing with role-based protected guards            |
| **UI Framework**      | Bootstrap 5               | Clean, responsive styling with native cards, tables, badges, and modals     |
| **Icons**             | Bootstrap Icons / Unicode | Standard, clean visual cues across cards and buttons                        |
| **HTTP Client**       | Axios                     | REST API communication with automatic JWT Authorization interceptor         |
| **State Management**  | React Context API         | Native React auth context (`AuthContext`) avoiding Redux complexity         |
| **Backend**           | Node.js & Express.js      | RESTful HTTP API routing and modular controller architecture                |
| **Database**          | MongoDB                   | Document database for JSON-like storage of users, appointments, and records |
| **ODM**               | Mongoose (v8)             | Schema validation, relational indexing, and `.populate()` references        |
| **Password Security** | bcryptjs                  | Salt generation and one-way password hashing                                |
| **Token Security**    | jsonwebtoken (JWT)        | Stateless signed session tokens stored in browser localStorage              |

> **Viva Note**: No over-engineered technologies (Redux, Next.js, TypeScript, GraphQL, Docker, Prisma) were used. The code prioritizes readability, straightforward async/await patterns, and easy explanation.

---

## 📂 Folder Structure

```text
hospital/
│
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection using Mongoose
│   │
│   ├── controllers/
│   │   ├── authController.js          # Patient register, universal login, getMe
│   │   ├── doctorController.js        # Doctor CRUD, 7-day availability, filters
│   │   ├── patientController.js       # Patient search, profile updates, account blocking
│   │   ├── appointmentController.js   # Booking (double-booking check), reschedule, cancel
│   │   ├── treatmentController.js     # Diagnosis, prescriptions, medical records
│   │   ├── specializationController.js# Hospital department administration
│   │   └── dashboardController.js     # Live MongoDB analytics for all 3 dashboards
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js          # Verifies Bearer JWT & loads req.user
│   │   └── roleMiddleware.js          # Role-Based Access Control (RBAC) guard
│   │
│   ├── models/
│   │   ├── User.js                    # Base authentication & account model
│   │   ├── Doctor.js                  # Doctor credentials, experience, and weekly slots
│   │   ├── Patient.js                 # Patient demographics (age, gender, contact)
│   │   ├── Appointment.js             # Consultations with status and conflict index
│   │   ├── Treatment.js               # Clinical diagnosis, prescription, and notes
│   │   └── Specialization.js          # Medical departments / specialties
│   │
│   ├── routes/
│   │   ├── authRoutes.js              # /api/auth
│   │   ├── doctorRoutes.js            # /api/doctors
│   │   ├── patientRoutes.js           # /api/patients
│   │   ├── appointmentRoutes.js       # /api/appointments
│   │   ├── treatmentRoutes.js         # /api/treatments
│   │   ├── specializationRoutes.js    # /api/specializations
│   │   └── dashboardRoutes.js         # /api/dashboard
│   │
│   ├── seed/
│   │   ├── createAdmin.js             # Auto-creates Admin on backend initialization
│   │   └── seedData.js                # Populates realistic demo hospital data
│   │
│   ├── .env                           # Local environment variables
│   ├── .env.example                   # Template environment variables
│   ├── package.json                   # Backend scripts and dependencies
│   └── server.js                      # Express application entry point
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Top bar with branding, user badge, and logout
│   │   │   ├── Sidebar.jsx            # Role-specific left dashboard navigation
│   │   │   ├── ProtectedRoute.jsx     # Dual-level client-side route guard
│   │   │   ├── StatCard.jsx           # Reusable metric card with icon and count
│   │   │   ├── AlertMessage.jsx       # Dismissible feedback banner (success / error)
│   │   │   └── TreatmentModal.jsx     # Modal for doctor diagnosis and prescription entry
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global authentication state and localStorage sync
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Hospital landing page with hero, stats, and doctors
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx          # Universal email/password login for all roles
│   │   │   │   └── Register.jsx       # Patient registration form
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx # Admin analytics and recent appointment activity
│   │   │   │   ├── ManageDoctors.jsx  # Search, filter, edit, deactivate, delete doctors
│   │   │   │   ├── AddDoctor.jsx      # Doctor creation form
│   │   │   │   ├── EditDoctor.jsx     # Doctor profile and schedule editor
│   │   │   │   ├── ManagePatients.jsx # Patient search and block/unblock toggles
│   │   │   │   ├── ManageAppointments.jsx # Full hospital appointments overview
│   │   │   │   └── ManageSpecializations.jsx # Department creation and deletion
│   │   │   ├── doctor/
│   │   │   │   ├── DoctorDashboard.jsx# Today's visits, metrics, and schedule
│   │   │   │   ├── DoctorAppointments.jsx # Calendar of assigned consultations
│   │   │   │   ├── DoctorPatients.jsx # Directory of patients treated by doctor
│   │   │   │   ├── DoctorPatientDetail.jsx # Chronological medical file and prescriptions
│   │   │   │   └── DoctorAvailability.jsx # 7-day availability schedule manager
│   │   │   └── patient/
│   │   │       ├── PatientDashboard.jsx # Upcoming appointment highlight and quick stats
│   │   │       ├── DoctorSearch.jsx   # Search doctors by name or department
│   │   │       ├── DoctorProfile.jsx  # Comprehensive doctor credentials and weekly slots
│   │   │       ├── BookAppointment.jsx# Booking interface with double-booking check
│   │   │       ├── PatientAppointments.jsx # Booked/completed visits with reschedule
│   │   │       ├── PatientHistory.jsx # Digital prescription and diagnosis history
│   │   │       └── PatientProfile.jsx # Edit patient demographics
│   │   │
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with Authorization Bearer header
│   │   │
│   │   ├── App.jsx                    # React Router route definitions
│   │   ├── main.jsx                   # React root mount and provider hierarchy
│   │   └── index.css                  # Clean modern healthcare theme styling
│   │
│   ├── index.html                     # HTML5 template
│   ├── vite.config.js                 # Vite development configuration
│   └── package.json                   # Frontend dependencies
│
├── README.md                          # Complete project guide and viva documentation
└── package.json                       # Root package with helper scripts
```

---

## 🗄️ Database Models & Schemas

### 1. `User` Model

Central authentication document for all accounts:

- `name` (String, required): Full name
- `email` (String, required, unique, lowercase): Login email
- `password` (String, required): bcrypt-hashed password
- `role` (String, enum: `["admin", "doctor", "patient"]`): Access level
- `phone` (String): Contact phone
- `address` (String): Office or home address
- `isActive` (Boolean, default: `true`): Deactivation flag for account blocking

### 2. `Doctor` Model

Extends `User` with clinical information:

- `user` (ObjectId, ref: `User`, required): Link to base user
- `specialization` (ObjectId, ref: `Specialization`, required): Medical department
- `qualification` (String, required): Medical degrees (e.g. `MBBS, MD (Cardiology)`)
- `experience` (Number, required): Years of clinical practice
- `availability` (Array): Weekly 7-day schedule:
  - `day` (String): Monday through Sunday
  - `isAvailable` (Boolean): Working day status
  - `slots` (Array of Strings): Time intervals (e.g. `["10:00 AM - 01:00 PM"]`)
- `isAvailable` (Boolean, default: `true`): General consultation toggle

### 3. `Patient` Model

Extends `User` with clinical demographics:

- `user` (ObjectId, ref: `User`, required): Link to base user
- `age` (Number, required): Age in years
- `gender` (String, enum: `["Male", "Female", "Other"]`, required)
- `phone` (String): Contact phone
- `address` (String): Residential address

### 4. `Appointment` Model

Connects Patient and Doctor on a specific date and time slot:

- `patient` (ObjectId, ref: `Patient`, required)
- `doctor` (ObjectId, ref: `Doctor`, required)
- `date` (String, required): Stored as `"YYYY-MM-DD"` for timezone-agnostic comparisons
- `time` (String, required): Consultation time slot (e.g. `"10:00 AM - 11:00 AM"`)
- `status` (String, enum: `["Booked", "Completed", "Cancelled"]`, default: `"Booked"`)
- `reason` (String, required): Symptoms or purpose of consultation
- Compound Index: `{ doctor: 1, date: 1, time: 1, status: 1 }` for high-speed slot conflict checks.

### 5. `Treatment` Model

Clinical outcomes created when a doctor completes a consultation:

- `appointment` (ObjectId, ref: `Appointment`, required)
- `patient` (ObjectId, ref: `Patient`, required)
- `doctor` (ObjectId, ref: `Doctor`, required)
- `diagnosis` (String, required): Clinical assessment (e.g. `Hypertension Stage 1`)
- `prescription` (String, required): Medications, dosages, and duration
- `notes` (String): Doctor's advice and follow-up guidance

### 6. `Specialization` Model

Clinical departments:

- `name` (String, required, unique): Department name (e.g. `Cardiology`)
- `description` (String): Overview of departmental scope

---

## 🔐 Authentication & Authorization Flow

### 1. Patient Registration

```text
Patient fills registration form (Name, Email, Password, Age, Gender, Phone, Address)
                                ↓
Express backend receives POST /api/auth/register
                                ↓
Checks if email is already taken in User collection
                                ↓
bcrypt.genSalt(10) -> bcrypt.hash(password, salt)
                                ↓
Creates User record (role: "patient") & linked Patient record
                                ↓
Signs JWT token with { id: user._id, role: user.role }
                                ↓
Returns JWT token + user details to React
                                ↓
React stores token in localStorage and updates AuthContext
```

### 2. Login & Role Redirection

```text
User enters Email and Password
             ↓
Express finds User by email
             ↓
bcrypt.compare(enteredPassword, user.password)
             ↓
Verifies account is active (user.isActive !== false)
             ↓
Generates JWT token signed with JWT_SECRET (valid for 7 days)
             ↓
React stores token in localStorage
             ↓
Client redirects based on user.role:
   - "admin"   → /admin/dashboard
   - "doctor"  → /doctor/dashboard
   - "patient" → /patient/dashboard
```

### 3. Dual-Level Role Protection

- **Frontend Guard (`ProtectedRoute.jsx`)**: Checks if the user is authenticated and if `allowedRoles.includes(user.role)`. If not, redirects immediately.
- **Backend Guard (`authMiddleware.js` + `roleMiddleware.js`)**:
  1. `protect`: Extracts `Bearer <token>` from HTTP Authorization header, verifies signature with `jwt.verify()`, and attaches `req.user`.
  2. `authorize(...roles)`: Verifies `roles.includes(req.user.role)`. If unauthorized, responds with **HTTP 403 Forbidden**.

---

## 🌐 REST API Endpoints Reference

### Authentication (`/api/auth`)

| Method | Endpoint             | Access        | Description                                            |
| :----- | :------------------- | :------------ | :----------------------------------------------------- |
| `POST` | `/api/auth/register` | Public        | Register new patient account                           |
| `POST` | `/api/auth/login`    | Public        | Authenticate user (Admin, Doctor, Patient) & issue JWT |
| `GET`  | `/api/auth/me`       | Authenticated | Get current authenticated user profile                 |

### Doctors (`/api/doctors`)

| Method   | Endpoint                        | Access        | Description                                                             |
| :------- | :------------------------------ | :------------ | :---------------------------------------------------------------------- |
| `GET`    | `/api/doctors`                  | Public        | List all doctors (supports `search`, `specialization`, `availableOnly`) |
| `GET`    | `/api/doctors/:id`              | Public        | Get single doctor details and weekly availability                       |
| `POST`   | `/api/doctors`                  | Admin         | Create new doctor account & clinical profile                            |
| `PUT`    | `/api/doctors/:id`              | Admin, Doctor | Update doctor qualifications, contact, or experience                    |
| `PATCH`  | `/api/doctors/:id/status`       | Admin         | Toggle doctor active/inactive status                                    |
| `PUT`    | `/api/doctors/:id/availability` | Doctor, Admin | Update doctor's 7-day consultation schedule                             |
| `DELETE` | `/api/doctors/:id`              | Admin         | Delete doctor profile and user login account                            |

### Patients (`/api/patients`)

| Method  | Endpoint                   | Access                 | Description                                                 |
| :------ | :------------------------- | :--------------------- | :---------------------------------------------------------- |
| `GET`   | `/api/patients`            | Admin                  | List all patients (supports `search` by name, email, phone) |
| `GET`   | `/api/patients/:id`        | Admin, Doctor, Patient | Get patient demographic details                             |
| `PUT`   | `/api/patients/:id`        | Patient, Admin         | Update patient personal demographics                        |
| `PATCH` | `/api/patients/:id/status` | Admin                  | Block or unblock patient login access                       |

### Appointments (`/api/appointments`)

| Method | Endpoint                           | Access         | Description                                               |
| :----- | :--------------------------------- | :------------- | :-------------------------------------------------------- |
| `POST` | `/api/appointments`                | Patient, Admin | Book appointment (with double-booking check)              |
| `GET`  | `/api/appointments`                | Authenticated  | Get appointments (Admin sees all; Doctor/Patient see own) |
| `GET`  | `/api/appointments/:id`            | Authenticated  | View specific appointment details                         |
| `PUT`  | `/api/appointments/:id/reschedule` | Patient, Admin | Reschedule date & time (with conflict check)              |
| `PUT`  | `/api/appointments/:id/cancel`     | Authenticated  | Cancel an appointment                                     |
| `PUT`  | `/api/appointments/:id/complete`   | Doctor         | Mark appointment as completed                             |

### Health Check

| Method | Endpoint | Access | Description                             |
| :----- | :------- | :----- | :-------------------------------------- |
| `GET`  | `/api`   | Public | Confirm that the backend API is running |

### Treatments & Prescriptions (`/api/treatments`)

| Method | Endpoint                                     | Access        | Description                                                  |
| :----- | :------------------------------------------- | :------------ | :----------------------------------------------------------- |
| `POST` | `/api/treatments`                            | Doctor        | Record diagnosis, prescription, notes & complete appointment |
| `GET`  | `/api/treatments/patient/:patientId`         | Authenticated | Get complete medical history for a patient                   |
| `GET`  | `/api/treatments/appointment/:appointmentId` | Authenticated | Get treatment record for a specific appointment              |

### Departments / Specializations (`/api/specializations`)

| Method   | Endpoint                   | Access | Description                           |
| :------- | :------------------------- | :----- | :------------------------------------ |
| `GET`    | `/api/specializations`     | Public | List all clinical departments         |
| `POST`   | `/api/specializations`     | Admin  | Add new medical department            |
| `PUT`    | `/api/specializations/:id` | Admin  | Update department name or description |
| `DELETE` | `/api/specializations/:id` | Admin  | Remove department                     |

### Dashboard Analytics (`/api/dashboard`)

| Method | Endpoint                 | Access  | Description                                                |
| :----- | :----------------------- | :------ | :--------------------------------------------------------- |
| `GET`  | `/api/dashboard/admin`   | Admin   | Computes live counts for doctors, patients, appointments   |
| `GET`  | `/api/dashboard/doctor`  | Doctor  | Computes today's visits, completed visits, unique patients |
| `GET`  | `/api/dashboard/patient` | Patient | Returns next appointment, visit counts, recent treatments  |

---

## ⚙️ Installation & Setup Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher; required by the Vite 5 toolchain)
- [MongoDB](https://www.mongodb.com/) running locally on `mongodb://127.0.0.1:27017` (or a MongoDB Atlas URI)

### Step 1: Clone or Navigate to the Project Directory

```bash
cd e:\hospital
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment Variables

Copy `backend/.env.example` to `backend/.env` and set a valid MongoDB URI and JWT secret before starting the backend.

### Step 5: Start the Backend Server

The backend automatically creates the initial admin and populates the demo departments, doctors, patients, schedules, and clinical records when the database is empty:

```bash
cd e:\hospital\backend
npm run dev   # or npm start
```

_Backend runs on:_ `http://localhost:5000`

To manually reset and reseed the database, run this from `backend`. **This deletes all existing users and clinical records before reseeding:**

```bash
npm run seed
```

### Step 6: Start the Frontend Application

In a separate terminal window:

```bash
cd e:\hospital\frontend
npm run dev
```

_Frontend runs on:_ `http://localhost:5173`

---
