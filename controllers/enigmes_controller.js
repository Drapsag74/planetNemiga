var Enigme = require('../models').enigme;

module.exports.randomEnigme = async function(req, res, next) {
    var enigme = new Enigme();
    await enigme.randomizeEnigme('maths');
    res.render('pageEnigme.hbs', {description: enigme.getDescription()});
}