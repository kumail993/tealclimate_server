const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:model_year', async (req, res) => {
    var model_year = req.params.model_year;

    if (model_year.startsWith(':')) {
        model_year = model_year.substring(1); // Remove the first character (the colon)
      }
    try {
        const makeFetchQuery = 'SELECT DISTINCT make FROM car_database WHERE model_year = $1';
        const value = [model_year]
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(makeFetchQuery,value);

        // Extract only the model_year values from the rows array
        const make = result.rows.map(row => row.make);

        // Send the fetched data as a JSON response
        res.status(200).json({ make });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;