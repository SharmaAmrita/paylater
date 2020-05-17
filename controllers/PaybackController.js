/* eslint-disable max-len */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const dbConfig = require('../config/dbconnect');
const Payback = require('../models/PaybackModel');
const User = require('../models/UserModel');
const Interest = require('../models/InterestModel');


const currentMonth = new Date().getUTCMonth();
const currentYear = new Date().getUTCFullYear();
/**
 *
 * @param {user_name : String} name
 * @param {amount: Number} amount
 * @description This will check if the user exists or not, if the payback amount without interest is less than or equals to credit limit and then creates the document in simpl_paybacks collection
 * This will also fetch the interest rate from simpl_interests collection for the current month and year and will calculate the payback+interest
 */

const sendPayback = (name, amount) => {
  if (!parseFloat(amount)) {
    console.log('please enter a valid amount.');
    process.exit();
  }
  User.find({ user_name: name }).exec((err, userData) => {
    if (err) {
      console.log('An error occured while searching for user');
      process.exit();
    }
    if (userData.length === 0) {
      console.log('User does not exist. Please write valid username or create a user.');
      process.exit();
    }
    if (userData[0].credit_limit < amount) {
      console.log('Payback amount exceeds credit limit. Rejected!');
      process.exit();
    }

    Interest.find({ interest_month: currentMonth, interest_year: currentYear }).exec((interestFindError, interestData) => {
      if (interestFindError) {
        console.log('An error occured while searching for Interest Rate');
        process.exit();
      }
      let interestRate = 0;
      let paybackAmount = parseFloat(amount);
      if (interestData.length > 0) {
        interestRate = interestData[0].interest_rate;
        console.log(interestData[0].interest_rate);
      }
      Payback.aggregate([
        { $match: { user_name: name } },
        { $group: { _id: '$user_name', total: { $sum: '$payback_amount' } } },
      ]).exec((paybackError, paybackData) => {
        if (paybackError) {
          console.log(err);
          console.log('An error occured while creating payback');
          process.exit();
        }
        if (paybackData.length > 0) {
          paybackAmount += paybackData[0].total;
          if (userData[0].credit_limit < paybackAmount + paybackData[0].total) {
            console.log(userData[0].credit_limit);
            console.log('Payback amount exceeds credit limit. Rejected!');
            process.exit();
          }
        }
        const newPayback = new Payback({
          user_name: name, payback_amount: amount, payback_month: currentMonth, payback_year: currentYear, credit_payback_amount: parseFloat(amount),
        });
        const amt = parseFloat(amount);
        newPayback.credit_payback_amount = amt + (amt * (interestRate / 100));
        Payback.create(newPayback, (paybackCreateErr) => {
          if (paybackCreateErr) {
            console.log(paybackCreateErr);
            console.log('An error occured while creating payback');
            process.exit();
          }
          console.log(`${name}(dues:${userData[0].credit_limit - paybackAmount})`);
          process.exit();
        });
      });
    });
  });
};
module.exports = { sendPayback };
