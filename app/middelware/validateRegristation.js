const response = require("../config/response");
const validator = require("validator");

const validateRegistration = (req, res, next) => {
  const { userName, password, email } = req.body;

  if (
    !userName ||
    typeof userName !== "string" ||
    !validator.isLength(userName, { min: 3, max: 30 })
  ) {
    return res
      .status(400)
      .json(
        response.commonErrorMsg(
          "Invalid username! Username must be between 3 and 30 characters."
        )
      );
  }
  if (
    !password ||
    typeof password !== "string" ||
    !validator.isLength(password, { min: 8 })
  ) {
    return res
      .status(400)
      .json(
        response.commonErrorMsg(
          "Invalid password! Password must be at least 8 characters long."
        )
      );
  }
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json(response.commonErrorMsg("Invalid email!"));
  }

  next();
};

module.exports = validateRegistration;
