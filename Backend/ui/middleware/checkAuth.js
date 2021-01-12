const JWT = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header['auth-token'];
    if (!token) return res.redirect('/ui/login/user')

    try {
        const verified = JWT.verify(token, process.env.jwtSecret);

        req.user = verified;
        // console.log(verified);

        next();
        // console.log("next");
    } catch (err) {
        res.redirect('/ui/login/user')
    }
};