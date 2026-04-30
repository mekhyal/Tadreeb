# Tadreeb

Tadreeb is a MERN training and internship platform for university students, companies, and administrators. Students discover and apply to opportunities, companies publish programs and review participants, and admins manage the platform from a dedicated portal.

This repository contains the full Tadreeb application:

- `frontend/` - React single-page application.
- `backend/` - Express REST API connected to MongoDB.

---

## Table of Contents

- [Overview](#overview)
- [Roles](#roles)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Requirements](#requirements)
- [Environment Setup](#environment-setup)
- [Run Locally](#run-locally)
- [Build](#build)
- [Documentation](#documentation)
- [Security Notes](#security-notes)
- [Development Workflow](#development-workflow)
- [Team](#team)

---

## Overview

Tadreeb supports the full internship workflow:

1. Students create accounts, browse programs, apply, and manage applications.
2. Companies request to join, manage programs, and review applicants.
3. Admins oversee users, company requests, programs, and participant visibility.

The system includes role-based authentication, protected dashboards, program lifecycle logic, seat tracking, registration deadlines, responsive layouts, and profile management for each role.

---

## Roles

| Role | Main Responsibilities |
| --- | --- |
| Student | Browse programs, apply, remove eligible applications, view status, manage profile |
| Company | Manage programs, view participants, accept/reject applicants, manage profile |
| Admin | Manage users, companies, programs, participants, visibility, and platform overview |

---

## Key Features

### Public Experience

- Public home page with sections for hero, about, audiences, partners, stats, and contact.
- Student login and signup.
- Company request form with confirmation before submission.
- Responsive navbar and mobile menu behavior.

### Authentication And Access

- Role-based authentication for students, companies, and admins.
- Protected routes for role-specific portals.
- Public-only routes for login, signup, and company request pages.
- Password visibility toggles across auth and profile forms.
- Logout confirmation and redirect to the public home page.

### Student Experience

- Search and filter available programs.
- View program lifecycle status: Register Now, Selection Phase, Active, Completed.
- Apply only while registration is open.
- Remove applications only while registration is open.
- View active applications and completed programs in separate sections.
- Update profile details and email through controlled profile flows.

### Company Experience

- Dashboard with application snapshot and summary cards.
- Create, edit, delete, and view programs.
- Manage seats, dates, registration deadlines, rules, qualifications, and images.
- View participants with student details, program, status, and notes.
- Accept or reject applications before the program becomes active/completed.
- Update company profile with validation and save confirmation.

### Admin Experience

- Dashboard with recent users, recent applications, and active internship program count.
- Manage all programs across companies.
- Manage participant visibility and company decision notes.
- Review company requests using Under Review, Accepted, and Rejected labels.
- Manage users and login access for student and company accounts.
- Manage admin profile with validation and save behavior.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, React Router, Axios, Context API, React Icons, Bootstrap |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Database | MongoDB local or MongoDB Atlas |
| Styling | CSS organized by role and feature |

---

## Repository Structure

```text
Tadreeb/
|-- README.md
|-- TADREEB_UPDATES.md
|-- frontend/
|   |-- README.md
|   |-- package.json
|   |-- .env.example
|   `-- src/
|       |-- api/
|       |-- assets/
|       |-- components/
|       |-- context/
|       |-- pages/
|       |-- styles/
|       `-- utils/
`-- backend/
    |-- README.md
    |-- package.json
    |-- .env.example
    `-- src/
        |-- config/
        |-- controllers/
        |-- middleware/
        |-- models/
        |-- routes/
        |-- utils/
        `-- server.js
```

---

## Requirements

| Tool | Recommended Version |
| --- | --- |
| Node.js | 18.x or 20.x |
| npm | 9+ |
| MongoDB | 6.x or newer, local or Atlas |

---

## Environment Setup

### Backend Environment

Create `backend/.env` from the example file:

```bash
cd backend
cp .env.example .env
```

Common backend variables:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment

Create `frontend/.env` from the example file:

```bash
cd frontend
cp .env.example .env
```

Frontend API variable:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

Restart the frontend server after changing `.env`.

---

## Run Locally

Run the backend first:

```bash
cd backend
npm install
npm run dev
```

Default API URL:

```text
http://localhost:5001
```

Run the frontend in a second terminal:

```bash
cd frontend
npm install
npm start
```

Default frontend URL:

```text
http://localhost:3000
```

---

## Build

Create a frontend production build:

```bash
cd frontend
npm run build
```

Start the backend in production mode:

```bash
cd backend
npm start
```

---

## Documentation

Detailed documentation is split by app layer:

- [Frontend README](frontend/README.md) - routes, UI structure, setup, styling, validation, and frontend architecture.
- [Backend README](backend/README.md) - API setup, environment variables, routes, domain rules, and troubleshooting.
- [Updates Summary](TADREEB_UPDATES.md) - recent feature and behavior changes.

---

## Security Notes

- Passwords are hashed on the backend before storage.
- JWT tokens are used for protected API access.
- Role-based route guards protect portal pages on the frontend.
- Backend middleware protects API routes by role.
- Company and student login access can be controlled by admin account status.
- Use a strong `JWT_SECRET` and never commit real `.env` files.
- Use HTTPS in production.

---

## Development Workflow

Recommended branch workflow:

| Branch | Purpose |
| --- | --- |
| `main` | Stable release branch |
| `dev` | Integration branch |
| `feature/*` | Feature-specific work |

Typical flow:

1. Create a feature branch from `dev`.
2. Make focused changes.
3. Test frontend and backend behavior.
4. Open a pull request into `dev`.
5. Merge into `main` after final testing.

---

## Team

- Abdullah Al-Mekhyal
- Yousef Joudah
- Abdulaziz Alshammeri

---

## Course

CS335 - Web Development, Kuwait University.
