const JWT = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("token")
        // console.log(req.header['auth-token'])
    if (!token) return res.redirect('/ui/login/user')

    try {
        const verified = JWT.verify(token, process.env.jwtSecret);
        req.user = verified;
        // console.log(req.user)
        // console.log(req.user);
        if (req.user.userType === "User") {
            next();
        } else {
            res.redirect('/ui/login/user')

        }
    } catch (err) {
        res.redirect('/ui/login/user');
    }
};