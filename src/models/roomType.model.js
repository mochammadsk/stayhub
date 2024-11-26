const mongoose = require('mongoose');

const typeRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    facility: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FacilityRoom' }],
    description: { type: String, required: true },
    cost: { type: Number, required: true },
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
