# 🚀 TaskFlow — Production-Grade Task Management App

A full-stack task management application built with React, Node.js, Express, and MongoDB.

## 📁 Project Structure

```
taskflow/
├── backend/          # Node.js + Express API
│   ├── config/       # Database connection
│   ├── controllers/  # Route logic
│   ├── middleware/   # Auth, error, validation
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── server.js     # Entry point
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # React context (Auth)
        ├── pages/       # Route pages
        └── utils/       # Axios instance
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and a strong JWT_SECRET
npm run dev
# API running at http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

## 🔑 Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/tasks | Get tasks (filter/search/paginate) |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get single task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/bulk-status | Bulk update statuses |

### Query Parameters for GET /api/tasks
- `status` — Pending | In Progress | Completed
- `priority` — Low | Medium | High
- `search` — search in title/description
- `page` — page number (default: 1)
- `limit` — results per page (default: 10, max: 50)
- `sortBy` — field to sort by (default: createdAt)
- `sortOrder` — asc | desc

## ✅ Features
- JWT Authentication (register/login)
- Full CRUD for tasks
- Filters: status, priority, search
- Pagination
- List & Kanban views
- Drag-and-drop in Kanban
- Dark mode toggle
- Toast notifications
- Loading skeletons
- Responsive design
- Role-based access (user/admin)
- Input validation
- Error handling middleware
