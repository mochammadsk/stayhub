const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: "user" },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("user", userSchema);
