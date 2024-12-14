const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      // default: 'pending',
      // enum: ['pending', 'in progress', 'follow up', 'resolved', 'cancelled'],
      default: "Menunggu",
      enum: ["Menunggu", "Selesai"],
    },
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

complaintSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

module.exports = mongoose.model('Complaint', complaintSchema);
