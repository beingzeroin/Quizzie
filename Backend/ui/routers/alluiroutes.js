const express = require("express");
const router = express.Router();

const dashboard = require('./dashboard');
const login = require("./login");
const signup = require("./signup");

router.use('/dashboard', dashboard);
router.use('/login', login)
router.use('/signup', signup)
module.exports = router