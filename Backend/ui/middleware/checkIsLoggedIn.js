const JWT = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("token")
    if (!token) next();
    try {
        const verified = JWT.verify(token, process.env.jwtSecret);
        return res.redirect("/ui/dashboard");

        // console.log(verified);


        // console.log("next");
    } catch (err) {
        next();
    }
};