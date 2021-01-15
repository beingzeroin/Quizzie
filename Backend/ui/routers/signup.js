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

router.get("/user", (req, res) => {
    res.render('signup.pug');
})

router.get("/organizer", (req, res) => {
    res.render('signup_organizer.pug');
})

module.exports = router