const router = require('express').Router();
const historyController = require('../controllers/history');

router.get('/save', (req, res) => {
    historyController.saveHistory(req, res);
});

router.get('/', (req, res) => {
    historyController.getHistory(req, res);
})

module.exports = router;