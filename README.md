# Vault — file storage app

- `backend/` — Express + MongoDB + S3, JWT cookie auth
- `frontend/` — React + Vite dashboard

## Setup

### Backend
```
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, AWS_* values
npm run dev            # or: npm start
```
Runs on http://localhost:5000

### Frontend
```
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173

Open http://localhost:5173, register an account, and start uploading files.
The frontend talks to the backend over cookies (`credentials: "include"`),
so both must be running for anything to work.
