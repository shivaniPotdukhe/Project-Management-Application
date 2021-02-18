const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "ProjectManagement",
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err){
        console.log('Connected Successfully!');
    }
    else{
        console.log('Connection Failed!');
    }
});

module.exports = mysqlConnection;