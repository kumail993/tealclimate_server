const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
  
    
    try {
       
        const userid=req.body.userid;
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
 
        const mapArray = req.body.airlineDetails;
 
 
       
        let total_kgco2e = 0;
 
        const insertionPromises = mapArray.map (async (element) => {
 
            const airports_query1 = 'SELECT * FROM airports WHERE airport_name = $1';
            const airports_values1 = [element.from];
           
            const airports_query2 = 'SELECT * FROM airports WHERE airport_name = $1';
            const airports_values2 = [element.to];
     
            // Execute both queries concurrently
            const [airports_result1, airports_result2] = await Promise.all([
                db.query(airports_query1, airports_values1),
     
                db.query(airports_query2, airports_values2),
     
            ]);
            const airports_data1 = airports_result1.rows[0];  
     
            const airports_data2 = airports_result2.rows[0];  
   
 
            const earthRadius = 6371;
 
           
           
            const distance = earthRadius * Math.acos(
                Math.sin(airports_data1.latitude) * Math.sin(airports_data2.latitude) +
                Math.cos(airports_data1.latitude) * Math.cos(airports_data2.latitude) * Math.cos(airports_data2.longitude - airports_data1.longitude)
            );
            miles=distance*0.621371;
            if(miles<300){
                level4value='Air Travel - Short Haul (< 300 miles) ';
            }
            if(miles<=300 <2300){
                level4value='Air Travel - Medium Haul (>= 300 miles, < 2300 miles) ';
            }
            if(miles>=2300){
                level4value="Air Travel - Long Haul (>= 2300 miles) ";
            }
            Business_travel_air_ghg_conversion_factor=0;
            WTT_Business_travel_air_ghg_conversion_factor=0;
 
            Business_travel_air=0
            WTT_Business_travel_air=0
            const query = 'SELECT * FROM air_travel_database WHERE travel_haul = $1 AND class = $2';
            const values = [level4value,element.class];
            return new Promise((resolve, reject) => {
               
 
                db.query(query, values, (error, result) => {
                    if (error) {
                        console.error('Error executing query:', error);
                        reject(error);
                    } else {
                       
                        let successfulInsertions = 0;
                        datas=result.rows;
                        result.rows.forEach(data => {
 
                            kgco2e=data.ghg_conversion_factor*distance
                            console.log(kgco2e)
 
                            if(data.category==='Business travel- air'){
                                Business_travel_air += kgco2e
                                Business_travel_air_ghg_conversion_factor += data.ghg_conversion_factor;
                            }
                            if(data.category==='WTT- business travel- air'){
                                WTT_Business_travel_air+=kgco2e
                                WTT_Business_travel_air_ghg_conversion_factor += data.ghg_conversion_factor;
 
                            }
                            total_kgco2e += kgco2e;
 
                            successfulInsertions++;
 
                            if (successfulInsertions === result.rows.length) {
                           
                                resolve();
 
                       
                            }
                        });
                    }
                });
            });
 
        });
 
 
        // Wait for all promises to settle
        Promise.all(insertionPromises)
            .then(() => {
                console.log('All data processed successfully');
                console.log('Total distance:', total_kgco2e);
                console.log('Total Business travel- Air:', Business_travel_air);
                msgs=[]
                console.log('Total WTT- business travel- Air:', WTT_Business_travel_air);
                let successfulInsertions = 0; // Variable to keep track of successful insertions
 
                datas.forEach(element => {
               
                    const scope = element.scope;
                    const category = 'Vacation';
                    const sub_category = element.category;
                    const stage = element.stage;
                    placeholder = element.placeholder;
                    const uom = element.uom;
                    const ghgunit = element.ghgunit;
                    // const ghg_conversion_factor = element.ghg_unit_conversion_factor;
               
                    let kgco2e; // Define kgco2e variable
                    console.log(sub_category,stage)
                    if(element.category==='Business travel- air'){
                        kgco2e = Business_travel_air;
                        ghg_conversion_factor=Business_travel_air_ghg_conversion_factor
                    }
                    if (element.category == 'WTT- business travel- air') {
                        kgco2e = WTT_Business_travel_air;
                        ghg_conversion_factor=WTT_Business_travel_air_ghg_conversion_factor
                    }
               
                    const insertQuery = 'INSERT INTO carbon_emissions (scope,category,sub_category,stage,country,region,placeholder,uom,ghgunit,ghg_conversion_factor,kgco2e,login_id,user_name,month,year) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)';
                    const insertValues = [scope, category, sub_category, stage, country, region, placeholder, uom, ghgunit, ghg_conversion_factor, kgco2e, userid, username, month, year];
               
                    db.query(insertQuery, insertValues, (insertError, insertResult) => {
                        if (insertError) {
                            console.error('Error executing INSERT query:', insertError);
                        } else {
                            // The INSERT query was successful.
                            successfulInsertions++; // Increment successful insertions counter
                            // console.log('kgco2e data inserted successfully and emission is: ' + kgco2e);
                            msgs.push(kgco2e+' '+sub_category)
                            // Check if all insertions are complete
                            if (successfulInsertions === datas.length) {
                                console.log('All data inserted successfully: '+msgs);
 
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
        // return res.status(500).send('Error fetching data from database');
    } finally {
      

    }
    
});

module.exports = router;
