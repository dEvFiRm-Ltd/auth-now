const jwt = require('jsonwebtoken');

exports.createAccessToken = (payload,token,time) => {
    return jwt.sign(payload, token, {expiresIn: time || '15m' })
}

exports.createRefreshToken = (payload,refreshToken,time) => {
    console.log(time);
    return jwt.sign(payload, refreshToken, {expiresIn:time || '7d'})
} 

exports.validateEmail = (email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}