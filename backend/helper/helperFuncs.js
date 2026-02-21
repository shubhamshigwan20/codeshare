const db = require("../db/db");

const DEBOUNCE_MS = 500;
const roomTimers = new Map();

const saveWorkspace = async (roomId, message) => {
  await db.query(
    `INSERT INTO workspace (room_id, data, updated_at)
     VALUES ($1, $2, CURRENT_TIMESTAMP)
     ON CONFLICT (room_id)
     DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
    [roomId, message],
  );
};

const debounceSave = (roomId, message) => {
  if (!roomId) {
    return;
  }

  const existingTimer = roomTimers.get(roomId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(async () => {
    try {
      await saveWorkspace(roomId, message ?? "");
    } catch (error) {
      console.error("Failed to save workspace:", error);
    } finally {
      if (roomTimers.get(roomId) === timer) {
        roomTimers.delete(roomId);
      }
    }
  }, DEBOUNCE_MS);

  roomTimers.set(roomId, timer);
};

module.exports = debounceSave;
