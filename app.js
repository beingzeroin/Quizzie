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
const checksloggedin = require("./Backend/ui/middleware/checkIsLoggedIn")
sgMail.setApiKey(process.env.SendgridAPIKey);
const itemlib = require("./Backend/api/lib/itemlib");
////routers

const app = express();
var fs = require('fs');
var async = require('async'),
    http = require('http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(cors());


app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', checksloggedin, (req, res) => {
    console.log("rendering indx");
    res.render('home.pug')
});

app.use(express.static(__dirname + '/Frontend/public/'));

const apiroutes = require("./Backend/api/routers/allapiroutes")
const uiroutes = require("./Backend/ui/routers/alluiroutes");
const quiz = require("./Backend/api/models/quiz");


const dbURI = process.env.dbURI;

mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

console.log(Date.now())

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/ui', uiroutes);
app.use("/api", apiroutes);


// Allow CORS
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization,auth-token"
//     );
//     if (req.method === "OPTIONS") {
//         res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//         return res.status(200).json({});
//     }
//     next();
// });

// app.use(cors());



//route not found
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

// ////SEND REMINDER EMAIL 
// var rule = new schedule.RecurrenceRule();

// rule.minute = new schedule.Range(0, 59, 5);

// schedule.scheduleJob(rule, async function() {
//     let currentTime = Date.now();
//     const quizzes = await Quiz.find({
//         reminderSent: { $ne: true },
//         scheduledFor: {
//             $lte: currentTime + 30 * 60 * 1000,
//         }
//     })
//     console.log(`${quizzes.length} number of quizzes need to be reminded`);

//     for (let i = 0; i < quizzes.length; i++) {
//         console.log(quizzes[i])
//         for (j = 0; j < quizzes[i].usersEnrolled.length; j++) {
//             console.log(quizzes[i].usersEnrolled[j])
//             const user = await User.findById(quizzes[i].usersEnrolled[j].userId)
//             const msg = {
//                 to: user.email,
//                 from: process.env.sendgridEmail,
//                 subject: "Quzzie: Quiz Reminder",
//                 text: `This is an automatically genrated email sent from Quizzie. This is to remind you that your quiz ${quizzes[i].quizName} is scheduled at ${new Date(Number(quizzes[i].scheduledFor))}, Please login on time to not miss out on your quiz.`,
//             };

//             sgMail
//                 .send(msg)
//                 .then((result) => {
//                     console.log(`Reminder email for ${quizzes[i].quizName} to ${msg.to}`)
//                 })
//                 .catch((err) => {
//                     console.log('Some Error Occured', err.toString())
//                 });
//         }
//         await Quiz.updateOne({ _id: quizzes[i]._id }, { reminderSent: true })
//     }
//     // console.log(quizzes)
// });



let PORT = process.env.PORT || 3000;
// if (process.env.mode = 'devlopment')
//     PORT = process.env.development

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})