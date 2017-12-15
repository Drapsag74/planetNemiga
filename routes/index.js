var express = require('express');
var controller = require('../controllers');

var router = express.Router();



/* general middleware */
router.use((req, res, next) => {
  if(req.user) res.locals.pseudo = req.user._pseudo;
  next();
});


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
router.get('/logout', (req, res, next)=>{
  req.session.destroy();
  res.locals = null;
  res.render('logout');
})


module.exports =  router;
