const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    
    try {

        const quantity = req.body.quantity;
        const userid=req.body.userid;
        const month=req.body.month;
        const year= req.body.year;
       
        
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
        stage1='Onsite heat and steam';
        stage2='District heat and steam';
        const query = 'SELECT * FROM heat_and_steam WHERE stage IN ($1, $2)';
        const values = [stage1, stage2];
        
        

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).send('Error fetching heat_and_steam data');
            } else {

                // // The query was successful, and the result is available in the 'result' object.
                const datas = result.rows;

                category='household';
           


                stages = [];
                
                datas.forEach(element => {
                    const kgco2e = element.ghg_conversion_factor * quantity;
                    const insertQuery = 'INSERT INTO carbon_emissions (scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)';
                    const insertValues = [element.scope,category,element.category,element.stage,country,region,element.placeholder,element.uom,element.ghgunit,element.ghg_conversion_factor,kgco2e,userid,username,month,year];
                    db.query(insertQuery, insertValues, (insertError, insertResult) => {
                        if (insertError) {
                            console.error('Error executing INSERT query:', insertError);
                            return res.status(500).send('Error inserting kgco2e data');
                        } else {
                            // The INSERT query was successful.
                            stages.push(element.stage+': '+kgco2e);
                            // Check if all queries have been executed
                            if (stages.length === datas.length) {
                                console.log('sucessfully',stages);
                                 res.status(200).json({ success: true, stages:stages});

                            }
                        }
                    });
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