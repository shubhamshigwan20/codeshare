const express = require("express");
const db = require("./db/db");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes/routes");
const { debounceSave, getRoomData } = require("./helper/helperFuncs");
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

  socket.on("join-room", async (data = {}, ack) => {
    try {
      const rawRoomId = data.roomId;
      const userName = data.userName || "Anonymous";
      const roomId = String(rawRoomId || "").replace(/^\//, "");

      if (!roomId) {
        if (ack) ack({ status: false, error: "roomId is required" });
        return;
      }

      socket.join(roomId);
      console.log(`${userName} joined ${roomId}`);

      const roomData = await getRoomData(roomId);
      if (ack) ack({ status: true, roomId, roomData });

      socket.emit("joined-room", { roomId });
      socket.to(roomId).emit("user-joined", { userName, socketId: socket.id });
    } catch (error) {
      console.error("join-room failed:", error);
      if (ack) ack({ status: false, error: "failed to join room" });
    }
  });

  socket.on("send-data", ({ roomId, message } = {}) => {
    const normalizedRoomId = String(roomId || "").replace(/^\//, "");
    if (!normalizedRoomId) {
      return;
    }

    debounceSave(normalizedRoomId, message);

    socket.to(normalizedRoomId).emit("receive-data", {
      message: message || "",
      from: socket.id,
      at: Date.now(),
      roomId: normalizedRoomId,
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
  try {
    await db.query("SELECT 1");
    console.log("database connected");
    console.log(`server started on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect database:", error);
    process.exit(1);
  }
});
