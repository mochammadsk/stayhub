const jwt = require("jsonwebtoken");

const blacklist = [];
const auth = (role) => (req, res, next) => {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];

  if (!token) return res.status(401).send({ message: "Unauthorized!" });

  if (blacklist.includes(token)) {
    console.log(blacklist);
    return res.status(403).send({ message: "Token has been blacklisted!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    if (req.user.role !== role) {
      return res.status(403).json({ messages: "Unauthorized access!" });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = { auth, blacklist };
