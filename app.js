const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const passportSetup = require("./Backend/api/config/passport-setup");
const passportSetupAdmin = require("./Backend/api/config/passport-setup-admin");
const passport = require("passport");
const cors = require("cors");
const cookieSession = require("cookie-session");
const ipfilter = require('express-ipfilter').IpFilter
const rateLimit = require("express-rate-limit");
const schedule = require('node-schedule');
const sgMail = require("@sendgrid/mail");
const emailTemplates = require("./Backend/emails/email");
const checkAuthUser = require("./Backend/api/middleware/checkAuthUser")
sgMail.setApiKey(process.env.SendgridAPIKey);
const itemlib = require("./Backend/api/lib/itemlib");
////routers

const app = express();


app.set('view engine', 'pug');
app.set('views', './views');


app.get('/', (req, res) => {
        console.log("rendering indx");
        res.render('home.pug')
});
app.use(express.static(__dirname + '/Frontend/public/'));



let PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})