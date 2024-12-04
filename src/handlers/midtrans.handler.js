/* NEXT DEVELOPMENT */

// const Transaction = require('../models/transaction.model');
// const crypto = require('crypto');

// exports.webhook = async (req, res) => {
//   const notification = req.body;

//   try {
//     // Generate signature key
//     const serverKey = process.env.MIDTRANS_SERVER_KEY;
//     const inputSignature =
//       notification.order_id +
//       notification.status_code +
//       notification.gross_amount +
//       serverKey;
//     const calculatedSignature = crypto
//       .createHash('sha512')
//       .update(inputSignature)
//       .digest('hex');

//     // Compare signature key
//     if (calculatedSignature !== notification.signature_key) {
//       return res.status(401).json({ message: 'Invalid signature key' });
//     }

//     // Process the transaction (your existing code)
//     const transaction = await Transaction.findOne({
//       'paymentDetails.order_id': notification.order_id,
//     });
//     if (!transaction) {
//       return res.status(404).json({ message: 'Transaction not found' });
//     }

//     transaction.status = notification.transaction_status;
//     transaction.paymentDetails = notification;
//     await transaction.save();

//     res.status(200).send('OK');
//   } catch (error) {
//     console.error('Webhook processing error:', error);
//     res.status(500).json({ message: 'Internal Server Error', error });
//   }
// };
