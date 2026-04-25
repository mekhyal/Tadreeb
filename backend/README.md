# Tadreeb — Backend

REST API for the Tadreeb training platform. Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, **JWT**, and **bcryptjs**.

It supports three roles:

- **student** — registers, logs in, applies to opportunities, tracks own applications.
- **company** — logs in, creates / updates / deletes its opportunities, reviews and updates the status of student applications.
- **admin** — logs in, creates other admins / companies / students, lists everyone, updates a company's status.

---

## 1. Requirements

| Tool | Version |
|---|---|
| Node.js | 18.x or 20.x |
| npm | 9+ (comes with Node) |
| MongoDB | 6.x or newer (local install **or** MongoDB Atlas cloud) |

Verify locally:

```bash
node -v
npm -v
mongod --version   # only needed if you run Mongo locally
```

---

## 2. Project structure

```
backend/
├── .env                # local secrets (NOT committed)
├── .env.example        # template
├── package.json
└── src/
    ├── server.js                   # app entry point
    ├── config/
    │   └── db.js                   # mongoose connection
    ├── controllers/
    │   ├── authController.js       # register/login (student, company, admin)
    │   ├── adminController.js      # admin-only management
    │   ├── opportunityController.js
    │   └── applicationController.js
    ├── middleware/
    │   ├── authMiddleware.js       # JWT verify  (protect)
    │   └── roleMiddleware.js       # role guard  (allowRoles)
    ├── models/
    │   ├── Student.js
    │   ├── Company.js
    │   ├── Admin.js
    │   ├── Opportunity.js
    │   └── Application.js
    ├── routes/
    │   ├── authRoutes.js           → mounted on /api/auth
    │   ├── adminRoutes.js          → /api/admin
    │   ├── opportunityRoutes.js    → /api/opportunities
    │   └── applicationRoutes.js    → /api/applications
    └── utils/
        └── generateToken.js        # signs JWT { id, role }, expires in 7d
```

---

## 3. Setting up MongoDB

You can use **either** a local MongoDB **or** a free MongoDB Atlas cluster. The connection string goes into `.env` as `MONGO_URI`.

### Option A — Local MongoDB (recommended for development)

