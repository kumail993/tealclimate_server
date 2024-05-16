const express = require('express');
const router = express.Router();
const db = require('./db.js');


const waterController = {
    getAllWaterCarbon: async (req, res) => {
        try {
            const userid = req.body.userid;
            mid_category = "water";
            console.log(userid);

            const selectQuery = 'SELECT * FROM carbon_emissions WHERE login_id = $1 AND mid_category= $2';

            const selectValues = [userid, mid_category];

            const { rows } = await db.query(selectQuery, selectValues);

            console.log(rows);

            if (rows.length > 0) {
                console.log('Data found:', rows);
                res.status(200).send(rows);

            } else {
                res.status(200).send([]);
                console.log('No data found for userid', userid);
            }
        } catch (error) {
            console.error('Error executing select query:', error);
            return res.status(500).send('Error fetching data from database');
        }
    },

    deleteWaterCarbon: async (req, res) => {
        try {
            const userid = req.body.userid;
            let emission_id = req.body.emission_id;
            mid_category = "water";
            const deleteQuery = 'DELETE FROM carbon_emissions WHERE login_id = $1 AND emission_id = $2 AND mid_category =$3';
            const deleteValues = [userid, emission_id, mid_category];
            db.query(deleteQuery, deleteValues);
            console.log(`Data for userid ${userid} and emission_id ${emission_id} deleted successfully`);
            msg = `Data for userid ${userid} and emission_id ${emission_id} deleted successfully`
            res.status(200).json({ success: true, message: msg });

        } catch (error) {
            console.error('Error executing delete query:', error);
            return res.status(500).send('Error deleting data from database');
        }
    }

};


module.exports = waterController;
