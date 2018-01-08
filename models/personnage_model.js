var dao = require('./DAO_model');

module.exports = class Personnage {

    constructor() {
        this.categorie = null;
        this.sexe = null;
        this.description = null;
        this.image = null;
    }

    async init(categorie) {
        var perso = await dao.getPersonnage(categorie);
        if (perso) {
            this.categorie = perso.categorie;
            this.sexe = perso.sexe;
            this.description = perso.description;
            this.image = perso.image;

        }
    }

    async getAll() {
        var personnages = await dao.getAllPersonnages();
        return personnages;
    }
}