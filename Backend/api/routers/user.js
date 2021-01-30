const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const request = require("request");
//const sharp = require('sharp');
const User = require("../models/user");
const Quiz = require("../models/quiz");
const emailTemplates = require("../../emails/email");

const item = require("../lib/itemlib")
const checkAuth = require("../middleware/checkAuth");
const checkAuthUser = require("../middleware/checkAuthUser");
const verifyURL = require("../middleware/verifyURL");
const { RuleTester } = require("eslint");
const { Router } = require("express");

const router = express.Router();

sgMail.setApiKey(process.env.SendgridAPIKey);

///Send Verification email

router.get("/:userid", (req, res) => {
    item.getItemById(req.params.userid, User, (err, result) => {
        if (err)
            console.log("error", e);
        else {
            console.log(result);
            res.send(result);
        }
    })
})
router.post("/resendVerificationEmail", verifyURL, async(req, res, next) => {
    const { email } = req.body;
    if (!req.body.captcha) {
        return res.status(400).json({
            message: "No recaptcha token",
        });
    }
    var flag = 0;
    console.log(req.verifyURL);
    request(req.verifyURL, (err, response, body) => {
        body = JSON.parse(body);
        console.log(err)
        console.log(body)
        try {
            if (!body.success || body.score < 0.4) {
                flag = 1
                return res.status(401).json({
                    message: "Something went wrong",
                });
            }
            if (err) {
                return res.status(401).json({
                    message: err.toString(),
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            })
        }
    });
    console.log(flag)
    const user = await User.findOne({ email });
    if (user) {
        user.verificationKey = shortid.generate();
        user.verificationKeyExpires = new Date().getTime() + 20 * 60 * 1000;
        await user
            .save()
            .then((result) => {
                const msg = {
                    to: email,
                    from: process.env.sendgridEmail,
                    subject: "Quzzie: Email Verification",
                    text: " ",
                    html: emailTemplates.VERIFY_EMAIL(result),
                };

                sgMail
                    .send(msg)
                    .then((result) => {
                        res.status(200).json({
                            message: "Password reset key sent to email",
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            // message: "something went wrong1",
                            error: err.toString(),
                        });
                    });
            })
            .catch((err) => {
                res.status(400).json({
                    message: "Some error occurred",
                    error: err.toString(),
                });
            });
    }
});

///Verify email
router.patch("/verifyEmail",async(req, res, next) => {
    //console.log(req.body)
    const { verificationKey } = req.body;
    await User.findOne({ verificationKey })
        .then(async(user) => {
            if (Date.now() > user.verificationKeyExpires) {
                res.status(401).json({
                    message: "Pass key expired",
                });
            }
            user.verificationKeyExpires = null;
            user.verificationKey = null;
            user.isEmailVerified = true;
            await user
                .save()
                .then((result1) => {
                    res.status(200).json({
                        message: "User verified",
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        message: "Some error",
                        error: err.toString(),
                    });
                });
        })
        .catch((err) => {
            res.status(409).json({
                message: "Invalid verification key",
                error: err.toString(),
            });
        });
});

////Signup --------DONE
router.post("/signup", async(req, res, next) => {
    // 	if (!req.body.captcha) {
    // 		return res.status(400).json({
    // 			message: "No recaptcha token",
    // 		});
    //   }
    //   var flag = 0;
    //   console.log(req.verifyURL);
    // 	request(req.verifyURL, (err, response, body) => {
    //     body = JSON.parse(body);
    //     console.log(err)
    //     console.log(body)
    //     try{
    //       if (!body.success || body.score < 0.4) {
    //         flag = 1
    //         return res.status(401).json({
    //           message: "Something went wrong",
    //         });
    //       }
    //       if(err){
    //         return res.status(401).json({
    //           message: err.toString(),
    //         });
    //       }
    //     }catch(err){
    //       return res.status(500).json({
    //         error: err
    //       })
    //     }
    //   });
    //   console.log(flag)
    item.getItemByQuery({ email: req.body.email }, User, (err, user) => {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "Email already exists",
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                        });
                    } else {
                        const user = {
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            mobileNumber: req.body.mobileNumber,
                            isEmailVerified: false,
                        };
                        item.createitem(user, User, async(err, result) => {
                            if (err) {
                                res.status(500).json({
                                    error: err,
                                });
                            } else {
                                result.verificationKey = shortid.generate();
                                result.verificationKeyExpires =
                                    new Date().getTime() + 20 * 60 * 1000;
                                await result
                                    .save()
                                    .then((result1) => {
                                        const msg = {
                                            to: result.email,
                                            from: process.env.sendgridEmail,
                                            subject: "Quizzie: Email Verification",
                                            text: " ",
                                            html: emailTemplates.VERIFY_EMAIL(result1),
                                        };

                                        sgMail
                                            .send(msg)
                                            .then((result) => {
                                                console.log("Email sent");
                                            })
                                            .catch((err) => {
                                                console.log(err.toString());
                                                res.status(500).json({
                                                    // message: "something went wrong1",
                                                    error: err,
                                                });
                                            });
                                        res.status(201).json({
                                            message: "user created",
                                            userDetails: {
                                                userId: result._id,
                                                email: result.email,
                                                name: result.name,
                                                mobileNumber: result.mobileNumber,
                                            },
                                        });
                                    })
                                    .catch((err) => {
                                        res.status(400).json({
                                            message: "Error",
                                            error: err.toString(),
                                        });
                                    });
                            }
                        })
                    }

                })
            }
        }
    })

});

