const router = require('express').Router();



const {
    userRegisterController,
    userLoginController,
    getAccessToken,
} = require('./controllers/authController');
const {updateUserPermission} = require('./controllers/userPermissionController')
const {googleLogin} = require('./controllers/googleLogin');
const {facebookLogin}= require('./controllers/facebookLogin');
const{getUserInfo} = require('./controllers/getUserInfo');
const isAuthenticated = require('./middleware/auth')
const accessPermission = require('./middleware/UserAccessPermission');


router.post('/registration', userRegisterController);
router.post('/access_token',getAccessToken);
router.post('/google_login', googleLogin);
router.post('/facebook_login',facebookLogin);
router.get('/info',isAuthenticated,getUserInfo);
router.get('/', (req, res) => {
    res.send('Welcome to the Auth-now');
});
router.post('/login', userLoginController);

router.patch('/update-user-permissions',isAuthenticated,accessPermission,updateUserPermission);

module.exports = router;