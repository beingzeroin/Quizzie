const express = require("express");
const router = express.Router();



const userRoutes = require("./user");
const adminRoutes = require("./admin");
const quizRoutes = require("./quiz");
const questionRoutes = require("./questions");
const authRoutes = require("./auth");
const authAdminRoutes = require("./auth-admin");
const generalRoutes = require("./general");
const ownerRoutes = require("./owner");
const feedbackRoutes = require("./feedback");


//IMPORT QUIZ AND USERS

const Quiz = require('./quiz');
const User = require('./user');
const Admin = require('./admin');


router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/quiz", quizRoutes);
router.use("/question", questionRoutes);
router.use("/auth", authRoutes);
router.use("/general", generalRoutes);
router.use("/owner", ownerRoutes);
router.use("/auth/admin", authAdminRoutes);
router.use("/feedback", feedbackRoutes);

module.exports = router;