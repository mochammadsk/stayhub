const User = require('../models/user.model');
const UserPasswordReset = require('../models/userPassReset.model');
const sendResetPasswordEmail = require('../services/userPassReset.service');
const { v4: uuidv4 } = require('uuid');
const argon2 = require('argon2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// Password reset
exports.resetPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ error: true, messages: 'User not found' });
      }

      const resetToken = uuidv4();
      const hashedToken = bcrypt.hashSync(resetToken, 10);
      const expiresAt = Date.now() + 3600000; // 1 hour

      const newPasswordReset = new UserPasswordReset({
        userId: user._id,
        resetToken: hashedToken,
        createdAt: Date.now(),
        expiresAt,
      });

      newPasswordReset
        .save()
        .then(() => {
          sendResetPasswordEmail(user.email, user.userName, resetToken)
            .then(() => {
              res
                .status(200)
                .json({ error: false, messages: 'Password reset email sent' });
            })
            .catch((error) => {
              console.error('Error sending reset email:', error);
              res
                .status(500)
                .json({ error: true, messages: 'Error sending reset email' });
            });
        })
        .catch((error) => {
          console.error('Error saving password reset record:', error);
          res
            .status(500)
            .json({ error: true, messages: 'Error processing reset request' });
        });
    })
    .catch((error) => {
      console.error('Error finding user:', error);
      res
        .status(500)
        .json({ error: true, messages: 'Error processing reset request' });
    });
};

// Verification email password reset
exports.verifyResetPassword = (req, res) => {
  const { resetToken, newPassword } = req.body;

  UserPasswordReset.find()
    .then((passwordResets) => {
      const passwordReset = passwordResets.find((pr) =>
        bcrypt.compareSync(resetToken, pr.resetToken)
      );

      if (!passwordReset) {
        return res
          .status(400)
          .json({ error: true, messages: 'Invalid reset token' });
      }

      const { userId, expiresAt } = passwordReset;

      if (expiresAt < Date.now()) {
        return res
          .status(400)
          .json({ error: true, messages: 'Reset token has expired' });
      }

      // Update user password
      User.findById(userId)
        .then((user) => {
          if (!user) {
            return res
              .status(400)
              .json({ error: true, messages: 'User not found' });
          }

          // Hash new password
          argon2
            .hash(newPassword)
            .then((hashedPassword) => {
              user.password = hashedPassword;
              user
                .save()
                .then(() => {
                  // Delete the password reset token from the database
                  UserPasswordReset.deleteOne({ _id: passwordReset._id })
                    .then(() => {
                      res.status(200).json({
                        success: true,
                        messages: 'Password reset successfully',
                      });
                    })
                    .catch((error) => {
                      console.error(
                        'Error deleting password reset token:',
                        error
                      );
                      res.status(500).json({
                        error: true,
                        messages: 'Failed to reset password',
                      });
                    });
                })
                .catch((error) => {
                  console.error('Error saving new password:', error);
                  res.status(500).json({
                    error: true,
                    messages: 'Failed to reset password',
                  });
                });
            })
            .catch((error) => {
              console.error('Error hashing new password:', error);
              res
                .status(500)
                .json({ error: true, messages: 'Failed to reset password' });
            });
        })
        .catch((error) => {
          console.error('Error finding user:', error);
          res
            .status(500)
            .json({ error: true, messages: 'Failed to reset password' });
        });
    })
    .catch((error) => {
      console.error('Error finding password reset token:', error);
      res
        .status(500)
        .json({ error: true, messages: 'Failed to reset password' });
    });
};

// Update data
exports.update = (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({ messages: "Data can't be updated!" });
      }
      res.send({ messages: 'Data updated successfully!' });
    })
    .catch((err) => res.status(500).send({ messages: err.messages }));
};

// Delete data
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findOneAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ messages: "Data can't be deleted!" });
      }
      res.send({ messages: 'Data deleted successfully!' });
    })
    .catch((err) => res.status(500).send({ messages: err.messages }));
};
