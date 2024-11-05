const User = require('../models/user.model');
const UserVerification = require('../models/userVerification.model');
const sendVerificationEmail = require('../services/userVerification.service');
const UserPasswordReset = require('../models/userPassReset.model');
const sendResetPasswordEmail = require('../services/userPassReset.service');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// Register account
exports.register = (data) =>
  new Promise((resolve, reject) => {
    console.log('Starting registration process...');

    // Check if email already exists
    User.findOne({
      $or: [{ email: data.email }],
    })
      .then((user) => {
        if (user) {
          if (user.email === data.email) {
            return reject(console.log('Email already exists!'));
          }
        } else {
          console.log('User not found. Proceeding with registration...');

          // Hash password
          argon2
            .hash(data.password)
            .then((hash) => {
              console.log('Password hashed successfully.');
              data.password = hash;
              User.create(data)
                .then((createdUser) => {
                  console.log('User created successfully:', createdUser);

                  // Create verification token
                  const uniqueString = uuidv4() + createdUser._id;
                  bcrypt
                    .hash(uniqueString, 10)
                    .then((hashedUniqueString) => {
                      const newVerification = new UserVerification({
                        userId: createdUser._id,
                        uniqueString: hashedUniqueString,
                        expiresAt: Date.now() + 3600000, // 1 hour
                      });

                      newVerification
                        .save()
                        .then(() => {
                          // Send verification email
                          sendVerificationEmail(
                            createdUser.email,
                            createdUser.fullName,
                            uniqueString
                          )
                            .then(() => {
                              resolve({
                                message:
                                  'Successful registration! Please verify your email.',
                                user: createdUser,
                              });
                            })
                            .catch((error) => {
                              reject(
                                'Registration successful but verification email failed to send.'
                              );
                            });
                        })
                        .catch((error) => {
                          reject('Failed to save verification data.');
                        });
                    })
                    .catch((error) => {
                      reject('Failed to hash verification string.', error);
                    });
                })
                .catch((error) => {
                  reject('User creation failed.', error);
                });
            })
            .catch((error) => {
              reject('Password hashing failed.', error);
            });
        }
      })
      .catch((error) => {
        reject('Failed to find user.', error);
      });
  });

// Verification email for register account
exports.verifyEmail = (req, res) => {
  const { uniqueString } = req.params;

  UserVerification.findOne({})
    .then((record) => {
      if (record) {
        bcrypt.compare(uniqueString, record.uniqueString, (err, isMatch) => {
          if (err) {
            console.error('Error comparing unique strings:', err);
            return res.status(500).json({
              messages: 'Error verifying email',
            });
          }
          if (isMatch) {
            const { userId } = record;
            User.updateOne({ _id: userId }, { verified: true })
              .then(() => {
                UserVerification.deleteOne({ _id: record._id })
                  .then(() => {
                    res.status(200).json({
                      messages: 'Email verified successfully!',
                    });
                  })
                  .catch((error) => {
                    res.status(500).json(
                      console.log({
                        messages: 'Error deleting verification record:',
                        error,
                      })
                    );
                  });
              })
              .catch((error) => {
                res.status(500).json(
                  console.log({
                    messages: 'Error updating user verification status:',
                    error,
                  })
                );
              });
          } else {
            res
              .status(400)
              .json({ messages: 'Invalid or expired verification link' });
          }
        });
      } else {
        res
          .status(400)
          .json({ messages: 'Invalid or expired verification link' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: 'Error verifying email:',
        error,
      });
    });
};

// Login account
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user based on email
    const user = await User.findOne({ email: email });
    if (!user) {
      console.error(`${email} not found`);
      throw new Error('Email not found!');
    }

    // Verify password
    const match = await argon2.verify(user.password, password);
    if (!match) {
      console.error(`Wrong password for ${user.fullName}`);
      throw new Error('Wrong password!');
    }

    // Check status role
    if (user.role !== 'user') {
      console.error('Unauthorized role for:', user.fullName);
      throw new Error('Unauthorized role!');
    }

    // Buat JWT token
    const token = jwt.sign(
      { userName: user.userName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Jika password cocok, simpan user di session
    req.session.user = user;

    console.log('Login successful for', user.fullName);
    return { user };
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

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

// Login Google
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8000/user/auth/google/callback'
);

exports.googleAuthRedirect = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    include_granted_scopes: true,
  });
  res.redirect(authUrl);
};

exports.googleAuthCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const userInfo = await google
      .oauth2({ version: 'v2', auth: oauth2Client })
      .userinfo.get();

    // Simpan informasi pengguna ke dalam database
    User.findOneAndUpdate(
      { email: userInfo.data.email, fullName: userInfo.data.name, role: 2 },
      userInfo.data,
      { upsert: true, new: true } // Untuk membuat entri baru jika tidak ditemukan
    )
      .then((user) => {
        console.log('User Info:', user);
        res.send('Authentication successful!');
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send('Failed to save user data!');
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Authentication failed!');
  }
};
