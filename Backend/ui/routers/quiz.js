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

router.get('/editQuiz/:quizid', (req, res) => {
    res.render('editQuiz.pug')
})

router.get('/createQuiz', (req, res) => {
    res.render('createQuiz.pug');
})

router.get('/updateQuiz/:quizId', (req, res) => {
    res.render('updateQuiz.pug');
})

router.get("/start", (req, res) => {
    let data = decodeURIComponent(req.query.data)
    res.render("startquiz.pug", { data: data })
})

router.get("/stats/:quizId", (req, res) => {
    res.render("Stats.pug")
})
module.exports = router;