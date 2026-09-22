# Task Management App

A full-stack Task Management Application built using the MERN Stack.  
Users can register, login, and manage their daily tasks with a clean and responsive interface.

---

## Features

- User Registration & Login
- JWT based Authentication
- Secure Password Hashing using bcrypt
- Pre-Seeded Test Accounts & Quick-Fill Login
- Create Tasks
- View Tasks & Task Details
- Edit & Delete Tasks
- Task Status Management (Pending, In Progress, Completed)
- Search & Filtering (Status, Priority, Date Sorting)
- Responsive UI
- Light/Dark Mode Theme
- Toast Notifications & Metrics Breakdown Charts
- MongoDB Database Integration & DNS Resolution Fix (querySrv ECONNREFUSED)

---

## Tech Stack

### Frontend

- React.js (v19)
- Vite
- CSS
- Axios
- React Router (v7)
- Redux Toolkit

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

## Test Credentials (Pre-Seeded)

| Role | Email | Password |
| :--- | :--- | :--- |
| Standard User | `testuser@example.com` | `Test@1234` |
| Admin User | `admin@example.com` | `Admin@1234` |

---

## Project Structure

```text
Task-Management-App
│
├── client
│   ├── src
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/vinay6672/task-team-management.git
cd task-team-management
```

### Backend Setup

Go to server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://patilvinay2025_db_user:patilvinay6672@cluster0.84rbhjs.mongodb.net/taskManagement?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_task_management_2026_intern
JWT_EXPIRE=30d
```

Seed initial database test accounts & tasks:

```bash
npm run seed
```

Run backend:

```bash
npm run dev
```

### Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Open browser at `http://localhost:5173`.

---

## Author

Vinay Patil

GitHub:  
[https://github.com/vinay6672](https://github.com/vinay6672)

---
##  Live Demo

 **Frontend:** [Open Live Application](https://task-team-management-frontend-git-main-a-e7f9.vercel.app)

**Backend API:** [Backend API](https://task-team-management-0645.onrender.com)

## API Documentation

Postman Collection:  
`Task-Management-API.postman_collection.json`
