# Tadreeb

Tadreeb is a training and internship platform that connects university students with companies in Kuwait. Students discover programs and apply; companies publish opportunities, review applicants, and accept up to a fixed seat count; administrators manage accounts and oversight.

## Team

- Abdullah Al-Mekhyal  
- Yousef Joudah  
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

CS335 - Web Development, Kuwait University.
