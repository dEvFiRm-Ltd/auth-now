const jwt = require('jsonwebtoken');

exports.createAccessToken = (payload,token) => {
    return jwt.sign(payload, token, {expiresIn: '15m'})
}

exports.createRefreshToken = (payload,refreshToken) => {
    return jwt.sign(payload, refreshToken, {expiresIn: '7d'})
} 

exports.validateEmail = (email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}