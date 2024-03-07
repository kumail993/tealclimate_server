const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:userid/:year', async (req, res) => {


    var year = req.params.year;
    var userId = req.params.userid;

    if (year.startsWith(':')) {
        year = year.substring(1); // Remove the first character (the colon)
      }
      if (userId.startsWith(':')) {
        userId = userId.substring(1); // Remove the first character (the colon)
      }
      try {
        // Fetch carbon emissions data for all 12 months of the given year and user id
        const query = `
          SELECT 
            CASE m
              WHEN 1 THEN 'January'
              WHEN 2 THEN 'February'
              WHEN 3 THEN 'March'
              WHEN 4 THEN 'April'
              WHEN 5 THEN 'May'
              WHEN 6 THEN 'June'
              WHEN 7 THEN 'July'
              WHEN 8 THEN 'August'
              WHEN 9 THEN 'September'
              WHEN 10 THEN 'October'
              WHEN 11 THEN 'November'
              WHEN 12 THEN 'December'
            END AS month_name,
            COALESCE(SUM(kgco2e), 0) AS total
          FROM generate_series(1, 12) AS m
          LEFT JOIN (
            SELECT 
              CASE 
                WHEN month = 'January' THEN 1
                WHEN month = 'February' THEN 2
                WHEN month = 'March' THEN 3
                WHEN month = 'April' THEN 4
                WHEN month = 'May' THEN 5
                WHEN month = 'June' THEN 6
                WHEN month = 'July' THEN 7
                WHEN month = 'August' THEN 8
                WHEN month = 'September' THEN 9
                WHEN month = 'October' THEN 10
                WHEN month = 'November' THEN 11
                WHEN month = 'December' THEN 12
                ELSE NULL
              END AS month_number,
              kgco2e
            FROM carbon_emissions
            WHERE "year" = $1 AND "login_id" = $2
          ) AS ce ON m = ce.month_number
          GROUP BY m
          ORDER BY m;
        `;
        const { rows } = await db.query(query, [year, userId]);
    
        // Calculate total of all months
        const totalOfAllMonths = parseInt(rows.reduce((acc, curr) => acc + curr.total, 0));
    
        // Convert each month total to integer
        const months = rows.map(row => ({ month_name: row.month_name, total: parseInt(row.total) }));
    
        res.json({ months, total: totalOfAllMonths });
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'Internal server error' });
    }
    
    
    
    
    
    });
  



module.exports = router;
