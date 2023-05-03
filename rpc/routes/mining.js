const express = require("express");
const router = express.Router();
const { startMining, stopMining } = require("../controllers/mining");

router.post("/start", startMining);
router.post("/stop", stopMining);

module.exports = router;