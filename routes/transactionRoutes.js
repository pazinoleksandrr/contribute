const router = require('express').Router();
const transactionController = require('../controllers/transaction');
const authMiddleware = require('../middlewares/auth');

router.post('/connect', (req, res) => {
    transactionController.handleConnect(req, res);
});

router.post('/withdraw', authMiddleware, (req, res) => {
    transactionController.handleWithdraw(req, res);
});

router.post('/check', authMiddleware, (req, res) => {
    transactionController.checkConnected(req, res);
});

module.exports = router;