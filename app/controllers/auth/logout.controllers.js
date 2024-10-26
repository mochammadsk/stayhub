router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed!" });
    }
    res.status(200).json({ message: "Logged out successfully!" });
  });
});
