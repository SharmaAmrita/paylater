/* eslint-disable max-len */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const dbConfig = require('../config/dbconnect');

const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel');
const Merchant = require('../models/MerchantModel');

const currentMonth = new Date().getUTCMonth();
const currentYear = new Date().getUTCFullYear();

/**
 *
 * @param {username: String} username
 * @param {merchan name: String} merchantname
 * @param {txn_amount: Number} txn_amount
 * @description Creates a document in simpl_transactions collection
 * @summary
 * Checks whether the merchant exists, checks whether the user exists - For initial validation
 * Checks if the amount to be transacted is lesser than the credit-limit/balance.
 * @note The user's balance is updated after every transaction.
 *
 *
 * Discount Percent is also added in the simpl_transactions document, this can fetch reports of at what percent the transaction was done before the merchant updated its discount percent
 */
const addTransaction = (username, merchantname, txnAmount) => {
  if (!parseFloat(txnAmount)) {
    console.log('please enter a valid Amount.');
    process.exit();
  }
  const newTransaction = new Transaction({
    user_name: username, merchant_name: merchantname, txn_amount: txnAmount, transaction_month: currentMonth, transaction_year: currentYear, discount_percent: 0,
  });
  // Fetch Merchant Discount Percentage
  Merchant.find({ merchant_name: merchantname }).exec((err, merchantData) => {
    if (err) {
      console.log('An error occured while searching for Merchant');
      process.exit();
    }
    if (merchantData.length === 0) {
      console.log('Merchant with this name does not exist. Please enter a valid merchant or add a merchant.');
      process.exit();
    }
    User.find({ user_name: username }).exec((userError, userData) => {
      if (userData.length === 0) {
        console.log('User with this name does not exist. Please enter a valid user or add a user.');
        process.exit();
      }
      if (err) {
        console.log('An error occured while searching for User');
        process.exit();
      }
      if (userData[0].balance < txnAmount) {
        console.log('rejected! (reason: credit limit)');
        process.exit();
      } else {
        newTransaction.discount_percent = merchantData[0].discount_percentage;
        const discountValue = txnAmount * (merchantData[0].discount_percentage / 100.00);
        const amount = txnAmount - discountValue;
        const balanceAmount = userData[0].balance - amount;
        Transaction.create(newTransaction, (transactionErr) => {
          if (transactionErr) {
            console.log('An error occured while adding transaction');
            process.exit();
          }
          // Update User Balance

          User.updateOne({ user_name: username }, { balance: balanceAmount }).exec((userUpdateErr) => {
            if (userUpdateErr) {
              console.log('An error occured while updating user balance');
              process.exit();
            }
            Merchant.updateOne({ merchant_name: merchantname }, { discount_total: merchantData[0].discount_total + discountValue }).exec((merchantErr) => {
              if (merchantErr) {
                console.log('An error occured while updating merchant discount total');
                process.exit();
              }
              console.log('success!');
              process.exit();
            });
          });
        });
      }
    });
  });
};
module.exports = { addTransaction };
