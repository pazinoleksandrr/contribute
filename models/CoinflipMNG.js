const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipMNGSchema = new mongoose.Schema({
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
CoinflipMNGSchema.plugin(autoIncrement.plugin, 'CoinflipMNG');
module.exports = mongoose.model("CoinflipMNG", CoinflipMNGSchema);
