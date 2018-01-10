var dao = require('./DAO_model');

module.exports = class {
    constructor(joueur) {
        this._chapitre = null;
        this._joueur = joueur;
        this._xp = null;
    }
    
    async getProgressionJoueurMatiere(matiere) {
        var xpTot = 0;
        try {
            var chapitres = await dao.getChapitres(matiere);
            console.log(chapitres);
            for(let i=0; i < chapitres.length; i++) {
                xpTot += (await dao.getProgressionJoueurChapitre(this._joueur, chapitres[i].titre))[0].xp;
            }
        } catch (error) {
            console.log(error);
        }
        return xpTot;
    }

    async ajouterXp(xp, chapitre) {
        try {
            var existe = await dao.getProgressionJoueurChapitre(this._joueur, chapitre);
            if(existe.length !==0) {
                await dao.ajouterXpJoueur(this._joueur, xp, chapitre);
            } else {
                await dao.nouvelleProgression(this._joueur, chapitre, xp);
            }
        } catch (error) {
            console.log(error);
        }
    }

}