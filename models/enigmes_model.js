dao = require("./DAO_model");


/**représente une enigme
 * @property {number} _id - id de l'énigme
 * @property {string} _matiere - matière de l'énigme
 * @property {string} _chapitre - chapitre de l'énigme
 * @property {string} _description - description de l'énigme
 * @property {number} _difficultee - difficultée de l'énigme entre 1 et 10
 * @private
*/
module.exports = class enigme {

    /**
    * @param {number} id - id de l'énigme (null par défaut)
    * @param {string} matiere - matière de l'énigme (null par défaut)
    * @param {string} chapitre - chapitre de l'énigme (null par défaut)
    * @param {string} description - description de l'énigme (null par défaut)
    * @param {number} difficultee - difficultée de l'énigme entre 0 et 10 (0 par défaut)
    * @public
    */
    constructor(id = null, matiere = null , chapitre = null , description = null , difficultee = 0) {
        this._id = id;
        this._matiere = matiere;
        this._chapitre = chapitre;
        this._description = description;
        this._difficultee = difficultee;
    }


    /************************** 
    ***************************
    *********  getter  ********
    ***************************
    ***************************/

    getId() {
        return this._id;
    }
    getMatiere() {
        return this._matiere;
    }
    getChapitre() {
        return this._chapitre;
    }
    getDescription() {
        return this._description;
    }
    getDifficultee() {
        return this._difficultee;
    }


    /************************** 
    ***************************
    ****  autres méthodes  ****
    ***************************
    ***************************/

    async randomizeEnigme(matiere) {
        var request = await dao.getRandomFromEnigmes(matiere);
        if (request === null) throw ("Requête renvoie null");
        else {
            this._id = request.id;
            this._matiere = request.matiere;
            this._chapitre = request.chapitre;
            this._description = request.description;
            this._difficultee = request.difficultee;
        }
        
        
    }

}
