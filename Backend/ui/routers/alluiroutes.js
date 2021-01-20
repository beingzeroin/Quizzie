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

router.get("/save", (req, res) => {
    let data = decodeURIComponent(req.query.data)
    res.render('save.pug', { data: data })
})
router.get("/result/:quizId", (req, res) => {
    res.render('result.pug');
})
router.get("/feedbackform/:quizId", (req, res) => {
    res.render('feedbackform.pug');
})
router.get("/feedback/:quizId", (req, res) => {
    res.render('feedbacks.pug');
})

module.exports = router
module.exports = router