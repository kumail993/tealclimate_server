const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const dbHost = process.env.PG_HOST;
const dbUser = process.env.PG_USER;
const dbPass = process.env.PG_PASSWORD;
const dbDatabase = process.env.PG_DATABASE;



console.log(dbHost);

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbDatabase,
  password: dbPass,
  port: 5432, // PostgreSQL default port
  ssl: {
    rejectUnauthorized: false, // Set to true to reject unauthorized connections
},
});

// // Listen for the 'connect' event
// pool.on('connect', () => {
//     console.log('Connected to PostgreSQL database');
//   });
  
//   // Listen for the 'error' event
//   pool.on('error', (err) => {
//     console.error('Error connecting to PostgreSQL database:', err);
//   });
  
//   // Attempt to connect and log the result
//   pool.connect()
pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL database:', err));
  

module.exports = pool;

// const isProduction = process.env.NODE_ENV === "production";
// const connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${process.env.DB_PORT}/${dbDatabase}`;

// const pool = new Pool({
//   connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
//   ssl: isProduction
// });

// module.exports = { pool };