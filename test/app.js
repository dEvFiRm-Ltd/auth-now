require('dotenv').config()
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const morgan = require('morgan')
const Auth = require('auth-now');
const cors = require('cors');
const cookieParser = require('cookie-parser')


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

const auth = new Auth({
    model:require('./models/User'),
    googleClientID:process.env.GOOGLE_CLIENT_ID,
    googleClientSecret:process.env.GOOGLE_CLIENT_SECRET,
    facebookAppID:process.env.FACEBOOK_APP_ID,
    facebookAppSecret:process.env.FACEBOOK_APP_SECRET ,
    // accessTokenSecret,
    // refreshTokenSecret,
    expiresIn : {
        refreshToken:'7d',
        accessToken:'7d'
    }
})



// console.log('auth'+auth.userRegister());
// console.log(auth)
let {authUser,authAdmin,accessPermission} = auth
app.use('/user',auth.router(app)); 
app.get('/', async(req, res) => { 
    // const Users = req.app.locals.userModel;
    res.send('authSdk')
})
app.get('/user1/ok',authUser,accessPermission,(req, res)=>{
    res.send('authManager')
})

mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(5001, () => {
        console.log('Listening on port 5001');
    })
}
).catch(err => {
    console.log('Error connecting to MongoDB:', err.message);
}
);

