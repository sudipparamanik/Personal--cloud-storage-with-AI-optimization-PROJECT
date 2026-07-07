# ☁️ Personal Cloud Storage with AI Optimization

> A full-stack cloud storage platform with intelligent AI-powered features — built to store, manage, and understand your files smarter.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel" />
  <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render" />
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square" />
</p>

---

## 🚀 Live Demo

| Service | URL |
|--------|-----|
| 🌐 Frontend | [View on Vercel](#) |
| ⚙️ Backend API | [View on Render](#) |

---

## 📌 About the Project

**Personal Cloud Storage with AI Optimization** is a production-ready web application that allows users to securely upload, manage, and interact with their files in the cloud. What sets it apart is its layer of **AI-powered intelligence** — users can ask questions about their files, get instant summaries, and search using natural language instead of exact filenames.

Built with a **React frontend**, **Node.js/Express backend**, **MongoDB** for metadata, and **AWS S3** for file storage — with full **JWT-based authentication** and a clean dashboard UI.

---

## ✨ Features

### 🔐 Authentication
- User Registration & Login
- JWT-based secure authentication
- Password hashing with **bcrypt**
- Protected routes on both frontend and backend

### 📁 File Management
- Upload files directly to **AWS S3**
- Download files with a single click
- Delete files from cloud storage
- View all files in a personal dashboard with metadata (name, size, type, date)

### 🤖 AI Optimization Features
- **Ask About Files** — Chat with AI to get answers about your stored documents
- **AI Document Summarization** — Instantly summarize long documents
- **Smart AI Search** — Search files using natural language queries instead of exact names
- **AI File Categorization** — Files are automatically categorized by type and content

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js |
| **Styling** | CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password Security** | bcrypt |
| **Cloud Storage** | AWS S3 |
| **API Testing** | Postman |
| **Frontend Deployment** | Vercel |
| **Backend Deployment** | Render |

---

## 🏗️ System Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│     React Frontend  │ ──────► │  Express.js Backend  │
│     (Vercel)        │ ◄────── │  (Render)            │
└─────────────────────┘         └──────────┬───────────┘
                                           │
                      ┌────────────────────┼─────────────────────┐
                      ▼                    ▼                     ▼
             ┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
             │   MongoDB   │     │   AWS S3     │     │   AI / Claude    │
             │  (Metadata) │     │ (File Store) │     │   (Smart Layer)  │
             └─────────────┘     └──────────────┘     └──────────────────┘
```

---

## 📂 Project Structure

```
personal-cloud-storage/
│
├── frontend/                  # React Application
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Login, Register, Dashboard
│       ├── api.js             # Centralized API helper
│       └── App.js
│
└── backend/                   # Express.js API Server
    ├── controllers/           # Route logic
    ├── middleware/            # JWT auth middleware
    ├── models/                # Mongoose schemas
    ├── routes/                # Auth & file routes
    └── server.js              # Entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- AWS account with S3 bucket
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/sudipparamanik/personal-cloud-storage.git
cd personal-cloud-storage
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `/frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

### 4. Open the App

Visit `http://localhost:3000` in your browser.

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### File Routes *(Protected — requires JWT)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files` | Get all files for logged-in user |
| POST | `/api/files/upload` | Upload a file to AWS S3 |
| GET | `/api/files/download/:id` | Download a specific file |
| DELETE | `/api/files/:id` | Delete a file from S3 |

### AI Routes *(Protected)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/ask` | Ask a question about a file |
| POST | `/api/ai/summarize` | Summarize a document |
| POST | `/api/ai/search` | Smart search across files |

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt** before storing in MongoDB
- All protected routes validated with **JWT middleware**
- AWS S3 files are accessed via **signed URLs** — not publicly exposed
- Environment variables used for all secrets — never hardcoded

---

## 🚢 Deployment

| Part | Platform | Notes |
|------|----------|-------|
| Frontend | **Vercel** | Auto-deploys on push to `main` |
| Backend | **Render** | Persistent Node.js server |
| Database | **MongoDB Atlas** | Cloud-hosted |
| Storage | **AWS S3** | Production bucket |

---

## 🧪 Testing

API endpoints tested with **Postman** for:
- Auth flow (register → login → get token)
- File upload/download/delete with JWT headers
- AI route responses

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 👨‍💻 Author

**Sudip Paramanik**
- GitHub: [@sudipparamanik](https://github.com/sudipparamanik)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by Sudip Paramanik</p>
