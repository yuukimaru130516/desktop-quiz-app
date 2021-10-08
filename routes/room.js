var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', (req, res, next) => {
  const userName = req.body.userName;
  res.render('room', {userName});
})


module.exports = router;