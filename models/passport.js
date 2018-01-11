var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Joueur = require('./joueur_model');
var dao = require('./DAO_model');
var Ecole = require('./ecole_model');
var Classe = require('./classe_model');

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
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, motDePasse, done) => {
    try {
        var joueur = new Joueur(null,req.body.pseudo, email);
        joueurEx = await dao.getJoueur(email);
    } catch (e) {
        return done(e);
    }
    if (joueurEx) return done(null, false); // req.flash('signup' "Le pseudo : "+pseudo+" est déjà utilisé"
    else {
        try {
            joueur = await joueur.init(email, motDePasse);
            var codeP = parseInt(req.body.codeP);
            var ecole = new Ecole(req.body.nomEcole, codeP, req.body.ville);
            await ecole.ajouter();
            await joueur.ajouterEcole(req.body.nomEcole, codeP);
            var classe = new Classe(req.body.idClasse, req.body.nomEcole, codeP);
            await classe.ajouter();
            await joueur.ajouterClasse(classe._id);
        } catch (e) {
            return done(null, false, {
                message: "Erreur lors de la création de l'utilisateur"
            });
        }
        return done(null, joueur);
    }
}));

//login
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'motDePasse',
    passReqToCallback: true
},async (req, mail, motDePasse, done) => {
    joueur = new Joueur(null,null, mail);
    try {
        var verif = await joueur.verifMdp(mail, motDePasse);
    } catch(e) {
        return done(e);
    }
    if(verif === true) {
        try {
            await joueur.connect();
        } catch (e) {
            console.log(e);
        }
        done(null, joueur);
    } else done(null, false);
}
));

module.exports = passport;