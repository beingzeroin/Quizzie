const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const request = require("request");
const shortid = require("shortid");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
//const sharp = require('sharp');
const Quiz = require("../models/quiz");
const Admin = require("../models/admin");
const User = require("../models/user");
const Question = require("../models/question");
const redis = require("redis");

const item = require("../lib/itemlib")
const checkAuth = require("../middleware/checkAuth");
const checkAuthUser = require("../middleware/checkAuthUser");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const verifyURL = require("../middleware/verifyURL");
const { update } = require("../models/user");

// const REDIS_PORT = process.env.REDISTOGO_URL || 6379 || process.env.REDIS_URL;

// const client = redis.createClient(REDIS_PORT);

const router = express.Router();

router.use(cookieParser());

////Create and Innitialise the quiz  ----DONE
router.post(
    "/createQuiz",
    checkAuthAdmin, async(req, res, next) => {
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
        if (req.body.quizType.toLowerCase() == "private") {
            const quiz = {
                _id: new mongoose.Types.ObjectId(),
                quizName: req.body.quizName,
                adminId: req.user.userId,
                scheduledFor: req.body.scheduledFor,
                quizDuration: req.body.quizDuration,
                quizType: req.body.quizType.toLowerCase(),
                quizCode: shortid.generate(),
                quizRestart: 0,
                topicName:req.body.topicName
            };
            //console.log(quiz);
            item.createitem(quiz, Quiz, (err, result) => {
                if (err) {
                    res.status(400).json({ error: "err" });
                } else {
                    const quizId = result._id;
                    item.updateItemField({ _id: req.user.userId }, { $push: { quizzes: { quizId } } }, Admin, (err, result1) => {
                        if (err) {
                            res.status(400).json({ error: "err1" });

                        } else {
                            res.status(201).json({
                                message: "created",
                                result,
                            });
                        }
                    })
                }
            })

        } else {
            const quiz = {
                _id: new mongoose.Types.ObjectId(),
                quizName: req.body.quizName,
                adminId: req.user.userId,
                quizDate: req.body.quizDate,
                quizTime: req.body.quizTime,
                scheduledFor: req.body.scheduledFor,
                quizDuration: req.body.quizDuration,
                quizType: req.body.quizType.toLowerCase(),
                topicName:req.body.topicName
            };
            item.createitem(quiz, Quiz, (err, result) => {
                if (err) {
                    res.status(400).json({ error: "err" });
                } else {

                    const quizId = result._id;
                    item.updateItemField({ _id: req.user.userId }, { $push: { quizzes: { quizId } } }, Admin, (err, result1) => {
                        if (err) {
                            res.status(400).json({ error: "err1" });
                        } else {
                            const date = new Date(Number(result.scheduledFor));
                            res.status(201).json({
                                message: "created",
                                result,
                            });
                        }
                    })
                }
            })

        }
    }
);

///Get all quiz for student dashboard
router.get("/all", async(req, res, next) => {
    item.getItemByQueryWithPopulateAndSelect({ quizType: "public", isDeleted: false }, Quiz, "adminId", "-__v", async(err, result) => {
        if (err) {
            res.status(400).json({
                message: "An error occurred",
            });
        } else {
            const remover = (result) => {
                return result.quizStatus <= 1;
            };
            result = result.filter(remover);
            await res.status(200).json({
                message: "Successfully retrieved",
                result,
            });
        }
    })

});

