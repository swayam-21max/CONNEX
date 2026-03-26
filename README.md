# CONNEX 📇

A production-grade **Contact Management Web App** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Clean architecture, dark glassmorphism UI, and full CRUD operations.

---

## ✨ Features

- **Full CRUD** — Create, Read, Update, Delete contacts
- **Live Search** — Filter by name, email, or company with debounced input
- **Responsive Grid** — Beautiful card layout that works on all screen sizes
- **Form Validation** — Client-side + server-side validation with clear error messages
- **Toast Notifications** — Success and error feedback on every action
- **Initials Avatars** — Auto-generated colored avatar if no photo URL is provided
- **Glassmorphism UI** — Premium dark theme with smooth CSS animations

---

## 🏗️ Project Structure

```
INGLU/
├── server/                    ← Node.js + Express API
│   ├── controllers/
│   │   └── contactController.js
│   ├── middleware/
│   │   ├── errorHandler.js    ← Centralized error handler
│   │   └── validate.js        ← express-validator rules
│   ├── models/
│   │   └── Contact.js         ← Mongoose schema
│   ├── routes/
│   │   └── contactRoutes.js
│   ├── .env                   ← Environment config (gitignored)
│   ├── .env.example
│   └── server.js              ← Entry point
│
└── client/                    ← React + Vite frontend
    └── src/
        ├── api/
        │   └── contactService.js  ← Axios service layer
        ├── components/
        │   ├── Avatar.jsx
        │   ├── ConfirmModal.jsx
        │   ├── ContactCard.jsx
        │   ├── ContactForm.jsx
        │   ├── EmptyState.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── SearchBar.jsx
        │   └── Toast.jsx
        ├── context/
        │   └── ContactContext.jsx  ← useReducer + Context API
        ├── hooks/
        │   └── useDebounce.js
        ├── pages/
        │   └── ContactsPage.jsx
        ├── App.jsx
        └── index.css              ← Vanilla CSS design system
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` in the `/server` folder and fill in your values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/contactsdb
```

> **Atlas example:** `MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/contactsdb`

### 3. Run the App

Open **two terminals**:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts` | List all contacts |
| GET | `/contacts?search=john` | Search by name, email, company |
| GET | `/contacts/:id` | Get a single contact |
| POST | `/contacts` | Create a contact |
| PUT | `/contacts/:id` | Update a contact |
| DELETE | `/contacts/:id` | Delete a contact |
| GET | `/health` | Health check |

### Contact Schema

```json
{
  "name":    "string (required, 2–100 chars)",
  "email":   "string (required, valid email, unique)",
  "phone":   "string (optional, E.164 format)",
  "company": "string (optional, max 100 chars)",
  "role":    "string (optional, max 100 chars)",
  "avatar":  "string (optional, image URL)"
}
```

### Example Responses

**POST /api/contacts** — `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1 555 000 0000",
    "company": "Acme Corp",
    "role": "Engineer",
    "avatarColor": "#6366f1",
    "createdAt": "2026-03-26T08:00:00.000Z",
    "initials": "JD"
  }
}
```

**Validation Error** — `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please enter a valid email address" }
  ]
}
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js |
| API Framework | Express.js |
| Database | MongoDB + Mongoose |
| Validation | express-validator |
| Frontend Framework | React 19 + Vite |
| State Management | Context API + useReducer |
| HTTP Client | Axios |
| Styling | Vanilla CSS (custom design system) |
| Routing | React Router DOM v7 |

---

## 🎨 Design Highlights

- **Dark glassmorphism** theme with CSS backdrop-filter
- **CSS Custom Properties** for a consistent design token system
- **Staggered card animations** using `animation-delay`
- **FAB button** with rotate-on-hover microanimation
- **Toast notifications** with slide-in/fade-out
- **Fully responsive** — mobile-first breakpoints at 480px and 768px
- **No CSS framework** — 100% hand-crafted vanilla CSS

---

## 📝 License

MIT — use freely for learning, interviews, and production.
