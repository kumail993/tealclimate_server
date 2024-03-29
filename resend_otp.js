

    
const express = require('express');
const router = express.Router();
const db = require('./db.js');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {

    try{
    var email = req.body.email;

    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                console.log(otp);

                // Send OTP to the given Email
                const transporter = nodemailer.createTransport({
                    service: "Gmail", // Use your email service here (e.g., "Gmail", "Outlook")
                    auth: {
                        user: "khaider308@gmail.com",
                        pass: "epjudfftrtdmaukc",
                    },
                });
                const mailOptions = {
                    from: "Khaider308@gmail.com",
                    to: email, // Recipient's email
                    subject: "Your Teal-Climate Verification Code",
                    html: `<html>
                    <head>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: white;
                        margin: 0;
                        padding: 0;
                      }
                      .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                      }
                      .header {
                        color: #008080; /* Teal */
                        font-size: 24px;
                        margin-bottom: 10px;
                        text-align: center;
                      }
                      .info {
                        font-size: 18px;
                        margin-bottom: 20px;
                        text-align: center;
                        color: #333; /* Dark Gray */
                      }
                      .otp {
                        font-weight: bold;
                        font-size: 28px;
                        color: #008080; /* Teal */
                        text-align: center;
                        margin: 20px 0;
                      }
                      .footer {
                        font-size: 14px;
                        margin-top: 20px;
                        color: white;
                        background-color: #008080; /* Teal */
                        padding: 10px;
                        text-align: center;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">Verification Email</div>
                      <div class="info">
                        Hello, ${email}!<br>
                        We're delighted to welcome you to our TealClimate community.
                      </div>
                      <div class="otp">${otp}</div>
                      <div class="info">
                        Use the verification code above to complete your registration process. If you haven't initiated this request, kindly disregard this email.
                      </div>
                      <div class="footer">
                        Best regards,<br>
                        The Teal-Climate Team
                      </div>
                    </div>
                  </body>
                    </html>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending OTP:", error);
                        res.status(500).json({ success: false, message: 'Error sending OTP' });
                    }
                    else {
                        console.log("OTP email sent:", info.response);
                    }
                })

                const updateOtpQuery = 'UPDATE user_credentials SET otp = $1 WHERE user_email = $2';
                await db.query(updateOtpQuery, [otp, email]);
            
                res.status(200).json({ success: true, message: 'OTP sent successfully' });
              } catch (error) {
                console.error('Error sending OTP:', error);
                res.status(500).json({ success: false, message: 'Error sending OTP' });
              }

});

module.exports = router;

    