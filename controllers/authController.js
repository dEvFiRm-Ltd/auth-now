const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

//without email verification registration
exports.userRegisterController = async(req,res,next)=>{
    console.log('model in controller',req.app.locals.userModel); 
    const Users = req.app.locals.userModel;
    const {email,password,name} = req.body;
    console.log(req.body);
   try {
        // if(!validateEmail(email))return res.status(400).json({msg: "Invalid emails."})
        console.log('here');
         const user = await Users.findOne({email});
         if(user){
              return res.status(400).json({
                message:'User already exists'
              });
         }
            const newUser = new Users({
                email,
                password: await bcrypt.hash(password,10),
                name:name || email.split('@')[0]
            });
            await newUser.save();
            res.status(201).json({
                status:200,
                message:'User created successfully'
            });

    
   } catch (error) {
    next(error);
   }
}
// custom user login 
exports.userLoginController = async (req, res) => {
    const Users = req.app.locals.userModel;

    try {
        const {email, password} = req.body
        const user = await Users.findOne({email})
        if(!user) return res.status(400).json({msg: "This email does not exist."})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

        const refresh_token = createRefreshToken({id: user._id}, req.app.locals.refreshTokenSecret)
        res.cookie('refreshtoken', refresh_token, 
        {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7*24*60*60*1000 // 7 days
        }
        )

        res.json({msg: "Login success!",refreshtoken:refresh_token})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
} 
exports.getAccessToken = async(req, res) => {
    try {
        // const rf_token = req.cookies?.refreshtoken
        const rf_token =req.body.refreshToken
        // console.log(rf_token);
        if(!rf_token) return res.status(400).json({msg: "Please login now!"})

        jwt.verify(rf_token, req.app.locals.refreshTokenSecret, (err, user) => {
            if(err) return res.status(400).json({msg: "Please login now!"})

            const access_token = createAccessToken({id: user.id}, req.app.locals.accessTokenSecret)
            res.json({access_token})
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({msg: err.message})
    }
},
exports.googleLogin= async(req, res) => {

}




function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, req.app.locals.activationTokenSecret, {expiresIn: '5m'})
}

const createAccessToken = (payload,token) => {
    return jwt.sign(payload, token, {expiresIn: '15m'})
}

const createRefreshToken = (payload,refreshToken) => {
    return jwt.sign(payload, refreshToken, {expiresIn: '7d'})
}       