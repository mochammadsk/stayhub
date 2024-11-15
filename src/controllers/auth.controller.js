const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { google } = require('googleapis');
const UserVerification = require('../models/userVerification.model');
const sendVerificationEmail = require('../services/userVerification.service');
const UserPasswordReset = require('../models/userPassReset.model');
const sendResetPasswordEmail = require('../services/userPassReset.service');

// Register account for user
exports.register = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await argon2.hash(req.body.password);
    req.body.password = hashedPassword;

    const createdUser = await User.create(req.body);
    console.log('User created successfully:', createdUser);

    // Create verification token
    const uniqueString = uuidv4() + createdUser._id;
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

    const userVerification = new UserVerification({
      userId: createdUser._id,
      uniqueString: hashedUniqueString,
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    await userVerification.save();

    // Send verification email
    await sendVerificationEmail(
      createdUser.email,
      createdUser.fullName,
      uniqueString
    );

    return res.status(200).json({
      message: 'Successful registration! Please verify your email.',
      user: createdUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
};

// Verification email for register account
exports.verifyEmail = async (req, res) => {
  try {
    const { uniqueString } = req.params;
    const record = await UserVerification.findOne({});
    if (record) {
      const isMatch = await bcrypt.compare(uniqueString, record.uniqueString);

      if (isMatch) {
        await User.updateOne({ _id: record.userId }, { verified: true });
        await UserVerification.deleteOne({ _id: record._id });
        return res.status(200).json({
          messages: 'Email verified successfully',
        });
      } else {
        return res.status(400).json({
          messages: 'Invalid verification link',
        });
      }
    } else {
      return res.status(400).json({
        messages: 'Invalid verification link',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    const user = !admin ? await User.findOne({ email }) : null;

    if (!user && !admin) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const match = admin
      ? await argon2.verify(admin.password, password)
      : await argon2.verify(user.password, password);

    if (!match) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    const token = jwt.sign(
      {
        id: admin ? admin._id : user._id,
        email: admin ? admin.email : user.email,
        role: admin ? admin.role : user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res
      .header(`Authorization`, `Bearer ${token}`)
      .status(200)
      .json({ messages: 'Login Succesful!', token });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Login Google
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:8000/auth/google/callback'
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
      {
        fullName: userInfo.data.name,
        email: userInfo.data.email,
        role: 'user',
        verified: true,
      },
      userInfo.data,
      { upsert: true, new: true }
    )
      .then((user) => {
        console.log('User Info:', user);
        res.json('Authentication successful!');
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json('Failed to save user data!');
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json('Authentication failed!');
  }
};

// Password reset
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, messages: 'User not found' });
    }

    // Buat reset token dan hash
    const resetToken = uuidv4();
    const hashedToken = bcrypt.hashSync(resetToken, 10);
    const expiresAt = Date.now() + 3600000; // 1 hour

    // Buat record untuk password reset
    const newPasswordReset = new UserPasswordReset({
      userId: user._id,
      resetToken: hashedToken,
      createdAt: Date.now(),
      expiresAt,
    });

    // Simpan record password reset
    await newPasswordReset.save();

    // Kirim email reset password
    await sendResetPasswordEmail(user.email, user.userName, resetToken);
    res.status(200).json({
      error: false,
      messages: 'Password reset email sent',
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      messages: 'Error processing reset request',
    });
  }
};

// Verification email password reset
exports.verifyResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const passwordResets = await UserPasswordReset.find();
    const passwordReset = passwordResets.find((pr) =>
      bcrypt.compareSync(resetToken, pr.resetToken)
    );

    if (!passwordReset) {
      return res.status(400).json({
        error: true,
        messages: 'Invalid reset token',
      });
    }

    const { userId, expiresAt } = passwordReset;
    if (expiresAt < Date.now()) {
      return res.status(400).json({
        error: true,
        messages: 'Reset token has expired',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: true,
        messages: 'User not found',
      });
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;

    await user.save();
    await UserPasswordReset.deleteOne({ _id: passwordReset._id });
    res.status(200).json({
      success: true,
      messages: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      messages: 'Failed to reset password',
    });
  }
};
