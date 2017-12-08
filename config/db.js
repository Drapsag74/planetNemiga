var dbAdmin =require("./dbAdmin.json");

db = {
    host: 'localhost',
    port: 5432,
    database: 'planetNemiga',
    user: dbAdmin.username,
    password: dbAdmin.password
}



module.exports = db;
