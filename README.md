# 🎮 Guessing Game Backend (Assignment Submission)

## 📌 Overview

This project is a **real-time multiplayer guessing game backend** built with **Node.js, Express, MongoDB, and Socket.IO** following the **MVC architecture**.

Players can join a game session, receive a question, and attempt to guess the correct answer in real time.



##  Features

* Game session creation (Game Master)
* Players can join before game starts
* Real-time gameplay using Socket.IO
* Chat-style interaction
* 3 attempts per player
* 60 seconds timer per session
* Winner detection and score allocation
* Score tracking for all players
* Game master rotation after each round
* Session ends when all players leave


##  Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO

---

##  Project Structure

```
src/
│
├── config/
├── controllers/
├── models/
├── routes/
├── services/
├── sockets/
├── utils/
├── app.js
└── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/yourusername/guessing-game.git
cd guessing-game
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 4. Run the server

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### Create Session

```
POST /api/sessions
```

### Join Session

```
POST /api/sessions/:id/join
```

### Start Game

```
POST /api/sessions/start
```

---

## ⚡ Socket Events

### Connect

```js
const socket = io("http://localhost:5000");
```

### Join Session

```js
socket.emit("join_session", { sessionId, userId });
```

### Send Guess

```js
socket.emit("send_guess", { sessionId, userId, guess });
```

---

## 🎯 Game Rules

* Minimum of 2–3 players required to start a game
* Only the game master can start the game
* Each player has 3 attempts to guess correctly
* First correct answer wins and earns 10 points
* Game ends after 60 seconds if no correct answer
* No new players can join during an active game

---

## 🧪 Testing

The API can be tested using **Postman**, and real-time features can be tested via the browser console or a simple HTML client.

---



## 👨‍💻 Author

**Nnamdi Paschal**

---
