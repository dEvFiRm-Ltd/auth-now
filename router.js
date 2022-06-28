const router = require('express').Router();



const {
    userRegisterController,
    userLoginController,
    getAccessToken,
} = require('./controllers/authController');
const {googleLogin} = require('./controllers/googleLogin');
const {facebookLogin}= require('./controllers/facebookLogin');
const{getUserInfo} = require('./controllers/getUserInfo');
const isAuthenticated = require('./middleware/auth')


router.post('/registration', userRegisterController);
router.post('/refresh_token',getAccessToken);
router.post('/google_login', googleLogin);
router.post('/facebook_login',facebookLogin);
router.get('/info',isAuthenticated,getUserInfo);
router.get('/', (req, res) => {
    res.send('Welcome to the Auth API');
});
router.post('/login', userLoginController);

module.exports = router;