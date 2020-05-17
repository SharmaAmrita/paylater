const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user_name: { type: String, unique: true },
  user_email: { type: String },
  credit_limit: { type: Number },
  balance: { type: Number },
  credit_onboard_month: { type: Number },
  credit_onboard_year: { type: Number },
});

const User = mongoose.model('simpl_user', userSchema);

module.exports = User;
