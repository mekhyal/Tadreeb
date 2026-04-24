# Tadreeb Platform — Frontend


## Overview

Tadreeb supports three user roles:

- **Students** → explore and apply for training programs  
- **Companies** → publish programs and manage participants  
- **Admins** → manage users, companies, and the full system  

The platform uses a **role-based architecture**, so each user sees only what is relevant to them.

---

## Features

### Public Pages
- Home page with modern UI
- Smooth section navigation
- Login / Signup pages
- Company request form

### Authentication (Frontend)
- Role-based login (Student / Company / Admin)
- Route protection using React Context
- Redirect based on role after login
- Public routes blocked after login

---

### Student Portal
- Browse training programs
- Apply to opportunities
- Track application status
- Manage profile

---

### Company Portal
- Dashboard with statistics
- Create / edit programs
- Manage participants
- Add notes and update status
- Profile management

---

### Admin Portal
- System-wide dashboard
- Manage all programs
- Manage participants (review / approve / reject)
- Manage companies (approve / reject requests)
- Manage users (students, companies, admins)
- Profile management

---

## UI & UX

- Responsive design (mobile → desktop)
- Smooth navigation with loaders
- Modal-based interactions
- Pagination for large data
- Clean and consistent design system
- Custom icons for statistics

---

## Project Structure

```

src/
├── components/
├── pages/
│   ├── authentication/
│   ├── student/
│   ├── company/
│   ├── admin/
├── context/
├── data/
├── styles/
└── assets/

```

---

## Technologies

- React.js
- React Router
- Context API
- Bootstrap
- Custom CSS
- React Icons

---

## Route Protection

- `/student/*` → student only  
- `/company/*` → company only  
- `/admin/*` → admin only  

Uses:
- `ProtectedRoute`
- `PublicOnlyRoute`

---

## Test Accounts

```

Student
[student@tadreeb.com]
Student123!

Company
[company@tadreeb.com]
Company123!

Admin
[admin@tadreeb.com]
Admin123!

````

---

## Run Project

```bash
npm install
npm start
````

Open:

```
http://localhost:3000
```

---

## Build

```bash
npm run build
```

---

## Notes

* Frontend uses mock authentication (localStorage)
* Ready for backend integration
* Scalable and reusable structure


## Done by : Abdulaziz

