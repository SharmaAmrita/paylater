/* eslint-disable max-len */
/* eslint-disable no-console */

// eslint-disable-next-line no-unused-vars
const dbConfig = require('../config/dbconnect');
const User = require('../models/UserModel');
const Merchant = require('../models/MerchantModel');
const Payback = require('../models/PaybackModel');


/**
 *
 * @param {user name: String} username
 * @description search in payback table using username and fetch the dues, which is credit_limit - payback_amount
 */


const getDues = (username) => {
  User.find({ user_name: username }).exec((err, userData) => {
    if (err) {
      console.log('An error occured while finding user.');
      process.exit();
    }
    if (userData.length === 0) {
      console.log('user does not exist');
      process.exit();
    }
    Payback.aggregate([
      { $match: { user_name: username } },
      { $group: { _id: '$user_name', total: { $sum: '$payback_amount' } } },
    ]).exec((paybackError, paybackData) => {
      if (paybackError) {
        console.log('An error occured while fetching payback results.');
        process.exit();
      }
      if (paybackData.length === 0) {
        console.log(userData[0].credit_limit);
        process.exit();
      }
      console.log(userData[0].credit_limit - paybackData[0].total);
      process.exit();
    });
  });
};

/**
 * @description calculates dues for all users and displays total.
 */
const getTotalDues = () => {
  const userDictionary = {};
  const payBackDictionary = {};
  User.find().exec((err, userData) => {
    if (err) {
      console.log('An error occured while finding user.');
      process.exit();
    }
    if (userData.length === 0) {
      console.log('user does not exist');
      process.exit();
    }
    Payback.aggregate([
      { $group: { _id: '$user_name', total: { $sum: '$payback_amount' } } },
    ]).exec((paybackError, paybackData) => {
      if (paybackError) {
        console.log('An error occured while fetching payback results.');
        process.exit();
      }
      if (paybackData.length === 0 && userData.length > 0) {
        for (let i = 0; i < userData.length; i += 1) {
          console.log(`${userData[i].user_name}:${userData[i].credit_limit}`);
          process.exit();
        }
      } else if (paybackData.length > 0) {
        for (let i = 0; i < userData.length; i += 1) {
          userDictionary[userData[i].user_name] = userData[i].credit_limit;
        }
        for (let j = 0; j < paybackData.length; j += 1) {
          // eslint-disable-next-line no-underscore-dangle
          payBackDictionary[paybackData[j]._id] = paybackData[j].total;
        }
      }
      let sum = 0;
      Object.keys(userDictionary).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(payBackDictionary, key)) {
          console.log(`${key} : ${userDictionary[key] - payBackDictionary[key]}`);
          sum += (userDictionary[key] - payBackDictionary[key]);
        } else {
          console.log(`${key} : ${userDictionary[key]}`);
          sum += userDictionary[key];
        }
      });
      console.log('total :', sum);
      process.exit();
    });
  });
};

/**
 *
 * @param {merchant name: String} merchantname
 * @description Fetches data from simpl_merchants for a given merchant name
 */

const discountByMerchant = (merchantname) => {
  Merchant.find({ merchant_name: merchantname }).exec((err, merchantData) => {
    if (err) {
      console.log('An error occured while finding merchant.');
      process.exit();
    }
    if (merchantData.length === 0) {
      console.log('Merchant does not exist.');
      process.exit();
    } else {
      console.log(merchantData[0].discount_total);
      process.exit();
    }
  });
};

/**
 * @description Fetches data from simpl_usrs where balance is less than equal to 0
 */


const getUsersAtCredit = () => {
  User.find({ balance: { $lte: 0 } }).exec((err, userData) => {
    if (err) {
      console.log('An error occured while finding user.');
      process.exit();
    }
    if (userData.length === 0) {
      console.log('Data does not exist.');
      process.exit();
    } else {
      for (let i = 0; i < userData.length; i += 1) {
        console.log(userData[i].user_name);
      }
      process.exit();
    }
  });
};

module.exports = {
  getDues, getTotalDues, getUsersAtCredit, discountByMerchant,
};
