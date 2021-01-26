const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const request = require("request");
const shortid = require("shortid");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
//const sharp = require('sharp');
const Admin = require("../models/admin");
const Quiz = require("../models/quiz");
const User = require("../models/user");
const emailTemplates = require("../../emails/email");

const item = require("../lib/itemlib")

const checkAuth = require("../middleware/checkAuth");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const checkAuthUser = require("../middleware/checkAuthUser");
const verifyURL = require("../middleware/verifyURL");

const router = express.Router();

sgMail.setApiKey(process.env.SendgridAPIKey);



router.get("/:adminid", (req, res) => {
    item.getItemById(req.params.adminid, Admin, (err, result) => {
        if (err)
            console.log("error", e);
        else {
            console.log(result);
            res.send(result);
        }
    })
})

router.post("/resendVerificationEmail", verifyURL, async(req, res, next) => {
    if (!req.body.captcha) {
        return res.status(400).json({
            message: "No recaptcha token",
        });
    }
    var flag = 0;
    console.log(req.verifyURL)
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
    const { email } = req.body;
    const user = await Admin.findOne({ email });
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
router.patch("/verifyEmail", verifyURL, async(req, res, next) => {
    if (!req.body.captcha) {
        return res.status(400).json({
            message: "No recaptcha token",
        });
    }
    var flag = 0;
    console.log(req.body.captcha)
    console.log(req.verifyURL)
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
    const { verificationKey } = req.body;
    await Admin.findOne({ verificationKey })
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

//signup
router.post("/signup", async(req, res, next) => {
    // if (!req.body.captcha) {
    //     return res.status(400).json({
    //         message: "No recaptcha token",
    //     });
    // }
    // var flag = 0;
    // console.log(req.verifyURL)
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
    item.getItemByQuery({ email: req.body.email }, Admin, (err, user) => {
        if (err) {
            res.status(500).json({
                error: err.toString(),
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
                        item.createitem(user, Admin, async(err, result) => {
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
                                                res.status(500).json({
                                                    // message: "something went wrong1",
                                                    error: err.toString(),
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
//login
router.post("/login", async(req, res, next) => {
    // if (!req.body.captcha) {
    //     return res.status(400).json({
    //         message: "No recaptcha token",
    //     });
    // }
    // var flag = 0;
    // console.log(req.verifyURL)
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
    item.getItemByQuery({ email: req.body.email }, Admin, (err, user) => {
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
                if (result) {
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
                        },
                        token: token,
                    });
                }
                res.status(401).json({
                    message: "Auth failed1",
                });

            })
        }
    })


});

//Admin profile
router.get("/", checkAuthAdmin, async(req, res, next) => {
    const populateJson = {
        path: "quizzes",

        populate: { path: "quizId" }
    }
    item.getItemByIdWithPopulate(req.user.userId, Admin, populateJson, (err, result1) => {
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

////Update admin profile
router.patch("/updateProfile", checkAuthAdmin, (req, res) => {
    // if (!req.body.captcha) {
    //     return res.status(400).json({
    //         message: "No recaptcha token",
    //     });
    // }
    // request(req.verifyURL, (err, response, body) => {
    //     body = JSON.parse(body);
    //     if (!body.success || body.score < 0.4) {
    //         return res.status(401).json({
    //             message: "Something went wrong",
    //         });
    //     }
    //     if (err) {
    //         return res.status(500).json({
    //             message: "Google error",
    //         });
    //     }
    // });
    console.log(req.body);
    const id = req.user.userId;
    console.log(id)
    const updateOps = {};
    updateOps.name = req.body.name;
    updateOps.mobileNumber = req.body.mobileNumber;
    console.log(updateOps);
    // const id = req.user.userId;
    // const updateOps = {};
    // const updatableFields = ["name", "mobileNumber"];
    // var flag = 0;
    // for (const ops of req.body.updateOps) {
    //     if (updatableFields.includes(ops.propName)) {
    //         updateOps[ops.propName] = ops.value;
    //     }
    // }
    item.updateItemField({ _id: id }, { $set: updateOps }, Admin, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            res.status(200).json({
                message: "Profile updated",
            });
        }
    })

});

///all quizzess created by the admin
router.get("/created", checkAuthAdmin, async(req, res, next) => {
    const populateJson = {
        path: "usersEnrolled",

        populate: { path: "userId" }
    }
    item.getItemByQueryWithPopulate({ adminId: req.user.userId, isDeleted: false }, Quiz, populateJson, (err, result) => {
        if (err) {
            res.status(400).json({
                message: err.toString(),
            });
        } else {
            res.status(200).json({
                result,
            });
        }
    })

});

///Number of students enrolled in a particular quiz
router.get(
    "/studentsEnrolled/:quizId",
    async(req, res, next) => {
        const populateJson = {
            path: "usersEnrolled",

            populate: { path: "userId" },
        }
        item.getItemByQueryWithPopulate({ _id: req.params.quizId, isDeleted: false }, Quiz, populateJson, (err, result1) => {
                if (err || result1.length <= 0) {
                    res.status(400).json({
                        message: err.toString(),
                    });
                } else {
                    result1 = result1[0];
                    res.status(200).json({
                        result1,
                    });
                }
            })
            // await Quiz.findById(req.params.quizId)
            //     .populate({
            //         path: "usersEnrolled",

        //         populate: { path: "userId" },
        //     })
        //     .exec()
        //     .then(async(result1) => {
        //         res.status(200).json({
        //             result1,
        //         });
        //     })
        //     .catch((err) => {
        //         res.status(400).json({
        //             message: err.toString(),
        //         });
        //     });
    }
);

router.patch(
    "/changePassword", checkAuthAdmin, async(req, res, next) => {
        item.getItemById(req.user.userId, Admin, (err, result) => {
            if (err) {
                res.status(400).json({
                    error: err.toString(),
                });
            } else {
                // if (!req.body.captcha) {
                //     return res.status(400).json({
                //         message: "No recaptcha token",
                //     });
                // }
                // var flag = 0;
                // console.log(req.verifyURL)
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
                bcrypt.compare(req.body.password, result.password, (err, result1) => {
                    if (err) {
                        return res.status(401).json({
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
                            item.updateItemField({ _id: req.user.userId }, { $set: { password: hash } }, Admin, (err, result) => {
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

router.get(
    "/allStudentsQuizResult/:quizId",
    async(req, res, next) => {
        const populateJson = {
            path: "usersParticipated",
            populate: { path: "userId", select: { name: 1 } }
        }
        item.getItemByQueryWithPopulate({ _id: req.params.quizId, isDeleted: false }, Quiz, populateJson, (err, users) => {
                if (err) {
                    res.status(400).json({
                        message: err.toString(),
                    });
                } else if (users.length <= 0) {
                    res.status(400).json({
                        message: "Some error occurred",
                    });
                } else {
                    users = users[0];
                    const userResults = users.usersParticipated;
                    res.status(200).json({
                        userResults,
                    });
                }
            })
            // const users = await Quiz.findById(req.params.quizId).populate({
            //     path: "usersParticipated",
            //     populate: { path: "userId", select: { name: 1 } },
            // });
            // if (!users) {
            //     res.status(400).json({
            //         message: "Some error occurred",
            //     });
            // }
            // const userResults = users.usersParticipated;
            // res.status(200).json({
            //     userResults,
            // });
    }
);

router.post("/forgot", verifyURL, (req, res) => {
    if (!req.body.captcha) {
        return res.status(400).json({
            message: "No recaptcha token",
        });
    }
    var flag = 0;
    console.log(req.verifyURL)
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
    Admin.findOne({ email: email }, (err, userData) => {
        if (!err && userData != null) {
            userData.passResetKey = shortid.generate();

            userData.passKeyExpires = new Date().getTime() + 20 * 60 * 1000; // pass reset key only valid for 20 minutes
            userData.save().then((x) => {
                const html = emailTemplates.FORGOT_PASSWORD(x);
                console.log(html);
                if (!err) {
                    const msg = {
                        to: email,
                        from: process.env.sendgridEmail,
                        subject: "Quizzie: Password Reset Request",
                        text: " ",
                        html: html,
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
    console.log(req.verifyURL)
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

    await Admin.findOne({ passResetKey: resetKey })
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