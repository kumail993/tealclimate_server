const express = require('express');
const router = express.Router();
const db = require('./db.js');

router.post('/', async (req, res) => {
    try {
        const user_email = req.body.user_email;
        const otp = req.body.otp;
        console.log(otp);

        const { rows } = await db.query('SELECT * FROM user_credentials WHERE user_email = $1', [user_email]);

        if (rows.length > 0) {
            const row = rows[0];

            // Compare OTP directly
            console.log(row.otp);
            if (row.otp == otp) {
                console.log('hello');
                await db.query('UPDATE user_credentials SET active_status = 1 WHERE user_email = $1', [user_email]);
                res.json({ message: 'OTP verified and status updated.' });
            } else {
                res.status(400).json({ message: 'OTP does not match.' });
            }
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (err) {
        console.error('Database error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const db = require('./db.js');


// router.post('/', async (req, res) => {
//     // Your OTP verification logic here
//     var user_email = req.body.user_email;
//     var otp = req.body.otp;
//     console.log(user_email);
  
//     db.query('SELECT * FROM user_credentials WHERE user_email = $1', [user_email], (err, rows) => {
//         console.log(rows[0])
//       if (err) {
//         console.error('Database query error:', err.message);
//         res.status(500).json({ message: 'Internal server error' });
//       } else if (rows.length > 0) {
//         console.log(rows[0]);
//         const row = rows[0]; // Get the first row from the array
//         if (row.otp === otp) {
//           db.query('UPDATE user_credentials SET active_status = 1 WHERE user_email = $1', [user_email], (err) => {
//             if (err) {
//               console.error('Database update error:', err.message);
//               res.status(500).json({ message: 'Internal server error' });
//             } else {
//               res.json({ message: 'OTP verified and status updated.' });
//             }
//           });
//         } else {
//           res.status(400).json({ message: 'OTP does not match.' });
//         }
//       } else {
//         res.status(404).json({ message: 'User not found.' });
//       }
//     });
//   });

// module.exports = router;

















// // const express=require('express');
// // const router=express.Router();
// // var db=require('./db.js');
// // const app = express();
// // require('dotenv').config();



// // router.route('/otpverification').post((req, res, next) => {
// //     console.log(req.body);
// //     var email = req.body.email;
// //     var otp = req.body.otp;

// //     db.query('SELECT * FROM user_credentials WHERE email = ?', [email], (err, rows) => {
// //         if (err) {
// //             console.error('Database query error:', err.message);
// //             res.status(500).json({ message: 'Internal server error' });
// //         } else if (rows.length > 0) {
// //             const row = rows[0]; // Get the first row from the array
// //             if (row.otp === otp) {
// //                 db.query('UPDATE user_credentials SET active_status = 1 WHERE email = ?', [email], (err) => {
// //                     if (err) {
// //                         console.error('Database update error:', err.message);
// //                         res.status(500).json({ message: 'Internal server error' });
// //                     } else {
// //                         res.json({ message: 'OTP verified and status updated.' });
// //                     }
// //                 });
// //             } else {
// //                 res.status(400).json({ message: 'OTP does not match.' });
// //             }
// //         } else {
// //             res.status(404).json({ message: 'User not found.' });
// //         }
// //     });
// // });

// // module.exports = router;