////Login ------DONE
router.post("/login", async(req, res, next) => {
    // if (!req.body.captcha) {
    //     return res.status(400).json({
    //         message: "No recaptcha token",
    //     });
    // }
    // var flag = 0;
    // request(req.verifyURL, (err, response, body) => {
    //     body = JSON.parse(body);
    //     console.log(err)
    //     console.log(body)
    //     try {
    //         if (!body.success || body.score < 0.4) {
    //             flag = 1
    //             return res.status(401).json({
    //                 message: "Something went wrong",
    //             });
    //         }
    //         if (err) {
    //             return res.status(401).json({
    //                 message: err.toString(),
    //             });
    //         }
    //     } catch (err) {
    //         return res.status(500).json({
    //             error: err
    //         })
    //     }
    // });
    // console.log(flag)
    item.getItemByQuery({ email: req.body.email }, User, (err, user) => {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed: Email not found probably",
                });
            }
            // if (user[0].isEmailVerified === false) {
            //     return res.status(409).json({
            //         message: "Please verify your email",
            //     });
            // }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed",
                    });
                }
                if(user[0].isEmailVerified)
                {if (result) {
                    console.log(result)
                    const token = jwt.sign({
                            userType: user[0].userType,
                            userId: user[0]._id,
                            email: user[0].email,
                            name: user[0].name,
                            mobileNumber: user[0].mobileNumber,
                        },
                        process.env.jwtSecret, {
                            expiresIn: "1d",
                        }
                    );
                    // req.header['auth-token'] = token;
                    return res.status(200).json({
                       
                        message: "Auth successful",
                        userDetails: {
                            userType: user[0].userType,
                            userId: user[0]._id,
                            name: user[0].name,
                            email: user[0].email,
                            mobileNumber: user[0].mobileNumber,
                            isEmailVerified: user[0].isEmailVerified,
                        },
                        token: token,
                    });
                }

                res.status(401).json({
                    message: "Auth failed1",
                });
            }
            console.log("Not Verified")
            res.status(401).json({
                message: "Your Is Email Not Verified",
            });
            });
        }
    });
});

router.get("/google", (req, res, next) => {
    res.send("Welcome you are logged in as " + req.user);
});

////Get Profile
router.get("/", checkAuthUser, async(req, res, next) => {
    populateJson = {
        path: "quizzesEnrolled",

        populate: { path: "quizId", populate: { path: "adminId" } },
    }
    item.getItemByIdWithPopulate(req.user.userId, User, populateJson, (err, result1) => {
        if (err) {
            res.status(400).json({
                message: "Error",
            });
        } else {
            res.status(200).json({
                result1,
            });
        }
    })
});

