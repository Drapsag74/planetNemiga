dao = require("./DAO_model");


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
        } catch(e) {
            console.log(e);
        }
        if (request === undefined) throw ("Erreur requête vide");
        this._id = request.id;
        this._titre = request.titre;
        this._enonce = request.enonce;
    }

    async verifReponse(reponse, idEnigme) {
        try {
            var request = await dao.getReponseEnigme(idEnigme);
        } catch(e){
            console.log(e);
        }
        if (request === undefined) throw ("Erreur requête vide");
        if(request.texte === reponse) {
            return true
        } else {
            return false;
        }

    }

    async CreateEnigmeFromDb(id) {
            try {
                var request = await dao.getEnigme(id);
            } catch(e) {
                console.log(e); 
            }
            if (request === undefined) throw ("Erreur requête vide");
            this._id = id;
            this._titre = request.titre;
            this._enonce = request.enonce;
    }
}
