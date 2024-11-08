module.exports = (app) => {
  const room = require('../controllers/room.controller');
  const { auth } = require('../middelware/auth.middleware');
  const { uploadRoomImages } = require('../config/multer');
  const router = require('express').Router();
  const dotenv = require('dotenv');

  dotenv.config();

  // Get all rooms
  router.get('/', (req, res) => {
    room.findAll(req, res);
  });

  // Get room by id
  router.get('/:id', (req, res) => {
    room.findById(req, res);
  });

  // Create room
  router.post('/add', auth(), uploadRoomImages, (req, res) => {
    room.addRoom(req, res);
  });

  // Update room by id
  router.put('/update/:id', auth(), uploadRoomImages, (req, res) => {
    room.updateRoom(req, res);
  });

  // Delete room by id
  router.delete('/delete/:id', auth(), (req, res) => {
    room.deleteById(req, res);
  });

  // Delete all rooms
  router.delete('/delete', auth(), (req, res) => {
    room.deleteAll(req, res);
  });

  app.use('/room', router);
};
