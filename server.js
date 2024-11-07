const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Joining a room based on the unique chatId
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  // Handle message sending
  socket.on("chatMessage", (message) => {
    io.to(message.chatId).emit("chatMessage", message); // Send message to everyone in the room
  });

  // Handle typing event
  socket.on("typing", (data) => {
    socket.broadcast.to(data.chatId).emit("typing", data);
  });

  socket.on("stopTyping", (data) => {
    socket.broadcast.to(data.chatId).emit("stopTyping", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
