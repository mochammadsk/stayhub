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
const connectDB = async () => {
  try {
    await mongoose.connect(db.url, db.mongooseConfig);
    console.log('Connected to database!');
  } catch (error) {
    console.log(`Failed to connect - ${error.message}`);
    process.exit(1);
  }
};

// Create server port and start server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT;
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

  return server;
};

startServer();

module.exports = { connectDB, startServer };
