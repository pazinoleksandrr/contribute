const Blackjack = require('mongoose').model('Blackjack');
const Wallet = require('mongoose').model('Wallet');
const statController = require('../stat');
const walletController = require('../wallet');

async function startGame(walletAddress, bet, token) {
    try {
        var deck = [];
        for (let i = 0; i < 52; i++) {
            deck.push(i + 1);
        }
        deck = shuffle(deck);

        let betValue = parseFloat(bet);
        const stat = await statController.getStat(token);
        if ((stat.totalBet + betValue) < (stat.successBet + betValue * 2) * 10 / 9) {
            deck = PrepareFailDeck(deck)
        }

        var newGame = {
            Deck: deck,
            BankerPoints: 0,
            PlayerPoints: 0,
            CurrentCardIndex: 0,
            Bet: bet,
            WalletAddress: walletAddress,
            PlayerAcesCount: 0,
            BankerAcesCount: 0,
            token,
        }

        const findRes = await Blackjack.findOne({ WalletAddress: walletAddress });
        if (findRes) {
            await Blackjack.findOneAndUpdate({ WalletAddress: walletAddress }, newGame);
        } else {
            await new Blackjack(newGame).save();
        }
    } catch (err) {
        console.log('start game error: ', err);
        return null;
    }
}

async function getCardId(walletAddress, isForPlayer) {
    try {
        let findRes = await Blackjack.findOne({ WalletAddress: walletAddress });
        if (findRes) {
            let game = findRes._doc;

            game.CurrentCardIndex++;
            var cardid = game.Deck[game.CurrentCardIndex - 1];
            var points = countCardPoints(cardid);
            if (isForPlayer === "true") {
                if (points == 11)
                    game.PlayerAcesCount++;
                game.PlayerPoints += points;
                if (game.PlayerPoints > 21) {
                    for (let i = 0; i < game.PlayerAcesCount; i++) {
                        game.PlayerPoints -= 10;
                        if (game.PlayerPoints <= 21)
                            break;
                    }
                }
            }
            else {
                if (points == 11)
                    game.BankerAcesCount++;
                game.BankerPoints += points;
                if (game.BankerPoints > 21) {
                    for (let i = 0; i < game.BankerAcesCount; i++) {
                        game.BankerPoints -= 10;
                        if (game.BankerPoints <= 21)
                            break;
                    }
                }
            }
            await Blackjack.findOneAndUpdate({ WalletAddress: walletAddress }, game);
            return cardid;
        } else {
            return null;
        }
    } catch (err) {
        console.log('get card id error: ', err);
        return null;
    }
}

