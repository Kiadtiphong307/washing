const mysql = require('mysql2/promise');

const washingMachine = mysql.createPool({
    host: 'localhost',
    user: 'kiadtiphong192',
    password: 'boss12345',  
    database: 'washing'
});

module.exports = washingMachine; 