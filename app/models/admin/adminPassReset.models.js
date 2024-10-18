const mongoose = require("mongoose");

const adminPasswordResetSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
  resetToken: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

const AdminPasswordReset = mongoose.model(
  "AdminPasswordReset",
  adminPasswordResetSchema
);

module.exports = AdminPasswordReset;
