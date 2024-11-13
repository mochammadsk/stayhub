const { limits } = require("argon2");
const { storage } = require("googleapis/build/src/apis/storage");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/images/profile"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const roomStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/images/rooms"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const keluhanStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, "../../public/images/keluhan");
    // Membuat direktori jika belum ada
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
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
  }
  cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"));
};

const uploadProfileImages = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
}).single("profileImages");

const uploadRoomImages = multer({
  storage: roomStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
}).array("roomImages", 5);

const uploadKeluhanImages = multer({
  storage: keluhanStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
}).array("keluhanImages", 5);

module.exports = { uploadProfileImages, uploadRoomImages, uploadKeluhanImages };
