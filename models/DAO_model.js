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
            data = await this._db.any("SELECT * FROM monde.personnages");
        } catch(e) {
            console.log("ERROR :", e);
        }
        return data;
    }

    async getRandomFromEnigmes(matiere) {
        var data = null; //will be null if query fails
        /*
        

SELECT column FROM table
ORDER BY RANDOM()
LIMIT 1
*/
        try {
            data = (await this._db.any("SELECT * FROM monde.enigmes WHERE matiere=$1 ORDER BY RANDOM() LIMIT 1", [matiere]))[0];
        } catch(e) {
            console.log("ERROR :", e);
        }
        return data;
    }
    
}

var dao = new Dao();
module.exports = dao;