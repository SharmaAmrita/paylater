const mongoose = require('mongoose');

const merchantSchema = mongoose.Schema({
  merchant_name: { type: String, unique: true },
  discount_percentage: { type: Number },
  discount_total: { type: Number },
});

const Merchant = mongoose.model('simpl_merchant', merchantSchema);


module.exports = Merchant;
