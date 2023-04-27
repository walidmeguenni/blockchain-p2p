#!/usr/bin/env node
const { program } = require("commander");

const axios = require("axios");
// Define transaction cli commands

program //send transaction
  .command("send")
  .description("Send a new transaction")
  .option("-f, --from <address>", "Sender address")
  .option("-t, --to <address>", "Recipient address")
  .option("-a, --amount <number>", "Transaction amount")
  .option("-g, --gas <number>", "Transaction gas")
  .option("-p, --privateKey <string>", "Sender private key")
  .action((options) => {
    const { from, to, amount, gas, privateKey } = options;
    // Call your API route to send transaction here
    // You can use the variables passed in from the CLI options
    try {
      const response = app.post("/transaction/send", {
        body: { from, to, amount, gas, privateKey },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  });
program
  .command("all")
  .description("Get all transactions")
  .action(() => {
    axios
      .get("http://localhost:3001/transaction/all")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
program.parse(process.argv);
