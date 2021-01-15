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
const Admin = require("../../api/models/admin")
const checkAuth = require("../middleware/checkAuth")

router.get("/", checkAuth, (req, res) => {
    if (req.user.userType == 'User') {
        item.getItemById(req.user.userId, User, (err, result) => {
            console.log(result)
            if (err) res.send('Error has occured')
            else if (result) res.render('dashboard.pug', { user: result });
            else res.send("Something went wrong")
        })
    } else if (req.user.userType == 'Admin') {
        item.getItemById(req.user.userId, Admin, (err, result) => {
            if (err) res.send('Error has occured')
            else if (result) res.render('dashboard.pug', { user: result });
            else res.send("Something went wrong")
        })
    }
})
module.exports = router