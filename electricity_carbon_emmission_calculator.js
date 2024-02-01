const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    // Your registration logic here

    const country = req.body.country;
    const region =  req.body.region;
    const userid = req.body.userid;
    const username = req.body.username;
    const quantity = req.body.quantity;
    const category = "household";


    try {
        const query = 'SELECT * FROM scope2 WHERE country = $1 AND region = $2';
        const values = [country, region];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Error fetching scope2 data');
            } else {
                // The query was successful, and the result is available in the 'result' object.
                console.log(result);
                const datas = result.rows[0];
                console.log(datas);
                const kgco2e=datas.ghg_conversion_factor*quantity

                console.log(datas);
                // sub_category,
                const insertQuery = 'INSERT INTO carbon_emissions (scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)';

                const insertValues = [datas.scope,category,datas.category,datas.stage,datas.country,datas.region,datas.placeholder,datas.uom,datas.ghgunit,datas.ghg_conversion_factor,kgco2e,userid,username];

                db.query(insertQuery, insertValues, (insertError, insertResult) => {
                    if (insertError) {
                        console.error('Error executing INSERT query:', insertError);
                        return res.status(500).send('Error inserting kgco2e data');
                    } else {
                        // The INSERT query was successful.
                        console.log('kgco2e data inserted successfully');
                        res.status(200).json({ success: true, kgco2e:kgco2e });
                    }
                });

            }
        });
    } finally {
       
    }
});

module.exports = router;
