const express = require("express");
const db = require("./db/db");
const helmet = require("helmet");
const cors = require("cors");
const router = require("./routes/routes");
const {
  routeNotFound,
  errorHandler,
} = require("./middleware/commonMiddlewares");
const { createRoomHandlers } = require("./sockets/roomHandlers");
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

  const {
    joinRoomHandler,
    sendDataHandler,
    disconnectingHandler,
    disconnectHandler,
  } = createRoomHandlers(socket);

  socket.on("join-room", joinRoomHandler);
  socket.on("send-data", sendDataHandler);
  socket.on("disconnecting", disconnectingHandler);
  socket.on("disconnect", disconnectHandler);
});

app.use(routeNotFound);

app.use(errorHandler);

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
