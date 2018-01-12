var Enigme = require('../models').enigme;
var Progression = require('../models').progression;
module.exports.randomEnigme = async function (req, res, next) {
    var enigme = new Enigme();
    await enigme.randomizeEnigme();
    res.user.idEnigme = enigme.getId();
    res.render('pageEnigme', {
        titre: enigme.getTitre(),
        enonce: enigme.getEnonce(),
        id: enigme.getId()
    });
}

module.exports.choisirEnigme = async function (req, res, next) {

    if (!req.session.enigmeEnCours) {
        var chapitre = req.params.chapitre;
        var difficulte = req.params.difficulte;
        req.session.enigmeEnCours = {};
        var enigme = new Enigme();
        try {
            await enigme.choisir(chapitre, difficulte);
        } catch (e) {
            console.log(e);
        }
        req.session.enigmeEnCours.chapitre = chapitre;
        req.session.enigmeEnCours.id = enigme.getId();
        req.session.enigmeEnCours.enonce = enigme.getEnonce();
        req.session.enigmeEnCours.titre = enigme.getTitre();
        req.session.enigmeEnCours.nbReponse = enigme._nbReponse;
        req.session.enigmeEnCours.difficulte = enigme._niveauDiff
        req.session.enigmeEnCours.numEssais = 1; 
        res.render('pageEnigme', {
            titre: enigme.getTitre(),
            enonce: enigme.getEnonce(),
            id: enigme.getId()
        });


    } else {
        res.render('pageEnigme', {
            titre: req.session.enigmeEnCours.titre,
            enonce: req.session.enigmeEnCours.enonce,
            id: req.session.enigmeEnCours.id
        });
    }

}


module.exports.verifReponse = async function (req, res, next) {
    var enigme = new Enigme();
    var idEnigme =  req.session.enigmeEnCours.id;
    var difficulte = req.session.enigmeEnCours.difficulte;
    var chapitre = req.session.enigmeEnCours.chapitre;

    try {
        var reponseJuste = await enigme.verifReponse(req.body.reponse, idEnigme, req.session.enigmeEnCours.nbReponse); //on vérifie si la réponse est juste
    } catch (e) {
        console.log(e);
    }
    if (reponseJuste) {
        var progression = new Progression(req.user._id);
        try {
            var exp = await enigme.calculXp(difficulte, req.session.enigmeEnCours.numEssais, req.user._personnage);
            await progression.ajouterXp(exp, chapitre);
        } catch (error) {
            console.log(error)
        }
        res.locals.xp = exp;
        res.locals.numEssais = req.session.enigmeEnCours.numEssais;
        res.locals.chapitre = chapitre;
        res.locals.difficulte = difficulte;
        req.session.enigmeEnCours = undefined; //on clear comme enigme finis
        res.render('vueEnigmeReussie');
    } else {
        req.session.enigmeEnCours.numEssais++; //on incrémente le nombre d'essais dans la session
        res.render('pageEnigme', {
           titre: req.session.enigmeEnCours.titre,
            enonce: req.session.enigmeEnCours.enonce,
            id: idEnigme,
            reponseFausse: true
        })
    }
}