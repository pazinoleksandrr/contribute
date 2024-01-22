const router = require('express').Router();
const gameController = require('../controllers/game');

router.get('/roulette', (req, res) => {
    gameController.roulette(req, res);
});

router.get('/coinflip', (req, res) => {
    gameController.coinflip(req, res);
});

router.get('/slots', (req, res) => {
    gameController.slots(req, res);
});

router.get('/blackjack/start_new_game', (req, res) => {
    gameController.startNewBlakcJackGame(req, res);
});

router.get('/blackjack/card_id', (req, res) => {
    gameController.getcCardId(req, res);
});

router.get('/blackjack/check_result', (req, res) => {
    gameController.checkResults(req, res);
});

module.exports = router;