const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, '../../public/images/profile');
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const uuidName = uuid.v4().slice(0, 8);
    cb(null, `${uuidName}-${file.originalname}`);
  },
});

const roomStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, '../../public/images/rooms');
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const uuidName = uuid.v4().slice(0, 8);
    cb(null, `${uuidName}-${file.originalname}`);
  },
});

const complaintStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, '../../public/images/complaint');
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const uuidName = uuid.v4().slice(0, 8);
    cb(null, `${uuidName}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const mimetype = allowedFileTypes.test(file.mimetype);
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
  }
};

const uploadProfileImages = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
}).single('profileImages');

const uploadRoomImages = multer({
  storage: roomStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
}).array('roomImages', 5);

const uploadComplaintImages = multer({
  storage: complaintStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
}).array('complaintImages', 5);

module.exports = {
  uploadProfileImages,
  uploadRoomImages,
  uploadComplaintImages,
};
