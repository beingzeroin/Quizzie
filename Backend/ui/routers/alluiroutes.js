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

router.get("/updateProfile", checkAuth, (req, res) => {
    if (req.user.userType == 'User') {
        item.getItemById(req.user.userId, User, (err, result) => {
            if (err) res.send('Error has occured')
            else if (result) res.render('updateProfile.pug', { user: result });
            else res.send("Something went wrong")
        })
    } else if (req.user.userType == 'Admin') {
        item.getItemById(req.user.userId, Admin, (err, result) => {
            if (err) res.send('Error has occured')
            else if (result) res.render('updateProfile.pug', { user: result });
            else res.send("Something went wrong")
        })
    }

})

router.get("/result/:quizName/:quizId", (req, res) => {
     res.render('result.pug');
})
module.exports = router
module.exports = router