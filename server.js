const app = require('./app.js');
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Database config
const db = {
  url: process.env.DB_URL,
};
// Connection to database
mongoose
  .connect(db.url, db.mongooseConfig)
  .then(() => console.log('Connected to database!'))
  .catch((err) => {
    console.log(`Failed to connect - ${err.message}`);
    process.exit();
  });
// Create server port
const PORT = process.env.PORT;
const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
