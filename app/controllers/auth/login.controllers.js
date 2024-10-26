const Admin = require("../../models/admin/admin.models");
const User = require("../../models/user/user.models");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    let user;
    if (!admin) {
      user = await User.findOne({ email });
    } else if (!user && !admin) {
      return res.status(400).json("Email not found!");
    }

    const match = admin
      ? await argon2.verify(admin.password, password)
      : user
      ? await argon2.verify(user.password, password)
      : false;
    if (!match) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    const token = jwt.sign(
      {
        email: admin ? admin.email : user.email,
        role: admin ? admin.role : user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .header("auth-token", token)
      .json({ messages: "Login Successful", token });
  } catch (error) {
    res.status(400).send(error);
  }
};