function countCardPoints(cardid) {
    let color = Math.floor((cardid - 1) / 13);
    let number = cardid - (color * 13);
    let points = number;

    if (number > 10) {
        points = 10;
    }
    if (number == 1)
        points = 11;

    return points;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

async function checkResult(walletAddress, isFinal) {
    try {
        let findRes = await Blackjack.findOne({ WalletAddress: walletAddress });

        if (findRes) {
            let game = findRes._doc;

            var result = {
                GameOver: false,
                PlayerPoints: game.PlayerPoints,
                BankerPoints: game.BankerPoints,
                Winner: 0,
                WinnerPoints: 0
            }
            var _bankerPoints = game.BankerPoints;
            var _playerPoints = game.PlayerPoints;
            if (_bankerPoints === _playerPoints && _bankerPoints === 21) {
                result.GameOver = true;
                result.Winner = 1;
                result.WinnerPoints = _bankerPoints;
            }
            else if (_bankerPoints === 21) {
                result.GameOver = true;
                result.Winner = 1;
                result.WinnerPoints = _bankerPoints;
            }
            else if (_playerPoints === 21) {
                result.GameOver = true;
                result.Winner = 2;
                result.WinnerPoints = _playerPoints;
            }
            else if (_bankerPoints > 21 && _playerPoints > 21) {
                result.GameOver = true;
                result.Winner = 1;
                result.WinnerPoints = _bankerPoints;
            }
            else if (_bankerPoints > 21) {
                result.GameOver = true;
                result.Winner = 2;
                result.WinnerPoints = _playerPoints;
            }
            else if (_playerPoints > 21) {
                result.GameOver = true;
                result.Winner = 1;
                result.WinnerPoints = _bankerPoints;
            }
            else if (isFinal === "true") {
                if (_bankerPoints === _playerPoints) {
                    result.Winner = 1;
                    result.WinnerPoints = _bankerPoints;
                }
                else if (_bankerPoints > _playerPoints) {

                    result.Winner = 1;
                    result.WinnerPoints = _bankerPoints;

                }
                else {
                    result.Winner = 2;
                    result.WinnerPoints = _playerPoints;
                }
                result.GameOver = true;
            }
            const walletRes = await Wallet.findOne({ account: walletAddress });

            if (result.GameOver && (result.Winner === 0 || result.Winner === 1)) {
                if (walletRes) {
                    if (game.Bet > walletRes.GDRTBalance) {
                        return null;
                    }
                    await statController.updateStats(game.Bet, 0, game.token);
                    await walletController.updateUserBalance(walletAddress, game.token, game.Bet, 0);
                } else {
                    return null;
                }
            }
            else if (result.GameOver) {
                if (walletRes) {
                    if (game.Bet > walletRes.GDRTBalance) {
                        return null;
                    }

                    let winMultiplier = 1;
                    if (result.WinnerPoints === 21) {
                        winMultiplier = 1.5
                    }
                    await statController.updateStats(game.Bet, game.Bet * (1 + winMultiplier), game.token);
                    await walletController.updateUserBalance(walletAddress, game.token, game.Bet, game.Bet * (1 + winMultiplier));
                } else {
                    return null;
                }
            }

            return result;
        } else {
            return null;
        }
    } catch (err) {
        console.log('blackjack check result error: ', err);
        return null;
    }
}

function PrepareFailDeck(deck) {
    var randomValue = Math.floor(Math.random() * 10);
    if (randomValue < 2)
        return PrepareFailDeck1(deck);
    else if (randomValue < 6)
        return PrepareFailDeck2(deck, 8);
    else if (randomValue < 12)
        return PrepareFailDeck2(deck, 7);
}

function PrepareFailDeck1(deck) {
    let bankerFirst = 2;
    let next = 2;
    for (i = 0; i < 52; i++) {
        var points = countCardPoints(deck[i]);
        if (points == 10) {
            var t = deck[i];
            deck[bankerFirst] = deck[i];
            deck[i] = t;
            next = i;
            break;
        }
    }

    let bankerSecond = 3;

    for (i = next + 1; i < 52; i++) {
        var points = countCardPoints(deck[i]);
        if (points == 11 || points == 10) {
            var t = deck[i];
            deck[bankerSecond] = deck[i];
            deck[i] = t;
            break;
        }
    }

    return deck;
}

function PrepareFailDeck2(deck, playerSecondCard) {

    let playerFirst = 0;
    let next = 0;
    for (i = next; i < 52; i++) {
        var points = countCardPoints(deck[i]);
        if (points == 10) {
            var t = deck[i];
            deck[playerFirst] = deck[i];
            deck[i] = t;
            next = i;
            break;
        }
    }

    let playerSecond = 1;
    for (i = next + 1; i < 52; i++) {
        var points = countCardPoints(deck[i]);
        if (points == playerSecondCard) {
            var t = deck[i];
            deck[playerSecond] = deck[i];
            deck[i] = t;
            next = i;
            break;
        }
    }

    let bankerFirst = 2;
    for (i = next + 1; i < 52; i++) {
        var points = countCardPoints(deck[i]);
        if (points == 10) {
            var t = deck[i];
            deck[bankerFirst] = deck[i];
            deck[i] = t;
            next = i;
            break;
        }
    }

    let bankerSecond = 3;
    for (i = next + 1; i < 52; i++) {
        var points = countCardPoints(deck[i]);
        if (points == 10) {
            var t = deck[i];
            deck[bankerSecond] = deck[i];
            deck[i] = t;
            next = i;
            break;
        }
    }

    let playerThird = 4;
    for (i = next + 1; i < 52; i++) {
        var points = countCardPoints(deck[i]);
        if (points == 10) {
            var t = deck[i];
            deck[playerThird] = deck[i];
            deck[i] = t;
            next = i;
            break;
        }
    }
    return deck;
}

module.exports = { startGame, checkResult, getCardId, PrepareFailDeck };
