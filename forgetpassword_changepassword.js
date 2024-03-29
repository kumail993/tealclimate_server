const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db.js');

router.post('/', async (req, res) => {
  try {
    const { loginId, newPassword } = req.body;

    // Check if loginId and newPassword are provided
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    // Get the user from the database
    const user = await db.query('SELECT * FROM user_credentials WHERE user_email = $1', [loginId]);

    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db.query('UPDATE user_credentials SET user_password = $1 WHERE user_email = $2', [newPasswordHash, loginId]);

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