///Enroll/get access to a quiz
router.patch("/enroll", checkAuthUser, async(req, res, next) => {
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
    item.getSingleItemByQuery({ _id: req.body.quizId, isDeleted: false }, Quiz, (err, result2) => {
        if (err) {
            res.status(404).json({
                message: err,
            });
        } else {
            for (i = 0; i < result2.usersEnrolled.length; i++) {
                if (result2.usersEnrolled[i].userId == req.user.userId) {
                    return res.status(409).json({ message: "Already enrolled" });
                }
            }
            const userId = req.user.userId;
            const quizId = req.body.quizId;
            item.updateItemField({ _id: quizId, isDeleted: false }, { $push: { usersEnrolled: { userId } } }, Quiz, (err, result) => {
                if (err) {
                    res.status(404).json({
                        message: err,
                    });
                } else {
                    item.updateItemField({ _id: userId }, { $push: { quizzesEnrolled: { quizId } } }, User, async(err, result1) => {
                        if (err) {
                            res.status(400).json({
                                message: "Some error",
                            });
                        } else {
                            await res.status(200).json({
                                message: "Enrolled",
                            });
                        }
                    })
                }
            })
        }
    })

});

// Enroll in a private quiz
router.patch(
    "/enrollPrivate",
    checkAuthUser, async(req, res, next) => {
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
        item.getSingleItemByQuery({ quizCode: req.body.quizCode, isDeleted: false }, Quiz, (err, result2) => {
            if (err) {
                res.status(404).json({
                    message: "Invalid Code",
                });
            } else if (result2) {
                for (i = 0; i < result2.usersEnrolled.length; i++) {
                    if (result2.usersEnrolled[i].userId == req.user.userId) {
                        return res.status(409).json({ message: "Already enrolled" });
                    }
                }
                const userId = req.user.userId;
                item.updateItemField({ quizCode: req.body.quizCode, isDeleted: false }, { $push: { usersEnrolled: { userId } } }, Quiz, (err, result) => {
                    if (err) {
                        res.status(404).json({
                            message: err,
                        });
                    } else {
                        const quizId = result2._id;
                        item.updateItemField({ _id: userId }, { $push: { quizzesEnrolled: { quizId } } }, User, async(err, result1) => {
                            if (err) {
                                res.status(400).json({
                                    message: "Some error",
                                });
                            } else {
                                await res.status(200).json({
                                    message: "Enrolled",
                                });
                            }
                        })
                    }
                })
            } else {
                res.status(404).json({
                    message: "Invalid Code",
                });
            }
        })

    }
);

///Update Quiz
router.patch(
    "/updateDetails/:quizId", checkAuthAdmin,
    async(req, res, next) => {
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
        item.getItemByQuery({ _id: req.params.quizId, isDeleted: false }, Quiz, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: "Some error",
                });
            } else if (result.length > 0) {
                let result1 = result[0];
                if (result1.adminId != req.user.userId) {
                    return res.status(401).json({
                        message: "This is not your quiz",
                    });
                }
                const id = req.params.quizId;
                const updateOps = {};
                var flag = 0;
                updateOps.quizName = req.body.quizName
                updateOps.scheduledFor = req.body.scheduledFor
                updateOps.quizDuration = req.body.quizDuration
                updateOps.topicName = req.body.topicName
                updateOps.quizStatus = 0

                // for (const ops of req.body.updateOps) {
                //     updateOps[ops.propName] = ops.value;
                // }
                item.updateItemField({ _id: id }, { $set: updateOps }, Quiz, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            error: err,
                        });
                    } else {
                        res.status(200).json({
                            message: "Quiz updated",
                        });
                    }
                })
            } else {
                res.status(400).json({
                    message: "Some error",
                });
            }
        })

    }
);

router.get(
    "/checkAdmin/:quizId",
    async(req, res, next) => {
        item.getSingleItemByQuery({ _id: req.params.quizId, isDeleted: false }, Quiz, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: "Please enter a correct quizId",
                });
            } else {
                if (result.adminId == req.user.userId) {
                    return res.status(200).json({
                        message: "This is your quiz",
                    });
                } else {
                    return res.status(401).json({
                        message: "This is not your quiz",
                    });
                }
            }
        })

    }
);

