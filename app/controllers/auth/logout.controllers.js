const blacklist = [];

router.post("/logout", (req, res) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).json({ error: "Token" });

  if (token) {
    blacklist.push(token);
  }
  res.status(200).json({ message: "Logout successful" });
});
