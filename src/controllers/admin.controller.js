const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

// Show data user
exports.findAll = async (req, res) => {
  try {
    const user = await User.find();
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'User found!', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Show data user by id
exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'User found!', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update role user
exports.updateRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.body;
    const updateUser = await User.findByIdAndUpdate(id, role, { new: true });
    if (!updateUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res
      .status(201)
      .json({ message: 'User updated successfully!', data: updateUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete user data
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
