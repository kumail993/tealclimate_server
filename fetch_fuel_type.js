const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:model_year/:make/:model/:engineSize/:transmission', async (req, res) => {
    var model_year = req.params.model_year;
    var make = req.params.make;
    var model = req.params.model;
    var engine_size = req.params.engineSize;
    var transmission = req.params.transmission;

    if (model_year.startsWith(':')) {
        model_year = model_year.substring(1); // Remove the first character (the colon)
      }
      if (make.startsWith(':')) {
        make = make.substring(1); // Remove the first character (the colon)
      }
      if (model.startsWith(':')) {
        model = model.substring(1); // Remove the first character (the colon)
      }
      if (engine_size.startsWith(':')) {
        engine_size = engine_size.substring(1); // Remove the first character (the colon)
      }

      if (transmission.startsWith(':')) {
        transmission = transmission.substring(1); // Remove the first character (the colon)
      }

    try {
        const feulTypeFetchQuery = 'SELECT DISTINCT fuel_type FROM car_database WHERE model_year = $1 AND make = $2 AND model = $3 AND engine_size = $4 AND transmission =$5';
        const value = [model_year,make,model,engine_size,transmission]
        
        // Assuming your db module has a method to execute queries
        const result = await db.query(feulTypeFetchQuery,value);

        // Extract only the model_year values from the rows array
        const fuelType = result.rows.map(row => row.fuel_type);

        // Send the fetched data as a JSON response
        res.status(200).json({ fuelType });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching data from the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;