const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const TokenSchema = new mongoose.Schema({
  account: {
    type: String,
  },
  token: {
    type: String,
  },
});

autoIncrement.initialize(mongoose.connection);
TokenSchema.plugin(autoIncrement.plugin, 'Token');
module.exports = mongoose.model("Token", TokenSchema);
