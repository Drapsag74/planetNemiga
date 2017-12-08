var express = require('express');
var controller = require('../controllers');

var router = express.Router();


/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

router.get('/home', (req, res, next) => {
  res.render('home', { title: 'Planet Nemiga' });
});



/*choix des personnages */
router.get('/choixPerso', controller.db.choixPerso);


/*reponse aux enigmes*/
router.get('/pageEnigme',controller.enigme.randomEnigme);
router.post('/pageEnigme', controller.enigme.verifReponse);


router.get('/progCHal', (req, res, next) => {
  res.render('progChall');
})
router.get('/ChoixMonde',(req,res,next)=>{
  res.render('ChoixMonde');
})

//get login page & inscription pages
router.get('/login', controller.joueur.login);
router.get('/inscription', controller.joueur.inscription);

//handle login & inscription
router.post('/login', controller.joueur.handleLogIn);
router.post('/inscription', controller.joueur.handleSignUp);

router.get('/mondeMaths', (req, res, next) => {
  res.render('mondeMath');
})
router.get('/mondeMath',(req,res,next)=>{
  res.render('mondeMath')
})

module.exports =  router;
