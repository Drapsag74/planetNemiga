var Enigme = require('../models').enigme;

module.exports.randomEnigme = async function(req, res, next) {
    var enigme = new Enigme();
    await enigme.randomizeEnigme(req.body.matiere);
    res.render('enigme.hbs', {description: enigme.getDescription()});
}