const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/', async (req, res) => {
    try {
        const BusTypeFetchQuery = 'SELECT DISTINCT stage FROM bus_database';
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(BusTypeFetchQuery);

        // Extract only the model_year values from the rows array
        const BusType = result.rows.map(row => row.stage);

        // Send the fetched data as a JSON response
        res.status(200).json({ BusType });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;