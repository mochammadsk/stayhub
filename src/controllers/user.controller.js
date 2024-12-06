const User = require('../models/user.model');
const Room = require('../models/room.model');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs').promises;

dotenv.config();

// get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({data: user});
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}

// Update profile
exports.updateProfile = async (req, res) => {
  const { fullName, email, phone, address } = req.body;
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
    user.address = address || user.address;

    // Update profile images
    if (req.files?.profileImages) {
      if (Array.isArray(user.profileImages) && user.profileImages.length > 0) {
        for (const image of user.profileImages) {
          const filePath = path.resolve(image.url);
          await fs.access(filePath).then(() => fs.unlink(filePath));
        }
      }
      user.profileImages = req.files.profileImages.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
    }

    // Update ktp images
    if (req.files?.ktpImages) {
      if (Array.isArray(user.ktpImages) && user.ktpImages.length > 0) {
        for (const image of user.ktpImages) {
          const filePath = path.resolve(image.url);
          await fs.access(filePath).then(() => fs.unlink(filePath));
        }
      }
      user.ktpImages = req.files.ktpImages.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
    }

    // Save data
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

exports.selectRoom = async (req, res) => {
  const { room } = req.body;
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if room exists
    const existingRoom = await Room.findOne({ name: room });
    if (!existingRoom) {
      console.log(existingRoom);
      return res.status(404).json({ message: `Room ${room} not found` });
    }

    res.status(200).json({ message: 'Room selected' });
  } catch {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
