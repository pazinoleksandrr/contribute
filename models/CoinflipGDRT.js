const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipGDRTSchema = new mongoose.Schema({
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
CoinflipGDRTSchema.plugin(autoIncrement.plugin, 'CoinflipGDRT');
module.exports = mongoose.model("CoinflipGDRT", CoinflipGDRTSchema);