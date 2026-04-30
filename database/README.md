# Tadreeb Database Copy

This folder contains a JSON copy of the test database for course evaluation.

## Included File

| File | Purpose |
| --- | --- |
| `tadreeb-database-copy.json` | Exported MongoDB collections for the Tadreeb test database |

## Test Login Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@tadreeb.com` | `Admin123!` |
| Student | `student@tadreeb.com` | `Student123!` |
| Company | `company@tadreeb.com` | `Company123!` |

The JSON file stores password fields as bcrypt hashes, not plain text.

## Regenerate The Export

From the backend folder:

```bash
npm run db:export
```

This uses `backend/.env` and exports the current MongoDB database into this folder.

## Import This Copy

To replace the configured MongoDB database with this JSON copy:

```bash
cd backend
npm run db:import-copy
```

This command deletes and recreates the exported Tadreeb collections in the database configured by `backend/.env`.
