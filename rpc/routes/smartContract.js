const express = require("express");
const router = express.Router();
const {
  deployContract,
  executeMethod,
  compile,
} = require("../controllers/smartContract");
const { EVM } = require("../controllers/evm");

router.post("/deploy", deployContract);
router.post("/execute", executeMethod);
router.post("/compile", compile);
router.post("/evm", EVM);

module.exports = router;
