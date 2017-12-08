var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Joueur = require('./joueur_model');

//passport serialize, deserialize

passport.serializeUser((joueur, done) => {
    done(null, joueur._id);
});

passport.deserializeUser(async (id, done) => {
    var joueur = new Joueur();
    try {
        joueur = await joueur.findById(id);
    } catch (e) {
        console.log(e);
    }
    done(null, joueur);
});



//signup
passport.use('signup', new LocalStrategy({
    usernameField: 'pseudo',
    passwordField: 'motDePasse',
    passReqToCallback: true
}, async (req, pseudo, motDePasse, done) => {
    var joueur = new Joueur(pseudo);
    try {
        joueurEx = await joueur.existe();
    } catch (e) {
        return done(e);
    }
    if (joueurEx) return done(null, false); // req.flash('signup' "Le pseudo : "+pseudo+" est déjà utilisé"
    else {
        try {
            joueur = await joueur.init('mail', motDePasse);
        } catch (e) {
            return done(null, false, {
                message: "Erreur lors de la création de l'utilisateur"
            });
        }
        return done(null, joueur);
    }
}));

//signin
passport.use('login', new LocalStrategy( async (pseudo, motDePasse, done) => {
    joueur = new Joueur(pseudo);
    try {
        verif = await joueur.verifMdp();
    } catch(e) {
        return done(e);
    }
    if(verif === true) {
        joueur.connect();
        done(null, joueur);
    } else done(null, false);
}));

module.exports = passport;