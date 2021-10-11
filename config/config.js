const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection(
    {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST
    }
)

module.exports = db;