const router = require('express').Router();
const coinflipController = require('../controllers/coinflip');
const authMiddleware = require('../middlewares/auth');

router.post('/cro', authMiddleware, (req, res) => {
    coinflipController.addHistory(req, res);
});

router.get('/cro/:account', authMiddleware, (req, res) => {
    coinflipController.getHistory(req, res);
});

router.get('/cro', authMiddleware, (req, res) => {
    coinflipController.getAllHistory(req, res);
});

router.get('/cro/stats/:account', authMiddleware, (req, res) => {
    coinflipController.getStatsData(req, res);
});

module.exports = router;