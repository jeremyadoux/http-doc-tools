var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:page', function(req, res, next) {
  if(req.params.page) {
      res.render('index', { page:  "doc/" + req.params.page.replace('html', 'ejs')});
  }
});

router.get('/', function(req, res, next) {
    res.render('index', { page:  "doc/" + 'Accslaide.ejs'});
});

module.exports = router;
