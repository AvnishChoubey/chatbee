# 💬 ChatBee

A real-time full-stack chat application built with the MERN stack and Socket.IO — containerized with Docker.

![Node](https://img.shields.io/badge/Node.js-18-green?logo=node.js) ![React](https://img.shields.io/badge/React-17-blue?logo=react) ![MongoDB](https://img.shields.io/badge/MongoDB-6-green?logo=mongodb) ![Socket.IO](https://img.shields.io/badge/Socket.IO-4-black?logo=socket.io) ![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)

---

## ✨ Features

- 🔐 User authentication (signup / login) with bcrypt password hashing
- 💬 Public chat rooms — General, Techtalks, TeamWorks, Crypto
- 🔒 Private 1-on-1 messaging between members
- ⚡ Real-time messaging via Socket.IO
- 🔔 Unread message notifications per room and per user
- 🟢 Live online / offline member status
- 🖼️ Profile picture upload via Cloudinary
- 🐳 Fully containerized with Docker Compose

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Compose                       │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   Frontend   │    │   Backend    │    │   MongoDB    │   │
│  │  React SPA   │◄──►│  Express +   │◄──►│  (mongo:6)   │   │
│  │  nginx:80    │    │  Socket.IO   │    │  port 27017  │   │
│  │              │    │  port 3000   │    │              │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │                   │                               │
│    HTTP/nginx           REST + WS                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Application Flow

### Authentication Flow

```
User                  Frontend              Backend              MongoDB
 │                       │                     │                    │
 ├──── Fill Signup ─────►│                     │                    │
 │                       ├── POST /users ─────►│                    │
 │                       │                     ├── bcrypt hash ────►│
 │                       │                     │◄── user saved ─────┤
 │                       │◄── user object ─────┤                    │
 │                       ├── Redux persist ────►(localStorage)      │
 │◄── Redirect /chat ────┤                     │                    │
```

### Real-time Messaging Flow

```
User A                Socket.IO             User B
  │                      │                    │
  ├── join-room ────────►│                    │
  │                      ├── join-room ──────►│
  │                      │                    │
  ├── message-room ─────►│                    │
  │                      ├── save to MongoDB  │
  │                      ├── room-messages ──►│ (all in room)
  │◄── room-messages ────┤                    │
  │                      ├── notifications ──►│ (other rooms)
```

### Private Messaging Flow

```
User A clicks User B
       │
       ▼
orderIds(A._id, B._id)  →  deterministic room ID  →  join-room(roomId)
       │
       ▼
Messages stored in MongoDB with to: "<id1>-<id2>"
```

---

## 📁 Project Structure

```
ChatBee/
├── docker-compose.yml              # Orchestrates all 3 services
│
├── backend/
│   ├── Dockerfile                  # node:18-alpine + build tools
│   ├── server.js                   # Express + Socket.IO entry point
│   ├── connection.js               # MongoDB connection (MONGO_URI / Atlas)
│   ├── routes/
│   │   └── userRoutes.js           # POST /users, POST /users/login
│   └── models/
│       ├── User.js                 # name, email, password, picture, status
│       └── Message.js              # content, from, time, date, to (room)
│
└── frontend/
    ├── Dockerfile                  # Multi-stage: node build → nginx:alpine
    ├── nginx.conf                  # SPA routing (try_files → index.html)
    └── src/
        ├── context/appContext.js   # Socket.IO client + React context
        ├── features/userSlice.js   # Redux: user state + notifications
        ├── services/appApi.js      # RTK Query: signup, login, logout
        ├── store.js                # Redux store + redux-persist
        ├── components/
        │   ├── Navigation.js/css   # Sticky navbar
        │   ├── Sidebar.js/css      # Rooms + members panel
        │   └── MessageForm.js/css  # Chat area + input
        └── pages/
            ├── Home.js/css         # Landing hero page
            ├── Chat.js/css         # Full-height chat layout
            ├── Login.js            # Sign in form
            ├── Signup.js           # Register + Cloudinary upload
            └── Auth.css            # Shared auth card styles
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 17, Redux Toolkit, RTK Query, redux-persist |
| Styling | Custom CSS (dark theme, CSS variables, glassmorphism) |
| Routing | React Router v6 |
| Real-time | Socket.IO client v4 |
| Backend | Node.js 18, Express 4 |
| Real-time | Socket.IO server v4 |
| Database | MongoDB 6 via Mongoose |
| Auth | bcrypt (password hashing), Redux persist (session) |
| Image Upload | Cloudinary REST API |
| Containerization | Docker, Docker Compose |
| Web Server | nginx:alpine (SPA serving) |

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Run with Docker

```bash
# 1. Clone the repo
git clone git@github.com:AvnishChoubey/ChatBee.git
cd ChatBee

# 2. Create backend environment file
cp backend/.env.example backend/.env

# 3. Build and start all services
docker-compose up --build -d

# 4. Open in browser
open http://localhost
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:3000 |
| MongoDB | mongodb://localhost:27017 (internal) |

### Stop

```bash
docker-compose down
```

### Stop and remove data

```bash
docker-compose down -v
```

---

## ⚙️ Environment Variables

### `backend/.env`

```env
PORT=3000

# Option 1: Use Docker local MongoDB (default in docker-compose)
MONGO_URI=mongodb://mongo:27017/chatbee

# Option 2: Use MongoDB Atlas
# DB_USER=your_atlas_username
# DB_PW=your_atlas_password
```

### Frontend (build-time)

Set in `docker-compose.yml` under `frontend.build.args`:

```env
REACT_APP_API_URL=http://localhost:3000
```

---

## 🔌 API Reference

### REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users` | Register new user |
| `POST` | `/users/login` | Login, sets status online |
| `DELETE` | `/logout` | Logout, sets status offline |
| `GET` | `/rooms` | List all public rooms |

### Socket.IO Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `new-user` | emit → server | — | Announce presence, get member list |
| `new-user` | server → clients | `User[]` | Updated member list |
| `join-room` | emit → server | `newRoom, prevRoom` | Switch rooms |
| `room-messages` | server → client | `MessageGroup[]` | Messages for joined room |
| `message-room` | emit → server | `room, content, sender, time, date` | Send a message |
| `notifications` | server → others | `room` | New message in a room |

---

## 🐳 Docker Details

```
┌─────────────────────────────────────────────────────┐
│  docker-compose.yml                                 │
│                                                     │
│  mongo      → mongo:6          port 27017 (internal)│
│  backend    → node:18-alpine   port 3000            │
│  frontend   → nginx:alpine     port 80              │
│                                                     │
│  Volume: mongo_data (persistent MongoDB data)       │
│  Network: chatbee_default (internal bridge)         │
└─────────────────────────────────────────────────────┘
```

**Backend Dockerfile** — installs `python3 make g++` for bcrypt native compilation on ARM64 (Apple Silicon).

**Frontend Dockerfile** — multi-stage build:
1. `node:18-alpine` builds the React app with `REACT_APP_API_URL` baked in
2. `nginx:alpine` serves the static build with SPA routing

---

## 🐛 Bugs Fixed

| Bug | Fix |
|---|---|
| `app.delete('/logout')` registered inside `io.on('connection')` — new route on every socket | Moved outside socket handler |
| Duplicate `handleSubmit` in MessageForm | Removed dead first declaration |
| Hardcoded Netlify URL in `Sidebar.js` and `appContext.js` | Replaced with `REACT_APP_API_URL` env var |
| `==` loose equality throughout | Changed to `===` |
| Missing `alt` props on images | Added throughout |
| `bcrypt` fails to build on ARM64 Alpine | Added `python3 make g++` to Dockerfile |
| Bootstrap overriding dark theme | Moved Bootstrap import before `index.css` |

---

## 📸 Screenshots

| Home | Chat |
|---|---|
| Hero landing page with mock chat preview | Dark Discord-style chat with rooms & members |

---

## 📄 License

MIT