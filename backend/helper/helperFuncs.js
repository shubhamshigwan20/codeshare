const db = require("../db/db");

const DEBOUNCE_MS = 500;
const roomTimers = new Map();
const pendingRoomData = new Map();

const getRoomData = async (roomId) => {
  const roomData = await db.query(
    `SELECT data FROM workspace WHERE room_id = $1`,
    [roomId]
  );

  if (roomData.rowCount) {
    return roomData.rows[0].data;
  }
  return "";
};

const saveWorkspace = async (roomId, message) => {
  await db.query(
    `INSERT INTO workspace (room_id, data, updated_at)
     VALUES ($1, $2, CURRENT_TIMESTAMP)
     ON CONFLICT (room_id)
     DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
    [roomId, message]
  );
};

const flushRoomSave = async (roomId) => {
  if (!roomId || !pendingRoomData.has(roomId)) {
    return false;
  }

  const existingTimer = roomTimers.get(roomId);
  if (existingTimer) {
    clearTimeout(existingTimer);
    roomTimers.delete(roomId);
  }

  const message = pendingRoomData.get(roomId) ?? "";

  try {
    await saveWorkspace(roomId, message);
    return true;
  } catch (error) {
    console.error("Failed to save workspace:", error);
    return false;
  } finally {
    pendingRoomData.delete(roomId);
  }
};

const debounceSave = (roomId, message) => {
  if (!roomId) {
    return;
  }

  pendingRoomData.set(roomId, message ?? "");

  const existingTimer = roomTimers.get(roomId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(async () => {
    await flushRoomSave(roomId);
  }, DEBOUNCE_MS);

  roomTimers.set(roomId, timer);
};

module.exports = { debounceSave, getRoomData, flushRoomSave };
