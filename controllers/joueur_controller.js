var passport = require('../models').passport;


module.exports.login = async function(req, res, next) {
    res.render('login');
}

module.exports.inscription = async function(req, res, next) {
    res.render('inscription');
}

module.exports.handleLogIn = passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true 
  });

module.exports.handleSignUp = passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/inscription',
    failureFlash : true 
  });