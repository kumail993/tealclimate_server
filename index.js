
const express=require('express');
const app=express();
var bodyParser=require('body-parser');
var db=require('./db.js')

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const RegisterRouter=require('./Register.js');
const LoginRouter = require('./login');
const OTPVerificationRouter = require('./OTP_verification.js');
const CompletePRofileRouter = require('./complete_profile.js')


app.use('/tealclimate/register',RegisterRouter);
app.use('/tealclimate/otp',OTPVerificationRouter);
app.use('/tealclimate/login',LoginRouter);
app.use('/tealclimate/completeprofile',CompletePRofileRouter);



app.listen(5433,()=> console.log('your server is running on port 3000'))

