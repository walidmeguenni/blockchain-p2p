const express = require("express");
const router = express.Router();
const {
  sendTransaction,
  getTransactions,
} = require("../controllers/transaction");

router.post("/send", sendTransaction);
router.get("/all", getTransactions);

module.exports = router;
