# Virtual Event Backend (CommonJS)

A minimal Express backend for virtual event management with authentication, built using **CommonJS** (`require` / `module.exports`) and tested with **Jest**.

---

## ✅ Features
- **User Authentication**: Register and login with hashed passwords (bcrypt) and JWT tokens.
- **Event Management**:
  - Create, update, delete events.
  - List all events.
  - Register for an event (with capacity checks).
- **Middleware**:
  - JWT-based authentication.
  - Centralized error handling.
- **Tests**:
  - Unit tests for controllers.
  - Integration tests for API endpoints using Supertest.

---

## 📂 Project Structure
```
virtual-event-backend-structured/
├── src/
│   ├── controllers/        # authController.js, eventController.js
│   ├── middleware/         # authMiddleware.js, errorMiddleware.js
│   ├── models/             # dataStore.js (in-memory)
│   ├── server.js           # Express app
│   └── index.js            # Entry point
├── routes/                 # authRoutes.js, eventRoutes.js
├── test/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run tests
```bash
npm test
```

### 3. Start the server
```bash
npm run start
# Server runs on http://localhost:3000
```

---

## 🔑 API Endpoints

### **Auth**
- `POST /api/auth/register`  
  **Body:** `{ "username": "alice", "password": "password123" }`
- `POST /api/auth/login`  
  **Body:** `{ "username": "alice", "password": "password123" }`  
  **Response:** `{ "token": "<JWT>" }`

### **Events**
- `GET /api/events`  
- `POST /api/events` *(requires Bearer token)*  
- `PUT /api/events/:id` *(requires Bearer token)*  
- `DELETE /api/events/:id` *(requires Bearer token)*  
- `POST /api/events/:id/register` *(requires Bearer token)*  

---

## 🧪 Testing
- **Unit tests**: Validate controller logic.
- **Integration tests**: Validate full API flow (register → login → create event → list events).

---

## ⚙️ Tech Stack
- **Node.js**, **Express**
- **bcrypt** for password hashing
- **jsonwebtoken** for JWT auth
- **Jest** + **Supertest** for testing

---

## ✅ Notes
- Uses **in-memory datastore** (`dataStore.js`). Restarting the server resets data.
- For production, replace with a database (MongoDB, PostgreSQL, etc.).
- JWT secret is hardcoded (`SECRET = 'secretkey'`). Use `.env` for real apps.

---

### Author
Built for quick setup and testing of virtual event APIs using CommonJS.
