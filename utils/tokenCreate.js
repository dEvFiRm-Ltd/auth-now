const jwt = require('jsonwebtoken');
exports.createActivationToken = (payload) => {
    return jwt.sign(payload, req.app.locals.activationTokenSecret, {expiresIn: '5m'})
}

exports.createAccessToken = (payload,token) => {
    return jwt.sign(payload, token, {expiresIn: '15m'})
}

exports.createRefreshToken = (payload,refreshToken) => {
    return jwt.sign(payload, refreshToken, {expiresIn: '7d'})
} 