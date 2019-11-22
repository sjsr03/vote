const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD || 'dsc55031##',
    database: 'voting',
    dateStrings: 'date'
});
conn.connect();

module.exports = conn;