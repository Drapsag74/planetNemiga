var configDb = require("../config").db;
var pgp = require("pg-promise")();

class Dao {

    constructor() {
        this._db = pgp(configDb);
    }

    
    /*
    *----------------------------------------------------------------
    *----------------------------------------------------------------
    *----------------------Personnages-------------------------------
    *----------------------------------------------------------------
    *----------------------------------------------------------------
    */


    async getAllPersonnages() {
        var data = null; //will be null if query fails
        try {
            data = await this._db.any("SELECT * FROM users.personnages");
        } catch(e) {
            console.log("ERROR :", e);
        }
        return data;
    }


    /*
    *----------------------------------------------------------------
    *----------------------------------------------------------------
    *--------------------------Enigme--------------------------------
    *----------------------------------------------------------------
    *----------------------------------------------------------------
    */



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


    /*
    *----------------------------------------------------------------
    *----------------------------------------------------------------
    *----------------------Utilisateur-------------------------------
    *----------------------------------------------------------------
    *----------------------------------------------------------------
    */

    async getJoueurById(id) {
        try {
            var data = await this._db.one("SELECT id, pseudo, mail FROM users.joueurs WHERE id=$1", parseInt(id, 10));
        } catch(e) {
            console.log("ERROR : ", e);
        }
        return data;        
    }

    async getJoueur(pseudo) {
        try {
            var data = await this._db.any("SELECT id, pseudo, mail FROM users.joueurs WHERE pseudo=$1", [pseudo]);
        } catch(e) {
            console.log("ERROR : ", e);
        }
        if (data.length > 0) return data[0];
        else return undefined;
    }
    async getMotDePasse(pseudo) {
        try {
            var data = await this._db.one("SELECT motDePasse FROM users.joueurs WHERE pseudo=$1", pseudo);
        } catch(e) {
            console.log("ERROR : ", e);
        }
        return data;
    }
    


    async nouveauJoueur(pseudo, mail, hash) {
        try {
            this._db.none('INSERT INTO users.joueurs(pseudo,mail, motDePasse) VALUES($1, $2, $3)', [pseudo, mail, hash]);
        } catch(e){
            console.log(e);
            //throw(e);
        }
    }
}

var dao = new Dao();
module.exports = dao;