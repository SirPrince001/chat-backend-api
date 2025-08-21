# Chat Backend API

A real-time chat backend built with **Node.js, Express, Socket.IO, and Sequelize**.  
Supports multiple rooms, user presence, message rate limiting, and REST endpoints for chat history and room members.

---

## Features

- **Real-time messaging** using Socket.IO
- **Room management** (public/private) with invite codes
- **Room members tracking**
- **User presence** (online/offline) with last seen timestamp
- **Message rate limiting** (max 5 messages per 10 seconds)
- **Message validation** (prevent empty messages)
- **REST API endpoints** for chat history and room members
- **Pagination / lazy loading** for chat messages

---

## Tech Stack

- **Node.js** with TypeScript
- **Express.js** for REST API
- **Socket.IO** for real-time messaging
- **Sequelize ORM** with MySQL
- **UUID** for unique IDs
- **dotenv** for environment configuration

---

## Prerequisites

- Node.js ≥ 18
- NPM or Yarn
- MySQL database
- Git

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>

### 2. Install dependencies

```bash
npm install
 
 Create a .env file at the root of your project with the following content:

 PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chat_db
DB_USER=root
DB_PASSWORD=yourpassword

   ## Run migrations
 npx sequelize-cli db:migrate


##Start the server

npm run dev

##coonect to websocket
    HTTP server runs on http://localhost:4000

   Socket.IO namespace: ws://localhost:4000/chat (path /socket.io)