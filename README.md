# Tadreeb

Tadreeb is a training and internship platform that connects university students with companies in Kuwait. Students discover programs and apply, companies publish opportunities, review applicants, and accept up to a fixed seat count; administrators manage accounts and oversight.

## Team

- Abdullah Al-Mekhyal
- Yousef Joudeh
- Abdulaziz Alshammeri

## Stack

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
|-- database/
|   |-- README.md
|   `-- tadreeb-database-copy.json
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
    |-- scripts/
    |-- src/
    |   |-- config/
    |   |-- controllers/
    |   |-- middleware/
    |   |-- models/
    |   |-- routes/
    |   |-- utils/
    |   `-- server.js
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

Create these two `.env` files before running the app.

### Backend Environment

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Then paste this into `backend/.env` and replace `MONGO_URI` / `JWT_SECRET` as needed:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/tadreeb
JWT_SECRET=replace_this_with_a_long_secret_for_local_testing
CORS_ORIGIN=http://localhost:3000
```

If using MongoDB Atlas, replace `MONGO_URI` with the Atlas connection string.

### Frontend Environment

Create `frontend/.env`:

```bash
cd frontend
cp .env.example .env
```

Then paste this into `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

Restart the frontend server after changing `.env`.

---

## Database Copy

A JSON copy of the current test database is included for GitHub/course evaluation:

```text
database/tadreeb-database-copy.json
```

The copy includes MongoDB collections for admins, students, companies, company requests, opportunities, and applications. Passwords in the JSON file are bcrypt hashes; use the plain-text test passwords listed below when logging in through the app.

To import the checked-in database copy into the MongoDB database configured in `backend/.env`:

```bash
cd backend
npm install
npm run db:import-copy
```

To regenerate the database copy from the configured `backend/.env` database:

```bash
cd backend
npm run db:export
```

---

## Quick Start For Evaluation

After creating both `.env` files and importing the database copy, use two terminals.

Terminal 1 - backend API:

```bash
cd backend
npm install
npm run dev
```

Default API URL:

```text
http://localhost:5001
```

Terminal 2 - frontend app:

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

## Test Accounts

These accounts are included in the test database and can be used to move between the three main roles.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@tadreeb.com` | `Admin123!` |
| Student | `student@tadreeb.com` | `Student123!` |
| Company | `company@tadreeb.com` | `Company123!` |

Students can also create a new account from `/signup`.

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

- **Backend API, env vars, troubleshooting:** [backend/README.md](backend/README.md)
- **Frontend routes, features, run/build:** [frontend/README.md](frontend/README.md)
- **Database copy:** [database/README.md](database/README.md)

---

## Course

CS335 - Web Development, Kuwait University.
