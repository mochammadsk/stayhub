module.exports = (app) => {
  const keluhan = require("../controllers/keluhan.controller");
  const { auth } = require("../middelware/auth.middleware");
  const { uploadKeluhanImages } = require("../config/multer");
  const dotenv = require("dotenv");
  const router = require("express").Router();

  dotenv.config();

  // Get all keluhan
  router.get("/", auth("user", "admin"), keluhan.findAll);

  // Get keluhan by id
  router.get("/:id", auth("user", "admin"), keluhan.findById);

  // Create keluhan
  router.post("/create", auth("user"), uploadKeluhanImages, keluhan.addKeluhan);


  // Update keluhan by id
  router.put("/update/:id", auth("user"), uploadKeluhanImages, keluhan.update);

  // Delete keluhan by id
  router.delete("/delete/:id", auth("user"), keluhan.deleteById);

  app.use("/keluhan", router);
};
