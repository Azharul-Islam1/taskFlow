# TaskFlow — Kanban Board

> **Engineering Assignment — Option 3: Draggable Kanban Board**
> Full Stack Developer Intern | MEVN Stack (MongoDB, Express.js, Vue 3, Node.js)

---

## 📌 Project Overview

TaskFlow is an interactive task management board inspired by **Microsoft Teams Planner**, built with the MEVN stack. Users can create, manage, and drag tasks across three columns — **To Do**, **In Progress**, and **Done** — with real-time updates and full backend persistence.

### Features Implemented

- 🔐 JWT-based Authentication (Register / Login)
- 🖱️ Native HTML5 Drag & Drop with optimistic UI updates
- 📋 Activity Log (tracks every create, move, update, delete)
- 🏷️ Priority Tags (High / Medium / Low) with color indicators
- 📅 Due Dates — green (on time) / red (overdue)
- ✅ Checklist per task with progress bar
- 🔍 Real-time Search & Priority Filter
- 📝 Task Detail Panel — Teams Planner inspired slide-in panel
- 🎨 Clean light UI — Microsoft Teams Planner inspired

---

## 🛠️ Tech Stack

| Layer      | Technology                                           |
|------------|------------------------------------------------------|
| Frontend   | Vue 3 (Composition API), Pinia, Vue Router, Vite     |
| Backend    | Node.js, Express.js                                  |
| Database   | MongoDB Atlas                                        |
| Auth       | JWT (jsonwebtoken), bcryptjs                         |
| Styling    | Custom CSS (no framework)                            |

---

## 📁 Project Structure

```
taskFlow/
├── frontend/
│   ├── src/
│   │   ├── main.js
│   │   ├── App.vue
│   │   ├── assets/
│   │   │   └── main.css
│   │   ├── composables/
│   │   │   └── useApi.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── stores/
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── BoardView.vue
│   │   └── components/
│   │       ├── KanbanColumn.vue
│   │       ├── TaskCard.vue
│   │       ├── TaskModal.vue
│   │       ├── TaskDetailPanel.vue
│   │       └── ActivityLog.vue
│   └── package.json
│
└── backend/
    ├── server.js
    ├── .env
    ├── models/
    │   ├── User.js
    │   └── Task.js
    ├── routes/
    │   ├── auth.js
    │   └── tasks.js
    └── middleware/
        └── auth.js
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Azharul-Islam1/taskFlow.git
cd taskFlow
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
node server.js
```

You should see:
```
✅ MongoDB connected!
🚀 Server running on port 5000
```

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App will be running at:
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint    | Description        | Auth Required |
|--------|-------------|--------------------|---------------|
| POST   | `/register` | Register new user  | ❌            |
| POST   | `/login`    | Login, returns JWT | ❌            |

### Task Routes — `/api/tasks`

| Method | Endpoint                      | Description              | Auth Required |
|--------|-------------------------------|--------------------------|---------------|
| GET    | `/`                           | Get all tasks for user   | ✅            |
| POST   | `/`                           | Create a new task        | ✅            |
| PUT    | `/:id`                        | Update full task         | ✅            |
| PATCH  | `/:id/status`                 | Update task status only  | ✅            |
| PATCH  | `/:id/checklist/:checklistId` | Toggle checklist item    | ✅            |
| DELETE | `/:id`                        | Delete a task            | ✅            |

---

## 🔄 Data Flow

```
User Action (drag card)
        ↓
Pinia Store (tasks.js)
  → Optimistic UI update (instant column change)
  → PATCH /api/tasks/:id/status  { status: "inprogress" }
        ↓
Express Backend
  → JWT middleware verifies token
  → Task model updates MongoDB
        ↓
Response
  → Success → confirm UI state
  → Failure → rollback to original position
```

---

## 🗄️ Database Schema

### User Model
```js
{
  name:       String,
  email:      String (unique),
  password:   String (bcrypt hashed),
  timestamps: true
}
```

### Task Model
```js
{
  title:       String (required),
  description: String,
  status:      "todo" | "inprogress" | "done",
  priority:    "low" | "medium" | "high",
  dueDate:     Date,
  tags:        [String],
  checklist: [
    {
      text:    String,
      checked: Boolean
    }
  ],
  user:        ObjectId (ref: User),
  timestamps:  true
}
```

---

## 🚀 Features Demo

| Feature | Description |
|---|---|
| **Drag & Drop** | Native HTML5 drag events across columns |
| **Optimistic UI** | Instant feedback with automatic rollback on failure |
| **Task Detail Panel** | Teams-style slide-in panel with full task editing |
| **Checklist** | Add/toggle/delete checklist items with live progress bar |
| **Due Date Badge** | Green (on time) / Red (overdue) color coding |
| **Search** | Filters tasks by title/description in real-time |
| **Priority Filter** | Filter board by High / Medium / Low |
| **Activity Log** | Slide-in panel showing last 20 actions |
| **Auth** | JWT protected routes, persistent login via localStorage |

---

## 🏗️ Key Architectural Decisions

**1. Pinia for State Management**
Tasks are shared across `BoardView`, `KanbanColumn`, `TaskCard`, `TaskDetailPanel`, and `ActivityLog`. Pinia provides a clean centralized store without prop drilling.

**2. Optimistic UI for Drag & Drop**
When a user drags a card, the UI updates instantly before the API call completes. If the API fails, the task snaps back to its original column automatically.

**3. JWT Authentication**
All task API routes are protected via a custom Express middleware that verifies the Bearer token. The frontend Axios instance automatically attaches the token from localStorage and redirects to `/login` on 401 responses.

**4. Component Architecture**
- `BoardView` — orchestrates data fetching and event handling
- `KanbanColumn` — handles drag-over/drop events per column
- `TaskCard` — displays task data, emits drag/edit/delete events
- `TaskModal` — create new task
- `TaskDetailPanel` — full task editing with checklist
- `ActivityLog` — slide-in panel, reads from Pinia store

---

## 📹 Demo

> 🎥 [Watch Demo](https://www.loom.com/share/a4abdbcefc7e44d8bdc0984513da5719)

---

## 👤 Author

**Azharul Islam**
GitHub: [@Azharul-Islam1](https://github.com/Azharul-Islam1)
