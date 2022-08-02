const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
