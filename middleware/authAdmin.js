
const authAdmin = async (req, res, next) => {
    const Users = req.app.locals.userModel
    try {
        const user = await Users.findOne({_id: req.user.id})

        if(user.role !== 1) 
            return res.status(500).json({msg: "Admin resources access denied."})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin