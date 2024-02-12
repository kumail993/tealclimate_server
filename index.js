
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
const CarEngineSizeRouter = require('./fetch_engine_size.js');
const CarTrnasmissionseRouter = require('./fetch_car_transmission.js');
const CarFuelTypeRouter = require('./fetch_fuel_type.js');
const CountryRouter = require('./fetch_countries.js');
const RegionRouter = require('./fetch_regions.js');
const UserCarsRouter = require('./fetch_user_cars.js');
const FetchVacationCountriesRouter = require('./fetch_vacation_countries.js');
const CarCarbonEmissiosRouter = require('./car_carbon emission.js');
const PassengerTypeRouter = require('./fetch_pessenger_type.js');
const HeatAndSteamCarbonEmissionsRouter = require('./heat_steam_carbon_emissions.js');
const WaterCarbonEmissionsRouter = require('./water_carbon_emissions.js');

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
app.use('/tealclimate/carEngine',CarEngineSizeRouter);
app.use('/tealclimate/carTransmissions',CarTrnasmissionseRouter);
app.use('/tealclimate/carFuel',CarFuelTypeRouter);
app.use('/tealclimate/country',CountryRouter);
app.use('/tealclimate/region',RegionRouter);
app.use('/tealclimate/fetchUserCars',UserCarsRouter);
app.use('/tealclimate/fetchVacationCountries',FetchVacationCountriesRouter);
app.use('/tealclimate/carCarbonEmission',CarCarbonEmissiosRouter);
app.use('/tealclimate/passengerType',PassengerTypeRouter);
app.use('/tealclimate/heatAndSteam',HeatAndSteamCarbonEmissionsRouter);
app.use('/tealclimate/water',WaterCarbonEmissionsRouter);










app.listen(5433,()=> console.log('your server is running on port 3000'))

