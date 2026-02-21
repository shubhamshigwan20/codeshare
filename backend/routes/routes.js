const router = require("express").Router();
const { generateRoom } = require("../controllers/controllers");

router.get("/generateRoom", generateRoom);

module.exports = router;
