#!/usr/bin/env node
const { program } = require("commander");
const axios = require("axios");

program // get balance
  .command("get-balance <address>")
  .description("Get balance for an address")
  .action(async (address) => {
    try {
      const response = await axios.post("http://localhost:3001/balance", {
        body: { address },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  });

program //create account
  .command("create-account")
  .description("Create a new account")
  .action(() => {
    axios
      .post("http://localhost:3001/wallet/create")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  program //get accounts
  .command('accounts')
  .description('Get wallet accounts')
  .action(() => {
    axios.get('http://localhost:3001/wallet/accounts')
      .then(response => {
        console.log(response.data.accounts);
      })
      .catch(error => {
        console.error(error);
      });
  });

program.parse(process.argv);
