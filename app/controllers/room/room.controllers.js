const Room = require("../models/room");

exports.createRoom = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "Image is required!" });
    }

    try {
      if (
        !req.body.type ||
        !req.body.name ||
        !req.body.cost ||
        !req.body.startDate
      ) {
        return res.status(400).send({ message: "All fields are required!" });
      }

      const newRoom = new Room({
        type: req.body.type,
        name: req.body.name,
        cost: req.body.cost,
        startDate: new Date(req.body.startDate),
        imageUrl: req.file.path,
      });

      const savedRoom = await newRoom.save();
      res
        .status(201)
        .send({ message: "Room created successfully!", data: savedRoom });
    } catch (error) {
      console.error("Error creating room:", error.message);
      res.status(500).send({ message: "Error creating room!" });
    }
  });
};
