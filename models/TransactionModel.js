const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  user_name: { type: String },
  merchant_name: { type: String },
  txn_amount: { type: Number },
  transaction_month: { type: Number },
  transaction_year: { type: Number },
  discount_percent: { type: Number },
});

const Transaction = mongoose.model('simpl_transactions', transactionSchema);

module.exports = Transaction;
