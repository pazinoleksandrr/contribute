const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const CoinflipDARKCRYSTALSchema = new mongoose.Schema({
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
CoinflipDARKCRYSTALSchema.plugin(autoIncrement.plugin, 'CoinflipDARKCRYSTAL');
module.exports = mongoose.model("CoinflipDARKCRYSTAL", CoinflipDARKCRYSTALSchema);