var passport = require('../models').passport;
var Joueur = require('../models').joueur;

module.exports.login = async function(req, res, next) {
    res.render('login');
}

module.exports.inscription = async function(req, res, next) {
    res.render('inscription');
}

module.exports.handleLogIn = passport.authenticate('login', {
    successRedirect: '/choixPerso',
    failureRedirect: '/login',
    failureFlash : true 
  });

module.exports.handleSignUp = passport.authenticate('signup', {
    successRedirect: '/choixPerso',
    failureRedirect: '/inscription',
    failureFlash : true 
  });

module.exports.ajouterPerso = async function(req, res, next) {
    var id = req.params.id;
    var aEteAjoute = false;
    console.log(req.user);
    var joueur = new Joueur(req.user._id,req.user._pseudo, req.user._mail);
    if(id === "Timix") {
      aEteAjoute = await joueur.ajouterPerso("Timix");
    } else if(id === "Infobot") {
        aEteAjoute = joueur.ajouterPerso("Infobot");
    } else {
      aEteAjoute = false;
    }
    if(aEteAjoute) {
        res.redirect('/choixMonde');
    } else {
        res.redirect('/choixPerso');
    }
  }