const { VM } = require("ethereumjs-vm");
const { runCode } = require("ethereumjs-vm/dist/runTx");
const BN = require("bn.js");
const { fromHexString, toBuffer } = require("ethereumjs-util");

exports.EVM = async (req, res) => {
  const { bytecode, contractAddress, methodName, args } = req.body;
  const vm = new VM();

  // Create a new contract using the bytecode
  const contract = await vm.runCode({
    code: fromHexString(bytecode),
  });

  // Print the contract address
  console.log("Contract Address:", contractAddress);

  // Encode the arguments
  const encodedArgs = args.map((arg) => toBuffer(arg));

  // Execute the function on the contract with the encoded arguments
  const result = await contract.run(methodName, {
    gas: new BN(3000000),
    data: encodedArgs,
  });

  console.log("Execution Result:", result);

  // Access the contract's storage
  const storageValue = await contract.run("storageFunction", {
    gas: new BN(3000000),
  });
  console.log("Storage Value:", storageValue);

  res.status(202).json({ result });
};
