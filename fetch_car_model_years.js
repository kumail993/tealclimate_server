const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/', async (req, res) => {
    try {
        const modelsFetchQuery = 'SELECT DISTINCT model_year FROM cars ORDER BY model_year ASC';
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(modelsFetchQuery);

        // Extract only the model_year values from the rows array
        const modelYears = result.rows.map(row => row.model_year);

        // Send the fetched data as a JSON response
        res.status(200).json({ modelYears });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;