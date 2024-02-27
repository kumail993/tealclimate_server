const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;

        // Fetching categories with their respective summed values of kgco2e for a specific userid
        const categoryQuery = `
            SELECT scope, SUM(kgco2e) AS total_kgco2e
            FROM carbon_emissions
            WHERE login_id = $1
            GROUP BY scope;
        `;
        const categoryResult = await db.query(categoryQuery, [userid]);
        const categories = categoryResult.rows.map(category => ({
            ...category,
            total_kgco2e: roundToInteger(category.total_kgco2e) // Convert to integer
        }));

        // Fetching total sum of kgco2e for a specific userid
        const totalQuery = `
            SELECT SUM(kgco2e) AS total_kgco2e
            FROM carbon_emissions
            WHERE login_id = $1;
        `;
        const totalResult = await db.query(totalQuery, [userid]);
        const totalKgco2e = roundToInteger(totalResult.rows[0].total_kgco2e); // Convert to integer

        // Calculate percentage for each category and convert to integers
        const categoriesWithPercentage = categories.map(category => ({
            ...category,
            percentage: roundToInteger((category.total_kgco2e / totalKgco2e) * 100)
        }));

        res.json({ categories: categoriesWithPercentage, totalKgco2e });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function roundToInteger(number) {
    return Math.round(number);
}

module.exports = router;
