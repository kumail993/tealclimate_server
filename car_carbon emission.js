const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    

    try {

        const quantity = req.body.quantity;
        const userid= req.body.userid;
       
        const query1 = 'SELECT * FROM users WHERE login_id = $1';
        const values1 = [userid];
        
        const query2 = 'SELECT * FROM vehicle WHERE login_id = $1';
        const values2 = [userid];

        const query3 = 'SELECT * FROM property WHERE login_id = $1';
        const values3 = [userid];

        // Execute both queries concurrently
        const [result1, result2,result3] = await Promise.all([
            db.query(query1, values1),

            db.query(query2, values2),
            db.query(query3, values3)

        ]);

        const data1 = result1.rows[0];   

     

        const data2 = result2.rows[0];  

        const data3 = result3.rows[0];   

        
        // console.log('Data from table1:', data1);
        // console.log('Data from table2:', data2);

        country=data3.country
        region=data3.state
        username=data1.user_name;
        make=data2.make;
        model=data2.model;
        engine_size=data2.engine_size;
        transmission=data2.transmission;
        fuel_type=data2.fuel_type;
        model_year=data2.model_year;


        scope='Scope 1';
        category='vehicle';
        sub_category=model;
        satge='Fuel';
        uom='kwh'
        ghgunit='kg co2e'
        placeholder='' 
        const query = 'SELECT * FROM car_database WHERE model_year = $1 AND make = $2 AND model = $3  AND engine_size = $4 AND transmission = $5 AND fuel_type = $6';
        const values = [model_year, make,model,engine_size,transmission,fuel_type];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Error fetching electricity_database data');
            } else {

                // // The query was successful, and the result is available in the 'result' object.
                const datas = result.rows[0];
                const kgco2e=datas.co2e_kg_km * quantity

                console.log('hello',kgco2e);
                // sub_category,
                const insertQuery = 'INSERT INTO carbon_emissions (scope,category,mid_category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)';

                const insertValues = [scope,category,sub_category,sub_category,satge,country,region,placeholder,uom,ghgunit,datas.co2e_kg_km,kgco2e,userid,username];

                db.query(insertQuery, insertValues, (insertError, insertResult) => {
                    if (insertError) {
                        console.error('Error executing INSERT query:', insertError);
                        // return res.status(500).send('Error inserting kgco2e data');
                    } else {
                        // The INSERT query was successful.
                        res.status(200).json({ success: true, kgco2e:kgco2e });
                    }
                });

            }
        });



    } catch (error) {
        console.error('Error executing queries:', error);
        return res.status(500).send('Error fetching data from database');
    } finally {
    
    }   

});

module.exports = router;