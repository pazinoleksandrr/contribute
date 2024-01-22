const Wallet = require('../../models/Wallet');
const statController = require('../stat');

async function GetSlotsSpinResults(gameResult, walletAddress, token) {
    let deck = new Array(15);

    deck = PrepareRandomDeck();
    gameResult = checkResult(gameResult, deck);
    const stat = await statController.getStat(token);
    if ((stat.totalBet + gameResult.TotalBet) < (stat.successBet + gameResult.SpinWin) * 10 / 9) {
        deck = PrepareFailDeck(gameResult);
        gameResult = checkResult(gameResult, deck);
    }

    const findRes = await Wallet.findOne({ account: walletAddress });
    gameResult.TotalFreeSpinCount = gameResult.NewFreeSpinCount + findRes.freeSpinCount;

    if (findRes.freeSpinCount > 0) {
        gameResult.GameWin += gameResult.TotalBet;
        gameResult.SpinWin += gameResult.TotalBet;
        gameResult.TotalFreeSpinCount--;
    }

    await Wallet.findOneAndUpdate({ account: walletAddress }, { freeSpinCount: gameResult.TotalFreeSpinCount });

    response = {
        Deck: deck,
        GameResult: gameResult
    };
    return response;
}

function PrepareRandomDeck() {
    let deck = new Array(15);
    let count = 0;
    for (let x = 0; x < 5; ++x) {
        for (let y = 0; y < 3; ++y) {
            var randomValue = Math.floor(Math.random() * frequenciesSum);
            for (let i = 0; i < frequencies.length; ++i) {
                if (randomValue < frequencies[i]) {
                    deck[count] = i;
                    break;
                }
                else randomValue -= frequencies[i];
            }
            count += 1;
        }
    }
    return deck;
}

function PrepareFailDeck(gameResult) {
    let deck;
    do {
        deck = PrepareRandomDeck();
        gameResult = checkResult(gameResult, deck);
    } while (gameResult.SpinWin > 0 || gameResult.NewFreeSpinCount>0);
    return deck;
}

function checkResult(result, deck) {
    let iResult = new Array(5);
    result.SpinWin=0;
    result.GameWin=0;
    rowCount = 3;
    reelsConut = 5;
    let winsCount = 0;
    result.Wins = new Array(5);
    for (let i = 0; i < lines.length; ++i) {
        for (let x = 0; x < reelsConut; ++x) {
            iResult[x] = deck[rowCount * x + lines[i][x]];
        }
        let MatchCount = 0;
        let bFirstSymbol = false;
        let SymbolIdx = -1;

        for (let x = 0; x < reelsConut; ++x) {
            if (!bFirstSymbol) {
                if (iResult[x] != 1) {
                    SymbolIdx = iResult[x];
                    bFirstSymbol = true;
                }
                MatchCount++;
            }
            else {
                if ((SymbolIdx == iResult[x]) || iResult[x] == 1) {
                    MatchCount++;
                }
                else {
                    break;
                }
            }
        }

        if (SymbolIdx == -1) { continue; }

        let isNormal = SymbolIdx != 0 && SymbolIdx != 1;
        let reward = rewards[SymbolIdx][MatchCount - 1];

        if (isNormal && (MatchCount != 0) && (reward != 0)) {
            let LineWin = (reward) * result.TotalBet;
            var winItem = {
                Line: i,
                SymbolIdx: SymbolIdx,
                Matches: MatchCount,
                WinGold: LineWin
            };
            result.Wins[winsCount] = winItem;
            winsCount++;
            result.SpinWin += LineWin;
        }

        if (SymbolIdx == 0 && MatchCount != 0 && reward != 0) {
            result.NewFreeSpinCount = reward;
        }

    }
    result.GameWin += result.SpinWin;
    return result;
}

const frequencies = [1, 4, 20, 20, 20, 20, 6, 6, 3];

const frequenciesSum = 100;
const lines = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
];

const rewards = [
    [0, 0, 3, 4, 5],
    [0, 0, 0, 0, 0],
    [0, 0, 2, 3, 4],
    [0, 0, 2, 3, 6],
    [0, 0, 3, 4, 8],
    [0, 0, 3, 5, 10],
    [0, 3, 4, 10, 15],
    [0, 3, 4, 12, 20],
    [0, 3, 4, 15, 100],
];

module.exports = { GetSlotsSpinResults };