const midtransClient = require('midtrans-client');
const dotenv = require('dotenv');

dotenv.config();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY,
  clientKey: process.env.CLIENT_KEY,
});

module.exports = snap;
