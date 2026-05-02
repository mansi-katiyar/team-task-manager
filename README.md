# 🚀 Team Task Manager

A full-stack team task management application built with **Next.js 14**, **MongoDB**, and **Tailwind CSS**. Features JWT authentication, role-based access control (Admin/Member), project management, and task tracking.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss)

---

## ✨ Features

- **Authentication**: JWT-based signup/login with bcrypt password hashing
- **Role-Based Access**: Admin and Member roles with different permissions
- **Project Management**: Create projects, add team members
- **Task Management**: Create, assign, and track tasks with status updates
- **Dashboard**: Real-time stats with total, completed, pending, and overdue tasks
- **Premium UI**: Dark theme with glassmorphism, gradient accents, and micro-animations
- **Responsive**: Mobile-friendly with collapsible sidebar

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Auth | JWT (jose) + bcryptjs |
| Deployment | Railway-ready (standalone) |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **MongoDB** (local via MongoDB Compass or Atlas)

### 1. Clone & Install

```bash
cd team-task-manager
npm install
```

### 2. Configure Environment

Copy the example env file and update values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# For MongoDB Compass (local):
MONGODB_URI=mongodb://localhost:27017/team-task-manager

# Generate a strong secret for production:
JWT_SECRET=your-super-secret-key

NEXTAUTH_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running locally. If using **MongoDB Compass**:
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. The `team-task-manager` database will be created automatically

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Your First Account

1. Go to `/signup`
2. Create an account with role **Admin**
3. Start creating projects and tasks!

---

## 🔐 Roles & Permissions

| Action | Admin | Member |
|---|:---:|:---:|
| Create projects | ✅ | ❌ |
| Add team members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| View assigned tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ (own tasks) |
| View dashboard | ✅ | ✅ |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── auth/      # signup, login, me
│   │   ├── projects/  # CRUD + members
│   │   └── tasks/     # CRUD + overdue
│   ├── (dashboard)/   # Protected pages
│   │   ├── dashboard/ # Stats overview
│   │   ├── projects/  # Project management
│   │   └── tasks/     # Task management
│   ├── login/         # Login page
│   └── signup/        # Signup page
├── components/        # UI components
├── lib/               # DB, auth, middleware
└── models/            # Mongoose models
```

---

## 🚀 Deploy to Railway

1. Push code to GitHub
2. Create a new Railway project
3. Add a MongoDB plugin (or use Atlas URI)
4. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
5. Railway auto-detects Next.js and deploys

---

