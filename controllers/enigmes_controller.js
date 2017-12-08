var Enigme = require('../models').enigme;

module.exports.randomEnigme = async function(req, res, next) {
    var enigme = new Enigme();
    await enigme.randomizeEnigme();
    res.render('pageEnigme', {titre: enigme.getTitre(), enonce: enigme.getEnonce(), id: enigme.getId()});
}

module.exports.verifReponse = async function(req, res, next) {
    console.log(req.body);
    idEnigme = req.body.idEnigme;
    var enigme = new Enigme();
    try {
        var reponseJuste = await enigme.verifReponse(req.body.reponse, idEnigme);   //on vérifie si la réponse est juste
        await enigme.CreateEnigmeFromDb(idEnigme);                                          //on récupère l'énigme depuis la base de donnée
    } catch(e) {
        console.log(e);
    }
    if(reponseJuste) {
        res.render('enigmeReussi');
    } else {
        res.render('pageEnigme', {titre: enigme.getTitre(), enonce: enigme.getEnonce(), id: idEnigme, reponseFausse: true})
    }
}