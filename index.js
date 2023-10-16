const express = require("express");
const { connection } = require("./conn");
const { UserModel } = require("./Model/user");
const { EmployeeModel } = require("./Model/Employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Authentication } = require("./Authenticate");
require("dotenv").config();
const app = express();
const PORT = `${process.env.PORT}` || 3000; // or another port above 1024

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("base API endpoint");
});

app.post("/signup", async (req, res) => {
  const { age, email, password, name } = req.body;
  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      return res.status(500).json({ error: "Hashing error" });
    }
    try {
      const user = new UserModel({ email, password: hash, age, name });
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: "User creation error" });
    }
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const hash = user.password;
  bcrypt.compare(password, hash, function (err, result) {
    if (err || !result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ user_ID: user._id }, process.env.JWT_SECRET);
    res.json({ message: "Login successful", token });
  });
});

app.use(Authentication);

app.post("/employees", async (req, res) => {
  const { name, last_name, email, amount, department } = req.body;
  const employee = new EmployeeModel({
    name,
    last_name,
    email,
    amount,
    department,
    userID: req.user_ID, // Assuming userID is extracted from the authenticated user
  });

  try {
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: "Employee creation error" });
  }
});

app.get("/employees", async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 5;

  const employees = await EmployeeModel.find().skip(page * limit);

  res.send(employees);
});

app.delete("/employees/:id", async (req, res) => {
  const employeeId = req.params.id;

  try {
    const deletedEmployee = await EmployeeModel.findByIdAndRemove(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Employee deletion error" });
  }
});
app.listen(PORT, () => {
  try {
    connection;
    console.log(`Listening on port:${PORT}`);
  } catch (err) {
    console.error(err);
  }
});
