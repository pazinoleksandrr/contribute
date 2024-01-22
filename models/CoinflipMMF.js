const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipMMFSchema = new mongoose.Schema({
    account: {
        type: String,
    },
    hash: {
        type: String,
    },
    amount: {
        type: Number,
    },
    choice: {
        type: Number,
    },
    result: {
        type: Number,
    },
    payoff: {
        type: Number,
    },
    time: {
        type: String,
    },
});

autoIncrement.initialize(mongoose.connection);
CoinflipMMFSchema.plugin(autoIncrement.plugin, 'CoinflipMMF');
module.exports = mongoose.model("CoinflipMMF", CoinflipMMFSchema);
