# MERN Online Judge

A full-stack Online Judge (OJ) platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- User and Admin authentication (JWT-based)
- Admin dashboard: add, view, and delete coding problems with test cases
- User dashboard: view problems, submit code, and get verdicts (Accepted, Wrong Answer, Compilation Error, etc.)
- C++ code compilation and execution (local, via child_process)
- MongoDB for storing users, problems, test cases, and submissions
- **Solved status persists across sessions** (user progress tracking)
- **Logout** functionality for both users and admins
- **Dockerized deployment** for production (backend, frontend, MongoDB, nginx)

## Folder Structure
```
backend/    # Express + MongoDB API
frontend/   # React app
```

## Prerequisites (for local development)
- Node.js & npm
- MongoDB (local instance, or use Docker)
- g++ (for C++ code execution, e.g. via MinGW on Windows)

## Local Setup

### 1. Clone the repository
```
git clone <your-repo-url>
cd Online\ Judge
```

### 2. Install dependencies
```
cd backend
npm install
cd ../frontend
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running locally (default: `mongodb://localhost:27017/oj`).

### 4. Start the backend
```
cd backend
node server.js
```

### 5. Start the frontend
```
cd ../frontend
npm start
```

### 6. Access the app
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Dockerized Deployment (Recommended for Production)

### 1. Build and run all services
```
docker-compose up --build
```
- This will start the backend (Node.js/Express), frontend (React), MongoDB, and nginx (for frontend static serving).
- MongoDB will be available on port **27018** (see `docker-compose.yml`).

### 2. Access the app
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

### 3. Using MongoDB Compass
- Connect to: `mongodb://localhost:27018/oj`
- You can view and edit collections (users, problems, submissions, etc.)

## Usage
- Register as an **admin** or **user**
- Admins can add problems and test cases
- Users can view problems and submit code
- Verdicts are shown after code submission
- **Solved badge** appears for problems you've solved (persists after logout/login)
- Use the **Logout** button to end your session and return to the main page

## Notes
- Only C++ is supported for code execution in this version
- For production, use Docker for code isolation and security
- Do not commit `.env` files or secrets
- If you change MongoDB ports, update connection strings accordingly

## License
MIT
