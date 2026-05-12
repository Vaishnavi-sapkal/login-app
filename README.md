# 🔐 Login App — Node.js + Express + MongoDB

A complete login/register system with session-based authentication and MongoDB storage.

## 📁 Project Structure

```
login-app/
├── server.js               ← Main entry point
├── package.json
├── .env                    ← Environment variables (MongoDB URI, secret)
├── .gitignore
│
├── models/
│   └── User.js             ← Mongoose user schema (password auto-hashed)
│
├── routes/
│   ├── auth.js             ← POST /auth/login, /auth/register, /auth/logout
│   └── dashboard.js        ← GET /dashboard, /dashboard/me
│
├── middleware/
│   └── auth.js             ← isAuthenticated, isGuest guards
│
└── public/
    ├── login.html          ← Login page UI
    ├── register.html       ← Register page UI
    └── dashboard.html      ← Dashboard (protected)
```

## ⚙️ Setup

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`)  
  OR use MongoDB Atlas (cloud) — just paste the URI in `.env`

### 2. Install dependencies
```bash
cd login-app
npm install
```

### 3. Configure environment
Edit `.env`:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/loginapp
SESSION_SECRET=change_this_to_a_long_random_string
```

For **MongoDB Atlas**, replace MONGO_URI with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/loginapp
```

### 4. Start the server
```bash
# Normal
node server.js

# With auto-restart on file changes (dev mode)
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 🔄 How It Works

### Flow
```
/ (root)
  └─ If not logged in → login.html
  └─ If logged in     → redirect to /dashboard

POST /auth/register
  └─ Validate input
  └─ Hash password with bcrypt (12 rounds)
  └─ Save user to MongoDB
  └─ Create session → redirect to dashboard

POST /auth/login
  └─ Find user by email
  └─ Compare password with bcrypt
  └─ Create session → redirect to dashboard

GET /dashboard   (protected by isAuthenticated middleware)
  └─ If no session → redirect to login
  └─ Serves dashboard.html

GET /dashboard/me
  └─ Returns logged-in user's info as JSON

POST /auth/logout
  └─ Destroys session
  └─ Redirects to login
```

### Security Features
- ✅ Passwords hashed with **bcrypt** (12 salt rounds)
- ✅ Sessions stored in **MongoDB** (persist across restarts)
- ✅ **httpOnly** cookies (XSS protection)
- ✅ Protected routes via middleware
- ✅ Input validation on both client & server
- ✅ Duplicate email detection

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| express | Web framework |
| mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| express-session | Session management |
| connect-mongo | Store sessions in MongoDB |
| dotenv | Load .env variables |
| nodemon | Auto-restart in dev |
