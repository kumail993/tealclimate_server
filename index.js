
const express=require('express');
const app=express();
var bodyParser=require('body-parser');
var db=require('./db.js')

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const RegisterRouter=require('./Register.js');
const LoginRouter = require('./login');
const OTPVerificationRouter = require('./OTP_verification.js');
const CompletePRofileRouter = require('./complete_profile.js');
const FetchPropertyRouter = require('./fetch_property.js');
const FetchUserRouter = require('./fetchuser.js');
const ElectricityEmissionRouter = require('./electricity_carbon_emmission_calculator.js');
const CarModelRouter = require('./fetch_car_model_years.js');
const CarMakeRouter = require('./fetch_car_make.js');
const CarModelNameRouter = require('./fetch_car_model.js');

app.use('/tealclimate/register',RegisterRouter);
app.use('/tealclimate/otp',OTPVerificationRouter);
app.use('/tealclimate/login',LoginRouter);
app.use('/tealclimate/completeprofile',CompletePRofileRouter);
app.use('/tealclimate/property',FetchPropertyRouter);
app.use('/tealclimate/user',FetchUserRouter);
app.use('/tealclimate/electricity',ElectricityEmissionRouter);
app.use('/tealclimate/carModels',CarModelRouter);
app.use('/tealclimate/carMake',CarMakeRouter);
app.use('/tealclimate/carModel',CarModelNameRouter);






app.listen(5433,()=> console.log('your server is running on port 3000'))

