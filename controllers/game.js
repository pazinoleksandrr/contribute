const Wallet = require('mongoose').model('Wallet');
const url = require('url');
const blackJack = require('./games/blackjack');
const slots = require('./games/slots');
const statController = require('./stat');
const walletController = require('./wallet');

const blue = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const black = [2, 4, 6, 8, 11, 10, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
const even = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
const odd = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];
const firstHalf = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const secondHalf = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
const firstThird = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const secondThird = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const firstLine = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
const secondLine = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const thirdLine = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const lastThird = [25,26,27,28,29,30,31,32,33,34,35,36];

module.exports = {
    roulette: async (req, res) => {
        if ((req.get('origin') === 'https://cronos-roulette.firebaseapp.com' && process.env.DEPLOY_MODE === 'production') || process.env.DEPLOY_MODE === 'test') {
            try {
                const queryObject = url.parse(req.url, true).query;
                var randomNumber = Math.floor(Math.random() * 37);
                let betName = queryObject["betName"];
                let betValue = parseFloat(queryObject["betValue"]);
                let walletAddress = queryObject["walletAddress"];
                let token = queryObject["token"];
                let betMultiplier = 0;
    
                switch (betName) {
                    case "Blue":
                        if (blue.includes(randomNumber))
                            betMultiplier = 2;
                        break;
                    case "Black":
                        if (black.includes(randomNumber))
                            betMultiplier = 2;
                        break;
                    case "Even":
                        if (even.includes(randomNumber))
                            betMultiplier = 2;
                        break;
                    case "Odd":
                        if (odd.includes(randomNumber))
                            betMultiplier = 2;
                        break;
                    case "FirstHalf":
                        if (firstHalf.includes(randomNumber))
                            betMultiplier = 2;
                        break;
                    case "SecondHalf":
                        if (secondHalf.includes(randomNumber))
                            betMultiplier = 2;
                        break;
                    case "FirstThird":
                        if (firstThird.includes(randomNumber))
                            betMultiplier = 3;
                        break;
                    case "SecondThird":
                        if (secondThird.includes(randomNumber))
                            betMultiplier = 3;
                        break;
                    case "LastThird":
                        if (lastThird.includes(randomNumber))
                            betMultiplier = 3;
                    case "FirstLine":
                        if (firstLine.includes(randomNumber))
                            betMultiplier = 3;
                        break;
                    case "SecondLine":
                        if (secondLine.includes(randomNumber))
                            betMultiplier = 3;
                        break;
                    case "ThirdLine":
                        if (thirdLine.includes(randomNumber))
                            betMultiplier = 3;
                        break;
                }
    
                if (betName === randomNumber)
                    betMultiplier = 36;

                const stat = await statController.getStat(token);
                if ((stat.totalBet + betValue) < (stat.successBet + betMultiplier * betValue) * 10 / 9) {
                    betMultiplier = 0;
                    randomNumber = -1;
                }
    
                let totalWin = betMultiplier * betValue;
                
                const findRes = await Wallet.findOne({ account: walletAddress.toString() });
                if (findRes) {
                    if (betValue > findRes[`${token}Balance`]) {
                        return res.status(400).json('Not enough balance.');
                    }

                    await statController.updateStats(betValue, totalWin, token);
                    await walletController.updateUserBalance(walletAddress, token, betValue, totalWin);
                } else {
                    return res.status(400).json('No such user with the above wallet address');
                }
    
                var rouletteResponse = {
                    ResultNumber: randomNumber,
                    TotalWin: totalWin
                };
    
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(rouletteResponse, null, 4));
            } catch (err) {
                console.log('error in roulette game: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            return res.status(401).json("Unauthorized.");
        }
    },
    coinflip: async (req, res) => {
        if ((req.get('origin') === 'https://cronos-coin.web.app' && process.env.DEPLOY_MODE === 'production') || process.env.DEPLOY_MODE === 'test') {
            try {
                const queryObject = url.parse(req.url, true).query;
                let betName = parseInt(queryObject["betName"]);
                let betValue = parseFloat(queryObject["betValue"]);
                let walletAddress = queryObject["walletAddress"];
                let token = queryObject["token"];
    
                var chance = Math.floor(Math.random() * 101);
                if (chance < 60) {
                    var randomNumber = betName;
                }
                else if (betName === 0) {
                    var randomNumber = 1;
                }
                else if (betName === 1) {
                    var randomNumber = 0;
                }
    
                let betMultiplier = 0;
    
                if (betName === randomNumber)
                    betMultiplier = 2;

                const stat = await statController.getStat(token);
                if ((stat.totalBet + betValue) < (stat.successBet + betValue * betMultiplier) * 10 / 9) {
                    betMultiplier = 0;
                    randomNumber = betName === 0 ? 1 : 0;
                }
    
                let totalWin = betMultiplier * betValue;

                const findRes = await Wallet.findOne({ account: walletAddress });
                if (findRes) {
                    if (betValue > findRes[`${token}Balance`]) {
                        return res.status(400).json('Not enough balance.');
                    }

                    await statController.updateStats(betValue, totalWin, token);
                    await walletController.updateUserBalance(walletAddress, token, betValue, totalWin);
                } else {
                    return res.status(400).json('No such user with the above wallet address');
                }
    
                var rouletteResponse = {
                    ResultNumber: randomNumber,
                    TotalWin: totalWin
                };

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(rouletteResponse, null, 4));
            } catch (err) {
                console.log('error in coinflip game: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            return res.status(401).json("Unauthorized.");
        }
    },
    slots: async (req, res) => {
        if ((req.get('origin') === 'https://cronos-slots.web.app' && process.env.DEPLOY_MODE === 'production') || process.env.DEPLOY_MODE === 'test') {
            try {
                const queryObject = url.parse(req.url, true).query;
                var gameResult= JSON.parse(queryObject["gameResult"]);
                let walletAddress = queryObject["walletAddress"];
                let token = queryObject["token"];
                let response = await slots.GetSlotsSpinResults(gameResult, walletAddress, token);
    
                let betValue = gameResult.TotalBet;
                let winValue = response.GameResult.SpinWin;

                const findRes = await Wallet.findOne({ account: walletAddress });

                if (findRes) {
                    if (gameResult.TotalBet > findRes[`${token}Balance`]) {
                        return res.status(400).json('Not enough balance.');
                    }

                    await statController.updateStats(betValue, winValue, token);
                    await walletController.updateUserBalance(walletAddress, token, betValue, winValue);
                } else {
                    return res.status(400).json('No such user with the above wallet address');
                } 
               
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response, null, 4));
            } catch (err) {
                console.log('error in slots game: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            return res.status(401).json("Unauthorized.");
        }
    },
    startNewBlakcJackGame: async (req, res) => {
        if ((req.get('origin') === 'https://cronos-blackjack.web.app' && process.env.DEPLOY_MODE === 'production') || process.env.DEPLOY_MODE === 'test') {
            const queryObject = url.parse(req.url, true).query;
            let walletAddress = queryObject["walletAddress"];
            let bet = queryObject["bet"];
            let token = queryObject["token"];
    
            await blackJack.startGame(walletAddress, bet, token);
    
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end("{}");
        } else {
            return res.status(401).json('Unauthorized.');
        }
    },
    getcCardId: async (req, res) => {
        if ((req.get('origin') === 'https://cronos-blackjack.web.app' && process.env.DEPLOY_MODE === 'production') || process.env.DEPLOY_MODE === 'test') {
            const queryObject = url.parse(req.url, true).query;
            let walletAddress = queryObject["walletAddress"];
            let isForPlayer = queryObject["isForPlayer"];
    
            var cardId = await blackJack.getCardId(walletAddress, isForPlayer);
    
            if (cardId) {
                var getCardResponse = {
                    CardId: cardId
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(getCardResponse, null, 4));
            } else {
                res.status(400).json('Bad request.');
            }
        } else {
            return res.status(401).json('Unauthorized.');
        }
    },
    checkResults: async (req, res) => {
        if ((req.get('origin') === 'https://cronos-blackjack.web.app' && process.env.DEPLOY_MODE === 'production') || process.env.DEPLOY_MODE === 'test') {
            const queryObject = url.parse(req.url, true).query;
            let walletAddress = queryObject["walletAddress"];
            let isFinal = queryObject["isFinal"];
    
            var result = await blackJack.checkResult(walletAddress, isFinal);
    
            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result, null, 4));
            } else {
                res.status(400).json('Bad request.');
            }
        } else {
            return res.status(401).json('Unauthorized.');
        }
    }
}