const mongoose = require('mongoose');
const Admin = require('../src/models/admin.models');

mongoose
  .connect('mongodb://127.0.0.1:27017/stayhub')
  .then(async () => {
    console.log('Connected to database!');

    await Admin.deleteMany({});

    const admin = new Admin({
      userName: 'admin',
      email: 'admin@email.com',
      password: 'admin123',
      verified: 'true',
    });

    await admin.save();
    console.log('Admin added!');

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(`Failed to connect - ${err.message}`);
  });
