var Enigme = require('../models').enigme;

module.exports.randomEnigme = async function(req, res, next) {
    var enigme = new Enigme();
    await enigme.randomizeEnigme();
    res.render('pageEnigme.hbs', {enonce: enigme.getEnonce()});
}

module.exports.VerifReponse = async function(req, res, next) {
    if(Enigme.VerifReponse(req.body.reponse, req.body.idEnigme)) {
        console.log("enigme juste");
    } else {
        console.log("enigme fausse");
    }
}