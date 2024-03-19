
const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
  try {
    const { loginId, user_name, user_ph_no, user_gender, property_name, country, state, city, area,model_year,make,model,engine_size,transmission,fuel_type,car_name } = req.body;
    console.log(model_year);

    const updateQuery = `
      UPDATE users
      SET user_name = $1, user_ph_no = $2, user_gender = $3
      WHERE login_id = $4
      RETURNING user_id
    `;
    const userUpdateResult = await db.query(updateQuery, [user_name, user_ph_no, user_gender, loginId]);
    const userId = userUpdateResult.rows[0].user_id;

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
    const updateProfileStatusQuery = `
      UPDATE user_credentials
      SET profile_status = 1
      WHERE login_id = $1
    `;
    await db.query(updateProfileStatusQuery, [loginId]);

    const updateVehicleQuery = `
      UPDATE vehicle 
      SET make = $1, model = $2, engine_size = $3, transmission = $4, fuel_type = $5, model_year = $6, car_name = $7 
      WHERE login_id = $8
      RETURNING id
    `;

    const vehicleUpdateResult = await db.query(updateVehicleQuery, [
      make,
      model,
      engine_size,
      transmission,
      fuel_type,
      model_year,
      car_name,
      loginId,
    ]);


    res.status(200).json({ success: true, user_id: userId, property_id: updatedPropertyId });
  } catch (error) {
    console.error('Error updating user, property, and profile status:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const db = require('./db.js');

// router.post('/', async (req, res) => {
//   try {
//     const { loginId, user_name, user_ph_no, user_gender, property_name, country, state, city, area } = req.body;

//     const updateQuery = `
//       UPDATE users
//       SET user_name = $1, user_ph_no = $2, user_gender = $3
//       WHERE login_id = $4
//       RETURNING user_id
//     `;
//     const userUpdateResult = await db.query(updateQuery, [user_name, user_ph_no, user_gender, loginId]);
//     const userId = userUpdateResult.rows[0].user_id;

//     const updatePropertyQuery = `
//       UPDATE property 
//       SET property_name = $1, country = $2, state = $3, city = $4, area = $5 
//       WHERE login_id = $6
//       RETURNING property_id
//     `;
//     const propertyUpdateResult = await db.query(updatePropertyQuery, [
//       property_name,
//       country,
//       state,
//       city,
//       area,
//       loginId,
//     ]);

//     // Access the updated property_id from the result if needed
//     const updatedPropertyId = propertyUpdateResult.rows[0].property_id;

//     res.status(200).json({ success: true, user_id: userId, property_id: updatedPropertyId });
//   } catch (error) {
//     console.error('Error updating user and inserting property:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });

// module.exports = router;






// const express = require('express');
// const router = express.Router();
// const db = require('./db.js');

// router.post('/', async (req, res) => {
//     // Complete Profile Login
//     try{
//     const { loginId, user_name, user_ph_no, user_gender, property_name, country, state, city, area } = req.body;

//     const updateQuery = `
//       UPDATE users
//       SET user_name = $1, user_ph_no = $2, user_gender = $3
//       WHERE login_id = $4
//       RETURNING user_id
//     `;
//     const userUpdateResult = await db.query(updateQuery, [user_name, user_ph_no, user_gender, loginId]);
//     const userId = userUpdateResult.rows[0].user_id;


//     const insertPropertyQuery = `
//       INSERT INTO property (property_name, country, state, city, area, user_id)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING property_id
//     `;
//     const propertyInsertResult = await db.query(insertPropertyQuery, [
//       property_name,
//       country,
//       state,
//       city,
//       area,
//       userId,
//     ]);
//     const propertyId = propertyInsertResult.rows[0].property_id;

//     res.json({ success: true, user_id: userId, property_id: propertyId });
// } catch (error){
//     console.error('Error updating user and inserting property:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
// }

//   } );

// module.exports = router;
