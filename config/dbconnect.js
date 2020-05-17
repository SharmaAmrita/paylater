const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://amrita:simpl123A@ds133601.mlab.com:33601/simpl_paylater_db', {useNewUrlParser: true, useUnifiedTopology: true });

module.exports = db;