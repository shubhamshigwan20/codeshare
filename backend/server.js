const express = require("express");
const db = require("./db/db");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes/routes");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const PORT = process.env.PORT || 80;

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(express.json());
app.use(cors({}));

app.use(router);

io.on("connection", (socket) => {
  console.log("New client connected");
  console.log("socket.id:", socket.id);
  console.log("handshake query:", socket.handshake.query);
  console.log("handshake auth:", socket.handshake.auth);

  // If client sends custom "join-room" data, log it
  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);
    console.log(`${userName} joined ${roomId}`);

    socket.emit("joined-room", { roomId });
    socket.to(roomId).emit("user-joined", { userName, socketId: socket.id });
    console.log("join-room data:", data);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

//common error handling middleware
app.use((req, res) => {
  return res.status(500).json({
    status: false,
    message: "internal server error",
  });
});

httpServer.listen(PORT, async () => {
  await db.connect();
  console.log(`database connected`);
  console.log(`server started on port ${PORT}`);
});
