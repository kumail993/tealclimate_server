const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/', async (req, res) => {
    try {
        const categoryFetchQuery = 'SELECT DISTINCT category FROM rental_car_database ORDER BY category ASC';
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(categoryFetchQuery);

        // Extract only the model_year values from the rows array
        const carCategories = result.rows.map(row => row.category);

        // Send the fetched data as a JSON response
        res.status(200).json({ carCategories });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;