**macOS (Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0   # auto-starts on login
```

Verify it's running:

```bash
mongosh
# should open a shell connected to mongodb://localhost:27017
```

Use this URI in `.env`:

```
MONGO_URI=mongodb://localhost:27017/tadreeb
```

The database `tadreeb` is created automatically on the first write.

**Windows:** download the MongoDB Community Server from <https://www.mongodb.com/try/download/community> and install with the "Run service as Network Service user" option, then use the same URI above.

### Option B — MongoDB Atlas (cloud, free tier)

1. Create a free cluster at <https://www.mongodb.com/cloud/atlas>.
2. Database Access → add a user (username + password).
3. Network Access → add your IP (or `0.0.0.0/0` for development).
4. Cluster → **Connect** → **Drivers** → copy the connection string.
5. Use it in `.env` (replace `<password>` and `<dbname>`):

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/tadreeb?retryWrites=true&w=majority
```

---

## 4. Environment variables (`.env`)

Copy the template and fill in values:

```bash
cp .env.example .env
```

`.env` should contain:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/tadreeb
JWT_SECRET=replace_with_a_long_random_string
```

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> `.env` is git-ignored. **Never commit it.**

---

## 5. Install & run

From the `backend/` folder:

```bash
npm install      # installs dependencies
npm run dev      # development (auto-restarts via nodemon)
# or
npm start        # production-style (no auto-restart)
```

You should see:

```
MongoDB connected: 127.0.0.1
server is running on port 5001
```

Open <http://localhost:5001/> — you should see `Tadreeb API is running`.

### Available scripts

| Command | What it does |
|---|---|
| `npm run dev`  | Runs `nodemon src/server.js` (restarts on file save) |
| `npm start`    | Runs `node src/server.js` |

---

## 6. Dependencies

Production:

| Package | Why |
|---|---|
| `express` | HTTP server & routing |
| `mongoose` | MongoDB ODM |
| `dotenv` | Loads `.env` into `process.env` |
| `cors` | Allows the React frontend (port 3000) to call the API |
| `morgan` | HTTP request logger |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT signing & verification |

Dev:

| Package | Why |
|---|---|
| `nodemon` | Auto-restart on file changes |

---

## 7. API overview

Base URL: `http://localhost:5001`

| Method | Path | Auth | Role |
|---|---|---|---|
| GET    | `/`                                   | —     | — |
| POST   | `/api/auth/student/register`          | —     | — |
| POST   | `/api/auth/student/login`             | —     | — |
| POST   | `/api/auth/company/login`             | —     | — |
| POST   | `/api/auth/admin/login`               | —     | — |
| POST   | `/api/admin/create-admin`             | — *(bootstrap, see §9)* | — |
| POST   | `/api/admin/create-company`           | Bearer | admin |
| POST   | `/api/admin/create-student`           | Bearer | admin |
| GET    | `/api/admin/students`                 | Bearer | admin |
| GET    | `/api/admin/companies`                | Bearer | admin |
| GET    | `/api/admin/admins`                   | Bearer | admin |
| PUT    | `/api/admin/companies/:id/status`     | Bearer | admin |
| GET    | `/api/opportunities`                  | —     | — |
| GET    | `/api/opportunities/:id`              | —     | — |
| POST   | `/api/opportunities`                  | Bearer | company |
| PUT    | `/api/opportunities/:id`              | Bearer | company (owner) |
| DELETE | `/api/opportunities/:id`              | Bearer | company (owner) |
| POST   | `/api/applications`                   | Bearer | student |
| GET    | `/api/applications/my`                | Bearer | student |
| GET    | `/api/applications/company`           | Bearer | company |
| PATCH  | `/api/applications/:id/status`        | Bearer | company |

**Auth header for protected routes:**

```
Authorization: Bearer <JWT returned at login>
```

**Application status enum:** `Submitted` · `Under Review` · `Accepted` · `Rejected`
**Company status enum:** `Pending` · `Review` · `Approved` · `Rejected` · `Active`

---

## 8. Quick smoke test (curl)

```bash
BASE=http://localhost:5001

# health
curl -i $BASE/

# bootstrap an admin
curl -i -X POST $BASE/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Root","lastName":"Admin","email":"admin@tadreeb.com","phone":"0500000000","password":"Admin1234"}'

# admin login → copy "token"
curl -s -X POST $BASE/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tadreeb.com","password":"Admin1234"}'

# create a company (replace <ADMIN_TOKEN>)
curl -i -X POST $BASE/api/admin/create-company \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"companyName":"Aramco Digital","email":"co@aramco.com","password":"Co1234","industry":"Energy","phone":"0511111111","location":"Dhahran"}'
```

A full 20-step end-to-end test was used during development; all routes return the expected `200/201/401/403`.

---

## 9. First-time admin (bootstrap)

`POST /api/admin/create-admin` is **intentionally unprotected** so the very first admin can be created in an empty database. Once a root admin exists, lock it down by editing `src/routes/adminRoutes.js`:

```js
// before
router.post('/create-admin', createAdmin);
// after
router.post('/create-admin', protect, allowRoles('admin'), createAdmin);
```

---

## 10. Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` | Local Mongo isn't running. Start it: `brew services start mongodb-community@7.0` |
| `MongoNetworkError: bad auth` (Atlas) | Wrong user / password in `MONGO_URI`, or your IP isn't in Atlas Network Access |
| `Error: jwt malformed` / `Not authorized, token failed` | Header is missing `Bearer ` prefix, or `JWT_SECRET` was changed after the token was issued — log in again |
| `Cannot find module './lib/express'` (or similar) on `npm run dev` | Corrupted `node_modules`. Fix: `rm -rf node_modules package-lock.json && npm install` |
| `EADDRINUSE: 5001` | Another process is on port 5001. Kill it: `lsof -ti:5001 \| xargs kill -9` |
| `400 {"message":"Please provide all required student fields"}` | Some required field missing in the JSON body. See `src/models/Student.js` |
| `401 {"message":"Not authorized, no token"}` | You forgot the `Authorization: Bearer <token>` header |
| `403 {"message":"Access denied "}` | Token belongs to the wrong role for that route |

---

## 11. Security checklist before production

1. Replace `JWT_SECRET` with a long random value (see §4).
2. Lock `POST /api/admin/create-admin` (see §9).
3. Make sure `.env` is **not** committed (already in `.gitignore`).
4. If you ever leak a token, rotating `JWT_SECRET` invalidates every existing token.
5. Restrict Atlas Network Access to your real server IPs (don't keep `0.0.0.0/0`).

---

## 12. Course

CS335 — Web Development, Kuwait University.
