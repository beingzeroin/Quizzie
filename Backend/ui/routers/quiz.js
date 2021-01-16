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
const checkAuthUser = require("../middleware/checkAuthUser");
const router = express.Router();

router.get("/start/:id", (req, res) => {
    res.render("startquiz.pug")
})

module.exports = router