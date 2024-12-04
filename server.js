const app = require('./app.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Database config
const db = {
  url:
    process.env.NODE_ENV === 'production'
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI,
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(db.url, {});
    console.log(
      `Connected to ${
        process.env.NODE_ENV === 'production' ? 'cloud' : 'local'
      } database!`
    );
  } catch (error) {
    console.error(`Failed to connect - ${error.message}`);
    process.exit(1);
  }
};

// Initialize the server
const server = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT;
    if (!app.listening) {
      app.listening = true;
      app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    }
  } catch (error) {
    console.error(`Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
if (process.env.NODE_ENV !== 'production') {
  server();
}

module.exports = app;
