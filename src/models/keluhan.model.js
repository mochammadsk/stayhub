const mongoose = require("mongoose");

const keluhanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      default: "ditunda",
      enum: ["ditunda", "diproses", "selesai"],
    },
    images: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

keluhanSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("keluhan", keluhanSchema);
