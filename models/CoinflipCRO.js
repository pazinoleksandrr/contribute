const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipCROSchema = new mongoose.Schema({
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
CoinflipCROSchema.plugin(autoIncrement.plugin, 'CoinflipCRO');
module.exports = mongoose.model("CoinflipCRO", CoinflipCROSchema);
