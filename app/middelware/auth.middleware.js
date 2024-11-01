const jwt = require("jsonwebtoken");

const blacklist = [];
const auth = (role) => (req, res, next) => {
  const token = req.header("auth-token");
  console.log("Token:", token);

  if (!token) return res.status(401).send({ error: "Access denied!" });

  if (blacklist.includes(token)) {
    console.log(blacklist);
    return res.status(403).send({ message: "Token has been blacklisted!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified token:", verified);
    req.user = verified;

    if (req.user.role !== role) {
      return res.status(403).json({ messages: "Unauthorized access" });
    }

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = { auth, blacklist };
