const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:login_id', async (req, res) => {
    try {
        var loginId = req.params.login_id
        console.log(loginId);

        if (loginId.startsWith(':')) {
            loginId = loginId.substring(1); // Remove the first character (the colon)
          }
          console.log(loginId);


        // Ensure login_id is provided
        if (!loginId) {
            return res.status(400).json({ error: 'login_id is required' });
        }

        // Fetch data from the property table
        const FetchPropertyQuery = 'SELECT * FROM property WHERE login_id = $1';
        const { rows } = await db.query(FetchPropertyQuery, [loginId]);

        // Check if any rows were returned
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the provided login_id' });
        }

        // Respond with the fetched data
        res.json({ rows });
    } catch (error) {
        console.error('Error fetching data from property table:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
