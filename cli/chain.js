#!/usr/bin/env node
const { program } = require("commander");
const axios = require("axios");

program //get all block
  .command("get-blocks")
  .description("Get all blocks")
  .action(async () => {
    try {
      const response = await axios.get("http://localhost:3001/block/all");
      console.log(response.data.Blockchain);
    } catch (error) {
      console.error(error);
    }
  });
program //get last block
  .command("get-last-block")
  .description("Get last blocks")
  .action(async () => {
    try {
      const response = await axios.get("http://localhost:3001/block/lastblock");
      console.log(response.data.Blockchain);
    } catch (error) {
      console.error(error);
    }
  });

program.parse(process.argv);
