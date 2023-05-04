const express = require("express");
const router = express.Router();
const { create, getAccounts, getBalance } = require("../controllers/wallet");

router.post("/create", create);
router.get("/all", getAccounts);
router.post("/balance", getBalance);

module.exports = router;