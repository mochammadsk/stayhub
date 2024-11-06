const mongoose = require('mongoose');
const Room = require('../src/models/room.model');

const roomData = [
  {
    type: 'Standar Room',
    name: 'Room A',
    cost: '450.000 ',
  },
  {
    type: 'Standar Room',
    name: 'Room B',
    cost: '450.000',
  },
  {
    type: 'Deluxe Room',
    name: 'Room C',
    cost: '650.000',
  },
  {
    type: 'Deluxe Room',
    name: 'Room D',
    cost: '650.000',
  },
  {
    type: 'Suite Room',
    name: 'Room E',
    cost: '900.000',
  },
];

mongoose
  .connect('mongodb://127.0.0.1:27017/stayhub')
  .then(async () => {
    console.log('Connected to database!');

    await Room.deleteMany({});

    await Room.insertMany(roomData);
    console.log('Room added!');

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(`Failed to connect - ${err.message}`);
  });
