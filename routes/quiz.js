var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', (req, res, next) => {
  const rank = req.body.rank;
  const max = req.body.selectQues;
  const time = Number(req.body.time) * 1000;
  console.log(time);
  res.render('quiz', {rank, max, time});
})

module.exports = router;