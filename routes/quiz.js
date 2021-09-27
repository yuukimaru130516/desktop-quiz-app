var express = require('express');
var router = express.Router();

const path = require('path');
const fs = require('fs');

// quiz_json 読み込み
const quiz_file = path.join(path.resolve("__dirname", ".."),"quiz_20000_withYomi.json");
const quiz = JSON.parse(fs.readFileSync(quiz_file, 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {

  // TODO モジュール分割
  // 問題数の最大値
  const max = 5;
  const randoms = [];

  // 難易度選択
  const rank = req.query.rank;

  // 何問目か選択
  let number = 0;

  function intRandom(length){
    return Math.floor(Math.random() * length) + 1;
  }

  // 問題選択
  const createQuiz = (rank) => {
    const inFilter = quiz.filter(val => val.Rank === rank);
    for(i = 1; i <= inFilter.length; i++){
      while(i <= max){
        let tmp = intRandom(inFilter.length);
        if(!randoms.includes(tmp)){
          randoms.push(inFilter[tmp]);
          break;
        }
      }
    }
  }
  createQuiz(rank);
  // const random = randoms[0];
  number ++;
  console.log(number);
  res.render('quiz', {randoms, rank, number});
});

module.exports = router;