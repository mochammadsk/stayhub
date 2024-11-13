const Keluhan = require("../models/keluhan.model");
const fs = require("fs");

// get all keluhan
exports.findAll = async (req, res) => {
  try {
    const keluhan = await Keluhan.find();
    if (keluhan.length === 0) {
      return res.status(404).json({ message: "Keluhan not found" });
    }
    res.status(200).json(keluhan);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// get keluhan by id
exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const keluhan = await Keluhan.findById(id);
    if (!keluhan) {
      return res.status(404).json({ message: "Keluhan not found" });
    }
    res.status(200).json(keluhan);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// create keluhan
exports.addKeluhan = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existingKeluhan = await Keluhan.findOne({ title });
    if (existingKeluhan) {
      return res.status(409).json({ message: "Keluhan already exists" }); // Ganti 404 dengan 409
    }

    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    const keluhan = new Keluhan({
      title,
      description,
      images: images,
      status: "ditunda",
    });

    const savedKeluhan = await keluhan.save();
    console.log(savedKeluhan);

    res.status(201).json(savedKeluhan);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// update keluhan by id
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log("Req", id);

    const keluhan = await Keluhan.findById(id);

    console.log("Keluhan found:", keluhan);

    if (!keluhan) {
      return res.status(404).json({ message: "Keluhan not found" });
    }

    const existingKeluhan = await Keluhan.findOne({ title });
    if (existingKeluhan) {
      return res.status(409).json({ message: "Keluhan already exists" }); // Ganti 404 dengan 409
    }

    if (!keluhan.idUser) {
      return res.status(400).json({ message: "keluhan tidak memiliki idUSer" });
    }

    if (keluhan.idUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    keluhan.title = title || keluhan.title;
    keluhan.description = description || keluhan.description;

    if (req.files && req.files.length > 0) {
      keluhan.images.forEach((image) => {
        fs.unlink(image.url, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      });

      console.log("update keluhan with ID", id);
      console.log("Request body", req.body);

      const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      keluhan.images = images;
    }

    await keluhan.save();
    res.status(200).json({ message: "Keluhan updated!", keluhan });
  } catch (error) {
    console.error("erro update keluhan", error.message);
    console.error("Stack trace: ", error.stack);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// delete keluhan by id
exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const keluhan = await Keluhan.findByIdAndDelete(id);
    if (!keluhan) {
      return res.status(404).json({ message: "Keluhan not found" });
    }

    if (keluhan.idUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.status(200).json({ message: "Keluhan deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
