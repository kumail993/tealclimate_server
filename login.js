const express = require('express');
const router = express.Router();
const db = require('./db.js');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    // Your registration logic here

    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    if (user_email && user_password) {
        const sql = "SELECT * FROM user_credentials WHERE user_email=$1";

        db.query(sql, [user_email], async (err, result) => {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).json({ success: false, message: 'Internal server error' });
            } else {
                if (result.rows.length > 0) {
                    const user = result.rows[0];
                    if (user.active_status === 1) {
                        const hashedPassword = user.user_password;
                        // Compare hashed password with the provided password
                        const passwordMatch = await bcrypt.compare(user_password, hashedPassword);
                        if (passwordMatch) {
                            const sqll = "SELECT user_name FROM users WHERE login_id=$1";
                            db.query(sqll, [user.login_id], (err, result2) => {
                                if (err) {
                                    console.error('Database error:', err.message);
                                    res.status(500).json({ success: false, message: 'Internal server error' });
                                } else {
                                    if (result2.rows.length > 0) {
                                        const username = result2.rows[0].user_name; // Access user_name from the first row
                                        res.status(200).json({ success: true, user, username });
                                    } else {
                                        res.status(404).json({ success: false, message: 'Username not found' });
                                    }
                                }
                            });
                        } else {
                            res.status(401).json({ success: false, message: 'Incorrect email or password' });
                        }
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
