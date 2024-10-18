const express = require("express");
const http = require("http");
const { Server } = require("socket.io"); // Importing the correct Socket.IO class

const app = express();
const server = http.createServer(app);

// Create a new instance of the Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true, // Enable if you need to pass credentials (like cookies)
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("chatMessage", (message) => {
    // Broadcast the message to all clients except the sender
    socket.broadcast.emit("chatMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
