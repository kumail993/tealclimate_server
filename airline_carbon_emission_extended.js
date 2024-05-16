const express = require('express');
const router = express.Router();
const db = require('./db.js');


const airlineController = {
    getAirlineCarbon: async (req, res) => {
        try {
            const userid = req.body.userid;
            const sub_category = "Flights";
            const sub_category1 = "Wtt-Flights";

            const selectQuery = 'SELECT * FROM carbon_emissions WHERE login_id = $1 AND (stage = $2 OR sub_category = $3)';
            const selectValues = [userid, sub_category, sub_category1];

            const { rows } = await db.query(selectQuery, selectValues);

            if (rows.length > 0) {
                console.log('Data found:', rows);
                res.status(200).json({ success: true, data: rows });

            } else {
                console.log('No data found for userid', userid);
                res.status(200).json({ success: true, data: [] });

            }

        } catch (error) {
            console.error('Error executing select query:', error);
            return res.status(500).send('Error fetching data from database');
        }
    },

    deleteAirlineCarbon: async (req, res) => {
        try {
            const userid = req.body.userid;
            const emission_id = req.body.emission_id;
            const sub_category = "Flights";
            const sub_category1 = "Wtt-Flights";

            const deleteQuery = 'DELETE FROM carbon_emissions WHERE login_id = $1 AND (emission_id = $2 OR sub_category = $3 OR sub_category = $4)';
            const deleteValues = [userid, emission_id, sub_category, sub_category1];

            await db.query(deleteQuery, deleteValues); // Make sure to await the query execution
            console.log(`Data for userid ${userid} and emission_id ${emission_id} deleted successfully`);

            const msg = `Data for userid ${userid} and emission_id ${emission_id} deleted successfully`;
            res.status(200).json({ success: true, message: msg });

        } catch (error) {
            console.error('Error executing delete query:', error);
            return res.status(500).send('Error deleting data from database');
        }
    }


};


module.exports = airlineController;
