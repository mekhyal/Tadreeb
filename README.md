# Tadreeb

Tadreeb is a training and internship platform that connects university students with companies in Kuwait. Students discover programs and apply; companies publish opportunities, review applicants, and accept up to a fixed seat count; administrators manage accounts and oversight.

## Team

- Abdullah Al-Mekhyal  
- Yousef Joudah  
- Abdulaziz Alshammeri  

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React (Create React App), React Router, Context API, Axios |
| Backend | Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs |
| Database | MongoDB (local or Atlas) |

This is **not** a static `index.html` site: the UI is a SPA under `frontend/`, backed by the REST API under `backend/`.

## Repository layout

```
Tadreeb/
├── README.md                 # this file
├── frontend/                 # React client
│   ├── README.md
│   ├── .env.example          # REACT_APP_API_URL, etc.
│   └── src/
├── backend/                  # Express API
│   ├── README.md             # full API & setup details
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── middleware/
└── …                         # docs / LaTeX milestones (if present)
```

There is **no** MySQL `schema.sql` in this tree; data lives in **MongoDB** collections defined by Mongoose models.

## Quick start (development)

### 1. MongoDB

Run MongoDB locally or create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Put the URI in `backend/.env` as `MONGO_URI`.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGO_URI, JWT_SECRET, optionally CORS_ORIGIN for production

npm install
npm run dev
```

API default: **http://localhost:5001** (health: `GET /`).

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # if present; set REACT_APP_API_URL=http://localhost:5001/api
npm install
npm start
```

App default: **http://localhost:3000**.

### 4. First admin

The backend README describes bootstrapping the first admin via `POST /api/admin/create-admin`, then protecting that route in production.

## Documentation

- **Backend API, env vars, troubleshooting:** [backend/README.md](backend/README.md)  
- **Frontend routes, features, run/build:** [frontend/README.md](frontend/README.md)  

## Branch workflow

| Branch | Purpose |
| --- | --- |
| `main` | Stable release |
| `dev` | Integration |
| `feature/*` | Feature work |

Typical flow: branch from `dev` → PR to `dev` → merge to `main` after testing.

## Course

**CS335 — Web Development**, Kuwait University.
