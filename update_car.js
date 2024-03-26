
const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
  try {
    const { loginId,  make, model, engineSize, transmission, fuelType, modelYear, carName } = req.body;
    const updateCarQuery = `
      UPDATE vehicle 
      SET make = $1, model = $2, engine_size = $3, transmission = $4, fuel_type = $5, model_year = $6, car_name = $7
      WHERE login_id = $8
      RETURNING id
    `;
    const carUpdateResult = await db.query(updateCarQuery, [
      make,
      model,
      engineSize,
      transmission,
      fuelType,
      modelYear,
      carName,
      loginId,
    ]);

    // Access the updated property_id from the result if needed
    const updatedCarId = carUpdateResult.rows[0].id;

    // Update profile_status to 1 in user_credentials table


    res.status(200).json({ success: true, property_id: updatedCarId });
  } catch (error) {
    console.error('Error updating Car:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
