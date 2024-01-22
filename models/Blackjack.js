const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const BlackjackSchema = new mongoose.Schema({
    Deck: {
        type: Array,
    },
    BankerPoints: {
        type: Number,
    },
    PlayerPoints: {
        type: Number,
    },
    CurrentCardIndex: {
        type: Number,
    },
    Bet: {
        type: Number,
    },
    WalletAddress: {
        type: String,
    },
    PlayerAcesCount: {
        type: Number,
    },
    BankerAcesCount:{
        type: Number,
    },
    token: {
        type: String,
    }
});

autoIncrement.initialize(mongoose.connection);
BlackjackSchema.plugin(autoIncrement.plugin, 'Blackjack');
module.exports = mongoose.model("Blackjack", BlackjackSchema);
