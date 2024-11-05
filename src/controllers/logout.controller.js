const blacklist = [];

router.post("/logout", (req, res) => {
  const token = req.header("auth-token");

  if (!token) return res.status(401).send({ error: "Token" });

  if (token) {
    blacklist.push(token);
  }
  res.status(200).send({ message: "Logout successful" });
});
