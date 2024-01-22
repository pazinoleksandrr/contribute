const Token = require('mongoose').model('Token');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token || token === '') {
        return res.status(400).json("No token.");
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error || !decoded) {
            console.log('jwt error: ', error);
            return res.status(401).json("Unauthorized.");
        } else {
            const { token, account } = decoded;
            Token.findOne({ token: token, account: account }).then(async findRes => {
                if (findRes) {
                    next();
                } else {
                    return res.status(401).json("Unauthorized");
                }
            }).catch (err => {
                return res.status(500).json("Internal server error");
            })
        }
    });
}