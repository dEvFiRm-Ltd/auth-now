const router = require('./router');
const user = require('./middleware/auth');
const admin = require('./middleware/authAdmin');
const {userRegistration} = require('./controllers/authController')
module.exports = class Config {
    constructor({
        model,
        googleClientID,
        googleClientSecret,
        facebookAppID,
        facebookAppSecret,
        accessTokenSecret = 'access343sdfjhd',
        refreshTokenSecret = 'refreshsdfjhd',
    }) {
        this.router = function (app) {
            // user model
            app.locals.userModel = model;
            // for social
            app.locals.googleClientID = googleClientID;
            app.locals.googleClientSecret = googleClientSecret;
            app.locals.facebookAppID = facebookAppID;
            app.locals.facebookAppSecret = facebookAppSecret;
            // token secret
            app.locals.accessTokenSecret = accessTokenSecret;
            app.locals.refreshTokenSecret = refreshTokenSecret;

            return router;
        };
        this.userRegister = userRegistration;
        this.authUser = user;
        this.authAdmin = admin;
    }
}

//password error workings