router.get(
    "/quiz/check", checkAuthUser,
    async(req, res, next) => {
        populateJson = {
            path: "quizzesGiven",

            populate: { path: "quizId", populate: { path: "adminId" } }
        }
        console.log("id", req.user.userId);

        item.getItemByIdWithPopulate(req.user.userId, User, populateJson, (err, result) => {
            if (err) {
                return res.status(400).json({
                    err,
                });
            } else {
                return res.status(200).json({
                    result: result.quizzesGiven,
                });
            }
        })


    }
);

router.get(
    "/quizzesGiven", checkAuthUser,
    async(req, res, next) => {

        populateJson = {
            path: "quizzesGiven",

            populate: { path: "quizId", populate: { path: "adminId" } }
        }
        console.log("id", req.user.userId);

        item.getItemByIdWithPopulate(req.user.userId, User, populateJson, (err, result) => {
            if (err) {
                res.status(400).json({
                    err,
                });
            } else {
                res.status(200).json({
                    result: result.quizzesGiven,
                });
            }
        })

    }
);
router.get(
    "/studentQuizResult/:quizId", checkAuthUser,
    async(req, res, next) => {
        const studentId = req.user.userId;
        if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
            item.getItemById(studentId, User, (err, user) => {
                const quizLength = user.quizzesGiven.length;
                const quizId = req.params.quizId;
                for (i = 0; i < quizLength; i++) {
                    if (quizId == user.quizzesGiven[i].quizId) {
                        var result = user.quizzesGiven[i];
                    }
                }
                if (result) {
                    return res.status(200).json({
                        message: "Retrieved",
                        result: result,
                    });
                }
                res.status(400).json({
                    message: "Quiz not found in Database",
                });
            })

        }
    }
);

//Update user profile
router.patch("/updateProfile", checkAuthUser, (req, res, next) => {
    // if (!req.body.captcha) {
    //     return res.status(400).json({
    //         message: "No recaptcha token",
    //     });
    // }
    // var flag = 0;
    // console.log(req.verifyURL);
    // request(req.verifyURL, (err, response, body) => {
    //     body = JSON.parse(body);
    //     console.log(err)
    //     console.log(body)
    //     try {
    //         if (!body.success || body.score < 0.4) {
    //             flag = 1
    //             return res.status(401).json({
    //                 message: "Something went wrong",
    //             });
    //         }
    //         if (err) {
    //             return res.status(401).json({
    //                 message: err.toString(),
    //             });
    //         }
    //     } catch (err) {
    //         return res.status(500).json({
    //             error: err
    //         })
    //     }
    // });
    // console.log(flag)
    const id = req.user.userId;
    const updateOps = {};
    console.log(req.body);
    updateOps.name = req.body.name;
    updateOps.mobileNumber = req.body.mobileNumber;
    console.log(updateOps);
    // console.log(req.body.name,req.body.mobileNumber);
    // const updateOps = {};
    // const updatableFields = ["name", "mobileNumber"];
    // var flag = 0;
    // for (const ops of req.body.updateOps) {
    //     if (updatableFields.includes(ops.propName)) {
    //         updateOps[ops.propName] = ops.value;
    //     }
    // }
    item.updateItemField({ _id: id }, { $set: updateOps }, User, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            res.json({ "message": "success" });
        }
    })

});

