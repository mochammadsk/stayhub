const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

// Function to dynamically generate storage based on field name
const generateStorage = (folderName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.resolve(__dirname, `../../public/images/${folderName}`);
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
};

// File filter
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

// Multer middleware for multiple fields
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folderMap = {
        profileImages: 'profile',
        ktpImages: 'ktp',
        roomImages: 'rooms',
        complaintImages: 'complaint',
      };

      const folderName = folderMap[file.fieldname] || 'others';
      const dir = path.resolve(__dirname, `../../public/images/${folderName}`);
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
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file 2 MB
  fileFilter: fileFilter,
});

const uploadImages = upload.fields([
  { name: 'profileImages', maxCount: 1 },
  { name: 'ktpImages', maxCount: 1 },
  { name: 'roomImages', maxCount: 5 },
  { name: 'complaintImages', maxCount: 5 },
]);

module.exports = uploadImages;
