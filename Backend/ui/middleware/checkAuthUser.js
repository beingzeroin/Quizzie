const JWT = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header['auth-token'];
    // console.log(req.header['auth-token'])
    if (!token) res.redirect('/ui/login')

    try {
        const verified = JWT.verify(token, process.env.jwtSecret);
        req.user = verified;
        // console.log(req.user);
        if (req.user.userType === "User") {
            next();
        } else {
            res.redirect('/ui/login')

        }
    } catch (err) {
        res.redirect('/ui/login');
    }
};