const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    // Your registration logic here

        try {
            const quantity = req.body.quantity;
            const userid=req.body.userid;
            const uom = req.body.uom;
        const query1 = 'SELECT * FROM users WHERE login_id = $1';
        const values1 = [userid];
        
        const query2 = 'SELECT * FROM property WHERE login_id = $1';
        const values2 = [userid];
        

        // Execute both queries concurrently
        const [result1, result2] = await Promise.all([
            db.query(query1, values1),
            db.query(query2, values2)
        ]);

        const data1 = result1.rows[0];   
        // console.log('Data from table1:', data1);

        const data2 = result2.rows[0];   
    // console.log('Data from table2:', data2);
    
        username=data1.user_name
        country=data2.country
        region=data2.state
    
        console.log(region);
        console.log(country);

        const query = 'SELECT * FROM electricity_database WHERE country = $1 AND region = $2';
        const values = [country, region];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Error fetching electricity_database data');
            } else {

            
                const datas = result.rows;

                datas.forEach(element => {
                 
                    const kgco2e=element.ghg_conversion_factor *quantity
                    console.log(element.category);
                    category = element.category;
                    stage = element.stage;
                    const insertQuery = 'INSERT INTO carbon_emissions (scope,category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
    
                    const insertValues = [element.scope,element.category,element.stage,element.country,element.region,element.placeholder,element.uom,element.ghgunit,element.ghg_conversion_factor,kgco2e,userid,username];
    
                    db.query(insertQuery, insertValues, (insertError, insertResult) => {
                        if (insertError) {
                            console.error('Error executing INSERT query:', insertError);
                            return res.status(500).send('Error inserting kgco2e data');
                        } else {
                            // The INSERT query was successful.
                            res.status(200).json({ success: true, kgco2e:kgco2e });
                        }
                    });
                });

            }
        });

        // Handle data from both tables here
    } catch (error) {
        console.error('Error executing queries:', error);
        return res.status(500).send('Error fetching data from database');
    } finally {

    }
});

module.exports = router;