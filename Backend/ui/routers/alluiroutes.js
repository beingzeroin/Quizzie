const express = require("express");
const router = express.Router();

const dashboard = require('./dashboard');
const login = require("./login");
const signup = require("./signup");
const QUIZ = require("./quiz");

const item = require('../../api/lib/itemlib');
const User = require("../../api/models/user");
const Quiz = require("../../api/models/quiz");
const Admin = require("../../api/models/admin")


const checkAuthUser = require("../middleware/checkAuthUser")
const checkAuth = require("../middleware/checkAuth")
const checksloggedin = require("../middleware/checkIsLoggedIn")

router.use('/dashboard', dashboard);

router.use('/login', login)

router.use('/signup', signup)

router.use('/quiz', QUIZ)

router.get("/updateProfile", (req, res) => {
    res.render('updateProfile.pug');
})

router.get("/result", checkAuthUser, (req, res) => {
    item.getItemById(req.user.userId, User, (err, result) => {
        if (err) res.send('Error has occured')
        else if (result) res.render('result.pug', { user: result });
        else res.send("Something went wrong")
    })
})
module.exports = router
module.exports = router