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

const item = require("../lib/itemlib")
const checkAuth = require("../middleware/checkAuth");
const checkAuthUser = require("../middleware/checkAuthUser");
const checkAuthAdmin = require("../middleware/checkAuthAdmin");
const verifyURL = require("../middleware/verifyURL");
const question = require("../models/question");

const router = express.Router();

router.use(cookieParser());

router.delete("/:questionId", checkAuthAdmin, async(req, res, next) => {
    item.deleteItem(req.params.questionId, true, Question, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: "Couldn't delete",
                });
            } else {
                res.status(200).json({
                    message: "Deleted",
                });
            }
        })
        // await Question.deleteOne({ _id: req.params.questionId })
        //     .exec()
        //     .then((result) => {
        //         res.status(200).json({
        //             message: "Deleted",
        //         });
        //     })
        //     .catch((err) => {
        //         res.status(400).json({
        //             message: "Couldn't delete",
        //         });
        //     });
});

router.get("/all/:quizId", checkAuth, async(req, res, next) => {
    item.getItemByQuery({ quizId: req.params.quizId, isDeleted: false }, Question, (err, result) => {
        if (err) {
            res.status(400).json({
                message: "Some Error",
            });
        } else {
            res.status(200).json({
                result,
            });
        }
    })

});


router.post("/add", async(req, res, next) => {
    item.getSingleItemByQuery({ _id: req.body.quizId, isDeleted: false }, Quiz, (err, result1) => {
            if (err) {
                res.status(400).json({
                    message: "some error occurred123",
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

                let data = req.body;
                console.log(data);
                data.options = JSON.parse(data.options);
                //console.log(d);


                const ques = {
                    _id: new mongoose.Types.ObjectId(),
                    quizId: req.body.quizId,
                    description: req.body.description,
                    options: data.options,
                    correctAnswer: req.body.correctAnswer,
                }
                console.log(ques)
                item.createitem(ques, Question, (err, result) => {
                    if (err) {
                        res.status(400).json({
                            message: "some error occurred",
                        });
                    } else {
                        res.status(201).json({
                            message: "Created",
                        });
                    }
                })
            }
        })
        // await Quiz.findById(req.body.quizId)
        //     .exec()
        //     .then(async(result1) => {
        //         if (!req.body.captcha) {
        //             return res.status(400).json({
        //                 message: "No recaptcha token",
        //             });
        //         }
        //         var flag = 0;
        //         console.log(req.verifyURL)
        //         request(req.verifyURL, (err, response, body) => {
        //             body = JSON.parse(body);
        //             console.log(err)
        //             console.log(body)
        //             try {
        //                 if (!body.success || body.score < 0.4) {
        //                     flag = 1
        //                     return res.status(401).json({
        //                         message: "Something went wrong",
        //                     });
        //                 }
        //                 if (err) {
        //                     return res.status(401).json({
        //                         message: err.toString(),
        //                     });
        //                 }
        //             } catch (err) {
        //                 return res.status(500).json({
        //                     error: err
        //                 })
        //             }
        //         });
        //         console.log(flag)
        //         new Question({
        //                 _id: new mongoose.Types.ObjectId(),
        //                 quizId: req.body.quizId,
        //                 description: req.body.description,
        //                 options: req.body.options,
        //                 correctAnswer: req.body.correctAnswer,
        //             })
        //             .save()
        //             .then((result) => {
        //                 res.status(201).json({
        //                     message: "Created",
        //                 });
        //             })
        //             .catch((err) => {
        //                 res.status(400).json({
        //                     message: "some error occurred",
        //                 });
        //             });
        //     })
        //     .catch((err) => {
        //         res.status(400).json({
        //             message: "some error occurred123",
        //         });
        //     });
});

router.patch(
    "/update/:questionId",
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
        const updateOps = {};
        var flag = 0;
        console.log(req.body);
        updateOps.description = req.body.description
        updateOps.options = JSON.parse(req.body.options)
        updateOps.correctAnswer = req.body.correctAnswer
        item.updateItemField({ _id: req.params.questionId, isDeleted: false }, { $set: updateOps }, Question, (err, result) => {
                if (result) {
                    res.status(200).json({
                        message: "Question updated",
                    });
                }
            })
            // await Question.updateOne({ _id: req.params.questionId }, { $set: updateOps })
            //     .exec()
            //     .then((result) => {
            //         res.status(200).json({
            //             message: "Question updated",
            //         });
            //     });
    }
);

router.post("/csv", async(req, res, next) => {
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
    console.log(req.body);
    let questions=[]
    let z=req.body.data.split("\n");
    for(var i=0;i<z.length-1;i++)
    {
        var k=z[i].split(",");
        questions.push({"description":k[0],"quizId":req.body.quizId,"options":[{"text":k[1]},{"text":k[2]},{"text":k[3]},{"text":k[4]}],'correctAnswer':k[5].split('\r')[0]})
    }
    console.log(questions);
    item.createManyItems(questions, Question, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: "Error",
                    error: err.toString()
                });
            } else {
                res.status(200).json({
                    message: "Success",
                    result,
                });
            }
        })
        // await Question.insertMany(questions)
        //     .then((result) => {
        //         res.status(200).json({
        //             message: "Success",
        //             result,
        //         });
        //     })
        //     .catch((err) => {
        //         res.status(400).json({
        //             message: "Error",
        //             error: err.toString(),
        //         });
        //     });
});

module.exports = router;