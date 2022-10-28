const bcrypt = require('bcrypt')
const {createRefreshToken} = require('../utils/tokenCreate')
const axios = require('axios')

exports.facebookLogin= async (req, res) => {
    const Users = req.app.locals.userModel
    try {
        const {accessToken, userID} = req.body

        const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
        
        // const data = await fetch(URL).then(res => res.json()).then(res => {return res})
        const response = await axios.get(URL)

        const {email, name, picture} = response.data

        // const password = email + process.env.FACEBOOK_SECRET
        const password = email + req.app.locals.facebookAppSecret //TODO: change to env variable

        const passwordHash = await bcrypt.hash(password, 12)

        const user = await Users.findOne({email})

        if(user && user.facebookID){
            const isMatch = await bcrypt.compare(password, user.facebookID)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const refresh_token = createRefreshToken({id: user._id}, req.app.locals.refreshTokenSecret)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({msg: "Login success!",refreshtoken:refresh_token})
        }else if(user && !user.facebookID){
            user.facebookID = passwordHash
            user.avatar = picture.data.url
            user.provider= 'facebook'
            user.name = name
            await user.save();
            const refresh_token = createRefreshToken({id: user._id},req.app.locals.refreshTokenSecret)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })
            res.json({msg: "Login with facebook success",refreshtoken:refresh_token})
        }else{
            const newUser = new Users({
                name, email, facebookID: passwordHash, avatar: picture.data.url ,provider: 'facebook'
            })

            await newUser.save()
            
            const refresh_token = createRefreshToken({id: newUser._id},req.app.locals.refreshTokenSecret,req.app.locals.refreshTokenTimeOut)
            // res.cookie('refreshtoken', refresh_token, {
            //     httpOnly: true,
            //     path: '/user/refresh_token',
            //     maxAge: 7*24*60*60*1000 // 7 days
            // })

            res.json({msg: "Login success!",refreshtoken:refresh_token})
        }


    } catch (err) {
        // console.log(err);
        return res.status(500).json({msg: err.message})
    }
}