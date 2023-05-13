const express = require("express");
const router = express.Router();
const {
  deployContract,
  executeMethod,
} = require("../controllers/smartContract");

router.post("/deploy", deployContract);
router.post("/execute", executeMethod);

module.exports = router;
