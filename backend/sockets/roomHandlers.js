const {
  debounceSave,
  getRoomData,
  flushRoomSave,
} = require("../helper/helperFuncs");

const normalizeRoomId = (roomId) => String(roomId || "").replace(/^\//, "");

const createJoinRoomHandler =
  (socket) =>
  async (data = {}, ack) => {
    try {
      const roomId = normalizeRoomId(data.roomId);
      const userName = data.userName || "Anonymous";

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
  };

const createSendDataHandler =
  (socket) =>
  ({ roomId, message } = {}) => {
    const normalizedRoomId = normalizeRoomId(roomId);
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
  };

const createDisconnectingHandler = (socket) => async () => {
  const roomIds = Array.from(socket.rooms).filter((id) => id !== socket.id);

  if (!roomIds.length) {
    return;
  }

  await Promise.allSettled(roomIds.map((roomId) => flushRoomSave(roomId)));
};

const createDisconnectHandler = (socket) => (reason) => {
  console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
};

const createRoomHandlers = (socket) => ({
  joinRoomHandler: createJoinRoomHandler(socket),
  sendDataHandler: createSendDataHandler(socket),
  disconnectingHandler: createDisconnectingHandler(socket),
  disconnectHandler: createDisconnectHandler(socket),
});

module.exports = { createRoomHandlers };
