const mongoose = require("mongoose");

const userPasswordResetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

const UserPasswordReset = mongoose.model(
  "UserPasswordReset",
  userPasswordResetSchema
);

module.exports = UserPasswordReset;
