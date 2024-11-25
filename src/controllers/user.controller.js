const User = require('../models/user.model');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;

dotenv.config();

// Update profile
exports.updateProfile = async (req, res) => {
  const { fullName, email, phone } = req.body;
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update data
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    // Update image
    if (req.file) {
      if (Array.isArray(user.images) && user.images.length > 0) {
        for (const image of user.images) {
          const filePath = path.resolve(image.url);

          await fs.access(filePath);
          await fs.unlink(filePath);
        }
      }
      user.images = [
        {
          url: req.file.path,
          filename: req.file.filename,
        },
      ];
    }
    // Save
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete photo profile
exports.deletePhotoProfile = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete image
    if (Array.isArray(user.images) && user.images.length > 0) {
      for (const image of user.images) {
        const filePath = path.resolve(image.url);

        await fs.access(filePath);
        await fs.unlink(filePath);
      }
    }
    user.images = [];
    // Save
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
