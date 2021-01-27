const mongoose = require("mongoose");
const Quiz = require("./quiz");
const Questions = require("./question");
const Admin = require("./admin");
const User = require("./user");


const suggestionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userType: { type: String, required:true},
    userId: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    userName: { type: String, required: true },
    description: {type: String, required: true},
    isDeleted: { type: Boolean, default: false }

});

module.exports = mongoose.model("Suggest",suggestionSchema);