const Complaint = require('../models/complaint.model');
const fs = require('fs');

// Get all complaint
exports.findAll = async (req, res) => {
  try {
    const complaint = await Complaint.find();
    if (complaint.length === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Get complaint by id
exports.findById = async (req, res) => {
  try {
    const id = req.params.id;
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create complaint
exports.addKeluhan = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existingKeluhan = await Complaint.findOne({ title });
    if (existingKeluhan) {
      return res.status(409).json({ message: 'Complaint already exists' });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));

    const complaint = new Complaint({
      title,
      description,
      images: images,
      status: 'ditunda',
    });

    const savedKeluhan = await complaint.save();
    console.log(savedKeluhan);

    res.status(201).json(savedKeluhan);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Update complaint by id
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log('Req', id);

    const complaint = await Complaint.findById(id);

    console.log('Complaint found:', complaint);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const existingKeluhan = await Complaint.findOne({ title });
    if (existingKeluhan) {
      return res.status(409).json({ message: 'Complaint already exists' });
    }

    if (!complaint.idUser) {
      return res
        .status(400)
        .json({ message: 'Complaint tidak memiliki idUSer' });
    }

    if (complaint.idUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;

    if (req.files && req.files.length > 0) {
      complaint.images.forEach((image) => {
        fs.unlink(image.url, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          }
        });
      });

      console.log('update complaint with ID', id);
      console.log('Request body', req.body);

      const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      complaint.images = images;
    }

    await complaint.save();
    res.status(200).json({ message: 'Complaint updated!', complaint });
  } catch (error) {
    console.error('erro update complaint', error.message);
    console.error('Stack trace: ', error.stack);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Delete complaint by id
exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.idUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json({ message: 'Complaint deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
