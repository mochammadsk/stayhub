const mongoose = require("mongoose");

const userVerificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  uniqueString: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  expiredAt: { type: Date },
});

const UserVerification = mongoose.model(
  "UserVerification",
  userVerificationSchema
);

module.exports = UserVerification;
