const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipLIONSchema = new mongoose.Schema({
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
CoinflipLIONSchema.plugin(autoIncrement.plugin, 'CoinflipLION');
module.exports = mongoose.model("CoinflipLION", CoinflipLIONSchema);
