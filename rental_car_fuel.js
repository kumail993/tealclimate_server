const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:classification/:type', async (req, res) => {

    var classification = req.params.classification;
    var type = req.params.type;
    if (classification.startsWith(':')) {
        classification = classification.substring(1); // Remove the first character (the colon)
      }
      if (type.startsWith(':')) {
        type = type.substring(1); // Remove the first character (the colon)
      }


    console.log(classification);

    // if (classification.startsWith(':')) {
    //     classification = classification.substring(1); // Remove the first character (the colon)
    //   }

    try {
        const categoryFetchQuery = 'SELECT DISTINCT fuel_type FROM rental_car_database WHERE category = $1 AND stage = $2';
        const value = [classification,type]
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(categoryFetchQuery,value);

        // Extract only the model_year values from the rows array
        const fuelTypes = result.rows.map(row => row.fuel_type);

        // Send the fetched data as a JSON response
        res.status(200).json({ fuelTypes });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;