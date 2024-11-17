const Room = require('../models/room.model');
const Transaction = require('../models/transaction.model');
const snap = require('../config/midtranst');

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
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
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
  // Check if transaction exists
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  try {
    transaction.status = req.body.status;
    await transaction.save();
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
