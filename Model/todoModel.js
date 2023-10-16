const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema({
    email: String,
    password: String,
    age: String,
    user_ID:String
})

const ToDOModel = mongoose.model("toDo",ToDoSchema);
module.exports = {ToDOModel};