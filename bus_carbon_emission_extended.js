const express = require('express');
const router = express.Router();
const db = require('./db.js');


const busController = {
    getBusCarbon: async (req, res) => {
        try {
            const userid = req.body.userid;
            const sub_category = 'Business travel- land';
            const selectQuery = 'SELECT * FROM carbon_emissions WHERE login_id = $1 AND sub_category= $2';
            const selectValues = [userid, sub_category];

            const { rows } = await db.query(selectQuery, selectValues);

            if (rows.length > 0) {
                // Data found, you can process it here
                console.log('Data found:', rows);
                res.status(200).json({ success: true, data: rows });

            } else {
                // No data found for the provided userid and emission_id
                console.log('No data found for userid', userid);
            }

        } catch (error) {
            console.error('Error executing select query:', error);
            return res.status(500).send('Error fetching data from database');
        }
    },

    deleteBusCarbon: async (req, res) => {
        try {
            const userid = req.body.userid;
            const emission_id = req.body.emission_id;
            const sub_category = 'Business travel- land';
            const deleteQuery = 'DELETE FROM carbon_emissions WHERE login_id = $1 AND emission_id = $2 AND sub_category =$3';
            const deleteValues = [userid, emission_id, sub_category];
            await db.query(deleteQuery, deleteValues);
            console.log(`Data for userid ${userid} and emission_id ${emission_id} deleted successfully`);

            msg = `Data for userid ${userid} and emission_id ${emission_id} deleted successfully`
            res.status(200).json({ success: true, message: msg });

        } catch (error) {
            console.error('Error executing delete query:', error);
            return res.status(500).send('Error deleting data from database');
        }
    }


};


module.exports = busController;
