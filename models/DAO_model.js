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

    async getEnigme(id) {
        try {
            var data = await this._db.one("SELECT * FROM challenges.enigmes WHERE id=$1", id);
        } catch(e) {
            console.log(e);
        }
        return data;
    }

    async getRandomFromEnigmes() {
    try {
            var data = await this._db.one("SELECT * FROM challenges.enigmes ORDER BY RANDOM() LIMIT 1");
        } catch(e) {
            console.log("ERROR :", e);
        }
        return data;
    }

    async getReponseEnigme(idEnigme) {
        try {
            var data = await this._db.one("SELECT * FROM challenges.reponses WHERE idEnigme=$1", idEnigme);
        } catch(e) {
            console.log("ERROR :", e);
        }
        return data;
    }
    
}

var dao = new Dao();
module.exports = dao;