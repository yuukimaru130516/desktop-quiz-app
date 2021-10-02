var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/quiz', function(req, res, next) {
  const rank = req.query.rank
  res.render('quiz', {rank});
})

module.exports = router;
