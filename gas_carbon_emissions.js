
const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    
    try {
        const quantity = '500';
        const userid= req.body.userid;
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
       
        uom= req.body.uom;
        category='household'
        mid_category = 'gas'
        month=req.body.month;
        year=req.body.year;
    
        const query = 'SELECT * FROM gas_database WHERE uom = $1 ';
        const values = [uom];
    
    
       
        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Error fetching electricity_database data');
            } else {
                const datas = result.rows;
                stages = [];
                datas.forEach(element => {
                    const kgco2e = element.ghg_conversion_factor * quantity;
                    const insertQuery = 'INSERT INTO carbon_emissions (scope,category,mid_category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)';
    
                    const insertValues = [element.scope,category,mid_category,element.category,element.stage,country,region,element.placeholder,element.uom,element.ghgunit,element.ghg_conversion_factor,kgco2e,userid,username,month,year];
                    db.query(insertQuery, insertValues, (insertError, insertResult) => {
                        if (insertError) {
                            console.error('Error executing INSERT query:', insertError);
                            return res.status(500).send('Error inserting kgco2e data');
                        } else {
                            // The INSERT query was successful.
                            stages.push(element.category+': '+kgco2e);
                            // Check if all queries have been executed
                            if (stages.length === datas.length) {
                                console.log(stages);
                                 res.status(200).json({ success: true, stages:stages});
    
                            }
                        }
                    });
                });
               
                // // The query was successful, and the result is available in the 'result' object.
    
           
    
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







