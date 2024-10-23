const Admin = require("../../models/admin/admin.models");
const User = require("../../models/user/user.models");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const dotenv = require("dotenv");

dotenv.config();

exports.login = async (data) => {
  try {
    // Find admin based on username
    const admin = await Admin.findOne({ userName: data.userName });
    if (!admin) {
      console.error("Username not found:", data.userName);
      throw new Error("Username not found!");
    }

    // Verify password
    const match = await argon2.verify(admin.password, data.password);
    if (!match) {
      console.error("Wrong password for userName:", data.userName);
      throw new Error("Wrong password!");
    }

    // Check status role
    if (admin.role !== "admin") {
      console.error("Unauthorized role for userName:", data.userName);
      throw new Error("Unauthorized role!");
    }

    // Create JWT token
    const token = jwt.sign(
      { userName: admin.userName, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful for userName:", data.userName);
    return { message: "Login Successful", token };
  } catch (error) {
    console.error("Login error:", error.message);
    throw new Error(error.message);
  }
};

// Show data user
exports.findAll = (req, res) => {
  User.find()
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Update data
exports.update = (req, res) => {
  const id = req.params.id;

  Admin.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Data can't be updated!" });
      }
      res.send({ message: "Data updated successfully!" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Delete data
exports.delete = (req, res) => {
  const id = req.params.id;

  Admin.findOneAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Data can't be deleted!" });
      }
      res.send({ message: "Data deleted successfully!" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
