
const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
  try {
    const { loginId,  property_name, country, state, city, area, } = req.body;
    const updatePropertyQuery = `
      UPDATE property 
      SET property_name = $1, country = $2, state = $3, city = $4, area = $5 
      WHERE login_id = $6
      RETURNING property_id
    `;
    const propertyUpdateResult = await db.query(updatePropertyQuery, [
      property_name,
      country,
      state,
      city,
      area,
      loginId,
    ]);

    // Access the updated property_id from the result if needed
    const updatedPropertyId = propertyUpdateResult.rows[0].property_id;

    // Update profile_status to 1 in user_credentials table


    res.status(200).json({ success: true, user_id: userId, property_id: updatedPropertyId });
  } catch (error) {
    console.error('Error updating user, property, and profile status:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
