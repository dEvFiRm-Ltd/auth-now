exports.getUserInfo= async (req, res) => {
    let Users = req.app.locals.userModel
    try {
        const user = await Users.findById(req.user.id).select('-password -facebookID -googleID')

        res.json(user)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}