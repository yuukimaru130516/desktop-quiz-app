'use strict';

// main 処理
// モジュール読み込み
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// TODO トップ画面
// pugファイル内のrandomsを取得(サーバーからのAPIを取得する)
let quizIndex = 0;
let stop = false;

const Questions = {
  "A": [],
  "B": [],
  "C": [],
  "D": []
}

// suffle メソッド
Array.prototype.shuffle = function() {
  this.sort(() => Math.random() - 0.5);
}

// 難易度取得
const rank = $("#rank").text();
$("#rank").remove();


// クイズ取得
async function getQuiz() {
  const response = await $.get('/quiz-api');
  response.quiz.forEach((value) => {
    switch(value.Rank){
      case "A":
        Questions.A.push(value);
        break;
      case "B":
        Questions.B.push(value);
        break;
      case "C":
        Questions.C.push(value);
        break;
      default:
        Questions.D.push(value);
        break;
    }
  });
  Questions.A.shuffle();
  Questions.B.shuffle();
  Questions.C.shuffle();
  Questions.D.shuffle();
}

// answer
$("#ans-btn").on("click", () => {
  stop = true;
  });

async function quizMain() {
  return new Promise(async (resolve) => {
    await syutudai();
    quizIndex++;
    resolve();
  });
}

// main 
async function mainRoop(){
  // クイズ取得
  await getQuiz();
  // 五問出すまで、メイン処理を繰り返す
  console.log(Questions[0]);
  while(true){
    await quizMain();
    if(quizIndex == 5){
      break;
    }
  }
};

mainRoop();


// 次のクイズ
function nextQuiz() {
  return new Promise(resolve => {
    
    resolve();
  })
}



// 出題部分
const syutudai = () => {
  return new Promise(resolve => {
    $("#quiz-area").text(' ');
    $("#ans-area").text('')
    let content = [];
    let counter = 0;

    // 問題文を配列に代入
    const stdQuiz = Questions[rank][quizIndex].Content.Question;  

    for(let i in stdQuiz){
      content.push(stdQuiz[i]);
    }

    // 一文字ずつ出力
    const str_output = () => {
      $("<span>", {
        class: 'quiz',
        text: content[counter]
      }).appendTo('#quiz-area');
      counter++;
    }

    // 全て出力したら停止する
    const intervalId = setInterval(() => {
      str_output();
      if(counter === content.length){
        setTimeout(() => {
          // TODO 待ち時間のバーを表示する
          clearInterval(intervalId);
          resolve();
        }, 5000);
      }else if(stop) {
        clearInterval(intervalId);
        //TODO 回答処理、正答処理
        toAnswer();

      }
    }, 100);
  })
}

function toAnswer(){
  // 正答（漢字と読み）
  const nowAnswer = Questions[rank][quizIndex].Content.Answer;
  const nowAnswerYomi = Questions[rank][quizIndex].Content.Yomi;
  const nowAnswerYomiEach = [];
  for(let i in nowAnswerYomi){
    nowAnswerYomiEach.push(nowAnswerYomi[i]);
  }
  const nowAnswerYomiEachCharCode = nowAnswerYomiEach.map(val => { return val.charCodeAt(0)});

  nowAnswerYomiEachCharCode.forEach(async (value, index) => {
    await createAnswser(value, index);
    // TODO カードを選択する
});
}
const userAnswer = [];
let ansCount = 0;

function createAnswser(value, index){

  return new Promise(resolve => {
    if(ansCount === index){
    for(let i=0; i<4; i++){
        $("<div>", {
          id: 'cardValue' + i,  
          class: 'card text-center',
          text: String.fromCharCode(value + i)
        }).appendTo('#ans-area');
      }
    }

    $(document).on("click", ".card", () => {
      userAnswer.push($(".card").text);
      console.log(userAnswer);
      ansCount++;
      $(".card").remove();
      createAnswser(value ,index);
    })
    resolve();
  });
}


