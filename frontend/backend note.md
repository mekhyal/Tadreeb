## Backend Requirements (Future Integration)

To make Tadreeb a real full-stack system, the frontend must be connected to a backend server and a database.

### What the backend should handle

The backend should be responsible for:

- authenticating users with real email and password
- checking user roles securely
- protecting private data and routes
- storing all users, programs, requests, and application updates
- handling company requests and admin approvals
- returning real data to the frontend through APIs

The frontend currently uses mock data and localStorage. This is useful for development, but it is not real security. A backend is needed so the system can validate everything properly.

---

## Main Backend Features Needed

### 1. Authentication and Authorization
The backend should provide:

- login API
- logout API or token/session invalidation
- password hashing
- role-based authorization
- protected endpoints for student, company, and admin

Examples:
- only students can apply to programs
- only companies can manage their own programs
- only admins can approve companies or manage all users

### 2. User Management
The backend should support:

- student accounts
- company accounts
- admin accounts
- company request approval flow
- profile updates
- password change
- future support for forgot password / reset password

### 3. Program Management
The backend should support:

- create new program
- update program
- delete program
- mark program as completed
- fetch all programs
- fetch company-specific programs
- fetch student-visible programs

### 4. Applications / Participants Management
The backend should support:

- student applies to a program
- prevent invalid duplicate applications
- company reviews student applications
- company adds note and status
- admin reviews company decisions
- admin controls whether the result is visible to the student

### 5. Company Request Workflow
The backend should support:

- submit company request form
- save company request in database
- admin review request
- approve / reject / mark as review
- when approved, create company account
- send company email and password or activation flow

### 6. Admin Management
The backend should support:

- viewing all users
- viewing all programs
- viewing all companies
- viewing all applications
- changing user status
- creating admins or company/student accounts if needed

---

## Database Requirements

A relational database such as **MySQL** or **PostgreSQL** would fit this project well.

### Main tables needed

#### Users
Stores all system users.

Suggested fields:
- id
- system_id
- name
- email
- password_hash
- role
- status
- phone
- location
- created_at
- updated_at

#### Students
Stores student-specific information.

Suggested fields:
- id
- user_id
- student_id
- university_name
- major
- year
- gender
- country
- skills

#### Companies
Stores company-specific information.

Suggested fields:
- id
- user_id
- company_id
- industry
- website
- company_size
- founded_year
- contact_person
- internship_availability

#### Admins
Stores admin-specific information.

Suggested fields:
- id
- user_id
- admin_id
- job_title
- language
- gender
- country
- additional_info

#### Company Requests
Stores companies that request to join the platform before approval.

Suggested fields:
- id
- company_name
- industry
- official_email
- phone_number
- website
- company_size
- location
- founded_year
- contact_person
- company_description
- join_reason
- status
- submitted_at
- reviewed_at

#### Programs
Stores training programs created by companies.

Suggested fields:
- id
- company_id
- title
- subtitle
- description
- rules
- seats
- location
- image_url
- date_from
- date_to
- status
- created_at
- updated_at

#### Applications
Stores student applications to programs.

Suggested fields:
- id
- student_id
- program_id
- company_status
- company_note
- admin_status
- visible_to_student
- applied_at
- updated_at

---

## Suggested API Groups

The backend can be organized into these route groups:

- `/api/auth`
- `/api/users`
- `/api/students`
- `/api/companies`
- `/api/company-requests`
- `/api/programs`
- `/api/applications`
- `/api/admin`

---

## Frontend Files That Will Need Updates Later

When backend is added, these frontend files will need updates because they currently use mock data or local logic.

### Authentication
- `src/context/AuthContext.jsx`
- `src/components/auth/ProtectedRoute.jsx`
- `src/components/auth/PublicOnlyRoute.jsx`
- `src/pages/authentication/Login.jsx`
- `src/data/mockUsers.js`

### Student Pages
- `src/pages/student/StudentHome.jsx`
- `src/pages/student/StudentApplications.jsx`
- `src/pages/student/StudentProfile.jsx`
- any student modal or filter logic using fake data

### Company Pages
- `src/pages/company/CompanyDashboard.jsx`
- `src/pages/company/CompanyPrograms.jsx`
- `src/pages/company/CompanyParticipants.jsx`
- `src/pages/company/CompanyProfile.jsx`
- `src/pages/company/CompanyRequestForm.jsx`

### Admin Pages
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/AdminPrograms.jsx`
- `src/pages/admin/AdminParticipants.jsx`
- `src/pages/admin/AdminCompanies.jsx`
- `src/pages/admin/AdminUsers.jsx`
- `src/pages/admin/AdminProfile.jsx`

### Data Files That Will Be Replaced by APIs
- `src/data/companyData.js`
- `src/data/adminData.js`
- `src/data/mockUsers.js`

---

## What Will Change in the Frontend After Backend Integration

The frontend will stop depending on static local arrays and instead:

- fetch data from backend APIs
- send create / update / delete requests to backend
- store authenticated user token or session
- use backend role data instead of fake role selection
- load dashboards from real database values
- load programs, users, participants, and company requests dynamically

---

## Recommended Backend Stack

A good backend stack for this project would be:

- **Node.js**
- **Express.js**
- **MongoDB** or **MySQL / PostgreSQL**
- **JWT** or session-based authentication
- **bcrypt** for password hashing

If you want a relational design and clearer role-based records, MySQL or PostgreSQL is a strong choice.

---

## Final Goal

After backend integration, Tadreeb should become a real secure system where:

- users log in with real credentials
- roles are validated on the server
- all dashboards show real data
- company requests are saved and reviewed properly
- program applications are managed correctly
- admin controls the full system safely