# CUSAT ToDoList

A full-stack academic productivity application for CUSAT students. The project pairs a React + Vite client with a Django REST Framework API.

## Current progress

Phases 1 through 6 are complete: the responsive application shell, authentication, dashboard, task workflows, subjects, calendar/timetable, analytics, profile, settings, dark mode, notes/resources, and Django REST API integration.

The React client uses JWT authentication and reads and writes planner data through the Django API. The development database is SQLite and can later be swapped for PostgreSQL or MySQL through Django settings.

## Local development

### Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py seed_planner_data --email admin
python manage.py runserver 127.0.0.1:8018
```

The API health endpoint is available at `http://127.0.0.1:8018/api/health/`.

### Frontend

```powershell
cd frontend
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

For the preconfigured development administrator account, open `http://127.0.0.1:5173/login` and sign in with `admin` / `admin123@`. The Django admin is available at `http://127.0.0.1:8018/admin/` with the same credentials.

## API endpoints

- `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/logout/`
- `GET` / `PUT /api/auth/profile/` and `GET` / `PUT /api/auth/preferences/`
- `GET` / `POST /api/tasks/`, with detail, delete, and status update routes
- `GET` / `POST /api/subjects/`, with update and delete routes
- `GET` / `POST /api/notes/`, with filtered search, upload, update, delete, and authenticated download routes
- `GET /api/dashboard/`, `GET /api/calendar/`, and `GET /api/statistics/`

## Project layout

```text
frontend/  React single-page application
backend/   Django REST API
```

The backend ships with a seeded local administrator for development only. Change these credentials before any deployment.