router.patch(
    "/changePassword",
    async(req, res, next) => {
        // if (!req.body.captcha) {
        //     return res.status(400).json({
        //         message: "No recaptcha token",
        //     });
        // }
        // var flag = 0;
        // request(req.verifyURL, (err, response, body) => {
        //     body = JSON.parse(body);
        //     console.log(err)
        //     console.log(body)
        //     try {
        //         if (!body.success || body.score < 0.4) {
        //             flag = 1
        //             return res.status(401).json({
        //                 message: "Something went wrong",
        //             });
        //         }
        //         if (err) {
        //             return res.status(401).json({
        //                 message: err.toString(),
        //             });
        //         }
        //     } catch (err) {
        //         return res.status(500).json({
        //             error: err
        //         })
        //     }
        // });
        // console.log(flag)
        item.getItemById(req.user.userId, User, (err, result) => {
            if (err) {
                res.status(400).json({
                    err,
                });
            } else {
                bcrypt.compare(req.body.password, result.password, (err, result1) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Auth failed",
                        });
                    }
                    if (result1) {
                        bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                            if (err) {
                                res.status(400).json({
                                    err,
                                });
                            }
                            item.updateItemField({ _id: req.user.userId }, { $set: { password: hash } }, User, (err, result) => {
                                if (err) {
                                    res.status(400).json({
                                        message: "error",
                                    });
                                } else {
                                    res.status(200).json({
                                        message: "Password changed",
                                    });
                                }
                            })
                        })
                    } else {
                        return res.status(401).json({
                            message: "Auth failed",
                        });
                    }

                })
            }

        })

    }
);

router.post("/forgot", verifyURL, (req, res) => {
    if (!req.body.captcha) {
        return res.status(400).json({
            message: "No recaptcha token",
        });
    }
    var flag = 0;
    request(req.verifyURL, (err, response, body) => {
        body = JSON.parse(body);
        console.log(err)
        console.log(body)
        try {
            if (!body.success || body.score < 0.4) {
                flag = 1
                return res.status(401).json({
                    message: "Something went wrong",
                });
            }
            if (err) {
                return res.status(401).json({
                    message: err.toString(),
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            })
        }
    });
    console.log(flag)
    var email = req.body.email;
    User.findOne({ email: email }, (err, userData) => {
        if (!err && userData != null) {
            userData.passResetKey = shortid.generate();
            userData.passKeyExpires = new Date().getTime() + 20 * 60 * 1000; // pass reset key only valid for 20 minutes
            userData.save().then((x) => {
                if (!err) {
                    const msg = {
                        to: email,
                        from: process.env.sendgridEmail,
                        subject: "Quzzie: Password Reset Request",
                        text: " ",
                        html: emailTemplates.FORGOT_PASSWORD(x),
                    };

                    sgMail
                        .send(msg)
                        .then((result) => {
                            res.status(200).json({
                                message: "Password reset key sent to email",
                            });
                        })
                        .catch((err) => {
                            console.log(err.toString());
                            res.status(500).json({
                                // message: "something went wrong1",
                                error: err,
                            });
                        });
                }
            });
        } else {
            res.status(400).send("email is incorrect");
        }
    });
});

router.post("/resetpass", verifyURL, async(req, res) => {
    if (!req.body.captcha) {
        return res.status(400).json({
            message: "No recaptcha token",
        });
    }
    var flag = 0;
    request(req.verifyURL, (err, response, body) => {
        body = JSON.parse(body);
        console.log(err)
        console.log(body)
        try {
            if (!body.success || body.score < 0.4) {
                flag = 1
                return res.status(401).json({
                    message: "Something went wrong",
                });
            }
            if (err) {
                return res.status(401).json({
                    message: err.toString(),
                });
            }
        } catch (err) {
            return res.status(500).json({
                error: err
            })
        }
    });
    console.log(flag)
    let resetKey = req.body.resetKey;
    let newPassword = req.body.newPassword;

    await User.findOne({ passResetKey: resetKey })
        .then(async(result) => {
            if (Date.now() > result.passKeyExpires) {
                res.status(401).json({
                    message: "Pass key expired",
                });
            }
            result.password = bcrypt.hashSync(newPassword, 10);
            result.passResetKey = null;
            result.passKeyExpires = null;
            await result
                .save()
                .then((result1) => {
                    res.status(200).json({
                        message: "Password updated",
                    });
                })
                .catch((err) => {
                    res.status(403).json({
                        message: "Unusual error",
                        err: err.toString(),
                    });
                });
        })
        .catch((err) => {
            res.status(400).json({
                message: "Invalid pass key",
            });
        });
});

module.exports = router;