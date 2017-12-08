var dao = require('./DAO_model');
var bcrypt = require('bcrypt');
const SALTROUNDS = 10;

module.exports = class Joueur {

    constructor(pseudo = null) {
        this._id = null;
        this._pseudo = pseudo;
        this._mail = null;
    }

    getId() {
        return this._id;
    }

    getPseudo() {
        return this._pseudo;
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
        return this;
    }

    async existe() {
        try {
            var joueur = await dao.getJoueur(this.getPseudo());
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
            await dao.nouveauJoueur(this.getPseudo(), mail, hash);
            var joueur = await dao.getJoueur(this.getPseudo());
            this._id = joueur.id;
            this._mail = joueur.mail;

        } catch (e) {
            console.log(e);
            //throw(e);
        }
        return this;
    }

    async verifMdp() {

    }

    async connect() {
        try {
            joueur = await dao.getJoueur(getPseudo());
        } catch (e) {
            console.log(e);
        }
        return joueur;
    }

}