var express = require('express');
var router = express.Router();

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./localStorage');
}

/* GET home page. */
router.get('/:page', function(req, res, next) {
    var language = localStorage.getItem('language');

    if (language === "undefined" || language === null)
        language = req.acceptsLanguages(["fr-FR", "En-en"]).split('-')[0];

  if(req.params.page) {
      res.render('index', { lang: language, page:  'doc/'+language+'/' + req.params.page.replace('html', 'ejs')});
  }
});

router.get('/', function(req, res, next) {
    var language = localStorage.getItem('language');

    if (language === "undefined" || language === null)
        language = req.acceptsLanguages(["fr-FR", "En-en"]).split('-')[0];

    res.render('index', { lang: language, page:  'doc/'+language+'/' + 'Accslaide.ejs'});
});

router.get('/language/:language', function (req, res, next) {
    localStorage.setItem('language', req.params.language);

    res.redirect('/');
});

module.exports = router;
