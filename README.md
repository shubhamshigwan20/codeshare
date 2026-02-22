# Codeshare

Real-time collaborative code editor where multiple users can join the same room and edit code together live.

## 30-Second Overview

- Problem: share code changes instantly with another developer.
- Solution: room-based editor with WebSockets + PostgreSQL persistence.
- Stack: React + Monaco + Socket.IO + Express + Postgres.
- Entry flow: open app -> room auto-generated -> share URL -> collaborate.

## Screenshots / Demo

![Codeshare Demo](./docs/demo.gif)
![Codeshare Editor](./docs/screenshot-home.png)

If these files are missing, add them at:

- `docs/demo.gif`
- `docs/screenshot-home.png`

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Monaco Editor, Socket.IO Client, Axios
- Backend: Node.js, Express 5, Socket.IO, PostgreSQL (`pg`), Helmet, CORS
- Database: PostgreSQL table `workspace` for room content persistence

## Features

- Room-based collaboration by URL (`/<roomId>`)
- Real-time editor sync using WebSockets
- Auto-load latest room content from database on join
- Debounced autosave to reduce DB write load
- Disconnect flush to persist pending edits

## Live Demo

- Frontend: `https://codeshare-x.pages.dev/`
- Backend API/WebSocket: `https://codeshare-backend-api.onrender.com`

## Local Setup

1. Clone the repo.
2. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Create backend `.env` in `backend/.env`:

```env
PORT=80
PGHOST=your-db-host
PGPORT=5432
PGUSER=your-db-user
PGPASSWORD=your-db-password
PGDATABASE=your-db-name
PGSSLMODE=require
```

4. Create frontend `.env` in `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:80
```

5. Create DB table:

```sql
CREATE TABLE IF NOT EXISTS workspace (
  room_id VARCHAR(255) PRIMARY KEY,
  data TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

6. Run backend:

```bash
cd backend
npm run dev
```

7. Run frontend:

```bash
cd frontend
npm run dev
```

## Project Structure

- `frontend/` React app and Monaco editor UI
- `backend/` Express API, Socket.IO handlers, DB helpers

## Future Improvements

- Authentication and private rooms
- Multi-language support (JS/TS/Python/etc.)
- Presence indicators and typing status
- Role-based permissions (read-only/editor)
- Copy room link UX and invite flow
- Room expiration and cleanup jobs
- Test coverage (unit + integration + e2e)
