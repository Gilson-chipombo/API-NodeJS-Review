const {Pool, Query} = require('pg')
const dotenv = require('../.env');
const { text } = require('express');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    //opcionalmente configurar ssql quando em produto
    //ssl: {rejectedUnauthorized: false}
});

pool.on('error', (err) => {
    console.log('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
};