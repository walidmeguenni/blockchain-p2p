const express = require("express");
const router = express.Router();
const { getStatistic } = require("../controllers/monitor");

router.get("/", getStatistic);

module.exports = router;
