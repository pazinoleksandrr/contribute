const router = require('express').Router();
const walletController = require('../controllers/wallet');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, (req, res) => {
    walletController.addWallet(req, res);
});

router.get('/', authMiddleware, (req, res) => {
    walletController.getWallets(req, res);
});

router.put('/:account', authMiddleware, (req, res) => {
    walletController.updateWallet(req, res);
});

router.post('/deposit', authMiddleware, (req, res) => {
    walletController.deposit(req, res);
});

router.post('/ref_count', authMiddleware, (req, res) => {
    walletController.getReferralCount(req, res);
});

router.get('/game_balance', authMiddleware, (req, res) => {
    walletController.getTotalGameBalance(req, res);
});

// Router for get user game balance in game side.
router.get('/balance/:account/:token', (req, res) => {
    walletController.getUserBalance(req, res);
});

module.exports = router;