router.patch("/unenroll", checkAuthUser, async(req, res, next) => {
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
    item.getItemById(req.user.userId, User, async(err, result) => {
        if (err) {
            await res.status(400).json({
                message: "Error",
            });
        } else {
            var numQuiz = result.quizzesEnrolled.length;
            var flag = 0;
            for (i = 0; i < numQuiz; i++) {
                if (result.quizzesEnrolled[i].quizId == req.body.quizId) {
                    flag = 1;
                    var currentUser = req.user.userId;
                    item.updateItemField({ _id: currentUser }, { $pull: { quizzesEnrolled: { quizId: req.body.quizId } } }, User, (err, result) => {
                        if (err) {
                            return res.status(400).json({
                                message: "Error",
                            });
                        } else {
                            item.updateItemField({ _id: req.body.quizId }, { $pull: { usersEnrolled: { userId: req.user.userId } } }, Quiz, (err, result3) => {
                                if (err) {
                                    return res.status(400).json({
                                        message: "Some error Occurred",
                                    });
                                } else {
                                    return res.status(200).json({
                                        message: "Successfully un-enrolled",
                                    });
                                }
                            })
                        }
                    })
                }
            }
            if (flag === 0) {
                await res.status(401).json({
                    message: "You are not a part of this quiz",
                });
            }
        }
    })

});

