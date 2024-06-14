// routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Route to request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User with this email does not exist' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER, 
        pass: process.env.APP_PASSWORD, 
      },
    });
    const mailOptions = {
      to: 'aammn52340@gmail.com',
      from: 'aammn52340@gmail.com',
      subject: 'Password Reset',
      // text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      //        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
      //        http://localhost:3000/reset-password/${token}\n\n
      //        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error: ', err);
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset email sent successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to reset the password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
