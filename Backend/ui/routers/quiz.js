const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("request");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const router = express.Router();
const checkAuthUser = require("../middleware/checkAuthUser")
const item = require('../../api/lib/itemlib');
const User = require("../../api/models/user");
const Admin = require("../../api/models/admin");
const checkAuth = require("../middleware/checkAuth");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const Quiz = require("../../api/models/quiz")

router.get('/editQuiz/:quizid', checkAuthAdmin, (req, res) => {
    item.getItemById(req.params.quizid, Quiz, (err, result) => {
        if (err) res.send('Error has occured')
        else if (result) {
            console.log("quiz details", result);
            res.render('editQuiz.pug', { quizdetails: result });
        }
    })
})

router.get('/createQuiz', checkAuthAdmin, (req, res) => {
    res.render('createQuiz.pug');
})

router.get('/updateQuiz/:quizId', checkAuthAdmin, (req, res) => {
    item.getItemById(req.params.quizId, Quiz, (err, result) => {
        if (err) res.send('Error has occured')
        else if (result) res.render('updateQuiz.pug', { quizdetails: result });
        else res.send("Something went wrong")
    })
})

router.get("/start/:data", (req, res) => {
    let data = decodeURIComponent(req.params.data)
    res.render("startquiz.pug", { data: data })
})
module.exports = router;