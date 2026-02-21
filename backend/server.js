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
  console.log("New client connected:", socket.id);

  socket.on("join-room", (data = {}, ack) => {
    const roomId = data.roomId;
    const userName = data.userName || "Anonymous";

    if (!roomId) {
      if (ack) ack({ status: false, error: "roomId is required" });
      return;
    }

    socket.join(roomId);
    console.log(`${userName} joined ${roomId}`);

    if (ack) ack({ status: true, roomId });

    socket.emit("joined-room", { roomId });
    socket.to(roomId).emit("user-joined", { userName, socketId: socket.id });
  });

  socket.on("send-data", ({ roomId, message } = {}) => {
    if (!roomId) {
      return;
    }

    socket.to(roomId).emit("receive-data", {
      message: message || "",
      from: socket.id,
      at: Date.now(),
      roomId: roomId,
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

app.use((req, res) => {
  return res.status(404).json({
    status: false,
    message: "route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    status: false,
    message: err.message || "internal server error",
  });
});

httpServer.listen(PORT, async () => {
  await db.connect();
  console.log("database connected");
  console.log(`server started on port ${PORT}`);
});
