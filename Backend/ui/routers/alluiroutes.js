const express = require("express");
const router = express.Router();

const dashboard = require('./dashboard');
const login = require("./login");
const signup = require("./signup");
const checkAuthUser = require("../middleware/checkAuthUser")
const item = require('../../api/lib/itemlib');
const User = require("../../api/models/user");
router.use('/dashboard', dashboard);
router.use('/login', login)
router.use('/signup', signup)

router.get("/updateProfile", checkAuthUser, (req, res) => {
    item.getItemById(req.user.userId, User, (err, result) => {
        if (err) res.send('Error has occured')
        else if (result) res.render('updateProfile.pug', { user: result });
        else res.send("Something went wrong")
    })
})
module.exports = router