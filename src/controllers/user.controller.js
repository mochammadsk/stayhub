const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

// Update data
exports.update = (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({ messages: "Data can't be updated!" });
      }
      res.send({ messages: 'Data updated successfully!' });
    })
    .catch((err) => res.status(500).send({ messages: err.messages }));
};

// Delete data
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findOneAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ messages: "Data can't be deleted!" });
      }
      res.send({ messages: 'Data deleted successfully!' });
    })
    .catch((err) => res.status(500).send({ messages: err.messages }));
};
