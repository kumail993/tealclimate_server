const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:country', async (req, res) => {
    var country = req.params.country;
    if (country.startsWith(':')) {
        country = country.substring(1); // Remove the first character (the colon)
      }
    try {
        const regionFetchQuery = 'SELECT DISTINCT region FROM electricity_database WHERE country = $1';
        const value = [country]
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(regionFetchQuery,value);

        // Extract only the model_year values from the rows array
        const regions = result.rows.map(row => row.region);

        // Send the fetched data as a JSON response
        res.status(200).json({ regions });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;