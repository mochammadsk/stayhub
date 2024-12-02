// src/config/multer.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// File filter to allow only jpeg, jpg, png
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
  }
};

// Storage configuration for profile images
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, '../../public/images/profile');
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const uuidName = uuidv4().slice(0, 8);
    cb(null, `${uuidName}-${file.originalname}`);
  },
});

// Storage configuration for room images
const roomStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, '../../public/images/rooms');
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const uuidName = uuidv4().slice(0, 8);
    cb(null, `${uuidName}-${file.originalname}`);
  },
});

// Storage configuration for complaint images
const complaintStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, '../../public/images/complaint');
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const uuidName = uuidv4().slice(0, 8);
    cb(null, `${uuidName}-${file.originalname}`);
  },
});

// Multer middleware for profile images
const profileImages = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter,
}).single('profileImages'); // Ensure the field name matches frontend

// Multer middleware for room images
const roomImages = multer({
  storage: roomStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter,
}).array('files', 5); // 'files' matches the frontend field name

// Multer middleware for complaint images
const complaintImages = multer({
  storage: complaintStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter,
}).array('complaintImages', 5); // Ensure the field name matches frontend

module.exports = {
  profileImages,
  roomImages,
  complaintImages,
};
