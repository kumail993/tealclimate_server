const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:model_year/:make', async (req, res) => {
    var model_year = req.params.model_year;
    var make = req.params.make;

    if (model_year.startsWith(':')) {
        model_year = model_year.substring(1); // Remove the first character (the colon)
      }
      if (make.startsWith(':')) {
        make = make.substring(1); // Remove the first character (the colon)
      }
    try {
        const modelFetchQuery = 'SELECT DISTINCT model FROM cars WHERE model_year = $1 AND make = $2';
        const value = [model_year,make]
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(modelFetchQuery,value);

        // Extract only the model_year values from the rows array
        const model = result.rows.map(row => row.model);

        const manuallyAddedElement = 'Enter Model';
        model.unshift(manuallyAddedElement);

        // Send the fetched data as a JSON response
        res.status(200).json({ model });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;