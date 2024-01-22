const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipUSDCSchema = new mongoose.Schema({
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
CoinflipUSDCSchema.plugin(autoIncrement.plugin, 'CoinflipUSDC');
module.exports = mongoose.model("CoinflipUSDC", CoinflipUSDCSchema);
