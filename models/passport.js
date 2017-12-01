var passport = require('passport');

passport.use('local-signup', new LocalStrategy({
    usernameField: 'pseudo',
    passwordField: 'motDePasse'
}))