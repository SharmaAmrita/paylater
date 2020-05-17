#!/usr/bin/env node

const commander = require('commander');

const { sendPayback } = require('../controllers/PaybackController');

commander
  .arguments('<username> <amount>')
  .alias('givePayback')
  .description('To payback the amount')
  .action((username, amount) => {
    sendPayback(username.toLowerCase(), amount);
  });

commander.parse(process.argv);
