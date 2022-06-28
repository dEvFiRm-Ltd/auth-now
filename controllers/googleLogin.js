const {createRefreshToken} = require('../utils/tokenCreate')
const {google} = require('googleapis')
const {OAuth2} = google.auth;
const bcrypt = require('bcrypt')
// const fetch = require('node-fetch')


exports.googleLogin = async(req, res) => {
    const googleClientID = req.app.locals.googleClientID;
    const googleClientSecret = req.app.locals.googleClientSecret;
    const Users = req.app.locals.userModel;
    const client = new OAuth2(googleClientID);
    try {
        const {tokenId} = req.body

        const verify = await client.verifyIdToken({idToken: tokenId, audience: googleClientID})
        
        const {email_verified, email, name, picture} = verify.payload

        const password = email + googleClientSecret;

        const passwordHash = await bcrypt.hash(password, 12)

        if(!email_verified) return res.status(400).json({msg: "Email verification failed."})

        const user = await Users.findOne({email})

        if(user && user.googleID ){
            // console.log();
            // console.log(user.googleID==password);
            const isMatch = await bcrypt.compare(password, user.googleID)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const refresh_token = createRefreshToken({id: user._id},req.app.locals.refreshTokenSecret)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({msg: "Login success!",refreshtoken:refresh_token})
        }else if(user && !user.googleID){
            user.googleID = passwordHash
            user.avatar = picture
            user.provider= 'google'
            user.name = name
            await user.save();
            const refresh_token = createRefreshToken({id: user._id},req.app.locals.refreshTokenSecret)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })
            res.json({msg: "Login with google success",refreshtoken:refresh_token})
        }else{
            const newUser = new Users({
                name, email, googleID: passwordHash, avatar: picture,provider: 'google'
            })

            await newUser.save()
            
            const refresh_token = createRefreshToken({id: user._id},req.app.locals.refreshTokenSecret)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({msg: "Login success!",refreshtoken:refresh_token})
        }


    } catch (err) {
        // console.log(err);
        return res.status(500).json({msg: err.message})
    }
}