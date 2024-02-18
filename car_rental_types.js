const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:classification', async (req, res) => {

    var classification = req.params.classification;
    if (classification.startsWith(':')) {
        classification = classification.substring(1); // Remove the first character (the colon)
      }
    console.log(classification);

    // if (classification.startsWith(':')) {
    //     classification = classification.substring(1); // Remove the first character (the colon)
    //   }

    try {
        const categoryFetchQuery = 'SELECT DISTINCT stage FROM rental_car_database WHERE category = $1 ';
        const value = [classification]
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(categoryFetchQuery,value);

        // Extract only the model_year values from the rows array
        const carTypes = result.rows.map(row => row.stage);

        // Send the fetched data as a JSON response
        res.status(200).json({ carTypes });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;