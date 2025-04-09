# Talks-Talks Video Call

## Tech Stack
- Frontend: React, Mantine UI, WebRTC (PeerJS), Socket.io-client
- Backend: Express, Socket.io, PeerJS Server

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- Modern web browser (Chrome, Firefox, Edge)

### Installation
1. Clone the repository:
git clone https://github.com/johngeorge1998/task_talks-talks-video_call.git
cd task_talks-talks-video_call

2. Install client dependencies:
cd client
npm install

3. Install server dependencies:
cd ../server
npm install

### Running the Application
1. Start the backend server:
cd server
npm start

2. Start the frontend (in a new terminal):
cd client
npm run dev

## 🚀 How to Use
1. Open http://localhost:3000 in your browser
2. Enter your name
3. Choose to either:
   - Create Room (generates new room ID)
   - Join Room (enter existing room ID)
4. Use the controls to:
   - Toggle video/audio
   - Send chat messages

## ✨ Features
- Real-time video/audio calls
- In-call text chat
- Video/audio toggle
- Dark/light mode
- Responsive design

## 📝 Notes
- Uses PeerJS for peer connections
- Socket.io for signaling
- Check console for errors if issues occur
