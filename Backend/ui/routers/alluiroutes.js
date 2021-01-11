const express = require("express");
const router = express.Router();

const dashboard = require('./dashboard');
router.use('/dashboard', dashboard);

module.exports = router