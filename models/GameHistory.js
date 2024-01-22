const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const GameHistorySchema = new mongoose.Schema({
  account: {
    type: String,
  },
  coinflip: {
    type: Array,
    default: [],
  },
  roulette: {
    type: Array,
    default: [],
  },
  slots: {
    type: Array,
    default: [],
  },
  blackjack: {
    type: Array,
    defualt: [],
  },
  texas: {
    type: Array,
    default: [],
  },
});

autoIncrement.initialize(mongoose.connection);
GameHistorySchema.plugin(autoIncrement.plugin, 'GameHistory');
module.exports = mongoose.model("GameHistory", GameHistorySchema);
