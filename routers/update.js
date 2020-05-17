#!/usr/bin/env node

const commander = require('commander');

const { updateMerchant } = require('../controllers/MerchantController');

commander
  .command('merchant <name> <discountPercentage>')
  .alias('updateMerch')
  .description('To update a merchant discount percentage')
  .action((name, discountPercentage) => {
    updateMerchant(name.toLowerCase(), discountPercentage);
  });

commander.parse(process.argv);
