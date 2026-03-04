# Tadreeb

Tadreeb is a national training platform that connects university students with cooperative and field training opportunities at companies across Kuwait. It allows students to find internships, companies to post opportunities, and universities to track student progress.

## Team Members

- Abdullah Al-Mekhyal
- [Team Member 2]
- [Team Member 3]

## Project Structure

```
Tadreeb/
├── frontend/          # HTML, CSS, JS files
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── backend/           # Node.js server
│   └── src/
│       ├── app.js
│       └── routes/
├── database/          # SQL files
│   └── schema.sql
├── docs/              # Project documentation
└── README.md
```

## How to Run

### Frontend

1. Open `frontend/index.html` in your browser
2. Or use **Live Server** extension in VS Code:
   - Right-click `index.html` → "Open with Live Server"

### Backend

```bash
cd backend
npm install
npm start
```

Server runs at `http://localhost:3000`

### Database

- Schema location: `database/schema.sql`
- Import the schema into your MySQL database

---

## Branch Workflow

| Branch | Purpose |
|--------|---------|
| `main` | Final stable version |
| `dev` | Team integration branch |
| `feature/*` | Individual feature branches |

### How We Work

1. Create a feature branch from `dev`
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Push your changes
   ```bash
   git add .
   git commit -m "Add your message"
   git push -u origin feature/your-feature-name
   ```

3. Open a Pull Request to `dev`

4. After testing, merge `dev` → `main`

### Branch Naming Examples

- `feature/student-login`
- `feature/opportunity-filter`
- `feature/admin-approve-students`
- `fix/cv-upload-bug`

---

## Course

CS335 - Web Development  
Kuwait University
