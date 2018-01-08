Personnage = require('../models').personnage;
Joueur = require('../models').joueur;

module.exports.choix = async function(req, res, next) {
    if(!req.user._personnage) {
    personnage = new Personnage();
    res.locals.personnages = await personnage.getAll();
    res.render('choixPerso');
    } else res.redirect('/choixMonde');
}