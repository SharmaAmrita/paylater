/* eslint-disable max-len */
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const dbConfig = require('../config/dbconnect');

const Merchant = require('../models/MerchantModel');

/**
 *
 * @param {merchant name: String} name
 * @param {discount percent: Number} discount_percentage
 * @description Creates a document in simpl_merchants collection
 */

const addMerchant = (name, discountPercentage) => {
  if (!parseFloat(discountPercentage)) {
    console.log('please enter a valid discount percentage.');
    process.exit();
  }

  const newMerchant = new Merchant({ merchant_name: name, discount_percentage: discountPercentage, discount_total: 0 });

  Merchant.create(newMerchant, (err) => {
    if (err) {
      if (err.code === 11000) {
        console.log('Username already exists.');
      } else {
        console.log('An error occured.');
      }
    } else {
      console.log(`${name}(${discountPercentage})`);
    }

    process.exit();
  });
};

/**
 *
 * @param {merchant name: String} merchantname
 * @param {discount percentage: Number} discount_percentage
 * @description This will update mechant document for a given merchant in simpl_merchants collection
 *
 */
const updateMerchant = (merchantname, discountPercentage) => {
  if (!parseFloat(discountPercentage)) {
    console.log('please enter a valid discount_percentage to update.');
    process.exit();
  }
  Merchant.updateOne({ merchant_name: merchantname }, { discount_percentage: discountPercentage }).exec((err) => {
    if (err) {
      console.log('An error occured while updating Merchant');
    } else {
      console.log(`${merchantname}(${discountPercentage})`);
    }

    process.exit();
  });
};
module.exports = { addMerchant, updateMerchant };
