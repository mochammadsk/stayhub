const jwt = require("jsonwebtoken");
const Admin = require("../models/admin/admin.models");

// Middleware to check authentication
function auth(req, res, next) {
  const token = req.header("auth-token");
  console.log("Received token:", token);

  if (!token) return res.status(401).send({ error: "Access denied." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token:", verified);
    req.user = verified;
    next();
  } catch (error) {
    console.log("Token verification failed:", error);
    res.status(400).send({ error: "Invalid token." });
  }
}

// Middleware to check if the user is admin
async function isAdmin(req, res, next) {
  try {
    const admin = await Admin.findOne({ userName: req.user.userName });
    if (!admin || admin.role !== "admin") {
      return res.status(403).send({ error: "Access denied." });
    }
    next();
  } catch (err) {
    res.status(500).send({ error: "Server error." });
  }
}

module.exports = { auth, isAdmin };
