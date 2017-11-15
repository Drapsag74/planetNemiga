var dao = require("../models").dao;

db = {};

db.choixPerso = async function(req, res, next) {
    persos = await dao.getAllPersonnages();
    res.render('choixPerso.hbs', {personnages: persos});
}

module.exports = db;