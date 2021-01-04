const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const passportSetup = require("./Backend/api/config/passport-setup");
const passportSetupAdmin = require("./Backend/api/config/passport-setup-admin");
const passport = require("passport");
const cors = require("cors");

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SendgridAPIKey);

//routers

const app = express();
var fs = require('fs');


// var apiRouter = require('./Backend/api/routers/allRoutes');
var async = require('async'),
http = require('http');

app.use(express.static('./Frontend/public'));
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'pug');
app.set('views', './views');

const userRoutes = require("./Backend/api/routers/user");
const adminRoutes = require("./Backend/api/routers/admin");
const quizRoutes = require("./Backend/api/routers/quiz");
const questionRoutes = require("./Backend/api/routers/questions");
const authRoutes = require("./Backend/api/routers/auth");
const authAdminRoutes = require("./Backend/api/routers/auth-admin");
const generalRoutes = require("./Backend/api/routers/general");
const ownerRoutes = require("./Backend/api/routers/owner");


//IMPORT QUIZ AND USERS

const Quiz = require('./Backend/api/models/quiz');
const User = require('./Backend/api/models/user');
const Admin = require('./Backend/api/models/admin');


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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(Date.now())

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.get('/', async (req, res) => {
	res.send('hi')
  })

function init() {
	console.log("init");
  app.get('/', (req, res) =>{
	  console.log("rendering indx");
	   res.render('index')
	});
	console.log('no')

  // ALL SPECIFIC PAGES SHOULD BE CALLED HERE
//   app.use('/api', apiRouter);
//   app.use('/auth',authRouter);

  // PLACEHOLDER FOR GETTING ANY PAGE FROM VIEWS
  app.get('/:pagename', function (req, res) {
    console.log("redirecting to");
	console.log(req.params.pagename,__dirname);
	// let pos = __dirname
    if (fs.existsSync(__dirname + '/views/' + req.params.pagename + '.pug')) {
      res.render(req.params.pagename, {
        pageTitle: req.params.pagename
      })
    } else {
      res.render('404', {
        pageTitle: 'Page Not Found'
      })
    }
  });

  http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
  });
}

async.series([],
	function (err, results) {
	  if (err) {
		console.log('Exception initializing database.');
		throw err;
	  } else {
		console.log('Database initialization complete.');
		init();
	  }
	});

/////Rate Limiter
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	max: 150, // limit each IP to 100 requests per windowMs
// });

// //  apply to all requests
// app.use(limiter);

// Allow CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization,auth-token"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

app.use(cors());

// app.use("/user", userRoutes);
// app.use("/admin", adminRoutes);
// app.use("/quiz", quizRoutes);
// app.use("/question", questionRoutes);
// app.use("/auth", authRoutes);
// app.use("/general", generalRoutes);
// app.use("/owner", ownerRoutes);
// app.use("/auth/admin", authAdminRoutes);




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

//SEND REMINDER EMAIL 

// schedule.scheduleJob(rule, async function(){
//   let currentTime = Date.now();
//   const quizzes = await Quiz.find({
//     reminderSent: {$ne: true},
//     scheduledFor: {
//       $lte: currentTime + 30*60*1000,
//     }
//   })
//   console.log(`${quizzes.length} number of quizzes need to be reminded`);

//   for(let i = 0; i < quizzes.length; i++){
//     console.log(quizzes[i])
//     for(j = 0; j < quizzes[i].usersEnrolled.length; j++){
//       console.log(quizzes[i].usersEnrolled[j])
//       const user = await User.findById(quizzes[i].usersEnrolled[j].userId)
//       const msg = {
//         to: user.email,
//         from: process.env.sendgridEmail,
//         subject: "Quzzie: Quiz Reminder",
//         text: `This is an automatically genrated email sent from Quizzie. This is to remind you that your quiz ${quizzes[i].quizName} is scheduled at ${new Date(Number(quizzes[i].scheduledFor))}, Please login on time to not miss out on your quiz.`,
//       };
    
//       sgMail
//         .send(msg)
//         .then((result) => {
//           console.log(`Reminder email for ${quizzes[i].quizName} to ${msg.to}`)
//         })
//         .catch((err) => {
//           console.log('Some Error Occured', err.toString())
//         });
//     }  
//     await Quiz.updateOne({ _id: quizzes[i]._id }, { reminderSent: true })
//   }
//   // console.log(quizzes)
// });

const port = process.env.port || 3000;

// app.listen(PORT, () => {
// 	console.log(`Listening on port ${PORT}`);
// });
