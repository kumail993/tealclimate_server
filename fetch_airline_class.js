const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/', async (req, res) => {
    try {
        const airlineClassFetchQuery = 'SELECT DISTINCT class FROM air_travel_database';
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(airlineClassFetchQuery);

        // Extract only the model_year values from the rows array
        const airlineClass = result.rows.map(row => row.class);

        // Send the fetched data as a JSON response
        res.status(200).json({ airlineClass });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;