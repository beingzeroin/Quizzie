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
//const sharp = require('sharp');
const User = require("../models/user");
const Quiz = require("../models/quiz");
const Admin = require("../models/admin");
const Owner = require("../models/owner");
const Question = require("../models/question");

const item = require("../lib/itemlib")
const checkAuth = require("../middleware/checkAuth");
const checkAuthOwner = require("../middleware/checkAuthOwner");
const verifyURL = require("../middleware/verifyURL");
const user = require("../models/user");

const router = express.Router();

sgMail.setApiKey(process.env.SendgridAPIKey);

router.post("/signup", async(req, res, next) => {
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
    item.getItemByQuery({ email: req.body.email }, Owner, (err, user) => {
        if (err) {
            res.status(500).json({
                error: err,
            });
        } else {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "Email already exists",
                });
            } else if (req.body.signupCode != process.env.ownerKey) {
                return res.status(400).json({
                    message: "Incorrect signup code",
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
                            boardPosition: req.body.boardPosition,
                        };
                        item.createitem(user, Owner, (err, result) => {
                            if (err) {
                                res.status(500).json({
                                    error: err,
                                });
                            } else {
                                res.status(201).json({
                                    message: "user created",
                                    userDetails: {
                                        userId: result._id,
                                        email: result.email,
                                        name: result.name,
                                        mobileNumber: result.mobileNumber,
                                        boardPosition: result.boardPosition,
                                    },
                                });
                            }
                        })
                    }

                })
            }
        }
    })

});

router.post("/login", async(req, res, next) => {
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
    item.getItemByQuery({ email: req.body.email }, Owner, (err, user) => {
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
                            boardPosition: user[0].boardPosition,
                        },
                        process.env.jwtSecret, {
                            expiresIn: "1d",
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        userDetails: {
                            userType: user[0].userType,
                            userId: user[0]._id,
                            name: user[0].name,
                            email: user[0].email,
                            mobileNumber: user[0].mobileNumber,
                            boardPosition: user[0].boardPosition,
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

router.get("/allQuizzes", async(req, res, next) => {
    item.getItemByQueryWithPopulate({}, Quiz, "adminId", (err, result) => {
        if (err) {
            res.status(400).json({
                error: err,
            });
        } else {
            res.status(200).json({
                message: "Retrived",
                result,
            });
        }
    })

});
///
router.delete(
    "/quiz/:quizId",
    async(req, res, next) => {
        item.getItemById(req.params.quizId, Quiz, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: "Unexpected",
                });
            } else {
                var numUsers = result.usersEnrolled.length;
                //Remove quiz from student array
                for (i = 0; i < numUsers; i++) {
                    var currentUser = result.usersEnrolled[i].userId;
                    item.updateItemField({ _id: currentUser }, { $pull: { quizzesEnrolled: { quizId: req.params.quizId } } }, User, (err, result1) => {
                        if (err) {
                            res.status(400).json({
                                message: "some error",
                            });
                        } else {
                            console.log(result1);
                        }
                    })
                }
                //
                item.updateItemField({ _id: result.adminId }, { $pull: { quizzes: { quizId: req.params.quizId } } }, Admin, (err, result3) => {
                    if (err) {
                        res.status(400).json({
                            message: "Unexpected",
                        });
                    } else {
                        item.deleteMultipleItems({ quizId: req.params.quizId }, Question, (err, result4) => {
                            if (err) {
                                res.status(400).json({
                                    message: "cant happen",
                                });
                            } else {
                                item.deleteItem(req.params.quizId, false, Quiz, (err, result5) => {
                                    if (err) {
                                        res.status(400).json({
                                            message: "Unexpected Error",
                                        });
                                    } else {
                                        res.status(200).json({
                                            message: "Successfully deleted",
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

    }
);

router.get("/allAdmins", async(req, res, next) => {
    item.getItemByQueryWithPopulate({}, Admin, {
        path: "quizzes",

        populate: { path: "quizId" },
    }, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "Some error occurred",
            });
        } else {
            res.status(200).json({
                message: "Retrivied",
                result,
            });
        }
    })

});
// /
router.get("/allUsers", async(req, res, next) => {
    item.getItemByQueryWithPopulate({}, User, {
        path: "quizzesEnrolled",

        populate: { path: "quizId" },
    }, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "Some error occurred",
            });
        } else {
            res.status(200).json({
                message: "Retrivied",
                result,
            });
        }
    })

});

router.delete(
    "/admin/:adminId",
    async(req, res, next) => {
        item.getItemById(req.params.adminId, Admin, async(err, result) => {
            if (err) {
                await res.status(400).json({
                    message: "Unexpected Erroor",
                });
            } else if (result) {
                const numQuizzes = result.quizzes.length;
                for (i = 0; i < numQuizzes; i++) {
                    const currentQuiz = result.quizzes[i].quizId;
                    item.getItemById(currentQuiz, Quiz, async(err, result1) => {
                        if (err) {
                            await res.status(400).json({
                                message: "Unexpected Err",
                            });
                        } else {
                            const numOfUsers = result1.usersEnrolled.length;
                            for (j = 0; j < numOfUsers; j++) {
                                const currUser = result1.usersEnrolled[j].userId;
                                item.updateItemField({ _id: currUser }, { $pull: { quizzesEnrolled: { quizId: currentQuiz } } }, User, async(err, result3) => {
                                    if (err) {
                                        await res.status(400).json({
                                            message: "Unexpected Erro",
                                        });
                                    } else {
                                        item.deleteMultipleItems({ quizId: currentQuiz }, Question, async(err, result4) => {
                                            if (err) {
                                                await res.status(400).json({
                                                    message: "some error occurred",
                                                });
                                            } else {
                                                item.deleteItem(currentQuiz, false, Quiz, (err, result5) => {})
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
                //
                item.deleteItem(req.params.adminId, false, Admin, async(err, result6) => {
                    if (err) {
                        await res.status(200).json({
                            message: "Successfully Deleted",
                        });
                    } else {
                        await res.status(200).json({
                            message: "Successfully Deleted",
                        });
                    }
                })
            } else {
                await res.status(400).json({
                    message: "No user found",
                });
            }
        })

    }
);

router.patch(
    "/changePassword",
    async(req, res, next) => {
        // if (!req.body.captcha) {
        //     res.status(400).json({
        //         message: "No recaptcha token",
        //     });
        // }
        // request(req.verifyURL, (err, response, body) => {
        //     body = JSON.parse(body);
        //     if (!body.success || body.score < 0.4) {
        //         res.status(401).json({
        //             message: "Something went wrong",
        //         });
        //     }
        //     if (err) {
        //         return res.status(500).json({
        //             message: "Google error",
        //         });
        //     }
        // });
        item.getSingleItemByQuery({ _id: '5ff5c2af5b7ecc648046b226' }, Owner, (err, result) => {
            if (err) {
                res.status(400).json({
                    err,
                });
            } else if (result) {
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
                            item.updateItemField({ _id: '5ff5c2af5b7ecc648046b226' }, { $set: { password: hash } }, Owner, (err, result) => {
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
            } else {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
        })

    });

module.exports = router;