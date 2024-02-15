const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/', async (req, res) => {
    try {
        const mealTypeFetchQuery = 'SELECT DISTINCT category, stage FROM meal_database';
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(mealTypeFetchQuery);

        // Extract only the category and stage values from the rows array
        const categories = [];
        const stages = [];
        result.rows.forEach(row => {
            if (!categories.includes(row.category)) {
                categories.push(row.category);
            }
            if (!stages.includes(row.stage)) {
                stages.push(row.stage);
            }
        });

        // Send the fetched data as a JSON response
        res.status(200).json({ categories, stages });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
