const express = require('express');
const router = express.Router();
const db = require('./db.js');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt'); 
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const { email, } = req.body;

    // Check if the email already exists in the database
    const checkExistingQuery = 'SELECT * FROM user_credentials WHERE user_email = $1';
    const existingUsers = await db.query(checkExistingQuery, [email]);

    if (existingUsers.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'User with the same email already registered' });
    }

    // Generate OTP for User Authentication
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

    // Send OTP to the given Email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'khaider308@gmail.com',
        pass: 'epjudfftrtdmaukc',
      },
    });

    const mailOptions = {
      from: 'Khaider308@gmail.com',
      to: email, // Recipient's email
      subject: 'Your Teal-Climate Verification Code',
      html: `<html>
        <!-- Your HTML content here -->
        <div class="otp">${otp}</div>
        <!-- More HTML content -->
      </html>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.response);

    // Update the OTP in the database for the user
    const updateOtpQuery = 'UPDATE user_credentials SET otp = $1 WHERE user_email = $2';
    await db.query(updateOtpQuery, [otp, email]);

    // Insert into login table and other necessary logic
    // ...

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
});

module.exports = router;
