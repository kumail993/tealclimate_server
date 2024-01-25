const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    // Your registration logic here

    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    if (user_email && user_password) {
        const sql = "SELECT * FROM user_credentials WHERE user_email=$1 AND user_password=$2";

        db.query(sql, [user_email, user_password], (err, result) => {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).json({ success: false, message: 'Internal server error' });
            } else {
                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    if (user.active_status === 1) {
                        res.status(200).json({ success: true, user });
                    } else {
                        res.status(403).json({ success: false, message: 'User not verified' });
                    }
                } else {
                    res.status(401).json({ success: false, message: 'Incorrect email or password' });
                }
            }
        });
    } else {
        res.status(400).json({ success: false, message: 'Email and password required!' });
    }
});

module.exports = router;
