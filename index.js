
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
const RailTypeRouter = require('./fetch_rail_type.js');
const HeatAndSteamCarbonEmissionsRouter = require('./heat_steam_carbon_emissions.js');
const WaterCarbonEmissionsRouter = require('./water_carbon_emissions.js');
const HotelStayEmissionsRouter = require('./hotel_stay_emissions.js');
const FerryEmissionsRouter = require('./ferry_carbon_emissions.js');
const MealCategoriesRouter = require('./fetch_meal_categories.js');
const RailEmissionRouter = require('./rail_carbon_emission.js');
const MeallEmissionRouter = require('./meal_carbon_emission.js');
const BusEmissionRouter = require('./bus_carbon_emissions.js');
const BusTypesRouter = require('./fetch_bus_types.js');
const RentalCarsTypesRouter = require('./car_rental_categories.js');
const RentalCarStagesRouter = require('./car_rental_types.js');
const RentalCarFuelRouter = require('./rental_car_fuel.js');
const RentalCarEmissionRouter = require('./rental_car_carbon_emissions.js');
const TaxiEmissionRouter = require('./taxi_carbon_emission.js');




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
app.use('/tealclimate/railType',RailTypeRouter);
app.use('/tealclimate/heatAndSteam',HeatAndSteamCarbonEmissionsRouter);
app.use('/tealclimate/water',WaterCarbonEmissionsRouter);
app.use('/tealclimate/hotelStay',HotelStayEmissionsRouter);
app.use('/tealclimate/ferry',FerryEmissionsRouter);
app.use('/tealclimate/mealCategories',MealCategoriesRouter);
app.use('/tealclimate/rail',RailEmissionRouter);
app.use('/tealclimate/meal',MeallEmissionRouter);
app.use('/tealclimate/bus',BusEmissionRouter);
app.use('/tealclimate/busTypes',BusTypesRouter);
app.use('/tealclimate/carClassification',RentalCarsTypesRouter);
app.use('/tealclimate/carTypes',RentalCarStagesRouter);
app.use('/tealclimate/carFuel',RentalCarFuelRouter);
app.use('/tealclimate/rentalCar',RentalCarEmissionRouter);
app.use('/tealclimate/taxi',TaxiEmissionRouter);













app.listen(5433,()=> console.log('your server is running on port 3000'))

