var dao = require('./DAO_model');

module.exports = class Ecole {

    constructor(nomEcole, codePostal, ville) {
        this._nomEcole = nomEcole;
        this._codePostal = codePostal;
        this._ville = ville;
    }

    async ajouter() {
        try {
            var ecoleExiste = await dao.getEcole(this._nomEcole, this._codePostal);
            if(ecoleExiste.length ===0) {
                await dao.nouvelleEcole(this._nomEcole, this._codePostal, this._ville);
            }
        } catch(e) {
            console.log('--------------------------------------------errrroororooroi');
            console.log(e);
        }
    }
}