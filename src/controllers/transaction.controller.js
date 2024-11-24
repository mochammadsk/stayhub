const Room = require('../models/room.model');
const Transaction = require('../models/transaction.model');
const snap = require('../config/midtranst');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

exports.create = async (req, res) => {
  const { duration } = req.body;
  // Check if duration is valid
  if (!duration || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ message: 'Invalid duration provided' });
  }
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: 'User ID is missing' });
  }
  // Check if room exists
  const room = await Room.findById(req.params.id);
  if (!room) {
    return res.status(404).json({ message: 'Room not found' });
  }
  // Check if user already has a pending transaction
  const existingTransaction = await Transaction.findOne({
    user: req.user.id,
    room: req.params.id,
    status: 'pending',
  });
  if (existingTransaction) {
    return res.status(400).json({
      message: 'You already have a pending transaction for this room',
    });
  }

  // Create transaction
  const transaction = new Transaction({
    user: req.user.id,
    room: req.params.id,
    duration,
    totalCost: room.cost * duration,
    status: 'pending',
  });

  // Create Midtrans transaction
  try {
    const result = await transaction.save();
    const parameter = {
      transaction_details: {
        order_id: `order-${result._id}`,
        gross_amount: result.totalCost,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      item_details: [
        {
          id: room.id,
          price: result.totalCost,
          quantity: req.body.duration,
          category: room.type,
          name: room.name,
        },
      ],
    };

    const midtrans = await snap.createTransaction(parameter);

    res.status(201).json({
      message: 'Transaction created successfully',
      data: midtrans,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
};

exports.update = async (req, res) => {
  const { status } = req.body;
  // Validasi input status
  const validStatuses = ['pending', 'completed', 'canceled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid transaction status' });
  }

  try {
    // Cari transaksi berdasarkan ID
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Perbarui status transaksi
    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      message: 'Transaction updated successfully',
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

exports.webhook = async (req, res) => {
  const notification = req.body;

  try {
    // Generate signature key
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const inputSignature =
      notification.order_id +
      notification.status_code +
      notification.gross_amount +
      serverKey;
    const calculatedSignature = crypto
      .createHash('sha512')
      .update(inputSignature)
      .digest('hex');

    // Compare signature key
    if (calculatedSignature !== notification.signature_key) {
      return res.status(401).json({ message: 'Invalid signature key' });
    }

    // Process the transaction (your existing code)
    const transaction = await Transaction.findOne({
      'paymentDetails.order_id': notification.order_id,
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = notification.transaction_status;
    transaction.paymentDetails = notification;
    await transaction.save();

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
