const mongoose = require("mongoose");
const db_string = process.env.MONGO_URL;

require('./models/Wallet');
require("./models/Token");
require('./models/GameHistory');
require('./models/Blackjack');
require('./models/CoinflipCRO');
require('./models/CoinflipMNG');
require('./models/CoinflipLION');
require('./models/CoinflipUSDT');
require('./models/CoinflipUSDC');
require('./models/CoinflipMMF');
require('./models/CoinflipGDRT');
require('./models/CoinflipDARKCRYSTAL');
require('./models/Stat');

mongoose.connect(db_string, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }).then(() => {
  	console.log("MongoDB connected...");
}).catch(err => console.log(err));