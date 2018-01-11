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


    async getEnigmeById(id) {
        try {
            var data = await this._db.one({
                name: 'get-enigme-by-id',
                text: 'SELECT * FROM challenges.enigmes WHERE id=$1',
                values: [id]
            })
        } catch (e) {
            console.log(e);
        }
        return data;
    } 

    async getEnigme(chapitre, difficultee) {
        try {
            var data = await this._db.one({
                name: 'get-enigme',
                text: 'SELECT * FROM challenges.enigmes WHERE chapitre=$1 AND niveauDiff=$2 ORDER BY RANDOM() LIMIT 1',
                values: [chapitre, difficultee]
            })
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
            var data = await this._db.any({
                name: 'get-reponse',
                text: 'SELECT * FROM challenges.reponses WHERE idEnigme=$1',
                values: [idEnigme]
            });
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
    async getJoueurByPseudo(pseudo) {

        try {
            var data = await this._db.one("SELECT id, pseudo, mail, personnage FROM users.joueurs WHERE pseudo=$1", pseudo);
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
            var data = await this._db.one("SELECT motDePasse FROM users.joueurs WHERE pseudo=$1", [pseudo]);
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

    async ajouterEcoleJoueur(nomEcole, codePostal, id) {
        try {
            await this._db.none({
                name: 'insert-ecole-joueur',
                text: 'UPDATE users.joueurs SET nomEcole=$1, codePostal=$2 WHERE id=$3',
                values: [nomEcole, codePostal, id]
             });
        } catch (e) {
            console.log(e);
        }
    }

    async ajouterClasseJoueur(nomClasse, id) {
        try {
            await this._db.none({
                name: 'insert-classe-joueur',
                text: 'UPDATE users.joueurs SET classe=$1 WHERE id=$2',
                values: [nomClasse, id]
             });
        } catch (e) {
            console.log(e);
        }
    }

    /*
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     *----------------------Progression-------------------------------
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     */

    async getProgressionsJoueur(joueur) {
        try {
            var data = await this._db.any({
                name: 'get-progression',
                text: 'SELECT * FROM user.progressions WHERE joueur = $1',
                values: [joueur]
            })
        } catch (e) {
            console.log(e);
        }
        return data;
    }

    async getProgressionJoueurChapitre(joueur, chapitre) {
        try {
            var data = await this._db.any({
                name: 'get-progression-joueur-chapitre',
                text: 'SELECT * FROM users.progressions WHERE joueur=$1 AND chapitre=$2',
                values: [joueur, chapitre]
            })
        } catch (e) {
            console.log(e);
        }
        return data;
    }


    async ajouterXpJoueur(joueur, xp, chapitre) {
        try {
            await this._db.none({
                name: 'ajouter-experience',
                text: 'UPDATE users.progressions SET xp = xp + $1 WHERE joueur=$2 AND chapitre =$3',
                values: [xp, joueur, chapitre]
             });
        } catch (error) {
            console.log(error);
        }
    }

    async nouvelleProgression(joueur, chapitre, xp) {
        try {
            await this._db.none({
                name: 'insert-nouvelle-progression',
                text: 'INSERT INTO users.progressions(chapitre,joueur,xp) VALUES($1, $2, $3)',
                values: [chapitre, joueur, xp]
             });
        } catch (error) {
            console.log(error);
        }
    }



    /*
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     *------------------------Chapitre--------------------------------
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     */

    async getChapitres(matiere) {
        try {
            var data = await this._db.any({
                name: 'get-chapitres',
                text: 'SELECT titre FROM challenges.chapitres WHERE matiere=$1',
                values: [matiere]
            })
        } catch (e) {
            console.log(e);
        }
        return data;
    }



    /*
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     *-------------------------Ecole----------------------------------
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     */

    async getEcole(nomEcole, codePostal) {
        try {
            var data = await this._db.any({
                name: 'get-ecole',
                text: 'SELECT * FROM users.ecoles WHERE nomEcole=$1 AND codePostal=$2',
                values: [nomEcole, codePostal]
            })
        } catch (e) {
            console.log(e);
        }
        return data;
    }

    async nouvelleEcole(nomEcole, codePostal, ville) {
        try {
            await this._db.none({
                name: 'insert-nouvelle-ecole',
                text: 'INSERT INTO users.ecoles(nomEcole, codePostal, ville) VALUES($1, $2, $3)',
                values: [nomEcole, codePostal, ville]
             });
        } catch (error) {
            console.log(error);
        }
    }


    /*
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     *-------------------------Classe---------------------------------
     *----------------------------------------------------------------
     *----------------------------------------------------------------
     */


    async getClasse(nom,nomEcole, codePostal) {
        try {
            var data = await this._db.any({
                name: 'get-classe',
                text: 'SELECT * FROM users.classes WHERE nom=$1 AND nomEcole=$2 AND codePostal =$3',
                values: [nom ,nomEcole, codePostal]
            })
        } catch (e) {
            console.log(e);
        }
        return data;
    }

    async nouvelleClasse(nom, nomEcole, codePostal) {
        try {
            await this._db.none({
                name: 'insert-nouvelle-classe',
                text: 'INSERT INTO users.classes(nom, nomEcole, codePostal) VALUES($1, $2, $3)',
                values: [nom,nomEcole, codePostal]
             });
        } catch (error) {
            console.log(error);
        }
    }


    

}

var dao = new Dao();
module.exports = dao;