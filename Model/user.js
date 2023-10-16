const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:String,
    email: String,
    password: String,
    age: String
})

const UserModel = mongoose.model("users",userSchema);
module.exports = {UserModel};