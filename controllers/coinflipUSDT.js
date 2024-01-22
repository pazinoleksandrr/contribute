const Coinflip = require('mongoose').model('CoinflipUSDT');
const Wallet = require('mongoose').model('Wallet');

module.exports = {
    addHistory: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const createRes = await new Coinflip({ ...req.body, time: new Date().toISOString() }).save();
                const { account, amount } = req.body;
                const findRes = await Wallet.findOne({ account });
                if (findRes) {
                    await Wallet.findOneAndUpdate({ account }, { totalBetUSDT: findRes.totalBetUSDT + amount });
                }
                req.app.get('io').emit('COINFLIP_USDT', createRes);
                res.status(200).json(createRes);
            } catch (err) {
                console.log('coinflip controller add history error: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    getHistory: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const { account } = req.params;

                const findRes = await Coinflip.find({ account }).sort({ _id: -1 }).limit(100);
    
                if (findRes) {
                    res.status(200).json(findRes);
                } else {
                    res.status(200).json([]);
                }
            } catch (err) {
                console.log('coinflip controller get history error: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    getAllHistory: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const findRes = await Coinflip.find({}).sort({ _id: -1 }).limit(100);

                if (findRes) {
                    res.status(200).json(findRes);
                } else {
                    res.status(200).json([]);
                }
            } catch (err) {
                console.log('coinflip controller get all history error: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    getStatsData: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const allRes = await Coinflip.find({});
                if (allRes) {
                    let sumAll = 0;
                    for (let i=0; i<allRes.length; i++) {
                        sumAll += allRes[i].amount;
                    }
    
                    res.status(200).json({
                        totalBetAmountUSDT: sumAll,
                        totalBetCountUSDT: allRes.length,
                    });
                } else {
                    res.status(200).json({
                        totalBetAmountUSDT: 0,
                        totalBetCountUSDT: 0,
                    });
                }
            } catch (err) {
                console.log('coinflip controller get stats data error: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    }
}