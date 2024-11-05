const mongoose = require('mongoose');
const User = require('../src/models/user.model');

const userData = [
  {
    fullName: 'Syahrul',
    email: 'syahrul@email.com',
    phone: '081234567890',
    role: 'user',
    password: '123',
    verified: true,
  },
  {
    fullName: 'Subhan',
    email: 'subhan@email.com',
    phone: '081234567890',
    role: 'user',
    password: '123',
    verified: true,
  },
  {
    fullName: 'Deska',
    email: 'deska@email.com',
    phone: '081234567890',
    role: 'user',
    password: '123',
    verified: true,
  },
  {
    fullName: 'Danendra',
    email: 'danendra@email.com',
    phone: '081234567890',
    role: 'user',
    password: '123',
    verified: true,
  },
  {
    fullName: 'Enggar',
    email: 'enggar@email.com',
    phone: '081234567890',
    role: 'user',
    password: '123',
    verified: true,
  },
];

mongoose
  .connect('mongodb://127.0.0.1:27017/stayhub')
  .then(async () => {
    console.log('Connected to database!');

    await User.deleteMany({});

    await User.insertMany(userData);
    console.log('User added!');

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(`Failed to connect - ${err.message}`);
  });
