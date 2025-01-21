const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  //frontend port
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    socket.emit('message', msg); // Message echo
  });

  socket.emit("message", "Hello from server!");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(4000, () => {
  console.log("Socket.IO server is running on http://localhost:4000");
});
