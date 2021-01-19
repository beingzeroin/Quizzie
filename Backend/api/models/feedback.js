const mongoose = require("mongoose");
const Quiz = require("./quiz");
const Questions = require("./question");
const Admin = require("./admin");
const User = require("./user");


const feedbackSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quizId: { type: mongoose.Schema.Types.ObjectID, ref: "Quiz" },
    userId: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    name: { type: String, required: true },
    description: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Feedback", feedbackSchema);