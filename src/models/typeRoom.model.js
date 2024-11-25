const mongoose = require('mongoose');

const typeRoomSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    facility: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FacilityRoom' }],
    cost: { type: Number, required: true },
    images: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

typeRoomSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

module.exports = mongoose.model('TypeRoom', typeRoomSchema);
