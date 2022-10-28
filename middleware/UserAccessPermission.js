const permission = async (req, res, next) => {
    const User = req.app.locals.userModel
    try {
        const user = await User.findOne({_id: req.user.id})

        if(user.role == 1) {
             next()
        }else{
            let path = req.originalUrl.split('/')[2]
            if(req.params){
                path = path.split('?')[0]
            }
            if(user.permissions.includes(path)){
                next()
            }else{
                return res.status(403).json({
                    status: 403,
                    msg: "Admin resources access denied."
                })
            }
        }
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = permission