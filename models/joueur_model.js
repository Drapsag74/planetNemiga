var dao = require('./DAO_model');
var bcrypt = require('bcrypt');
const SALTROUNDS = 10;

module.exports = class Joueur {

    constructor(id = null,pseudo = null,mail=null) {
        this._id = id;
        this._pseudo = pseudo;
        this._mail = mail;
        this._personnage = null;
        this._nomEcole = null;
    }

    getId() {
        return this._id;
    }

    getPseudo() {
        return this._pseudo;
    }

    getMail() {
        return this._mail;
    }

    async findById(id) {
        try {
            var joueur = await dao.getJoueurById(id);
        } catch (e) {
            console.log(e);
        }
        this._id = joueur.id;
        this._pseudo = joueur.pseudo;
        this._mail = joueur.mail;
        this._personnage = joueur.personnage;
        return this;
    }

    async findByPseudo(pseudo) {
        try {
            var joueur = await dao.getJoueurByPseudo(pseudo);
        } catch (e) {
            console.log(e);
        }
        this._id = joueur.id;
        this._pseudo = joueur.pseudo;
        this._mail = joueur.mail;
        this._personnage = joueur.personnage;
        this._nomEcole = joueur.nomEcole;
        return this;
    }
    

    async existe() {
        try {
            var joueur = await dao.getJoueur(this.getMail);
        } catch (e) {
            console.log(e);
        }
        if (joueur) return true;
        else return false;
    }

    async init(mail, motDePasse) {
        try {
            const salt = await bcrypt.genSalt(SALTROUNDS);
            const hash = await bcrypt.hash(motDePasse, salt);
            var joueur = await dao.nouveauJoueur(this.getPseudo(), mail, hash);
            this._id = joueur.id;
            this._mail = joueur.mail;

        } catch (e) {
            console.log(e);
            //throw(e);
        }
        return this;
    }

    async verifMdp(mail, motDePasse) {
        try {
            var hash = await dao.getMdp(mail);
            var mdpEstBon = await bcrypt.compare(motDePasse, hash);
        } catch (e) {
            console.log(e);
        }
        return mdpEstBon;
    }

    async connect() {
        try {
            var joueur = await dao.getJoueur(this.getMail());
        } catch (e) {
            console.log(e);
        }
        this._id = joueur.id;
        this._pseudo = joueur.pseudo;
        return this;
    }

    async ajouterPerso(perso) {
        try {
            var ajoute = await dao.ajouterPersoJoueur(perso, this.getId());
        } catch (e) {
            console.log(e)
            ajoute = false;
        }
        
        return ajoute;
    }

    async ajouterEcole(nomEcole, codePostal) {
        try {
            await dao.ajouterEcoleJoueur(nomEcole, codePostal, this.getId());
        } catch (e) {
            console.log(e)
            ajoute = false;
        }
    }

    async ajouterClasse(nomClasse) {
        try {
            await dao.ajouterClasseJoueur(nomClasse, this.getId());
        } catch (e) {
            console.log(e)
            ajoute = false;
        }
    }
}