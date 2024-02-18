const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    // Your registration logic here

    try {
        const userid=req.body.userid;
     
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

    
        scope='Scope 3'
        ghgunit='kgco2e'
        factor= req.body.factor;
        kgco2e=0.20806;
        category='Vacation'
        placeholder=''
        sub_category='Taxi'
        subCategory='Taxi'
        uom='km'
        stage='Business travel- land'
 
        month='null';
        year='null';
 
 
        const insertQuery = 'INSERT INTO carbon_emissions (scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)';
        const insertValues = [scope, category, sub_category, stage, country, region, placeholder, uom, ghgunit, kgco2e,factor, userid, username, month, year];
         
       
        db.query(insertQuery, insertValues, (insertError, insertResult) => {
            if (insertError) {
                console.error('Error executing INSERT query:', insertError);
                return res.status(500).send('Error inserting kgco2e data');
            } else {
                // The INSERT query was successful.
                stage=(stage+': '+kgco2e);
                console.log(stage)
                res.status(200).json({ success: true, factor:factor});
 
             
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