var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', (req, res, next) => {
  const rank = "A";
  const max = req.body.selectQues;
  res.render('quiz', {rank, max});
})

module.exports = router;