const validator = require("validator");

const validateRegistration = (req, res, next) => {
  const { email, phone, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      error: "Invalid email!",
    });
  }

  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({
      error: "Invalid phone number! Phone number must contain 10 to 15 digits.",
    });
  }

  if (
    !password ||
    typeof password !== "string" ||
    !validator.isLength(password, { min: 8 }) ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*(),.?":{}|<>_-]/.test(password)
  ) {
    return res.status(400).json({
      error: "Invalid password! Password must be at least 8 characters long.",
    });
  }

  next();
};

module.exports = validateRegistration;
