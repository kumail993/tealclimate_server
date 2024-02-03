const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:model_year/:make/:model', async (req, res) => {
    var model_year = req.params.model_year;
    var make = req.params.make;
    var model = req.params.model;

    if (model_year.startsWith(':')) {
        model_year = model_year.substring(1); // Remove the first character (the colon)
      }
      if (make.startsWith(':')) {
        make = make.substring(1); // Remove the first character (the colon)
      }
      if (model.startsWith(':')) {
        model = model.substring(1); // Remove the first character (the colon)
      }
    try {
        const engineSizeFetchQuery = 'SELECT DISTINCT engine_size FROM car_database WHERE model_year = $1 AND make = $2 AND model = $3';
        const value = [model_year,make,model]
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(engineSizeFetchQuery,value);

        // Extract only the model_year values from the rows array
        const engineSize = result.rows.map(row => row.engine_size);

        // Send the fetched data as a JSON response
        res.status(200).json({ engineSize });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;