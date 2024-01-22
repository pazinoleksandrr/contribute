const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const WalletSchema = new mongoose.Schema({
  account: {
    type: String,
  },
  CROBalance: {
    type: Number,
    default: 0,
  },
  MNGBalance: {
    type: Number,
    default: 0,
  },
  LIONBalance: {
    type: Number,
    default: 0,
  },
  USDTBalance: {
    type: Number,
    default: 0
  },
  USDCBalance: {
    type: Number,
    default: 0,
  },
  MMFBalance: {
    type: Number,
    default: 0,
  },
  GDRTBalance: {
    type: Number,
    default: 0,
  },
  DARKCRYSTALBalance: {
    type: Number,
    default: 0,
  },
  DepositTransactions: {
    type: Array,
    default: [],
  },
  WithdrawTransactions: {
    type: Array,
    default: [],
  },
  referrer: {
    type: Number,
    default: -1,
  },
  referProfit: {
    type: Number,
    default: 0,
  },
  totalBet: {
    type: Number,
    default: 0,
  },
  totalBetMNG: {
    type: Number,
    default: 0,
  },
  totalBetLION: {
    type: Number,
    default: 0,
  },
  totalBetUSDT: {
    type: Number,
    default: 0,
  },
  totalBetUSDC: {
    type: Number,
    default: 0,
  },
  totalBetMMF: {
    type: Number,
    default: 0,
  },
  totalBetGDRT: {
    type: Number,
    default: 0,
  },
  totalBetDARKCRYSTAL: {
    type: Number,
    default: 0,
  },
  freeSpinCount: {
    type: Number,
    default: 0,
  }
});

autoIncrement.initialize(mongoose.connection);
WalletSchema.plugin(autoIncrement.plugin, 'Wallet');
module.exports = mongoose.model("Wallet", WalletSchema);
