const express = require("express");
const router = express.Router();
const { getLastBlock, getBlocks } = require("../controllers/block");

router.get("/all", getBlocks);
router.get("/lastblock", getLastBlock);

module.exports = router;