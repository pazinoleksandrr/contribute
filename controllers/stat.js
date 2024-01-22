const Stat = require('mongoose').model('Stat');

module.exports = {
    updateStats: async (total, success, token) => {
        try {
            const findRes = await Stat.findOne({ token });
            await Stat.findOneAndUpdate({ token }, { totalBet: findRes.totalBet + total, successBet: findRes.successBet + success });
        } catch (err) {
            console.log('update stat error: ', err);
        }
    },
    getStat: async token => {
        const findRes = await Stat.findOne({ token });
        if (findRes) {
            return { totalBet: findRes.totalBet, successBet: findRes.successBet };
        } else {
            await new Stat({ totalBet: 0, successBet: 0, token }).save();
            return { totalBet: 0, successBet: 0 };
        }
    }
}