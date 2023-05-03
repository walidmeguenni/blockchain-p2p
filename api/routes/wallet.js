const express = require("express");
const router = express.Router();
const { create, getAccounts } = require("../controllers/wallet");

router.post("/create", create);
router.get("/all", getAccounts);

module.exports = router;