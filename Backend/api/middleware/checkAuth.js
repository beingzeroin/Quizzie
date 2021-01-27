const JWT = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("token")
    console.log(token);
    if (!token) return res.status(401).json({
        message: "Unauthorized access",
    });

    try {
        const verified = JWT.verify(token, process.env.jwtSecret);

        req.user = verified;
        // console.log(verified);

        next();
        // console.log("next");
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access",
        });
    }
};