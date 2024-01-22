const GameHistory = require('mongoose').model('GameHistory');
const url = require('url');
const games =  [ 'coinflip', 'roulette', 'slots', 'blackjack', 'texas'];

module.exports = {
    saveHistory: async (req, res) => {
        const queryObject = url.parse(req.url, true).query;
        let historyItem = JSON.parse(queryObject["historyItemJson"]);
        historyItem = { ...historyItem, time: new Date().toISOString() };
        let prefix = queryObject["gamePrefix"];
        let walletAddress = queryObject["walletAddress"];

        if (!games.includes(prefix)) {
            return res.status(400).json('No such game prefix. Valid prefixes are coinflip, roulette, slots, blackjack and texas.');
        }

        try {
            const findRes = await GameHistory.findOne({ account: walletAddress });
            if (findRes) {
                await GameHistory.findOneAndUpdate({ account: walletAddress }, { $push: { [prefix]: historyItem } });
            } else {
                await new GameHistory({ account: walletAddress, [prefix]: [historyItem] }).save();
            }

            return res.status(200).json('Success');
        } catch (err) {
            console.log('history controller save history error: ', err);
            return res.status(500).json("Internal server error.");
        }
    },
    getHistory: async (req, res) => {
        const queryObject = url.parse(req.url, true).query;
        let prefix = queryObject["gamePrefix"];
        let walletAddress = queryObject["walletAddress"];
        let limit = parseInt(queryObject["limit"]);

        if (!games.includes(prefix)) {
            return res.status(400).json('No such game prefix. Valid prefixes are coinflip, roulette, slots, blackjack and texas.');
        }
        
        try {
            const findRes = await GameHistory.findOne({ account: walletAddress });
            if (findRes) {
                let targetArr = findRes._doc[[prefix]];
                if (targetArr.length <= limit || limit < 0) {
                    return res.status(200).json(targetArr);
                } else {
                    return res.status(200).json(targetArr.slice(targetArr.length - limit, targetArr.length));
                }
            } else {
                return res.status(200).json([]);
            }
        } catch (err) {
            console.log('history controller get history error: ', err);
            return res.status(500).json('Internal server error');
        }
    }
}