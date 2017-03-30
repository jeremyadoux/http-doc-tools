var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { lang: 'none', page: 'Accslaide'});
});

/* GET home page. */
router.get('/:language/:page', function(req, res, next) {
    var acceptedLanguages = req.app.get('acceptedLanguages');
    var language = req.params.language;
    var page = req.params.page;

    if(acceptedLanguages.indexOf(language) > -1) {
        res.render('index', {lang: language, page: page.replace('html', 'ejs')});
    }
    else
    {
        res.redirect('/');
    }


});


module.exports = router;
