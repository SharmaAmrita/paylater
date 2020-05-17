/* eslint-disable max-len */
/* eslint-disable no-console */


// eslint-disable-next-line no-unused-vars
const dbConfig = require('../config/dbconnect');
const Interest = require('../models/InterestModel');

const currentMonth = new Date().getUTCMonth();
const currentYear = new Date().getUTCFullYear();
/**
 *
 * @param {interest_rate: Number} interest_rate
 * @description This updates document of the collection simpl_interests by setting the interest rate limit (assumed to be used while making a payback) for the current month and current year
 * @summary This is a lookup collection and is directly entered in the DB.
 */

const setInterest = (interestRate) => {
  if (!parseFloat(interestRate)) {
    console.log('please enter a valid interest rate to update.');
    process.exit();
  }
  Interest.findOneAndUpdate({ interest_month: currentMonth, interest_year: currentYear }, { interest_rate: interestRate }, { useFindAndModify: false }).exec((err) => {
    if (err) {
      console.log('An error occured while updating Interest');
    }
    console.log(`interest-rate: ${interestRate}%`);
    process.exit();
  });
};
module.exports = { setInterest };
