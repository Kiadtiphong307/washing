const mysql = require('mysql2/promise');

const washingMachine = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'boss0631298537',  
    database: 'washing'
});

module.exports = washingMachine; 