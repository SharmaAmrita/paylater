const mongoose = require('mongoose');

const interestSchema = mongoose.Schema({
  interest_month: { type: Number },
  interest_year: { type: Number },
  interest_rate: { type: Number }, // Interest charged when the customer pays back.
});

const Interest = mongoose.model('simpl_interests', interestSchema);

module.exports = Interest;
