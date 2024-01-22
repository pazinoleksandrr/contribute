const transaction = require('./routes/transactionRoutes');
const wallet = require('./routes/walletRoutes');
const game = require('./routes/gameRoutes');
const gamehistory = require('./routes/historyRoutes');
const coinflip = require('./routes/coinflipRoutes');
const coinflipMNG = require('./routes/coinflipMNGRoutes');
const coinflipLION = require('./routes/coinflipLIONRoutes');
const coinflipUSDT = require('./routes/coinflipUSDTRoutes');
const coinflipUSDC = require('./routes/coinflipUSDCRoutes');
const coinflipMMF = require('./routes/coinflipMMFRoutes');
const coinflipGDRT = require('./routes/coinflipGDRTRoutes');
const coinflipDARKCRYSTAL = require('./routes/coinflipDARKCRYSTALRoutes');

module.exports = app => {
    app.use('/api/transaction', transaction);
    app.use('/api/wallet', wallet);
    app.use('/api/game', game);
    app.use('/api/gamehistory', gamehistory);
    app.use('/api/coinflip', coinflip);
    app.use('/api/coinflip_mng', coinflipMNG);
    app.use('/api/coinflip_lion', coinflipLION);
    app.use('/api/coinflip_usdt', coinflipUSDT);
    app.use('/api/coinflip_usdc', coinflipUSDC);
    app.use('/api/coinflip_mmf', coinflipMMF);
    app.use('/api/coinflip_gdrt', coinflipGDRT);
    app.use('/api/coinflip_darkcrystal', coinflipDARKCRYSTAL);
}