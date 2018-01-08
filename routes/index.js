var express = require('express');
var controller = require('../controllers');

var router = express.Router();



/* general middleware */
router.use(controller.others.loadPseudo);
router.use(controller.others.verifCo);


/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/home');
});

router.get('/home', controller.others.homepage);


//choixdesPerso
router.get('/choixPerso', controller.personnage.choix);

//page de selection d'un personnage
router.get('/choixPerso/:id', (req, res, next) => {
  res.render('vue'+req.params.id);
})
router.post('/choixPerso/:id', controller.joueur.ajouterPerso);

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
router.get('/login',controller.joueur.login);
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

//deconnexion
router.get('/logout', controller.others.deconnexion);


module.exports =  router;
