const mysql = require('mysql2');

const db = mysql.createPool({

    host:'localhost',
    user:'root',
    database:'csc314db',
    password:'2141582'
});

 module.exports= db.promise();
