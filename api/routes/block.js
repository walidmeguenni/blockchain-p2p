const express = require("express");
const router = express.Router();
const { getLastBlock, getBlocks } = require("../controllers/block");

router.post("/", getLastBlock);
router.get("/lastblock", getBlocks);

module.exports = router;