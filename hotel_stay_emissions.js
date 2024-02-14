const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    
    try {
 
        const number_of_nights = req.body.nights;
        const userid= req.body.userid;
        const hotel_country=req.body.country;
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
 
     
   
 
       
        placeholder=''
        const query = 'SELECT * FROM hotel_stay WHERE country = $1';
        const values = [hotel_country];
 
        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
            } else {
 
                // // The query was successful, and the result is available in the 'result' object.
                const datas = result.rows[0];
                console.log(datas)
                scope=datas.scope;
                category='Vacation';
                sub_category=datas.category;
                stage=datas.stage;
                placeholder=datas.placeholder;
                uom=datas.uom;
                ghgunit=datas.ghgunit;
                ghg_conversion_factor=datas.ghg_conversion_factor;
 
 
                const kgco2e=datas.ghg_conversion_factor * number_of_nights
                console.log('hello',datas);
 
                console.log('hello',kgco2e);
                // sub_category,
                const insertQuery = 'INSERT INTO carbon_emissions (scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)';
 
                const insertValues = [scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,userid,username,month,year];
 
                db.query(insertQuery, insertValues, (insertError, insertResult) => {
                    if (insertError) {
                        console.error('Error executing INSERT query:', insertError);
                        // return res.status(500).send('Error inserting kgco2e data');
                    } else {
                        // The INSERT query was successful.
                        res.status(200).json({ success: true, kgco2e:kgco2e,uom:uom});
 
                        console.log('kgco2e data inserted successfully and emission is: '+kgco2e);
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