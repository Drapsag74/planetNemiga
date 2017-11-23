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
router.get('/login', (req, res, next) => {
  res.render('login');
})
router.get('/inscription', (req, res, next) => {
  res.render('inscription');
})



module.exports =  router;
