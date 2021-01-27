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
    res.render('login.pug');
})

router.get("/organizer", (req, res) => {
    res.render('login_organizer.pug');
})
router.get("/owner", (req, res) => {
    res.render('login_owner.pug')
})
module.exports = router