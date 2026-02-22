# Backend (Codeshare)

Express + Socket.IO server for room management and real-time collaboration.

## What It Does
- Generates room IDs
- Handles join/send/disconnect socket events
- Persists latest room content to PostgreSQL

## Tech Stack
- Node.js
- Express 5
- Socket.IO
- PostgreSQL (`pg`)
- Helmet + CORS

## Setup
1. Install dependencies:
```bash
npm install
```
2. Create `.env`:
```env
PORT=80
PGHOST=your-db-host
PGPORT=5432
PGUSER=your-db-user
PGPASSWORD=your-db-password
PGDATABASE=your-db-name
PGSSLMODE=require
```
3. Create table:
```sql
CREATE TABLE IF NOT EXISTS workspace (
  room_id VARCHAR(255) PRIMARY KEY,
  data TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
4. Start server:
```bash
npm run dev
```

## API
- `GET /generateRoom` -> returns generated room string

## Socket Events
- `join-room` join a room and fetch saved data
- `send-data` broadcast editor content to room
- `disconnecting` flush pending debounced saves

## Key Files
- `server.js` HTTP + Socket.IO bootstrap
- `app.js` Express app config
- `sockets/roomHandlers.js` socket event handlers
- `helper/helperFuncs.js` debounce + DB save/fetch
- `db/db.js` PostgreSQL pool config

## Future Improvements
- JWT auth and protected rooms
- Rate limiting and abuse protection
- Validation layer for all events
- Structured logging + observability
- Integration tests for socket workflows
