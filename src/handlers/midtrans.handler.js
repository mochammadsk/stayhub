const Transaction = require('../models/transaction.model');
const Room = require('../models/room.model');
const snap = require('../config/midtranst');

// Midtrans webhook handler
exports.webhook = async (req, res) => {
  const notification = req.body;
  try {
    // Validate notification signature and get transaction status
    const statusResponse = await snap.transaction.notification(notification);

    const { order_id, transaction_status, fraud_status } = statusResponse;

    // Log the status response for debugging
    console.log('Notification received:', statusResponse);

    // Update transaction in the database
    const transaction = await Transaction.findOne({ _id: order_id });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction status based on Midtrans response
    if (transaction_status === 'settlement') {
      transaction.status = 'settlement';
    } else if (transaction_status === 'expire') {
      transaction.status = 'expired';
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny'
    ) {
      transaction.status = 'cancel';
    }

    // Additional fraud handling
    if (fraud_status === 'challenge') {
      transaction.status = 'pending';
    }

    // Save updated transaction
    await transaction.save();

    // Update transaction status in Room model
    Room.transaction.push(transaction._id);
    await Room.save();

    return res.status(200).json({ message: 'Transaction status updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
