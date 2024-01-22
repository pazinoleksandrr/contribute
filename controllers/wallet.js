const Wallet = require('mongoose').model('Wallet');

module.exports = {
    addWallet: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const { account, referrer } = req.body;

                const findRes = await Wallet.findOne({ account }).catch(err => {
                    res.status(500).json('Internal server error.');
                });
    
                if (findRes) {
                    res.status(200).json(findRes);
                } else {
                    const newData = {
                        account,
                        referrer,
                    };
    
                    const createRes = await new Wallet(newData).save().catch(err => {
                        res.status(500).json('Internal server error.');
                        return;
                    });
            
                    res.status(200).json(createRes);
                }
            } catch (err) {
                console.log('error in add wallet: ', err);
                res.status(500).json("Internal server error.");
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    getWallet: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const { account } = req.params;

                const findRes = await Wallet.findOne({ account }).catch(err => {
                    res.status(500).json('Internal server error.');
                });
    
                if (findRes) {
                    res.status(200).json(findRes);
                } else {
                    const newData = {
                        account,
                    };
    
                    const createRes = await new Wallet(newData).save().catch(err => {
                        res.status(500).json('Internal server error.');
                        return;
                    });
            
                    res.status(200).json(createRes);
                }
            } catch (err) {
                console.log('error in get wallet: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    updateWallet: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const { account } = req.params;

                const updateRes = await Wallet.findOneAndUpdate({ account }, req.body).catch(err => {
                    res.status(500).json('Internal server error.');
                });
    
                if (updateRes) {
                    res.status(200).json('Success');
                } else {
                    res.status(400).json('Failed');
                }
            } catch (err) {
                console.log('error in update wallet error: ', err);
                res.status(500).json('Internal server error');
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    deposit: async (req, res) => {
        console.log('origin: ', req.get('origin'));
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const { account, amount, history, token } = req.body;
                console.log('account: ', account);
                const findRes = await Wallet.findOne({ account });
                
                if (findRes) {
                    if (token === 'CRO') {
                        await Wallet.findOneAndUpdate({ account }, { CROBalance: findRes.CROBalance + amount, $push: { DepositTransactions: { ...history, time: new Date().toISOString() } }});
                        if (amount >= 10) {
                            const ref = await Wallet.findById(findRes.referrer);
                            if (ref) {
                                ref.referProfit += amount / 10;
                                await ref.save();
                            }
                        }
                    } else {
                        let key = `${token}Balance`;
                        await Wallet.findOneAndUpdate({ account }, { [key]: findRes[[key]] + amount, $push: { DepositTransactions: { ...history, time: new Date().toISOString() } }});
                    }
                    res.status(200).json('Success');
                } else {
                    res.status(400).json('No such user');
                }
            } catch (err) {
                console.log('error in deposit: ', err);
                res.status(500).json('Internal server error');
            }
        } else {
            res.status(401).json('Unauthorized');
        }
    },
    getUserBalance: async (req, res) => {
        try {
            const { account, token } = req.params;

            const findRes = await Wallet.findOne({ account }).catch(err => {
                res.status(500).json('Internal server error.');
            });
    
            if (findRes) {
                let key = `${token}Balance`;
                return res.status(200).json(findRes[[key]]);
            } else {
                res.status(400).json('No such wallet address.');
            }
        } catch (err) {
            console.log('error in get user balance: ', err);
            res.status(500).json("Internal server error.");
        }
    },
    getWallets: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const findRes = await Wallet.find({}).select('account totalBet totalBetMNG totalBetLION totalBetUSDT totalBetUSDC totalBetMMF totalBetGDRT totalBetDARKCRYSTAL');
                res.status(200).json(findRes);
            } catch (err) {
                console.log('error in get wallets: ', err);
                res.status(500).json('Internal server error.');
            }
        }
    },
    getReferralCount: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const findRes = await Wallet.find({ referrer: req.body.userId });
                if (findRes) {
                    res.status(200).json(findRes.length);
                } else {
                    res.status(200).json(0);
                }
            } catch (err) {
                console.log('get referrer count error: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            res.status(401).json('Unauthorized');
        }
    },
    getTotalGameBalance: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const findRes = await Wallet.find({});
                if (findRes) {
                    let sumCRO = 0;
                    let sumMNG = 0;
                    let sumLION = 0;
                    let sumUSDT = 0;
                    let sumUSDC = 0;
                    let sumMMF = 0;
                    let sumGDRT = 0;
                    let sumDARKCRYSTAL = 0;

                    for (let i=0; i<findRes.length; i++) {
                        sumCRO += findRes[i].CROBalance;
                        sumMNG += findRes[i].MNGBalance;
                        sumLION += findRes[i].LIONBalance;
                        sumUSDT += findRes[i].USDTBalance;
                        sumUSDC += findRes[i].USDCBalance;
                        sumMMF += findRes[i].MMFBalance;
                        sumGDRT += findRes[i].GDRTBalance;
                        sumDARKCRYSTAL += findRes[i].DARKCRYSTALBalance;
                    }
                    res.status(200).json({
                        totalGameBalanceCRO: sumCRO,
                        totalGameBalanceMNG: sumMNG,
                        totalGameBalanceLION: sumLION,
                        totalGameBalanceUSDT: sumUSDT,
                        totalGameBalanceUSDC: sumUSDC,
                        totalGameBalanceMMF: sumMMF,
                        totalGameBalanceGDRT: sumGDRT,
                        totalGameBalanceDARKCRYSTAL: sumDARKCRYSTAL,
                    });
                } else {
                    res.status(200).json(0);
                }
            } catch (err) {
                console.log('get total game balance error: ', err);
                res.status(500).json('Internal server error.');
            }
        } else {
            res.status(401).json('Unauthorized');
        }
    },
    updateUserBalance: async (account, token, betValue, winValue) => {
        try {
            const findRes = await Wallet.findOne({ account });

            switch (token) {
                case 'MNG': {
                    await Wallet.findOneAndUpdate({ account }, {
                        MNGBalance: findRes.MNGBalance - betValue + winValue,
                        totalBetMNG: findRes.totalBetMNG + betValue
                    });
                    break;
                }
                case 'LION': {
                    await Wallet.findOneAndUpdate({ account }, {
                        LIONBalance: findRes.LIONBalance - betValue + winValue,
                        totalBetLION: findRes.totalBetLION + betValue
                    });
                    break;
                }
                case 'USDT': {
                    await Wallet.findOneAndUpdate({ account }, {
                        USDTBalance: findRes.USDTBalance - betValue + winValue,
                        totalBetUSDT: findRes.totalBetUSDT + betValue
                    });
                    break;
                }
                case 'USDC': {
                    await Wallet.findOneAndUpdate({ account }, {
                        USDCBalance: findRes.USDCBalance - betValue + winValue,
                        totalBetUSDC: findRes.totalBetUSDC + betValue
                    });
                    break;
                }
                case 'MMF': {
                    await Wallet.findOneAndUpdate({ account }, {
                        MMFBalance: findRes.MMFBalance - betValue + winValue,
                        totalBetMMF: findRes.totalBetMMF + betValue
                    });
                    break;
                }
                case 'GDRT': {
                    await Wallet.findOneAndUpdate({ account }, {
                        GDRTBalance: findRes.GDRTBalance - betValue + winValue,
                        totalBetGDRT: findRes.totalBetGDRT + betValue
                    });
                    break;
                }
                case 'DARKCRYSTAL': {
                    await Wallet.findOneAndUpdate({ account }, {
                        DARKCRYSTALBalance: findRes.DARKCRYSTALBalance - betValue + winValue,
                        totalBetDARKCRYSTAL: findRes.totalBetDARKCRYSTAL + betValue
                    });
                    break;
                }
                default: {
                    await Wallet.findOneAndUpdate({ account }, {
                        CROBalance: findRes.CROBalance - betValue + winValue,
                        totalBet: findRes.totalBet + betValue
                    });
                    break;
                }
            }
        } catch (err) {
            console.log('error in update user balance: ', err);
        }
    }
}