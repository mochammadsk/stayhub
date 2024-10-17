const app = require("./app");
const db = require("./app/config/database");
const mongoose = require("mongoose");
const http = require("http");

// Connection to database
mongoose
  .connect(db.url, db.mongooseConfig)
  .then(() => console.log("Connected to database!"))
  .catch((err) => {
    console.log(`Failed to connect - ${err.message}`);
    process.exit();
  });

// Create server port
const PORT = 8000;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
