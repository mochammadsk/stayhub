const mongoose = require('mongoose');

module.exports = async () => {
  const db = 'mongodb://localhost:27017/test';
  await mongoose.connect(db);
  console.log('Global setup: Connected to test database');
};
