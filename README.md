# Real-Time Live Q&A Wall

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Frontend](https://img.shields.io/badge/frontend-Vercel-black)
![Backend](https://img.shields.io/badge/backend-Render-informational)
![Database](https://img.shields.io/badge/database-MongoDB%20Atlas-green)
![WebSockets](https://img.shields.io/badge/realtime-Socket.IO-010101)

A full-stack, real-time Q&A platform inspired by tools like Slido and Mentimeter.

Hosts can create live events and manage audience questions, while participants can join using a simple six-digit event code, submit questions, and upvote questions they want answered.

All interactions are synchronized instantly across connected devices using **Socket.IO**, with no page refresh required.

---

## ✨ Live Demo

| Service                     | Link                                         |
| --------------------------- | -------------------------------------------- |
| 🌐 **Frontend Application** | https://liveqa-eta.vercel.app                |
| ⚙️ **Backend API**          | https://live-qa-wall.onrender.com/           |
| 💚 **API Health Check**     | https://live-qa-wall.onrender.com/api/health |

> **Note:** The backend is deployed on Render's free tier, so the first request after inactivity may take a few seconds while the server wakes up.

---

## 📸 Overview

The application is designed around two types of users:

### 🎤 Host

Hosts can:

* Register and log in securely
* Create live Q&A events
* Generate a unique six-digit event code
* Monitor questions in real time
* Pin important questions
* Mark questions as answered
* Archive questions
* Delete inappropriate questions
* End events
* Manage events from a live control panel

### 👥 Audience

Participants can:

* Join an event using a six-digit code
* Optionally provide a nickname
* Submit questions without creating an account
* Upvote questions
* See new questions instantly
* See vote counts update in real time
* See pinned and answered questions instantly

---

## 🚀 Features

### 🔐 Host Authentication

* Host registration and login
* JWT-based authentication
* Protected host routes
* Configurable token expiration
* Secure event ownership checks

### 🎟️ Event Management

Hosts can:

* Create events
* Edit events
* View event details
* End events
* Delete events
* Generate unique six-digit join codes

### 💬 Live Questions

Participants can:

* Submit questions
* Upvote questions
* View questions in real time
* See question ordering change automatically based on votes

### 📌 Question Moderation

Hosts can:

* Pin questions
* Unpin questions
* Mark questions as answered
* Archive questions
* Delete questions

### ⚡ Real-Time Synchronization

The application uses Socket.IO to synchronize state across connected clients.

When a mutation succeeds:

1. The client sends the request to the REST API.
2. The server validates the request.
3. The server updates MongoDB.
4. The server broadcasts a Socket.IO event.
5. Connected clients update their local state immediately.

No manual refresh is required.

### 🎨 UI & UX

* Responsive interface
* Animated question transitions
* Smooth question re-ordering
* Framer Motion animations
* Fixed pinned-question panel
* Global toast notifications
* Loading and empty states
* Graceful server cold-start handling

### 💤 Render Cold-Start Handling

Because the backend runs on a free-tier Render instance, the server may temporarily sleep after inactivity.

The application includes a dedicated `ServerWakingScreen` to provide a better user experience while the backend starts again.

---

# 🏗️ Architecture

The project follows a **Write-via-REST, Broadcast-via-Socket** architecture.

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                  REST                 Socket.IO
                    │                     │
                    ▼                     ▲
          ┌─────────────────┐             │
          │   Express API   │             │
          │   Validation    │             │
          │ Authentication  │             │
          └────────┬────────┘             │
                   │                      │
                   ▼                      │
          ┌─────────────────┐             │
          │    MongoDB      │             │
          │     Atlas       │             │
          └─────────────────┘             │
                                          │
                         Broadcast updates│
                                          │
                         ┌────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Connected Users │
                │   Event Room    │
                └─────────────────┘
```

## Why REST + WebSockets?

REST is responsible for **durable state changes** and validation.

Socket.IO is responsible for **real-time broadcasting**.

This separation provides:

* Reliable database persistence
* Server-side validation
* Authentication and authorization
* Clear API boundaries
* Instant client synchronization
* Reduced unnecessary API refetching

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Socket.IO Client
* Framer Motion

## Backend

* Node.js
* Express.js
* Socket.IO
* JWT
* Mongoose

## Database

* MongoDB Atlas
* MongoDB
* Mongoose

## Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

# 📁 Project Structure

```text
live-qa-wall/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact directory structure may vary depending on the current implementation.

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) v18 or newer
* npm
* Git
* MongoDB or a MongoDB Atlas database

---

## 1. Clone the Repository

```bash
git clone https://github.com/Mukul0223/live-qa-wall.git
cd live-qa-wall
```

---

# 🔧 Backend Setup

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

## 3. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/qa-wall?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

### Environment Variables

| Variable         | Description                     |
| ---------------- | ------------------------------- |
| `PORT`           | Port used by the Express server |
| `MONGO_URI`      | MongoDB connection string       |
| `JWT_SECRET`     | Secret used to sign JWT tokens  |
| `JWT_EXPIRES_IN` | JWT expiration duration         |
| `CLIENT_URL`     | Frontend origin allowed by CORS |
| `NODE_ENV`       | Application environment         |

> Never commit your `.env` file or expose your `JWT_SECRET`.

## 4. Start the Backend

For development:

```bash
npm run dev
```

Or directly with Node:

```bash
node server.js
```

The backend should now be available at:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal window.

## 5. Install Frontend Dependencies

```bash
cd client
npm install
```

## 6. Configure Environment Variables

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Environment Variables

| Variable            | Description                    |
| ------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Base URL for REST API requests |
| `VITE_SOCKET_URL`   | Socket.IO server URL           |

## 7. Start the Frontend

```bash
npm run dev
```

The frontend should now be available at:

```text
http://localhost:5173
```

---

# 🔄 Application Flow

## Host Flow

```text
Register / Login
       │
       ▼
Create Event
       │
       ▼
Generate 6-Digit Code
       │
       ▼
Share Code With Audience
       │
       ▼
Monitor Questions
       │
       ├── Pin
       ├── Answer
       ├── Archive
       └── Delete
       │
       ▼
End Event
```

## Audience Flow

```text
Enter Event Code
       │
       ▼
Join Event
       │
       ▼
Enter Optional Nickname
       │
       ▼
View Live Questions
       │
       ├── Submit Question
       │
       └── Upvote Questions
       │
       ▼
Receive Real-Time Updates
```

---

# 🌐 API Reference

Base URL:

```text
/api
```

## Authentication

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| `POST` | `/auth/register` | Register a host        |
| `POST` | `/auth/login`    | Log in a host          |
| `GET`  | `/auth/me`       | Get authenticated host |

---

## Events

| Method   | Endpoint             | Description           |
| -------- | -------------------- | --------------------- |
| `POST`   | `/events`            | Create an event       |
| `GET`    | `/events`            | Get host events       |
| `GET`    | `/events/:id`        | Get event details     |
| `PUT`    | `/events/:id`        | Update an event       |
| `DELETE` | `/events/:id`        | Delete an event       |
| `POST`   | `/events/:id/end`    | End an event          |
| `GET`    | `/events/join/:code` | Join event using code |

---

## Questions

| Method   | Endpoint                     | Description                       |
| -------- | ---------------------------- | --------------------------------- |
| `POST`   | `/events/:eventId/questions` | Submit a question                 |
| `GET`    | `/events/:eventId/questions` | Get event questions               |
| `POST`   | `/questions/:id/upvote`      | Upvote a question                 |
| `PATCH`  | `/questions/:id/pin`         | Pin/unpin a question              |
| `PATCH`  | `/questions/:id/answer`      | Mark question answered/unanswered |
| `PATCH`  | `/questions/:id/archive`     | Archive/unarchive a question      |
| `DELETE` | `/questions/:id`             | Delete a question                 |

---

# 🔌 Socket.IO

Clients join an event-specific Socket.IO room:

```text
event:<eventId>
```

For example:

```text
event:64f123456789abcdef
```

## Real-Time Events

| Event                | Description                     |
| -------------------- | ------------------------------- |
| `question:created`   | A new question was submitted    |
| `question:upvoted`   | A question received an upvote   |
| `question:pinned`    | Question pin status changed     |
| `question:answered`  | Question answer status changed  |
| `question:archived`  | Question archive status changed |
| `question:deleted`   | Question was deleted            |
| `event:ended`        | Event was ended                 |
| `participant:joined` | Participant joined the event    |
| `participant:left`   | Participant left the event      |

---

# 🔒 Authentication & Authorization

Host authentication uses **JSON Web Tokens (JWT)**.

The general flow is:

```text
Host Login
    │
    ▼
Server validates credentials
    │
    ▼
JWT generated
    │
    ▼
Frontend stores authentication state
    │
    ▼
JWT sent with protected requests
    │
    ▼
Server verifies token
    │
    ▼
Request authorized
```

Protected operations include host-specific event and question management.

Audience members do not need to create an account to participate.

---

# 👍 Upvote Protection

Participants are restricted to **one upvote per question**.

The application tracks participant identity so that repeated requests cannot continuously increase a question's vote count.

This prevents simple duplicate voting while keeping audience participation friction-free.

---

# 🚀 Deployment

## Frontend — Vercel

The React/Vite frontend can be deployed to Vercel.

Configure:

```env
VITE_API_BASE_URL=https://live-qa-wall.onrender.com/api
VITE_SOCKET_URL=https://live-qa-wall.onrender.com
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

---

## Backend — Render

Configure the following environment variables in Render:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-production-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://liveqa-eta.vercel.app
NODE_ENV=production
```

The backend should expose the health endpoint:

```text
/api/health
```

---

## Database — MongoDB Atlas

Create a MongoDB Atlas cluster and provide the connection string through:

```env
MONGO_URI=<your-mongodb-uri>
```

Make sure the deployment environment has permission to connect to the database.

---

# 🩺 Health Check

The backend exposes a health-check endpoint:

```http
GET /api/health
```

Production:

```text
https://live-qa-wall.onrender.com/api/health
```

A successful response confirms that the API server is running.

---

# 🧪 Development Tips

When developing locally, run both applications simultaneously:

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

### Terminal 2 — Frontend

```bash
cd client
npm run dev
```

Then open:

```text
http://localhost:5173
```

For testing real-time functionality, open the application in multiple browser tabs or different devices and join the same event.

---

# 🐛 Troubleshooting

## Backend is not responding

Check:

```text
http://localhost:5000/api/health
```

If it does not respond, make sure the backend is running.

---

## MongoDB connection fails

Verify:

* `MONGO_URI` is correct
* MongoDB Atlas allows the server's IP address
* Database credentials are correct
* The database cluster is running

---

## Socket.IO updates are not appearing

Verify that:

```env
VITE_SOCKET_URL=http://localhost:5000
```

is pointing to the correct backend.

For production, make sure the frontend uses:

```env
VITE_SOCKET_URL=https://live-qa-wall.onrender.com
```

Also verify that the backend CORS configuration allows the frontend origin.

---

## Render server takes time to respond

This can happen when the free-tier backend has been inactive and needs to wake up.

The application includes a `ServerWakingScreen` to provide feedback during this process.

---

# 🔐 Security Notes

Do not commit secrets to Git.

Never commit:

```text
.env
.env.local
.env.production
```

Use environment variables for:

* Database credentials
* JWT secrets
* API URLs
* Production configuration

For production deployments, use a strong randomly generated `JWT_SECRET`.

---

# 📈 Future Improvements

Potential improvements include:

* [ ] Multiple event moderators
* [ ] Anonymous/identified participant modes
* [ ] Question search and filtering
* [ ] Advanced moderation tools
* [ ] Emoji reactions
* [ ] Question categories
* [ ] Export questions to CSV/PDF
* [ ] Event analytics
* [ ] Participant count analytics
* [ ] Persistent participant sessions
* [ ] Rate limiting
* [ ] Automated profanity filtering
* [ ] Redis adapter for Socket.IO horizontal scaling
* [ ] Automated tests and CI/CD
* [ ] Docker support

---

# 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

### 1. Fork the repository

```bash
git clone https://github.com/Mukul0223/live-qa-wall.git
```

### 2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

### 3. Make your changes

Implement and test your changes locally.

### 4. Commit your changes

```bash
git add .
git commit -m "feat: add my feature"
```

### 5. Push the branch

```bash
git push origin feature/my-feature
```

### 6. Open a Pull Request

Describe the changes and explain how they were tested.

---

# 📄 License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for details.

---

# 👨‍💻 Author

**Mukul**

GitHub:

https://github.com/Mukul0223

---

# ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

Built with React, Node.js, MongoDB, and Socket.IO.
