const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    role: { type: String, default: 'user' },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    profileImages: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
    ktpImages: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
    room: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  },
  {
    timestamps: true,
  }
);

userSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  return { id: _id, ...object };
});

module.exports = mongoose.model('User', userSchema);
