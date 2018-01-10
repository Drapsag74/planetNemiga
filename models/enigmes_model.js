dao = require("./DAO_model");

const BONUSXPPERSO = 1.07;
const MALUSERREUR = 0.85;
const XPBASEENIGME = 120;

/**représente une enigme
 * @property {number} _id - id de l'énigme
 * @property {string} _titre - titre de l'énigme
 * @property {string} _enonce - enonce de l'énigme
 * @private
 */
module.exports = class enigme {

    /**
     * @param {number} id - id de l'énigme (null par défaut)
     * @param {number} titre - titre de l'énigme (null par défaut)
     * @param {string} enonce - enonce de l'énigme (null par défaut)
     * @public
     */
    constructor(id = null, titre = null, enonce = null) {
        this._id = id;
        this._titre = titre;
        this._enonce = enonce;
        this._nbReponse = null;
        this._niveauDiff = null;
        this._chapitre = null;
    }


    /************************** 
     ***************************
     *********  getter  ********
     ***************************
     ***************************/

    getId() {
        return this._id;
    }
    getTitre() {
        return this._titre;
    }
    getEnonce() {
        return this._enonce;
    }


    /************************** 
     ***************************
     ****  autres méthodes  ****
     ***************************
     ***************************/

    async randomizeEnigme() {
        try {
            var request = await dao.getRandomFromEnigmes();
        } catch (e) {
            console.log(e);
        }
        if (request === undefined) throw ("Erreur requête vide");
        this._id = request.id;
        this._titre = request.titre;
        this._enonce = request.enonce;
    }

    async choisir(chapitre, difficultee) {
        try {
            var request = await dao.getEnigme(chapitre, difficultee);
        } catch (e) {
            console.log(e);
        }
        this._id = request.id;
        this._titre = request.titre;
        this._enonce = request.enonce;
        this._nbReponse = request.nbreponse;
        this._niveauDiff = request.niveaudiff;
        this._chapitre = request.chapitre;
    }

    async verifReponse(reponse, idEnigme, nbReponse) {
        try {

            var request = await dao.getReponseEnigme(idEnigme);

        } catch (e) {
            console.log(e);
        }
        if (request === undefined) throw ("Erreur Aucune Enigme avec cet id");
        var repJuste = true;
        if (nbReponse === 1) {
            if (await request[0].texte !== reponse)
                repJuste = false;
        } else {
            for (let i = 0; i < nbReponse; i++) {
                if (request[i].texte !== reponse[i])
                    repJuste = false;
            }
        }
        return repJuste;

    }

    async createEnigmeFromDb(id) {
        try {
            var request = await dao.getEnigmeById(id);
        } catch (e) {
            console.log(e);
        }
        if (request === undefined) throw ("Erreur requête vide");
        this._id = id;
        this._titre = request.titre;
        this._enonce = request.enonce;
        this._nbReponse = request.nbreponse;
        this._niveauDiff = request.niveaudiff;
        this._chapitre = request.chapitre;
    }

    async calculXp(difficulte, nbEssais, perso) {
        var xp = XPBASEENIGME * difficulte;
        if (perso === "Timix")
            xp *= BONUSXPPERSO;
            
        for (let i = 1; i < nbEssais; i++) {
            xp *= MALUSERREUR;
        }
        return xp;
    }
}