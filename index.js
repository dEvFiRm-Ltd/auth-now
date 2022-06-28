const router = require('./router');
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
            app.locals.googleClientID = googleClientID;
            app.locals.googleClientSecret = googleClientSecret;
            app.locals.facebookAppID = facebookAppID;
            app.locals.facebookAppSecret = facebookAppSecret;

            // token secret
            app.locals.accessTokenSecret = accessTokenSecret;
            app.locals.refreshTokenSecret = refreshTokenSecret;


            return router;
        };
        this.userRegister = function(){
            console.log('help');
            console.log('register');
        }
    }
}
