const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db.js');

router.post('/', async (req, res) => {
  try {
    const { loginId, oldPassword, newPassword } = req.body;

    // Check if loginId, oldPassword, and newPassword are provided
    if (!loginId || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    // Get the user from the database
    const user = await db.query('SELECT * FROM user_credentials WHERE login_id = $1', [loginId]);

    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const storedPasswordHash = user.rows[0].user_password;
    const oldPasswordHash = await bcrypt.hash(oldPassword, 10);

    // Verify oldPassword against stored password hash
    const passwordMatch = await bcrypt.compare(oldPasswordHash, storedPasswordHash);

    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await db.query('UPDATE user_credentials SET password = $1 WHERE login_id = $2', [newPasswordHash, loginId]);

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
