import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ExpressPeerServer } from "peer";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend origin
    methods: ["GET", "POST"],
  },
});

// Setup PeerJS server for WebRTC
const peerServer = ExpressPeerServer(server, {
  path: "/",
});
app.use("/peerjs", peerServer);

// Store room data (users in each room)
const rooms: {
  [key: string]: { id: string; username: string; peerId: string }[];
} = {};

io.on("connection", (socket) => {
  // Handle user joining a room
  socket.on("join-room", ({ roomId, username, peerId }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    if (!rooms[roomId].some((user) => user.id === socket.id)) {
      rooms[roomId].push({
        id: socket.id,
        username,
        peerId: peerId || "pending",
      });
    }

    const otherUsers = rooms[roomId].filter((user) => user.id !== socket.id);
    socket.emit("all-users", otherUsers); // Send list of existing users to new joiner
    socket.to(roomId).emit("user-joined", { id: socket.id, username, peerId }); // Notify others
  });

  // Broadcast chat messages to room
  socket.on("send-message", ({ roomId, username, text }) => {
    io.to(roomId).emit("message", { username, text });
  });

  // Notify room when someone toggles video/audio
  socket.on("toggle-state", ({ roomId, id, videoEnabled, audioEnabled }) => {
    socket.to(roomId).emit("user-toggled", { id, videoEnabled, audioEnabled });
  });

  // Handle user leaving a room
  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    rooms[roomId] =
      rooms[roomId]?.filter((user) => user.id !== socket.id) || [];
    socket.to(roomId).emit("user-left", socket.id); // Notify others
  });

  // Clean up when a user disconnects
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId].some((user) => user.id === socket.id)) {
        rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);
        socket.to(roomId).emit("user-left", socket.id);
      }
    }
  });
});

// PeerJS connection logs
peerServer.on("connection", (client) => {
  console.log("PeerJS connected:", client.getId());
});

peerServer.on("disconnect", (client) => {
  console.log("PeerJS disconnected:", client.getId());
});

peerServer.on("error", (err) => {
  console.error("PeerJS server error:", err);
});

// Start the server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});