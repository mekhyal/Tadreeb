# Tadreeb Frontend

Tadreeb Frontend is a React single-page application for an internship and training platform. It provides public pages, authentication, and role-specific portals for students, companies, and admins.

The frontend focuses on user experience, validation, routing, API integration, responsive layouts, and role-based screens. Backend implementation details are intentionally kept out of this README except for the API URL needed to run the app.

---

## Table of Contents

- [Overview](#overview)
- [Main Features](#main-features)
- [User Roles](#user-roles)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Run The Frontend](#run-the-frontend)
- [Build](#build)
- [Frontend Architecture](#frontend-architecture)
- [Styling](#styling)
- [Validation Rules](#validation-rules)
- [Responsive Behavior](#responsive-behavior)
- [Useful Scripts](#useful-scripts)

---

## Overview

The app supports three main experiences:

- Public visitors can view the home page, contact section, login/signup pages, and company request form.
- Students can browse programs, apply, remove eligible applications, view application progress, and manage their profile.
- Companies can manage programs, review participants, update application decisions, and manage their profile.
- Admins can review platform data, manage programs, participants, company requests, users, and their profile.

---

## Main Features

### Public Pages

- Public home page with hero, about, audience, partners, stats, and contact sections.
- Login and signup pages.
- Company request form at `/company-request`.
- Company request form includes a confirmation dialog before submit.
- Company request page navbar matches the public home navbar and supports mobile open/close behavior.

### Authentication

- Role-based login for students, companies, and admins.
- Signup confirmation dialog before creating a student account.
- Signup success state redirects to login with a green success message.
- Password visibility toggle on login, signup, profile, and admin add-user password fields.
- Logout confirmation for portal users.
- Logout returns users to the public home page.

### Student Portal

- Program discovery page with search and filter controls.
- Clear search button resets the student search.
- Program cards show lifecycle status, registration close date, seats, and details.
- Apply flow includes confirmation before submission.
- Applications page separates active applications and completed programs.
- Application removal is available only while registration is open.
- Student profile supports controlled save behavior, email update flow, field validation, and success/error messages.

### Company Portal

- Dashboard with application snapshot and summary data.
- Program management with add, edit, delete, seats, registration deadline, image fallback, and validation.
- Participants page with student details, program, status, and notes.
- Participant decision styles for Under Review, Accepted, and Rejected.
- Company profile supports delayed save behavior, field validation, password update, and polished error placement.

### Admin Portal

- Dashboard with recent users, recent applications, and active internship program count.
- Program management across companies.
- Participants management with company status visibility controls.
- Companies page for request review labels: Under Review, Accepted, Rejected.
- Users page for student/company/admin records and account access management.
- Admin profile with controlled save behavior and validation.

---

## User Roles

| Role | Frontend Access |
| --- | --- |
| Student | Student home, applications, profile |
| Company | Dashboard, programs, participants, profile |
| Admin | Dashboard, programs, participants, companies, users, profile |

---

## Routes

### Public Routes

| Route | Page |
| --- | --- |
| `/` | Public home |
| `/login` | Login |
| `/signup` | Student signup |
| `/company-request` | Company request form |

### Student Routes

| Route | Page |
| --- | --- |
| `/student` | Student program discovery |
| `/student/applications` | Student applications |
| `/student/profile` | Student profile |

### Company Routes

| Route | Page |
| --- | --- |
| `/company/dashboard` | Company dashboard |
| `/company/programs` | Company programs |
| `/company/participants` | Company participants |
| `/company/profile` | Company profile |

### Admin Routes

| Route | Page |
| --- | --- |
| `/admin/dashboard` | Admin dashboard |
| `/admin/programs` | Admin programs |
| `/admin/participants` | Admin participants |
| `/admin/companies` | Admin companies |
| `/admin/users` | Admin users |
| `/admin/profile` | Admin profile |

Routes are protected with `ProtectedRoute` and public-only auth pages use `PublicOnlyRoute`.

---

## Project Structure

```text
frontend/
|-- public/
|-- src/
|   |-- api/                    # Axios API wrappers
|   |-- assets/                 # Images and static assets
|   |-- components/
|   |   |-- admin/              # Admin-specific components
|   |   |-- auth/               # Route protection components
|   |   |-- common/             # Public navbar/footer
|   |   |-- company/            # Company cards, modals, confirms
|   |   |-- company-request/    # Request page navbar/footer
|   |   |-- home/               # Public home sections
|   |   |-- portal/             # Shared portal layout/sidebar/topbar
|   |   `-- student/            # Student cards, filters, modals
|   |-- context/                # AuthContext
|   |-- pages/
|   |   |-- admin/
|   |   |-- authentication/
|   |   |-- company/
|   |   `-- student/
|   |-- styles/                 # Global and role-specific CSS
|   |-- utils/                  # Frontend helpers and rules
|   |-- App.js                  # Route definitions
|   `-- index.js                # App entry
|-- .env.example
|-- package.json
`-- README.md
```

---

## Tech Stack

- React
- React Router
- Axios
- Context API
- React Icons
- Bootstrap / React Bootstrap
- Plain CSS organized by feature and role

---

## Setup

Install dependencies from the frontend folder:

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside `frontend/`.

```env
REACT_APP_API_URL=http://localhost:5001/api
```

If this variable is changed, restart the frontend dev server.

---

## Run The Frontend

Start the development server:

```bash
cd frontend
npm start
```

The app runs at:

```text
http://localhost:3000
```

Make sure the API URL in `.env` points to a running API server.

---

## Build

Create a production build:

```bash
cd frontend
npm run build
```

The optimized output is generated in:

```text
frontend/build/
```

---

## Frontend Architecture

### API Layer

API calls are grouped in `src/api/`:

- `apiService.js` configures the Axios instance and attaches the JWT token.
- `authAPI.js` handles login, signup, and profile endpoints.
- `opportunityAPI.js` handles program data.
- `applicationAPI.js` handles applications.
- `adminAPI.js` handles admin screens.
- `companyRequestAPI.js` handles the public company request form.

### Auth Context

`src/context/AuthContext.js` stores the logged-in user and token, exposes login/logout helpers, and keeps role data available to protected pages.

### Route Guards

- `ProtectedRoute` blocks unauthorized portal routes.
- `PublicOnlyRoute` keeps logged-in users away from login/signup/company-request pages.

### Shared Portal Components

The portal layout is shared between student, company, and admin areas through:

- `PortalLayout`
- `PortalSidebar`
- `PortalTopbar`
- `PortalLoader`
- `PortalStatCard`

---

## Styling

Styles are located in `src/styles/`.

```text
styles/
|-- variables.css
|-- home.css
|-- portal.css
|-- authentication/
|-- company/
|-- admin/
|-- student/
`-- layout/
```

The project uses role-specific CSS files to keep screens easy to maintain:

- Student styles are under `styles/student/`
- Company styles are under `styles/company/`
- Admin styles are under `styles/admin/`
- Public layout styles are under `styles/layout/`

---

## Validation Rules

Frontend validation is used before submit on auth, profile, company request, program, and admin user forms.

Password rules are centralized in:

```text
src/utils/passwordRules.js
```

Current password policy:

- 8-24 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

Program lifecycle helpers are in:

```text
src/utils/programStatus.js
```

Other frontend helpers include:

- `companyAccountStatus.js`
- `formatLinks.js`

---

## Responsive Behavior

The frontend supports smaller screens through:

- Mobile navbar menu on public and company request pages.
- Collapsing portal layouts.
- Scrollable tables on small screens.
- Responsive modals with safe height and scroll behavior.
- Wrapped long text and website links.
- Mobile-friendly form grids.

Recommended manual screen checks:

- 375px mobile width
- 390px mobile width
- 768px tablet width
- Desktop width

---

## Useful Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Run the frontend development server |
| `npm run build` | Create production build |
| `npm test` | Run React test runner |


