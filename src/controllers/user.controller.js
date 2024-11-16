const User = require('../models/user.model');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

dotenv.config();

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (req.file) {
      if (Array.isArray(user.images) && req.file.length > 0) {
        for (const image of user.images) {
          const filePath = path.resolve(image.url);
          if (fs.existsSync(filePath)) {
            console.log(`Deleted old file: ${filePath}`);
            await fs.unlink(filePath);
          }
        }
      }
      user.images = [
        {
          url: req.file.path,
          filename: req.file.filename,
        },
      ];
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete data
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findOneAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ messages: "Data can't be deleted!" });
      }
      res.send({ messages: 'Data deleted successfully!' });
    })
    .catch((err) => res.status(500).send({ messages: err.messages }));
};
