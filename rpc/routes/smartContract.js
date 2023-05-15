const express = require("express");
const router = express.Router();
const {
  deployContract,
  executeMethod,
  compile,
} = require("../controllers/smartContract");

router.post("/deploy", deployContract);
router.post("/execute", executeMethod);
router.post("/compile", compile);

module.exports = router;
