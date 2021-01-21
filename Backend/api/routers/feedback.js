const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const request = require("request");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
//const sharp = require('sharp');
const Admin = require("../models/admin");
const Quiz = require("../models/quiz");
const User = require("../models/user");
const emailTemplates = require("../../emails/email");

const item = require("../lib/itemlib")

const checkAuth = require("../middleware/checkAuth");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const checkAuthUser = require("../middleware/checkAuthUser");
const verifyURL = require("../middleware/verifyURL");
const Feedback = require("../models/feedback")

const router = express.Router();

router.post("/submit", async(req, res) => {
    feedbackdata={ _id: new mongoose.Types.ObjectId(),
        quizId      : req.body.quizId,
        userId      : req.body.userId,
        userName    : req.body.userName,
        description : req.body.description,
        rating      : req.body.rating,
        }
    item.createitem(feedbackdata, Feedback, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            res.status(200).json({ message: "created" })
        }
    })

})

router.get('/:quizid', async(req, res) => {
    item.getItemByQuery({ quizId: req.params.quizid }, Feedback, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            res.status(200).json({ result1: result })
        }
    })
})

module.exports = router;