const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    
    try {
       
        const userid= req.body.userid;
        month='Feb';
        year='2024';
        const query1 = 'SELECT * FROM users WHERE login_id = $1';
        const values1 = [userid];
       
        const query2 = 'SELECT * FROM property WHERE login_id = $1';
        const values2 = [userid];
 
        // Execute both queries concurrently
        const [result1, result2] = await Promise.all([
            db.query(query1, values1),
 
            db.query(query2, values2),
 
        ]);
 
        const data1 = result1.rows[0];  
        username=data1.user_name;
 
        const data2 = result2.rows[0];  
 
        country=data2.country
        region=data2.state
 
        const mapArray = req.body.rentalCarDetails;
 
        let total_kgco2e = 0;
        let successfulInsertions = -1;
        let ghg_conversion_factor=0;
        mapArray.map(element => {
            const query = 'SELECT * FROM rental_car_database WHERE category = $1 AND stage = $2 AND fuel_Type = $3 AND uom = $4';
            const values = [element.classification,element.type,element.fuelType,element.unit];
           
            db.query(query, values, (error, result) => {
                if (error) {
                    console.error('Error executing query:', error);
                } else {
                   
                    result.rows.forEach(data => {
 
                        let kgco2e = data.ghg_conversion_factor * element.distance;
                        if (element.unit == 'miles') {
                            kgco2e *= 0.621371; // Simplified multiplication
                        }
                        console.log(kgco2e)
                       
                        total_kgco2e += kgco2e;
                        ghg_conversion_factor += data.ghg_conversion_factor;
 
                        successfulInsertions++;
 
                        if (successfulInsertions === result.rows.length) {
                            const scope = data.scope;
                            const category = 'Vacation';
                            const sub_category = data.category;
                            const stage = 'Bus'; // Is this correct?
                            const placeholder = data.placeholder;
                            const uom = data.uom;
                            const ghgunit = data.ghgunit;
 
                            const insertQuery = 'INSERT INTO carbon_emissions (scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)';
                            const insertValues = [scope, category, sub_category, stage, country, region, placeholder, uom, ghgunit, ghg_conversion_factor, total_kgco2e, userid, username, month, year];
                            msgs=total_kgco2e+' '+stage
       
                            db.query(insertQuery, insertValues, (insertError, insertResult) => {
                                if (insertError) {
                                    console.error('Error executing INSERT query:', insertError);
                                } else {
                                    // console.log('kgco2e data inserted successfully and emission is: ' + msgs);
                                    res.status(200).json({ success: true, msgs:msgs});
                                }
                            });
                     
                        }
                    });
                }
            });
        });
 
       
     
       
 
 
    } catch (error) {
        console.error('Error executing queries:', error);
        return res.status(500).send('Error fetching data from database');
    } finally {
        
        
    }

    

    
});

module.exports = router;
