// const router = require('express').Router();

const sendCookie= (req, res) => {
    const rf_token = req.cookies?.refreshtoken
        console.log(rf_token);
        res.cookie('send','abc');

        res.send( 'token',rf_token);
}


module.exports = sendCookie