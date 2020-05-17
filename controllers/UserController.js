/* eslint-disable max-len */
/* eslint-disable no-console */

// eslint-disable-next-line no-unused-vars
const dbConfig = require('../config/dbconnect');

const User = require('../models/UserModel');

const currentMonth = new Date().getUTCMonth();
const currentYear = new Date().getUTCFullYear();
/**
 *
 * @param {username: String} name
 * @param {user email: String} email
 * @param {user credit limit: Number} credit_limit
 * @description Creates a document in simpl_users collection
 */

const addUser = (name, email, creditLimit) => {
  // Validate if the credit_limit is a number
  if (!parseFloat(creditLimit)) {
    console.log('please enter a valid credit limit.');
    process.exit();
  }

  const newUser = new User({
    user_name: name, user_email: email, credit_limit: creditLimit, balance: creditLimit, credit_onboard_month: currentMonth, credit_onboard_year: currentYear,
  });
  User.create(newUser, (err) => {
    if (err) {
      if (err.code === 11000) {
        console.log('Username already exists.');
      } else {
        console.log('An error occured.');
      }
    } else {
      console.log(`${name}(${creditLimit})`);
    }

    process.exit();
  });
};

module.exports = { addUser };
