#!/usr/bin/env node

const commander = require('commander');
const { addUser } = require('../controllers/UserController');
const { addMerchant } = require('../controllers/MerchantController');
const { addTransaction } = require('../controllers/TransactionController');

commander
  .command('user <name> <email> <creditLimit>')
  .alias('adduser')
  .description('To onboard a user')
  .action((name, email, creditLimit) => {
    addUser(name.toLowerCase(), email, creditLimit);
  });
commander
  .command('merchant <name> <discountPercentage>')
  .alias('addmerchant')
  .description('To add a merchant')
  .action((name, discountPercentage) => {
    addMerchant(name.toLowerCase(), discountPercentage);
  });


commander
  .command('txn <username> <merchantname> <txnAmount>')
  .alias('transact')
  .description('To make a transaction between user and merchant')
  .action((username, merchantname, txnAmount) => {
    addTransaction(username.toLowerCase(), merchantname.toLowerCase(), txnAmount);
  });

commander.parse(process.argv);
