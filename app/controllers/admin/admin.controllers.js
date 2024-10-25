const Admin = require("../../models/admin/admin.models");
const User = require("../../models/user/user.models");
const dotenv = require("dotenv");

dotenv.config();

// Show data user
exports.findAll = (req, res) => {
  User.find()
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Update data
exports.update = (req, res) => {
  const id = req.params.id;

  Admin.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Data can't be updated!" });
      }
      res.send({ message: "Data updated successfully!" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Delete data
exports.delete = (req, res) => {
  const id = req.params.id;

  Admin.findOneAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Data can't be deleted!" });
      }
      res.send({ message: "Data deleted successfully!" });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