router.patch("/start", checkAuthUser, async(req, res, next) => {
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
    item.getSingleItemByQuery({ _id: req.body.quizId, isDeleted: false }, Quiz, async(err, result0) => {
        if (err) {
            return res.status(400).json({
                message: err.toString(),
            });
        } else {
            item.getItemByQueryWithSelect({ quizId: req.body.quizId }, Question, "-__v", async(err, result) => {
                if (err && !result) {
                    return res.status(400).json({
                        message: err.toString(),
                    });
                } else {
                    if (result0.quizRestart == 1) {
                        item.getItemById(req.user.userId, User, async(err, result2) => {
                                if (err) {
                                    return res.status(400).json({
                                        message: "Some error Occurred",
                                    });
                                } else {
                                    for (let i = result.length - 1; i > 0; i--) {
                                        const j = Math.floor(Math.random() * (i + 1));
                                        [result[i], result[j]] = [result[j], result[i]];
                                    }
                                    var flag = 0;
                                    var numQuiz = result2.quizzesStarted.length;
                                    var numEnrolled = result2.quizzesEnrolled.length;
                                    for (i = 0; i < numEnrolled; i++) {
                                        if (result2.quizzesEnrolled[i].quizId == req.body.quizId) {
                                            flag = 1;
                                        }
                                    }

                                    for (i = 0; i < numQuiz; i++) {
                                        if (result2.quizzesStarted[i].quizId == req.body.quizId) {
                                            return res.status(405).json({
                                                message: "Already given the quiz!",
                                            });
                                        }
                                    }
                                    if (flag === 0) {
                                        return res.status(409).json({
                                            message: "You are not enrolled in this quiz",
                                        });
                                    }
                                }
                            })
                            // var clientId = questions+req.user.userId
                            // client.setex(req.user.userId, 3600, JSON.stringify(result));
                        var quizId = req.body.quizId;
                        item.updateItemField({ _id: req.user.userId }, { $push: { quizzesStarted: { quizId } } }, User, async(err, result1) => {
                            if (err) {
                                return res.status(400).json({
                                    message: "some error occurred",
                                    error: err.toString(),
                                });
                            } else {
                                var data = [];
                                for (i = 0; i < result.length; i++) {
                                    object = {
                                        quizId: result[i].quizId,
                                        description: result[i].description,
                                        options: result[i].options,
                                        questionId: result[i]._id,
                                    };
                                    data.push(object);
                                }
                                return res.status(200).json({
                                    message: "Quiz started for " + req.user.name,
                                    data,
                                    duration: result0.quizDuration,
                                    scheduledFor: result0.scheduledFor,
                                    quizRestart: result0.quizRestart,
                                    quizStatus: result0.quizStatus,
                                });
                            }
                        })
                    } else if (result0.quizStatus == 0) {
                        if (
                            Date.now() >=
                            Number(result0.scheduledFor) +
                            Number(result0.quizDuration * 60 * 1000)
                        ) {
                            item.updateItemField({ _id: req.body.quizId }, { $set: { quizStatus: 2 } }, Quiz, (err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        message: err.toString(),
                                    });
                                } else {
                                    return res.status(402).json({
                                        message: "Quiz time elapsed",
                                    });
                                }
                            })
                        } else if (Date.now() >= result0.scheduledFor) {
                            item.getItemById(req.user.userId, User, async(err, result2) => {
                                if (err) {
                                    return res.status(400).json({
                                        message: err.toString(),
                                    });
                                } else {
                                    for (let i = result.length - 1; i > 0; i--) {
                                        const j = Math.floor(Math.random() * (i + 1));
                                        [result[i], result[j]] = [result[j], result[i]];
                                    }
                                    var flag = 0;
                                    var numQuiz = result2.quizzesStarted.length;
                                    var numEnrolled = result2.quizzesEnrolled.length;
                                    for (i = 0; i < numEnrolled; i++) {
                                        if (result2.quizzesEnrolled[i].quizId == req.body.quizId) {
                                            flag = 1;
                                        }
                                    }

                                    for (i = 0; i < numQuiz; i++) {
                                        if (result2.quizzesStarted[i].quizId == req.body.quizId) {
                                            return res.status(405).json({
                                                message: "Already given the quiz!",
                                            });
                                        }
                                    }
                                    if (flag === 0) {
                                        return res.status(409).json({
                                            message: "You are not enrolled in this quiz",
                                        });
                                    }
                                    // var clientId = questions+req.user.userId
                                    // client.setex(req.user.userId, 3600, JSON.stringify(result));
                                    var quizId = req.body.quizId;

                                    item.updateItemField({ _id: req.user.userId }, { $push: { quizzesStarted: { quizId } } }, User, async(err, result1) => {

                                        if (err) {
                                            return res.status(400).json({
                                                message: "some error occurred",
                                            });
                                        } else {
                                            item.updateItemField({ _id: req.body.quizId }, { $set: { quizStatus: 1 } }, Quiz, async(err, result1) => {
                                                if (err) {
                                                    return res.status(400).json({
                                                        err: err.toString(),
                                                    });
                                                } else {
                                                    var data = [];
                                                    for (i = 0; i < result.length; i++) {
                                                        object = {
                                                            quizId: result[i].quizId,
                                                            description: result[i].description,
                                                            options: result[i].options,
                                                            questionId: result[i]._id,
                                                        };
                                                        data.push(object);
                                                    }
                                                    return res.status(200).json({
                                                        message: "Quiz started for " + req.user.name,
                                                        data,
                                                        duration: result0.quizDuration,
                                                        scheduledFor: result0.scheduledFor,
                                                        quizRestart: result0.quizRestart,
                                                        quizStatus: result0.quizStatus,
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            return res.status(401).json({
                                message: "Quiz hasn't started yet",
                            });
                        }
                    } else if (result0.quizStatus == 1) {
                        if (
                            Date.now() >=
                            Number(result0.scheduledFor) +
                            Number(result0.quizDuration * 60 * 1000)
                        ) {
                            item.updateItemField({ _id: req.body.quizId }, { $set: { quizStatus: 2 } }, Quiz, (err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        message: err.toString(),
                                    });
                                } else {
                                    return res.status(402).json({
                                        message: "Quiz time elapsed",
                                    });
                                }
                            })
                        } else {

                            item.getItemById(req.user.userId, User, async(err, result2) => {
                                if (err) {
                                    return res.status(400).json({
                                        message: "Some error Occurred",
                                    });
                                } else {
                                    for (let i = result.length - 1; i > 0; i--) {
                                        const j = Math.floor(Math.random() * (i + 1));
                                        [result[i], result[j]] = [result[j], result[i]];
                                    }
                                    var flag = 0;
                                    var numQuiz = result2.quizzesStarted.length;
                                    var numEnrolled = result2.quizzesEnrolled.length;
                                    for (i = 0; i < numEnrolled; i++) {
                                        if (result2.quizzesEnrolled[i].quizId == req.body.quizId) {
                                            flag = 1;
                                        }
                                    }

                                    for (i = 0; i < numQuiz; i++) {
                                        if (result2.quizzesStarted[i].quizId == req.body.quizId) {
                                            return res.status(405).json({
                                                message: "Already given the quiz!",
                                            });
                                        }
                                    }
                                    if (flag === 0) {
                                        return res.status(409).json({
                                            message: "You are not enrolled in this quiz",
                                        });
                                    }
                                    // var clientId = questions+req.user.userId
                                    // client.setex(req.user.userId, 3600, JSON.stringify(result));
                                    var quizId = req.body.quizId;

                                    item.updateItemField({ _id: req.user.userId }, { $push: { quizzesStarted: { quizId } } }, User, async(err, result1) => {
                                        if (err) {
                                            return res.status(400).json({
                                                message: "some error occurred",
                                                error: err.toString(),
                                            });
                                        } else {
                                            var data = [];
                                            for (i = 0; i < result.length; i++) {
                                                object = {
                                                    quizId: result[i].quizId,
                                                    description: result[i].description,
                                                    options: result[i].options,
                                                    questionId: result[i]._id,
                                                };
                                                data.push(object);
                                            }
                                            return res.status(200).json({
                                                message: "Quiz started for " + req.user.name,
                                                data,
                                                duration: result0.quizDuration,
                                                scheduledFor: result0.scheduledFor,
                                                quizRestart: result0.quizRestart,
                                                quizStatus: result0.quizStatus,
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    } else {
                        return res.status(402).json({
                            message: "Quiz time elapsed",
                        });
                    }

                }
            })
        }
    })

});

router.get("/data/:quizId", checkAuthUser, async(req, res, next) => {

    item.getSingleItemByQuery({ _id: req.params.quizId, isDeleted: false }, Quiz, async(err, result0) => {
        console.log(result0)
        if (err) {
            return res.status(400).json({
                message: err.toString(),
            });
        } else {

            item.getItemByQueryWithSelect({ quizId: req.params.quizId, isDeleted: false }, Question, "-__v", async(err, result) => {
                if (err && !result) {
                    return res.status(400).json({
                        message: err.toString(),
                    });
                } else {
                    var quizId = req.params.quizId;

                    var data = [];
                    for (i = 0; i < result.length; i++) {
                        object = {
                            quizId: result[i].quizId,
                            description: result[i].description,
                            options: result[i].options,
                            questionId: result[i]._id,
                        };
                        data.push(object);
                    }
                    return res.status(200).json({
                        message: "Quiz started for " + req.user.name,
                        data,
                        duration: result0.quizDuration,
                        scheduledFor: result0.scheduledFor,
                        quizRestart: result0.quizRestart,
                        quizStatus: result0.quizStatus,
                    });



                }
            })
        }
    })

});
router.get("/:quizId", checkAuth, async(req, res, next) => {
    item.getItemByQueryWithPopulate({ _id: req.params.quizId, isDeleted: false }, Quiz, "adminId", (err, result) => {
        if (err || result.length <= 0) {
            res.status(400).json({
                message: "some error occurred",
            });
        } else {
            res.status(200).json({
                result: result[0],
            });
        }
    })

});

router.patch("/finish", checkAuthUser, async(req, res) => {
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
    item.updateItemField({ _id: req.body.quizId, isDeleted: false }, { $set: { quizStatus: 2 } }, Quiz, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.toString(),
            });
        } else {
            res.status(200).json({
                message: "Updated Quiz Status",
            });
        }
    })

});

router.post("/check", checkAuthUser, async(req, res, next) => {
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
    let que_data = req.body.questions;
    que_data = JSON.parse(que_data);
    var quizId = req.body.quizId;
    const timeEnded = req.body.timeEnded;
    const timeStarted = req.body.timeStarted;
    var responses = [];
    var score = 0;
    item.getItemById(req.body.quizId, Quiz, (err, result9) => {
        if (err) {
            res.status(400).json({
                message: err.toString(),
            });
        } else {
            if (
                Date.now() >=
                Number(result9.scheduledFor) +
                Number(Number(result9.quizDuration) * 60 * 1000)
            ) {
                item.updateItemField({ _id: req.body.quizId }, { $set: { quizStatus: 2 } }, Quiz, (err, result) => {
                    if (err) {
                        res.status(400).json({
                            error: err.toString(),
                        });
                    } else {
                        console.log("updated quiz status");

                    }
                })
            }

        }
    })
    item.getItemByQuery({ quizId: quizId, isDeleted: false }, Question, (err, data) => {
            if (err) {
                res.status(400).json({
                    message: "Some Error",
                });
            } else {
                // console.log()
                dataQues = data;
                console.log(data)
                if (data != null) {
                    for (i = 0; i < dataQues.length; i++) {
                        console.log(que_data[i].selectedOption, dataQues[i].correctAnswer)
                        if (que_data[i].selectedOption == dataQues[i].correctAnswer) {
                            score += 1;
                        }
                        var object = {
                            description: dataQues[i].description,
                            selected: que_data[i].selectedOption,
                            quesId: que_data[i].quesId,
                            correctAnswer: dataQues[i].correctAnswer,
                            options: dataQues[i].options,
                        };
                        responses.push(object);
                    }
                    item.updateItemField({ _id: req.user.userId }, {
                        $push: {
                            quizzesGiven: {
                                quizId,
                                marks: score,
                                responses,
                                timeEnded,
                                timeStarted,
                            },
                        }
                    }, User, (err, result) => {
                        if (err) {
                            res.status(400).json({
                                message: "Couldnt update",
                            });
                        } else {
                            item.updateItemField({ _id: req.body.quizId }, {
                                $push: {
                                    usersParticipated: {
                                        userId: req.user.userId,
                                        marks: score,
                                        responses,
                                        timeEnded,
                                        timeStarted,
                                    },
                                },
                            }, Quiz, (err, result7) => {
                                if (err) {
                                    res.status(400).json({
                                        message: "Unexpected Error",
                                    });
                                } else {
                                    res.status(200).json({
                                        message: "Updated",
                                        quizId,
                                        marks: score,
                                        responses,
                                        timeEnded,
                                        timeStarted,
                                    });
                                }
                            })
                        }
                    })
                } else {
                    console.log("Couldn't find questions in cache");
                }

            }
        })
        // client.get(req.user.userId, (err, data) => {
        //     if (err) {
        //         return res.status(400).json({
        //             message: "Error in cachin",
        //         });
        //     }
        //     dataQues = JSON.parse(data);
        //     if (data != null) {
        //         for (i = 0; i < dataQues.length; i++) {
        //             if (que_data[i].selectedOption == dataQues[i].correctAnswer) {
        //                 score += 1;
        //             }
        //             var object = {
        //                 description: dataQues[i].description,
        //                 selected: que_data[i].selectedOption,
        //                 quesId: que_data[i].quesId,
        //                 correctAnswer: dataQues[i].correctAnswer,
        //                 options: dataQues[i].options,
        //             };
        //             responses.push(object);
        //         }
        //         item.updateItemField({ _id: req.user.userId }, {
        //             $push: {
        //                 quizzesGiven: {
        //                     quizId,
        //                     marks: score,
        //                     responses,
        //                     timeEnded,
        //                     timeStarted,
        //                 },
        //             }
        //         }, User, (err, result) => {
        //             if (err) {
        //                 res.status(400).json({
        //                     message: "Couldnt update",
        //                 });
        //             } else {
        //                 item.updateItemField({ _id: req.body.quizId }, {
        //                     $push: {
        //                         usersParticipated: {
        //                             userId: req.user.userId,
        //                             marks: score,
        //                             responses,
        //                             timeEnded,
        //                             timeStarted,
        //                         },
        //                     },
        //                 }, Quiz, (err, result7) => {
        //                     if (err) {
        //                         res.status(400).json({
        //                             message: "Unexpected Error",
        //                         });
        //                     } else {
        //                         res.status(200).json({
        //                             message: "Updated",
        //                             quizId,
        //                             marks: score,
        //                             responses,
        //                             timeEnded,
        //                             timeStarted,
        //                         });
        //                     }
        //                 })
        //             }
        //         })
        //     } else {
        //         console.log("Couldn't find questions in cache");
        //     }
        // });
});

router.delete("/delete", checkAuthAdmin, async(req, res, next) => {
    console.log(req.body);
    item.getItemById(req.body.quizId, Quiz, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "some error",
            });
        } else {
            var numUsers = result.usersEnrolled.length;
            for (i = 0; i < numUsers; i++) {
                var currentUser = result.usersEnrolled[i].userId;
                item.updateItemField({ _id: currentUser }, { $pull: { quizzesEnrolled: { quizId: req.body.quizId } } }, User, (err, result3) => {
                    if (err) {
                        res.status(400).json({
                            message: "some error",
                        });
                    }
                })
            }
            item.deleteMultipleItems({ quizId: req.body.quizId }, Question, (err, result4) => {
                if (err) {
                    res.status(400).json({
                        message: "some error",
                    });
                } else {
                    item.updateItemField({ _id: req.user.userId }, { $pull: { quizzes: { quizId: req.body.quizId } } }, Admin, (err, result5) => {
                        if (err) {
                            return res.status(400).json({
                                message: "some error",
                            });
                        }
                    })
                    item.deleteItem(req.body.quizId, true, Quiz, (err, result5) => {
                        if (err) {
                            res.status(400).json({
                                message: "some error",
                            });
                        } else {
                            res.status(200).json({
                                message: "Deleted successfully",
                            });
                        }
                    })
                }
            })

        }
    })

});


router.patch(
    "/removeUser",
    async(req, res, next) => {
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
        item.updateItemField({ _id: req.body.quizId }, { $pull: { usersEnrolled: { userId: req.body.userId } } }, Quiz, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: "Some error",
                });
            } else {
                res.status(200).json({
                    message: "User removed successfully",
                });
            }
        })

    }
);

router.patch("/restart", async(req, res, next) => {
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
    item.getItemById(req.body.quizId, Quiz, async(err, quiz) => {
        if (err) {
            res.status(400).json({
                message: "error",
            });
        } else {
            quiz.quizStatus = 1;
            quiz.quizRestart = 1;
            await quiz
                .save()
                .then((result) => {
                    res.status(200).json({
                        message: "Quiz restarted",
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        message: "error",
                    });
                });
        }

    })
});

router.patch("/close", async(req, res, next) => {
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
    item.getItemById(req.body.quizId, Quiz, async(err, quiz) => {
        if (err) {
            res.status(400).json({
                message: "error",
            });
        } else {
            quiz.quizStatus = 2;
            quiz.quizRestart = 0;
            await quiz
                .save()
                .then((result) => {
                    res.status(200).json({
                        message: "Quiz restarted",
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        message: "error",
                    });
                });
        }
    })

});
router.get("/checkSubmission/:quizid", checkAuthUser, async(req, res, next) => {
    item.getItemById(req.user.userId, User, async(err, result) => {
        if (err) {
            return res.status(400).json({
                message: "error",
            });
        }
        console.log(result.quizzesGiven)
        let quizzesgiven = result.quizzesGiven;
        for (let i = 0; i < quizzesgiven.length; i++) {
            if (quizzesgiven[i].quizId == req.params.quizid) {
                return res.status(400).json({
                    message: "already submited!"
                })
            }
        }
        return res.status(200).json({
            message: "not submited"
        })
    })
})


module.exports = router;