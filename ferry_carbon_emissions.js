const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    
    try {
       
        const userid= req.body.userid;
        hotel_country='UK';
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
 
        const mapArray = req.body.ferryDetails;
     
       
        let distance = 0;
        let Business_travel_sea = 0;
        let WTT_business_travel_sea = 0;
 
        const insertionPromises = mapArray.map(element => {
            if (element.unit == 'miles') {
                distance += element.distance;
            } else {
                distance += element.distance;
            }
       
       
            const query = 'SELECT * FROM ferry_database WHERE passenger_type = $1';
            const values = [element.type];
       
            return new Promise((resolve, reject) => {
                db.query(query, values, (error, result) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        reject(error);
                    } else {
                        datas=result.rows
                        result.rows.forEach(data => {
                            if (data.category == 'Business travel- sea') {
                                console.log('Business travel- sea');
                                let kgco2e = data.ghg_unit_conversion_factor * element.distance;
       
                                if (element.unit == 'miles') {
                                    kgco2e = kgco2e * 0.621371;
                                }
                                Business_travel_sea += kgco2e;
                            }
                            if (data.category == 'WTT- business travel- sea') {
                                console.log('WTT- business travel- sea');
                                let kgco2e = data.ghg_unit_conversion_factor * element.distance;
       
                                if (element.unit == 'miles') {
                                    kgco2e = kgco2e * 0.621371;
                                }
                                WTT_business_travel_sea += kgco2e;
                            }
                        });
                        resolve(); // Resolve the promise when query execution is successful
                    }
                });
            });
        });
       
        // Wait for all promises to settle
        Promise.all(insertionPromises)
            .then(() => {
                console.log('All data processed successfully');
                console.log('Total distance:', distance);
                console.log('Total Business travel- sea:', Business_travel_sea);
                msgs=[]
                console.log('Total WTT- business travel- sea:', WTT_business_travel_sea);
                let successfulInsertions = 0; // Variable to keep track of successful insertions
 
                datas.forEach(element => {
                    console.log(element);
               
                    const scope = element.scope;
                    const category = 'Vacation';
                    const sub_category = element.category;
                    const stage = element.stage;
                    placeholder = element.placeholder;
                    const uom = element.unit;
                    const ghgunit = element.ghgunit;
                    const ghg_conversion_factor = element.ghg_unit_conversion_factor;
               
                    let kgco2e; // Define kgco2e variable
               
                    if (element.category == 'Business travel- sea') {
                        kgco2e = Business_travel_sea;
                    }
                    if (element.category == 'WTT- business travel- sea') {
                        kgco2e = WTT_business_travel_sea;
                    }
               
                    const insertQuery = 'INSERT INTO carbon_emissions (scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)';
                    const insertValues = [scope, category, sub_category, stage, country, region, placeholder, uom, ghgunit, ghg_conversion_factor, kgco2e, userid, username, month, year];
               
                    db.query(insertQuery, insertValues, (insertError, insertResult) => {
                        if (insertError) {
                            console.error('Error executing INSERT query:', insertError);
                        } else {
                            // The INSERT query was successful.
                            successfulInsertions++; // Increment successful insertions counter
                            console.log('kgco2e data inserted successfully and emission is: ' + kgco2e);
                            msgs.push(sub_category+' '+kgco2e)
                            // Check if all insertions are complete
                            if (successfulInsertions === datas.length) {
                                // console.log('All data inserted successfully: '+msgs);
 
                                res.status(200).json({ success: true, msgs:msgs});
 
                            }
                        }
                    });
                });
               
            })
            .catch(error => {
                console.error('Error during processing:', error);
            });
       
 
 
    } catch (error) {
        console.error('Error executing queries:', error);
        return res.status(500).send('Error fetching data from database');
    } finally {
        
    }  


});

module.exports = router;