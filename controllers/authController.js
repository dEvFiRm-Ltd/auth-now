const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {createRefreshToken,createAccessToken ,validateEmail} = require('../utils/tokenCreate')

//without email verification registration
exports.userRegisterController = async(req,res,next)=>{
    const Users = req.app.locals.userModel;
    const {email,password,name} = req.body;
    // console.log(req.body);
   try {
        if(!validateEmail(email)) return res.status(400).json({msg: "Invalid emails."});
  
         const user = await Users.findOne({email});
         if(user){
              return res.status(400).json({
                message:'User already exists'
              });
         }
            
            req.body.password= await bcrypt.hash(password,10);
            const newUser =   await Users.create(req.body);
            res.status(201).json({
                status:200,
                message:'User created successfully',
                userId:newUser._id
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
        if(!user) return res.status(400).json({msg: "Invalid Credentials"})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"})
        const refresh_token = createRefreshToken({id: user._id}, req.app.locals.refreshTokenSecret,req.app.locals.refreshTokenTimeOut)
        res.cookie('refreshtoken', refresh_token, 
        {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7*24*60*60*1000 // 7 days
        })

        res.json({msg: "Login success!",refreshtoken:refresh_token})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
} 
exports.getAccessToken = async(req, res) => {
    const logs = req.app.locals.logs;
    try {
        // const rf_token = req.cookies?.refreshtoken
        const rf_token =req.body.refreshToken
        if(!rf_token) return res.status(400).json({msg: "Please login now!"})

        jwt.verify(rf_token, req.app.locals.refreshTokenSecret, (err, user) => {
            if(err) return res.status(400).json({msg: "Please login now!"})

            const access_token = createAccessToken({id: user.id}, req.app.locals.accessTokenSecret,req.app.locals.refreshTokenTimeOut)
            res.json({access_token})
        })
    } catch (err) {
        // console.log(err);
        return res.status(500).json({msg: err.message})
    }
}



       