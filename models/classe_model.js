var dao = require('./DAO_model');

module.exports = class Classe {
    constructor(nom, nomEcole, codePostal) {
        this._id = null;
        this._nom = nom;
        this._nomEcole = nomEcole;
        this._codePostal = codePostal;
    }

    async ajouter() {
        try {
            var classeExiste = await dao.getClasse(this._nom,this._nomEcole, this._codePostal);
            if(classeExiste.length ===0) {
                await dao.nouvelleClasse(this._nom, this._nomEcole, this._codePostal);
                this._id = (await dao.getClasse(this._nom,this._nomEcole, this._codePostal))[0].id; 
            }
        } catch(e) {
            console.log(e);
        }
    }

}