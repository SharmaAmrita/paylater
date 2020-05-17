const mongoose = require('mongoose');

const paybackSchema = mongoose.Schema({
  user_name: { type: String },
  payback_amount: { type: Number },
  payback_month: { type: Number },
  payback_year: { type: Number },
  credit_payback_amount: { type: Number }, // Amount without the interest
});

const Payback = mongoose.model('simpl_payback', paybackSchema);
module.exports = Payback;
