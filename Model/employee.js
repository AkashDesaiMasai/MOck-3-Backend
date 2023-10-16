const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  name: String,
  last_name: String,
  email: String,
  amount: Number, // Specify the type as Number (assuming "amount" should be a number)
  department: String,
});

const EmployeeModel = mongoose.model("employee",employeeSchema);
module.exports = {EmployeeModel};