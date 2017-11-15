var express = require('express');
var controller = require('../controllers');

var router = express.Router();


/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect("/home");
});

router.get('/home', (req, res, next) => {
  res.render('home', { title: 'Planet Nemiga' });
});



/*choix des personnages */
router.get("/choixPerso", controller.db.choixPerso);



/* POST enigme*/
router.post('/enigme', controller.enigme.randomEnigme);






module.exports =  router;