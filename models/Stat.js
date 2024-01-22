const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const StatSchema = new mongoose.Schema({
  totalBet: {
    type: Number,
  },
  successBet: {
    type: Number,
  },
  token: {
    type: String,
  }
});

autoIncrement.initialize(mongoose.connection);
StatSchema.plugin(autoIncrement.plugin, 'Stat');
module.exports = mongoose.model("Stat", StatSchema);
