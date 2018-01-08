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
        } catch (e) {
            console.log("ERROR :", e);
        }
        return data;
    }

    async getPersonnage(categorie) {
        try {
            var data = (await this._db.any("SELECT * FROM users.personnages WHERE categorie=$1", [categorie]))[0];
        } catch (e) {
            console.log("ERROR : ", e);
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
        } catch (e) {
            console.log(e);
        }
        return data;
    }

    async getRandomFromEnigmes() {
        try {
            var data = await this._db.one("SELECT * FROM challenges.enigmes ORDER BY RANDOM() LIMIT 1");
        } catch (e) {
            console.log("ERROR :", e);
        }
        return data;
    }

    async getReponseEnigme(idEnigme) {
        try {
            var data = await this._db.one("SELECT * FROM challenges.reponses WHERE idEnigme=$1", idEnigme);
        } catch (e) {
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
            var data = await this._db.one("SELECT id, pseudo, mail, personnage FROM users.joueurs WHERE id=$1", parseInt(id, 10));
        } catch (e) {
            console.log("ERROR : ", e);
        }
        return data;
    }

    async getJoueur(mail) {
        try {
            var data = await this._db.any("SELECT id, pseudo, mail FROM users.joueurs WHERE mail=$1", [mail]);
        } catch (e) {
            console.log("ERROR : ", e);
        }
        if (data) return data[0];
        else return data;
    }
    async getMotDePasse(pseudo) {
        try {
            var data = await this._db.one("SELECT motDePasse FROM users.joueurs WHERE pseudo=$1", pseudo);
        } catch (e) {
            console.log("ERROR : ", e);
        }
        return data;
    }

    async nouveauJoueur(pseudo, mail, hash) {
        try {
           await this._db.none({
               name: 'insert-nouveau-joueur',
               text: 'INSERT INTO users.joueurs(pseudo,mail, motDePasse) VALUES($1, $2, $3)',
               values: [pseudo, mail, hash]
            });
           var joueur = await this._db.one({
            name: 'recup-joueur',
            text: 'SELECT id, pseudo, mail FROM users.joueurs WHERE mail = $1',
            values: [mail]
        })
        } catch (e) {
            console.log(e);
            //throw(e);
        }
        return joueur;
    }

    async getMdp(mail) {
        try {
            var mdp = await this._db.one({
                name: 'verif-mdp',
                text: 'SELECT motDePasse FROM users.joueurs WHERE mail = $1',
                values: [mail]
            })
        } catch (e) {
            console.log(e);
        }
        return mdp.motdepasse;
    }

    async ajouterPersoJoueur(perso,id) {
        var reussis = true;
        try {
            await this._db.none({
                name: 'insert-perso-joueur',
                text: 'UPDATE users.joueurs SET personnage=$1 WHERE id=$2',
                values: [perso,id]
             });
        } catch (e) {
            console.log(e);
            reussis = false;
        }
        return reussis;
    }
}

var dao = new Dao();
module.exports = dao;