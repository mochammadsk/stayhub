const mongoose = require("mongoose");

const adminVerificationSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  uniqueString: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  expiredAt: { type: Date },
});

const AdminVerification = mongoose.model(
  "AdminVerification",
  adminVerificationSchema
);

module.exports = AdminVerification;
