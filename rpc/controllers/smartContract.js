const { Wmcoin } = require("../../core/main");
const { produceMessage, compileContract } = require("../services");
const { sendMessage } = require("../services");

exports.deployContract = async (req, res) => {
  try {
    const { abi, bytecode, from, privateKey, gas } = req.body;

    // validate input parameters
    if (!abi || !bytecode || !from || !privateKey) {
      return res.status(400).json({ message: "Missing input parameters" });
    }

    const data = Wmcoin.deploy(abi, bytecode, from, privateKey, 0, gas);
    sendMessage(produceMessage("DEPLOY_NEW_SMART_CONTRACT", data));
    res.status(202).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deploying contract" });
  }
};

exports.executeMethod = async (req, res) => {
  try {
    const { contractId, methodName, from, privateKey, args } = req.body;

    // validate input parameters
    if (!contractId || !methodName || !from || !privateKey) {
      return res.status(400).json({ message: "Missing input parameters" });
    }

    try {
      const { status, outputs, smartID, transactionSM } = await Wmcoin.execute(
        contractId,
        methodName,
        from,
        privateKey,
        ...args
      );
      sendMessage(produceMessage("EXECUTE_METHOD_OF_SMART_CONTRACT"), {
        outputs,
        smartID,
        transactionSM,
      });
      res.status(200).json(status, outputs, smartID, transactionSm);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error executing method" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error executing method" });
  }
};

exports.compile = async (req, res) => {
  try {
    const { abi, bytecode } = await compileContract(
      req.body.contractName,
      req.body.contractSource
    );
    res.status(200).json({ abi, bytecode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
