var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const rank = "A";
  const max = req.body.selectQues;
  res.render('quiz', {rank, max});
})


router.get('/quiz', function(req, res, next) {
  console.log(req.body);
})

module.exports = router;
