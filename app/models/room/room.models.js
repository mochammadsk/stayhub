const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    startDate: { type: Date, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

roomSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = mongoose.model("room", roomSchema);
