Personnage = require('../models').personnage;
personnage_controller = require('./personnage_controller');

module.exports.verifCo = function (req, res, next) {
    /*if(!req.user) res.redirect('/home');
    else */next();
}

//verifie que le perso existe et envois son avatar
module.exports.verifPerso = async function (req, res, next) {
    /*if (req.user) {
        console.log(res.locals);
        if (req.user.imagePereq.user.imagePerso) res.locals.imagePerso = req.user.imagePerso;
        else {
            var perso = new Personnage();
            try {
            await perso.init();
            if (perso.categorie == null && !res.locals.selectionPerso) {
                    res.locals.personnages = await perso.getAll();
                    console.log(res.locals.personnages);
                    res.render('choixPerso');
                    var rendered = true;
            } else {
                req.user.imagePerso = perso.image;
                res.locals.imagePerso = perso.image;

            }
        } catch(e) {
            console.log(e);
        }

        }
    }
    if(!rendered) next();
    else res.locals.selectionPerso = true;*/
}
//charge le pseudo du joueur ainsi que son personnage
module.exports.loadPseudo = async function (req, res, next) {
    var redirection = false;
    if (req.user) {
        res.locals.pseudo = req.user._pseudo;
        if(req.user._personnage) res.locals.personnage = req.user._personnage;
    }
    next();
}

module.exports.homepage = function (req, res, next) {
    if (req.user) res.redirect('./ChoixMonde');
    else res.render('home', {
        title: 'Planet Nemiga'
    });
}

module.exports.deconnexion = function (req, res, next) {
    req.session.destroy();
    res.locals = null;
    res.redirect('/home');
}