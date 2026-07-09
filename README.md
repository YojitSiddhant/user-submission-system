# Submission System Monorepo

This repository contains a production-ready document submission system split into three parts:

- `frontend/` - Next.js App Router user site and admin dashboard
- `backend/` - Express.js REST API with MySQL and file uploads
- `storage/` - SQL scripts used to create the database and tables

## Architecture

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Express.js + Node.js
- Database: MySQL
- Uploads: Multer

The frontend and backend are intentionally separated so each service can be deployed independently.

## Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Database Setup

The SQL schema lives in `storage/schema.sql`.

Run it against your local MySQL server before starting the backend:

```bash
mysql --socket=/tmp/mysql.sock -u root < storage/schema.sql
```

If your MySQL server uses a different host or socket, update `backend/.env` accordingly.

## Deployment

### Vercel

Deploy the `frontend/` folder as the Vercel project root.

- Root directory: `frontend`
- Framework: Next.js
- Build command: `npm run build`
- Install command: `npm install`

### Railway

Deploy the `backend/` folder as the Railway service root.

- Root directory: `backend`
- Start command: `npm start`
- Health check path: `/health`

## Environment Variables

Frontend:

- `NEXT_PUBLIC_API_BASE_URL`

Backend:

- `PORT`
- `FRONTEND_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_SOCKET`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `UPLOAD_DIR`
- `MAX_UPLOAD_SIZE_BYTES`

## Notes

- The backend serves uploaded files from `backend/uploads/`.
- The admin dashboard uses the same API as the user form; only the UI differs.
- The browser tab title is `Submission System`.
