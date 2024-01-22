const config = require('../config');
const Token = require('mongoose').model('Token');
const Wallet = require('mongoose').model('Wallet');
const jwt = require('jsonwebtoken');

module.exports = {
    handleConnect: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            try {
                const { account } = req.body;
                const findRes = await Token.findOne({ account });
            
                const token = Math.floor(Math.random() * 10000000);
            
                if (findRes) {
                    await Token.findOneAndUpdate({ account }, { token });
                } else {
                    let newTokenData = {
                        account,
                        token,
                    }
                    await new Token(newTokenData).save();
                }
            
                jwt.sign(
                    { token, account },
                    process.env.SECRET_KEY,
                    {},
                    (err, token) => {
                        res.json(token);
                    }
                )
            } catch (err) {
                console.log('error in connect: ', err);
                res.status(500).json("Internal server error.");
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    checkConnected: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            res.status(200).json(true);
        } else {
            res.status(401).json("Unauthorized");
        }
    },
    handleWithdraw: async (req, res) => {
        if (req.get('origin') === process.env.CLIENT_ORIGIN) {
            const { account, token, isReferral } = req.body;

            try {
                const userData = await Wallet.findOne({ account });

                if (token === 'CRO') {
                    if (userData.CROBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                } else if (token === 'MNG') {
                    if (userData.MNGBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                } else if (token === 'LION') {
                    if (userData.LIONBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                } else if (token === 'USDT') {
                    if (userData.USDTBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                } else if (token === 'USDC') {
                    if (userData.USDCBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                } else if (token === 'MMF') {
                    if (userData.MMFBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                } else if (token === 'GDRT') {
                    if (userData.GDRTBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                } else if (token === 'DARKCRYSTAL') {
                    if (userData.DARKCRYSTALBalance < req.body.amount) {
                        return res.status(400).json('Exceeds the balance.');
                    }
                }
                
                const Provide = require('@truffle/hdwallet-provider');
                const rpcUrl = config.rpcUrl;
                
                const Web3 = require('web3');
                const ownerKey = config.managerKey;
                const ownerAddress = config.managerAddress;
                const receiverAddress = account;
                
                const provider = new Provide(ownerKey, rpcUrl);
                const web3 = new Web3(provider);

                let tRes = null;
                const nonce = await web3.eth.getTransactionCount(ownerAddress, 'latest');
                if (isReferral || token === 'CRO') {
                    let amount = web3.utils.toWei((req.body.amount-0.1).toString(), 'ether');
                    
                    var rawTransaction = {
                        "from": ownerAddress,
                        "to": receiverAddress,
                        "value":  amount,
                        "chainId": web3.utils.toHex(config.netId),
                        "nonce": nonce,
                    };
                    
                    tRes = await web3.eth.sendTransaction(rawTransaction).catch(err => {
                        console.log('error in withdraw in block: ', err);
                        return res.status(500).json('Error in network.');
                    });
                } else {
                    let contract;
                    let amount = 0;

                    if (token === 'MNG') {
                        amount = web3.utils.toWei(req.body.amount.toString(), 'ether');
                        contract = new web3.eth.Contract(config.mngAbi, config.mngAddress);
                    } else if (token === 'LION') {
                        amount = web3.utils.toWei(req.body.amount.toString(), 'ether');
                        contract = new web3.eth.Contract(config.lionAbi, config.lionAddress);
                    } else if (token === 'USDT') {
                        amount = web3.utils.toWei(req.body.amount.toString(), 'mwei');
                        contract = new web3.eth.Contract(config.erc20Abi, config.usdtAddress);
                    } else if (token === 'USDC') {
                        amount = web3.utils.toWei(req.body.amount.toString(), 'mwei');
                        contract = new web3.eth.Contract(config.erc20Abi, config.usdcAddress);
                    } else if (token === 'MMF') {
                        amount = web3.utils.toWei(req.body.amount.toString(), 'ether');
                        contract = new web3.eth.Contract(config.erc20Abi, config.mmfAddress);
                    } else if (token === 'GDRT') {
                        amount = web3.utils.toWei(req.body.amount.toString(), 'ether');
                        contract = new web3.eth.Contract(config.erc20Abi, config.gdrtAddress);
                    } else if (token === 'DARKCRYSTAL') {
                        amount = web3.utils.toWei(req.body.amount.toString(), 'ether');
                        contract = new web3.eth.Contract(config.erc20Abi, config.darkcrystalAddress);
                    }

                    tRes = await contract.methods.transfer(receiverAddress, amount).send({ from: config.managerAddress, nonce }).catch(err => {
                        console.log('error in withdraw in block: ', err);
                        return res.status(500).json('Error in network.');
                    });
                }

                if (!tRes.socket) {
                    if (isReferral) {
                        await Wallet.findOneAndUpdate({ account }, {
                            referProfit: 0,
                            $push: { WithdrawTransactions: {
                                from: tRes.from,
                                to: tRes.to,
                                hash: tRes.transactionHash,
                                amount: req.body.amount - 0.1,
                                order: userData.DepositTransactions.length + userData.WithdrawTransactions.length,
                                type: 'referral',
                            }},
                        });
                    } else {
                        let key = `${token}Balance`
                        await Wallet.findOneAndUpdate({ account }, {
                            [key]: userData[[key]] - req.body.amount,
                            $push: { WithdrawTransactions: {
                                from: tRes.from,
                                to: tRes.to,
                                hash: tRes.transactionHash,
                                amount: req.body.amount,
                                order: userData.DepositTransactions.length + userData.WithdrawTransactions.length,
                                token,
                            }},
                        });
                    }
                } else {
                    console.log('error due to socket.');
                    return res.status(500).json('Error in network.');
                }

                res.status(200).json({
                    success: true,
                    data: tRes,
                });
            } catch (err) {
                console.log('error in withdraw: ', err);
                res.status(500).json({
                    success: false,
                    data: err,
                });
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    }
}