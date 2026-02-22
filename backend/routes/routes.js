const { generateRoom, healthCheck } = require("../controllers/controllers");
const router = require("express").Router();

router.get("/health", healthCheck);
router.get("/generateRoom", generateRoom);

module.exports = router;
