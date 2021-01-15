const JWT = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header['auth-token'];
    if (!token) return res.redirect('/ui/login/organizer')

    try {
        const verified = JWT.verify(token, process.env.jwtSecret);
        req.user = verified;
        // console.log(req.user);
        if (req.user.userType === "Admin") {
            next();
        } else {
            res.redirect('/ui/login/organizer')
        }
    } catch (err) {
        res.redirect('/ui/login/organizer')
    }
};