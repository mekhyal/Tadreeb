# Tadreeb — Backend

REST API for the Tadreeb training platform. Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT**, and **bcryptjs**.

Roles:

- **student** — registers, logs in, applies to opportunities, cancels pending applications, tracks status via `GET /applications/my`.
- **company** — logs in only when account is **Active** (legacy **`Approved`** in old data still allowed until migrated), posts programs, reviews applications, accepts/rejects up to **seat** capacity.
- **admin** — creates users, lists entities, updates **company account** status (**Pending** / **Active** / **Rejected**).

---

## 1. Requirements

| Tool | Version |
|---|---|
| Node.js | 18.x or 20.x |
| npm | 9+ |
| MongoDB | 6.x or newer (local or Atlas) |

---

## 2. Project structure

```
backend/
├── .env
├── .env.example
├── package.json
└── src/
    ├── server.js
    ├── config/db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── adminController.js
    │   ├── opportunityController.js
    │   ├── applicationController.js
    │   └── companyRequestController.js   # public “request to join” form
    ├── middleware/
    │   ├── authMiddleware.js             # JWT protect (401 if missing/invalid)
    │   ├── optionalAuthMiddleware.js     # optional Bearer on public GETs (opportunities metrics)
    │   └── roleMiddleware.js
    ├── models/
    │   ├── Student.js
    │   ├── Company.js
    │   ├── Admin.js
    │   ├── Opportunity.js                # includes optional qualifications
    │   ├── Application.js
    │   └── CompanyRequest.js             # inbound join requests (not company accounts)
    ├── routes/
    │   ├── authRoutes.js                 → /api/auth
    │   ├── adminRoutes.js                → /api/admin
    │   ├── opportunityRoutes.js          → /api/opportunities
    │   ├── applicationRoutes.js          → /api/applications
    │   └── companyRequestRoutes.js       → /api/company-requests
    └── utils/
        ├── generateToken.js              # { id, role }, 7d
        ├── companyAccountStatus.js       # portal access helper (Active / legacy Approved)
        └── validators.js                 # email, password policy, lengths, ObjectId
```

---

## 3. MongoDB setup

See your preferred flow (local `mongod` or Atlas). Set `MONGO_URI` in `.env`.

---

## 4. Environment variables

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port (default **5001**) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `CORS_ORIGIN` | Optional. Comma-separated allowed frontend origins for production. If unset, CORS reflects any origin (dev only). |

Password policy (register, admin-created users, profile password changes): **8–24** characters, at least **one letter** and **one digit** (see `validators.js`).

---

## 5. Install & run

```bash
cd backend
npm install
npm run dev       # nodemon
# or
npm start
```

Health: `GET http://localhost:5001/` → `Tadreeb API is running`.

---

## 6. API overview

Base URL: `http://localhost:5001`  
JSON bodies: `Content-Type: application/json`.

**Auth header (protected routes):**

```
Authorization: Bearer <JWT>
```

### Public

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/` | Health |
| POST | `/api/company-requests` | Company join request (no auth). Persists all form fields including description. |

### Auth (`/api/auth`)

| Method | Path | Auth | Role |
| --- | --- | --- | --- |
| POST | `/student/register` | — | — |
| POST | `/student/login` | — | — |
| POST | `/company/login` | — | — |
| POST | `/admin/login` | — | — |
| GET/PUT | `/student/profile` | Bearer | student |
| GET/PUT | `/company/profile` | Bearer | company |
| GET/PUT | `/admin/profile` | Bearer | admin |

Company login succeeds only when `companyMayUsePortal(status)` is true (**`Active`**, or legacy **`Approved`**).

### Admin (`/api/admin`)

Bootstrap and CRUD as implemented in `adminRoutes.js` (create admin/company/student, list users, update company **account** status, student/admin status, etc.).  
**Company account status** values: **`Pending`**, **`Active`**, **`Rejected`**.

### Opportunities (`/api/opportunities`)

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/` | Optional Bearer | Public list. `usedSeats` / `availableSeats` count **Accepted** students only (applications do not consume seats until accepted). With Bearer as **owning company** or **admin**, each row may include **`applicantsCount`** (all applications). |
| GET | `/:id` | Optional Bearer | Same seat semantics. |
| POST | `/` | Bearer | company (portal-eligible) |
| PUT | `/:id` | Bearer | company (owner) or admin |
| DELETE | `/:id` | Bearer | company (owner) or admin |

Programs include **`qualifications`** (optional text) plus title/description/rules/seats/dates, etc. Minimum seats on update cannot go below **accepted** count.

### Applications (`/api/applications`)

| Method | Path | Auth | Role |
| --- | --- | --- | --- |
| POST | `/` | Bearer | student — apply (`programID`) |
| GET | `/my` | Bearer | student — list own apps with status |
| DELETE | `/:id` | Bearer | student — cancel if status still `Submitted` / `Under Review` |
| GET | `/company` | Bearer | company |
| PATCH | `/:id/status` | Bearer | company — set status / note (accept obeys seat cap) |

**Application `status`:** `Submitted` · `Under Review` · `Accepted` · `Rejected`

---

## 7. Domain rules (summary)

- **Seats:** Capacity is enforced on **acceptance**, not on the mere count of applicants.
- **Company accounts:** Three states for admins — **Pending**, **Active**, **Rejected**. Only **Active** (or legacy **Approved**) can log in and post programs.
- **Join requests:** `CompanyRequest` tracks inbound forms (**Pending** / **Approved** / **Rejected** at schema level); separate from live `Company` accounts.

---

## 8. Quick smoke test (curl)

```bash
BASE=http://localhost:5001

curl -i $BASE/

# Bootstrap admin (lock down in production — see §9)
curl -i -X POST $BASE/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Root","lastName":"Admin","email":"admin@tadreeb.com","phone":"0500000000","password":"Admin1234"}'

curl -s -X POST $BASE/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tadreeb.com","password":"Admin1234"}'

# Create company (replace <ADMIN_TOKEN>) — new companies default to Active if status omitted
curl -i -X POST $BASE/api/admin/create-company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"companyName":"Example Co","email":"co@example.com","password":"Co123456","industry":"Tech","phone":"0511111111","location":"Kuwait City"}'
```

---

## 9. First-time admin (bootstrap)

`POST /api/admin/create-admin` may be **unprotected** for an empty database. **Re-protect it** before production (`protect`, `allowRoles('admin')` in `adminRoutes.js`).

---

## 10. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `MongooseServerSelectionError` | Mongo not reachable — check `MONGO_URI`, Atlas IP allowlist |
| `jwt malformed` / 401 | Missing `Bearer ` prefix or rotated `JWT_SECRET` — log in again |
| 403 on company routes | Company **Pending** / **Rejected** — admin must set **Active** |
| 415 on JSON routes | Send `Content-Type: application/json` |
| `EADDRINUSE: 5001` | Free the port or change `PORT` |

---

## 11. Security checklist (production)

1. Strong `JWT_SECRET`; never commit `.env`.
2. Lock bootstrap `create-admin`.
3. Set `CORS_ORIGIN` to real frontend origin(s).
4. TLS in front of the API; rotate secrets if leaked.

---

## 12. Course

CS335 — Web Development, Kuwait University.
