# Frontend (Codeshare)

React + TypeScript client for real-time collaborative editing.

## What It Does
- Connects to backend via REST + Socket.IO
- Generates or uses room URL
- Renders Monaco editor and syncs content live

## Demo / Screenshot
![Frontend Demo](../docs/demo.gif)

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Monaco Editor
- Socket.IO Client
- Axios

## Setup
1. Install dependencies:
```bash
npm install
```
2. Create `.env`:
```env
VITE_BACKEND_URL=http://localhost:80
```
3. Start dev server:
```bash
npm run dev
```

## Key Files
- `src/views/home/Home.tsx` room + socket lifecycle
- `src/views/home/components/editor/Editor.tsx` Monaco integration
- `src/api/AxiosPrivate.tsx` API client
- `src/routes/Routes.tsx` app routing

## Features
- Auto room creation on `/`
- Room rejoin by direct URL
- Live code sync across connected users
- Initial room state hydrate from backend

## Future Improvements
- Complete login/auth flow
- Better error/connection UI
- Theme/language switcher for editor
- Frontend test coverage
