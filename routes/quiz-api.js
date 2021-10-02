var express = require('express');
var router = express.Router();

const path = require('path');
const fs = require('fs');

// quiz_json 読み込み
const quiz_file = path.join(path.resolve("__dirname", ".."),"quiz_20000_withYomi.json");
const quiz = JSON.parse(fs.readFileSync(quiz_file, 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.json({quiz});  
  //res.render('quiz', {randoms, rank, numbers});
});


module.exports = router;