exports.updateUserPermission = async (req, res, next) => {
    const User = req.app.locals.userModel;
    try {
        const user = await User.findById(req.user.id);
        user.permissions = req.body.permissions
        await user.save();
        res.status(200).json({
            status:200,
            message: 'User permission Updated Successfully '
        })
        
    } catch (error) {
        next(error)
    }
}