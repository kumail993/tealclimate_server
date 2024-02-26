const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.get('/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;

        // Fetching categories with their respective summed values of kgco2e for a specific userid
        const categoryQuery = `
            SELECT category, SUM(kgco2e) AS total_kgco2e
            FROM carbon_emissions
            WHERE login_id = $1
            GROUP BY category;
        `;
        const categoryResult = await db.query(categoryQuery, [userid]);
        const categories = categoryResult.rows;

        // Fetching total sum of kgco2e for a specific userid
        const totalQuery = `
            SELECT SUM(kgco2e) AS total_kgco2e
            FROM carbon_emissions
            WHERE login_id = $1;
        `;
        const totalResult = await db.query(totalQuery, [userid]);
        const totalKgco2e = totalResult.rows[0].total_kgco2e;

        // Calculate percentage for each category
        const categoriesWithPercentage = categories.map(category => ({
            ...category,
            percentage: (category.total_kgco2e / totalKgco2e) * 100
        }));

        res.json({ categories: categoriesWithPercentage, totalKgco2e });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
