# Tadreeb — Frontend

React SPA for the Tadreeb platform: students, companies, and admins each use role-specific portals. The app talks to the **Express API** (see `../backend/README.md`); configure the base URL with `REACT_APP_API_URL`.

---

## Roles

| Role | What they do |
| --- | --- |
| **Student** | Browse programs, apply, track application status (including after a company accepts/rejects), manage profile |
| **Company** | Dashboard, create/edit programs (**seats**, **qualifications** text), manage participants and application status, profile |
| **Admin** | Dashboard, programs, participants, companies, users, profile |

---

## Features (high level)

- **Public:** marketing home, login/signup, **request to join as a company** (`/company-request`)
- **Auth:** JWT stored in `localStorage`, `AuthContext`, `ProtectedRoute` / `PublicOnlyRoute`
- **Student:** program discovery, apply flow, **My Applications** (refreshes on focus / navigation), profile
- **Company:** programs with seat limits and optional qualifications; participant list; profile
- **Admin:** cross-company programs and user management; company account status (**Pending** / **Active** / **Rejected**)

---

## UI

- Responsive layout, portal-style navigation, modals, pagination, React Icons  
- Styles under `src/styles/` (role-specific CSS; not only Bootstrap)

---

## Project structure

```
frontend/
├── public/
├── src/
│   ├── api/              # Axios wrappers (apiService, auth, admin, applications, …)
│   ├── components/       # shared + role-specific (portal, student, company, admin)
│   ├── context/          # AuthContext
│   ├── pages/
│   │   ├── authentication/
│   │   ├── student/
│   │   ├── company/
│   │   └── admin/
│   ├── utils/            # e.g. passwordRules.js, companyAccountStatus.js
│   ├── styles/
│   ├── App.js
│   └── index.js
├── .env.example
└── package.json
```

---

## Technologies

- React 18, React Router v6  
- Axios (JWT attached in `apiService`)  
- Context API  

---

## Route protection

| Path prefix | Role |
| --- | --- |
| `/student`, `/student/profile`, `/student/applications` | `student` |
| `/company/*` | `company` |
| `/admin/*` | `admin` |

---

## Environment

Create `.env` in `frontend/` if needed:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

Restart the dev server after changing env vars.

---

## Run & build

```bash
npm install
npm start          # http://localhost:3000
npm run build      # production bundle
```

Ensure the backend is running and CORS allows your origin (see `backend/.env` `CORS_ORIGIN` for production).

---

## Password policy (signup & profile updates)

Aligned with the API: **8–24 characters**, at least **one letter** and **one digit**. See `src/utils/passwordRules.js`.

Test accounts in a dev database are created via the API or admin UI; use credentials your team has provisioned (not committed here).

---

## Notes

- **Live API integration** — lists and dashboards load from the backend, not static mock JSON.  
- Application **status** on the student side comes from `GET /api/applications/my` and is refreshed when revisiting **My Applications** or refocusing the browser tab (student home also refreshes programs + applications on visibility/focus).

---

## Course

CS335 — Web Development, Kuwait University.
