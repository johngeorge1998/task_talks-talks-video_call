# Talks-Talks Video Call

A real-time video chat app built as a monorepo with a React frontend and an Express backend. Think of it like a custom Zoom—join or create rooms, toggle your video/audio, and chat with others in the call. Perfect for small group hangouts or quick meetings.

## Tech Stack
- **Client**: React, Mantine UI, WebRTC (via PeerJS), Socket.io-client
- **Server**: Express, Socket.io, PeerJS Server

## Project Structure 
talks-talks-video-call/
├── client/         # React frontend
├── server/         # Express backend
├── .gitignore      # Ignores node_modules and build artifacts
└── README.md        


## Prerequisites
- **Node.js**: v16 or higher
- **npm**: Comes with Node.js
- A modern browser (Chrome, Firefox, etc.) for WebRTC support

## Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/johngeorge1998/task_talks-talks-video_call.git
cd task_talks-talks-video_call

2. Install Dependencies
Each folder (client and server) has its own package.json. Install their dependencies separately:

cd client
npm install

cd ../server
npm install

3. Run the Server
Start the backend (runs on http://localhost:5000):

cd server
npm start

4. Run the Client
In a new terminal, start the frontend (runs on http://localhost:3000):

cd client
npm start

5. Use the App
Open http://localhost:3000 in your browser.
Enter your name and either:
Click "Create Room" to start a new call (copy the room ID to share).
Paste a room ID and click "Join Room" to join an existing call.
Toggle video/audio and chat away!

Features
Video/audio calls with WebRTC
Real-time chat in-room
Toggle video/audio on/off
Dark/light mode
Responsive UI with Mantine
Notes
The server uses Socket.io for real-time updates and PeerJS for WebRTC peer connections.
node_modules folders are ignored in .gitignore—don’t commit them!
Tested locally; for production, you’d need to deploy and tweak CORS/ports.
