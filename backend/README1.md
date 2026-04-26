# Tadreeb Backend API

Backend for the **Tadreeb Training Platform** built with:

- Node.js + Express  
- MongoDB (Mongoose)  
- JWT Authentication  

---

# Project Structure

```

backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   └── opportunityController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Application.js
│   │   ├── Company.js
│   │   ├── Opportunity.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   └── opportunityRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   └── server.js
├── .env
└── .env.example

````

---

# ⚙️ Setup

## 1. Install dependencies

```bash
cd backend
npm install
````

---

## 2. Create `.env`

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/tadreeb
JWT_SECRET=your_secret_key
```

---

## 3. Run MongoDB

```bash
mongod
```

---

## 4. Start server

```bash
npm run dev
```

---

## 5. Test

```
http://localhost:5001
```

---

# Roles

### Student

* Apply to programs
* View applications
* Remove application

### Company

* Create / edit / delete programs
* View applicants
* Accept / reject applications

### Admin

* Create users
* View users
* Manage companies

---

# Features

## Application System

* One application per student per program
* Status flow:

```
Submitted → Under Review → Accepted / Rejected
```

---

## Cancel Application

```
DELETE /api/applications/:id
```

* Removes application
* Frees seat automatically

---

## Smart Seats System

Each program includes:

* `seats`
* `usedSeats`
* `availableSeats`

### Rules

* Cannot apply if full
* Cannot reduce seats below current applications
* Auto mark program **Completed** when full
* Reopen if seat becomes available

---

# API Overview

## Auth

```
POST /api/auth/student/register
POST /api/auth/student/login
POST /api/auth/company/login
POST /api/auth/admin/login
```

---

## Opportunities

```
GET    /api/opportunities
GET    /api/opportunities/:id
POST   /api/opportunities        (company)
PUT    /api/opportunities/:id    (company/admin)
DELETE /api/opportunities/:id    (company/admin)
```

---

## Applications

```
POST   /api/applications            (student)
GET    /api/applications/my         (student)
DELETE /api/applications/:id        (student)
GET    /api/applications/company    (company)
PATCH  /api/applications/:id/status (company)
```

---

## Admin

```
POST /api/admin/create-admin
POST /api/admin/create-company
POST /api/admin/create-student
GET  /api/admin/students
GET  /api/admin/companies
GET  /api/admin/admins
PUT  /api/admin/companies/:id/status
```

---

# Authentication

```
Authorization: Bearer <token>
```

---

# Test Flow

1. Create admin
2. Admin creates company
3. Company creates program (e.g. 5 seats)
4. Students apply
5. Program becomes full
6. Student cancels → seat becomes available

---

# Notes

* Token required for protected routes
* Role must match endpoint
* Required fields must be provided




