const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    const user = !admin ? await User.findOne({ email }) : null;

    if (!user && !admin) {
      return res.status(400).send({ message: 'Email not found' });
    }

    const match = admin
      ? await argon2.verify(admin.password, password)
      : await argon2.verify(user.password, password);

    if (!match) {
      return res.status(400).send({ message: 'Wrong password!' });
    }

    const token = jwt.sign(
      {
        email: admin ? admin.email : user.email,
        role: admin ? admin.role : user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res
      .header(`Authorization`, `Bearer ${token}`)
      .status(200)
      .send({ messages: 'Login Succesful!', token });
  } catch (error) {
    res.status(400).send(error);
  }
};
