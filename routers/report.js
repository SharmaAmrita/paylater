#!/usr/bin/env node

const commander = require('commander');

const {
  discountByMerchant, getDues, getUsersAtCredit, getTotalDues,
} = require('../controllers/ReportsController');

commander
  .command('discount <merchantname>')
  .alias('d')
  .description('To get a total discount by a merchant')
  .action((merchantname) => {
    discountByMerchant(merchantname.toLowerCase());
  });
commander
  .command('dues <username>')
  .alias('du')
  .description('To fetch dues of a user')
  .action((username) => {
    getDues(username.toLowerCase());
  });


commander
  .command('users-at-credit-limit')
  .alias('atcred')
  .description('To fetch all users who have reached their credit limit.')
  .action(() => {
    getUsersAtCredit();
  });

commander
  .command('total-dues')
  .alias('totd')
  .description('To find total dues of all users included')
  .action(() => {
    getTotalDues();
  });

commander.parse(process.argv);
