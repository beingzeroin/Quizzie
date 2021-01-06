const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const passport = require("passport");
//const sharp = require('sharp');

const item = require("../lib/itemlib")
const User = require("../models/user");
const request = require("request");
const Quiz = require("../models/quiz");
const Admin = require("../models/admin");
const Owner = require("../models/owner");

const checkAuth = require("../middleware/checkAuth");
const verifyURL = require("../middleware/verifyURL");
const router = express.Router();

router.get("/checkUser", async(req, res) => {
    if (req.user.userType == "User") {
        const populateJson = { path: "quizzesEnrolled", populate: { path: "quizId" } }
        item.getItemByQueryWithPopulateAndSelect({ _id: req.user.userId }, User, populateJson, "-password", (err, result) => {
            if (err) {
                res.status(400).json({
                    error: err,
                });
            } else {
                res.status(200).json({
                    result,
                });
            }
        })

    } else if (req.user.userType == "Admin") {
        const populateJson = { path: "quizzes", populate: { path: "quizId" } }
        item.getItemByQueryWithPopulateAndSelect({ _id: req.user.userId }, Admin, populateJson, "-password", (err, result) => {
            if (err) {
                res.status(400).json({
                    error: err,
                });
            } else {
                res.status(200).json({
                    result,
                });
            }
        })
    } else {
        item.getItemByQueryWithSelect({ _id: req.user.userId }, Owner, "-password", (err, result) => {
            if (err) {
                res.status(400).json({
                    error: err,
                });
            } else {
                res.status(200).json({
                    result,
                });
            }
        })

    }
});

router.post("/verifyReCaptcha", verifyURL, async(req, res, next) => {
    if (!req.body.captcha) {
        return res.status(400).json({
            message: "No recaptcha token",
        });
    }
    request(req.verifyURL, (err, response, body) => {
        body = JSON.parse(body);
        if (!body.success || body.score < 0.4) {
            return res.status(401).json({
                message: "Something went wrong",
            });
        }
        res.status(200).json({
            message: "Verified",
        });
    });
});

module.exports = router;