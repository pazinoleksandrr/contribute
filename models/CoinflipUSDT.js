const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipUSDTSchema = new mongoose.Schema({
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
CoinflipUSDTSchema.plugin(autoIncrement.plugin, 'CoinflipUSDT');
module.exports = mongoose.model("CoinflipUSDT", CoinflipUSDTSchema);
