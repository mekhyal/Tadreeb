# Tadreeb Backend

REST API for the Tadreeb training platform. Built with Node.js, Express, MongoDB, Mongoose, JWT, and bcryptjs.

## Roles

- **student**: registers, logs in, applies while registration is open, removes applications only during registration, and tracks application status.
- **company**: logs in only when account access is Active, posts programs, reviews applications, and accepts/rejects applicants up to seat capacity before the program starts.
- **admin**: creates users, lists entities, manages company requests, controls student/company access, and reviews platform data.

---

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | 18.x or 20.x |
| npm | 9+ |
| MongoDB | 6.x or newer, local or Atlas |

---

## Project Structure

```text
backend/
|-- .env
|-- .env.example
|-- package.json
|-- scripts/
|   |-- exportDatabaseCopy.js
|   `-- importDatabaseCopy.js
`-- src/
    |-- server.js
    |-- config/db.js
    |-- controllers/
    |-- middleware/
    |-- models/
    |-- routes/
    `-- utils/
```

---

## Environment

Create `backend/.env`:

```bash
cp .env.example .env
```

Required/common variables:

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port, default `5001` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `CORS_ORIGIN` | Optional comma-separated frontend origins |

Password policy is 8-24 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character. Passwords are hashed with bcryptjs before storage.

---

## Install And Run

```bash
cd backend
npm install
npm run dev
```

Production-style run:

```bash
npm start
```

Health check:

```text
GET http://localhost:5001/
```

Expected response:

```text
Tadreeb API is running
```

---

## Useful Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the API with nodemon |
| `npm start` | Run the API with node |
| `npm run db:export` | Export current MongoDB data to `../database/tadreeb-database-copy.json` |
| `npm run db:import-copy` | Import the checked-in database copy into the configured MongoDB database |

---

## Test Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@tadreeb.com` | `Admin123!` |
| Student | `student@tadreeb.com` | `Student123!` |
| Company | `company@tadreeb.com` | `Company123!` |

The checked-in database copy stores passwords as bcrypt hashes. Use the plain-text values above only through the login UI/API.

---

## Database Copy

The repository includes a JSON database copy for course evaluation:

```text
../database/tadreeb-database-copy.json
```

It contains the exported MongoDB collections for admins, students, companies, company requests, opportunities, and applications.

Regenerate it from the database configured in `backend/.env`:

```bash
npm run db:export
```

Import the checked-in copy into the database configured in `backend/.env`:

```bash
npm run db:import-copy
```

---

## API Overview

Base URL:

```text
http://localhost:5001
```

Protected routes require:

```text
Authorization: Bearer <JWT>
```

### Public

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/` | Health check |
| `POST` | `/api/company-requests` | Public company join request |

### Auth

| Method | Path | Role |
| --- | --- | --- |
| `POST` | `/api/auth/student/register` | public |
| `POST` | `/api/auth/student/login` | public |
| `POST` | `/api/auth/company/login` | public |
| `POST` | `/api/auth/admin/login` | public |
| `GET/PUT` | `/api/auth/student/profile` | student |
| `GET/PUT` | `/api/auth/company/profile` | company |
| `GET/PUT` | `/api/auth/admin/profile` | admin |

### Admin

Admin routes are mounted under `/api/admin` and include:

- create admin/company/student
- list admins/companies/students
- update company/student account access
- list and review applications
- review company join requests

Admin-created student fields match the student profile shape: first name, last name, email, password, mobile number, gender, year, university name, major, skills, and student ID. Students do not use location/country fields. Admin accounts use country, not location.

### Opportunities

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/opportunities` | optional | Public list; owner company/admin receives applicant counts |
| `GET` | `/api/opportunities/:id` | optional | Single program |
| `POST` | `/api/opportunities` | company | Create program |
| `PUT` | `/api/opportunities/:id` | company owner/admin | Update program |
| `DELETE` | `/api/opportunities/:id` | company owner/admin | Delete program and related applications/participants |

Programs require a `registrationDeadline`, and it must be before `dateFrom`. Program completion is automatic after `dateTo`.

### Applications

| Method | Path | Role | Notes |
| --- | --- | --- | --- |
| `POST` | `/api/applications` | student | Apply to a program |
| `GET` | `/api/applications/my` | student | List own applications |
| `DELETE` | `/api/applications/:id` | student | Remove own application while registration is open |
| `GET` | `/api/applications/company` | company | List applications for company programs |
| `PATCH` | `/api/applications/:id/status` | company | Accept/reject before the program starts |

Application statuses:

```text
Submitted, Under Review, Not Reviewed, Accepted, Rejected
```

Students cannot apply to a second opportunity whose date range overlaps an existing `Submitted`, `Under Review`, `Not Reviewed`, or `Accepted` application. `Rejected` applications do not block future overlapping applications.

---

## Domain Rules

- Seats are consumed by Accepted applications only.
- Registration deadline is required and controls apply/remove behavior.
- Program lifecycle is derived from registration deadline, start date, and end date.
- Programs become Completed automatically after the end date.
- Deleting a program deletes related applications/participants.
- Companies cannot update application decisions after a program starts or completes.
- Company account access is controlled by Admin Users. Active companies can log in and post programs.
- Company requests use review labels Pending, Approved, and Rejected at the database layer; the admin UI presents them as Under Review, Accepted, and Rejected.
- Student application results can be hidden from students by admin review visibility controls.

---

## Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| `MongooseServerSelectionError` | Check `MONGO_URI`, MongoDB service, or Atlas IP allowlist |
| `jwt malformed` / `401` | Log in again and make sure the header is `Bearer <token>` |
| `403` on company routes | Company account is not Active |
| `415` on JSON routes | Send `Content-Type: application/json` |
| `EADDRINUSE: 5001` | Free the port or set another `PORT` |

---

## Production Checklist

1. Use a strong `JWT_SECRET`.
2. Never commit `.env`.
3. Lock or protect bootstrap admin creation before production.
4. Set `CORS_ORIGIN` to the deployed frontend origin.
5. Use HTTPS in production.
