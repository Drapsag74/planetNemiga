var dao = require('./DAO_model');

const XPREQUISNIV2 = 200;
const XPREQUISNIV3 = 500;
const sommerTableau = (accumulator, currentValue) => accumulator + currentValue;


module.exports = class {
    constructor(joueur) {
        this._chapitre = null;
        this._joueur = joueur;
        this._xp = null;
    }
    
    calculNiveau(xp) {
        var niveau = "1 à " + Math.round((xp/XPREQUISNIV2)*100) + "% (" + (XPREQUISNIV2 - xp) + " points d'experience avant le niveau suivant)";
        if(xp > XPREQUISNIV2 && xp < XPREQUISNIV3) {
            niveau = "2 à "+ Math.round((xp/XPREQUISNIV3)*100) + "% (" + (XPREQUISNIV3 - xp) + " points d'experience avant le niveau suivant)";
        } else if (xp > XPREQUISNIV3 ) {
            var xpRequisTab = [XPREQUISNIV2, XPREQUISNIV3];
            var sum = XPREQUISNIV2 + XPREQUISNIV3;
            while(xp > sum) {
                xpRequisTab.push(sum);
                sum = xpRequisTab.reduce(sommerTableau);
            }
            niveau = xpRequisTab.length + 1 + " à " + Math.round((xp/sum)*100) + "% (" + (sum - xp) + " points d'experience avant le niveau suivant)";
        }
        return niveau;
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