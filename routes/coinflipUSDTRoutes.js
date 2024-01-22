const router = require('express').Router();
const coinflipController = require('../controllers/coinflipUSDT');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, (req, res) => {
    coinflipController.addHistory(req, res);
});

router.get('/:account', authMiddleware, (req, res) => {
    coinflipController.getHistory(req, res);
});

router.post('/stats', authMiddleware, (req, res) => {
    coinflipController.getStatsData(req, res);
});

router.get('/', authMiddleware, (req, res) => {
    coinflipController.getAllHistory(req, res);
});

module.exports = router;