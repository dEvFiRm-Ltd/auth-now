const jwt = require('jsonwebtoken');

exports.createAccessToken = (payload,token) => {
    return jwt.sign(payload, token, {expiresIn: '15m'})
}

exports.createRefreshToken = (payload,refreshToken) => {
    return jwt.sign(payload, refreshToken, {expiresIn: '7d'})
} 