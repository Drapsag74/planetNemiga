var configDb = require("../config").db;
var pgp = require("pg-promise")();

class Dao {

    constructor() {
        this._db = pgp(configDb);
    }

    //
    async getAllPersonnages() {
        var data = null; //will be null if query fails
        try {
            data = await this._db.any("SELECT * FROM users.personnages");
        } catch(e) {
            console.log("ERROR :", e);
        }
        return data;
    }

    async getRandomFromEnigmes() {
        var data = null; //will be null if query fails
    try {
            data = (await this._db.any("SELECT * FROM challenges.enigmes ORDER BY RANDOM() LIMIT 1"))[0];
        } catch(e) {
            console.log("ERROR :", e);
        }
        return data;
    }

    async getReponseEnigme(idEnigme) {
        var data = null; //will be null if query fails
        try {
            data = (await this._db.any("SELECT * FROM challenges.enigmes WHERE idEnigme=$1", idEnigme))[0];
        } catch(e) {
            console.log("ERROR :", e);
        }
    }
    
}

var dao = new Dao();
module.exports = dao;