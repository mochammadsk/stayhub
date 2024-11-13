const Room = require("../models/room.model");
const fs = require("fs");
const path = require("path");

// Get all rooms
exports.findAll = async (req, res) => {
  try {
    const room = await Room.find();
    if (room.length === 0) {
      return res.status(404).json({ message: "Rooms not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Create room
exports.addRoom = async (req, res) => {
  try {
    const { type, name, cost } = req.body;
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(404).json({ message: "Room already exists" });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    const room = new Room({
      type,
      name,
      cost,
      images,
    });

    await room.save();
    res.status(201).json({ message: "Room created successfully", data: room });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Update book by id
exports.updateRoom = async (req, res) => {
  try {
    const { type, name, cost } = req.body;
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(404).json({ message: "Room already exists" });
    }

    room.type = type || room.type;
    room.name = name || room.name;
    room.cost = cost || room.cost;

    if (req.files && req.files.length > 0) {
      room.images.forEach((image) => {
        fs.unlink(image.url, (err) => {
          console.log(err);
        });
      });

      const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      room.images = images;
      await room.save();
    }

    res.status(200).json({ message: "Room updated!", room });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Delete room by id
exports.deleteById = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Delete all rooms
exports.deleteAll = async (req, res) => {
  try {
    const room = await Room.find();
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    await Room.deleteMany();
    res.status(200).json({ message: "All rooms deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
