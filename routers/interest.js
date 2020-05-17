#!/usr/bin/env node
const commander = require('commander');

const { setInterest } = require('../controllers/InterestController');

commander
  .command('interest <interestRate>')
  .alias('setInterest')
  .description('To set interest rate for paying back crdit')
  .action((interestRate) => {
    setInterest(interestRate);
  });

commander.parse(process.argv);
