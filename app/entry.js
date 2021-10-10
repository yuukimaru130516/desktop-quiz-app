'use strict';

// main 処理
// モジュール読み込み
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// ハンバーガーメニュー
$(".openbtn").click(function () {
  $(this).toggleClass('active');
  $('#nav').fadeToggle(500);
  $('#nav').toggleClass('in');
});

// スライドバー
$("#score").html($("#bar").val() + " sec.");
$('#bar').on('input change', function() {
  // 変動
  $('#score').html($(this).val() + " sec.");
});


// TODO トップ画面
let quizIndex = 0;
let quesThrew = false;

const Questions = {
  "A": [],
  "B": [],
  "C": [],
  "D": []
}
// TODO 問題数取得
const max = $("#max").data('max');

// 難易度取得
const rank = $("#rank").data('rank');

// 持ち時間取得
const time = $("#time").data('time');


// suffle メソッド
Array.prototype.shuffle = function() {
  this.sort(() => Math.random() - 0.5);
}

let userAnswer = [];
let ansCount = 0;
let randomAnswer = [];
let isTimeout = false;


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

async function quizMain() {
  return new Promise(async (resolve) => {
    await syutudai();
    if(!quesThrew){
      await toAnswer();
    }
    drawAnswer();
    await sleep(3000);
    $("#countdown-bar").css({width: "100%"});
    quesThrew = false;
    quizIndex++;
    resolve();
  });
}

// main 
async function mainRoop(){
  // クイズ取得
  if(Questions[rank].length === 0){
    await getQuiz();
  }

  // 五問出すまで、メイン処理を繰り返す
  while(true){
    $("#Q").text("Q"+ (Number(quizIndex) + 1));  
    await quizMain();
    if(quizIndex === max){
      break;
    }
  }

  $("#display-ans").text("全てのクイズが終了しました");
};

mainRoop();
let counter = 0;

// 出題部分
const syutudai = () => {
  return new Promise(resolve => {
    $("#quiz-area").text('');
    $("#display-ans").text('');
    $("#ans-area").text('');
    $("#user-input-text").text('');
    $("#answer-limit").text('');
    let content = [];
    counter = 0;
    $("#cor-rate").text(Questions[rank][quizIndex].Correct_rate + "%");

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
        str_output()

      // 問題文が読まれてクリックされなかった処理
      if(counter === content.length) {
        clearInterval(intervalId);
        $("#countdown-bar").animate({width: "0%"}, time, function() {
          quesThrew = true;
          resolve();
        });
      }

      // 解答ボタンが押された処理
      $("#ans-btn").on("click", async function() {
        // 問題文の途中で押された場合
        if(counter !== content.length) {
          clearInterval(intervalId);
          resolve();
        // 問題文が読み終わってから押された場合
        }else {
          $("#countdown-bar").stop(false, false);
          resolve();
        }
      })
    }, 100);

  })
}

// 答えを描画
function drawAnswer() {
  const nowAnswer = Questions[rank][quizIndex].Content.Answer;
  const nowAnswerYomi = Questions[rank][quizIndex].Content.Yomi;
  const nowQues = Questions[rank][quizIndex].Content.Question;

  if(counter !== nowQues.length) {
    $("#quiz-area").text(nowQues);
  }
  $("#display-ans").text("A. " + nowAnswer + "  (" + nowAnswerYomi + ")");

}

function toAnswer(){
  return new Promise(resolve => {
  // 正答
  $('.popup').addClass('show').fadeIn();
    let nowAnswerYomi = Questions[rank][quizIndex].Content.Yomi;
    let nowAnswerYomiEach = [];
    for(let i in nowAnswerYomi){
      nowAnswerYomiEach.push(nowAnswerYomi[i]);
    }
    (async() => {
      while(true){
        await createAnswser(nowAnswerYomiEach);
        await inputAnswer(nowAnswerYomiEach);

      // 正誤判定
        if(isTimeout){
          break;
        }
        if(userAnswer[ansCount -1] != nowAnswerYomiEach[ansCount - 1]){
          alert("不正解です");
          $('.popup').fadeOut();
          break;
        }
        if(ansCount === nowAnswerYomiEach.length){
          alert("正解です");
          $('.popup').fadeOut();
          break;  
        }}
      // 初期化処理
      ansCount = 0;
      userAnswer = [];
      isTimeout = false;
      resolve();  
      })();
  });
}

// 時間制限
function answerLimit(time) {
  let count = time/1000 + 1;
  const interval = setInterval(() => {
    count -= 1;
    $("#answer-limit").text(count);
    if(count === 0){
      clearInterval(interval);
      alert("時間切れです");
      $('.popup').fadeOut();
      isTimeout = true;
    }
  }, 1000);
  return interval;
}



function createAnswser(nowAnswerYomiEach){
  // 配列で4文字を作成する
  randomAnswer = [];
  return new Promise(resolve => {
    // 正解の文字をセット
    randomAnswer.push(nowAnswerYomiEach[ansCount]);
    const isHiragana = /^[\u3040-\u309F]+$/;
    const isKatakana = /^[\u30A0-\u30FF]+$/;
    const isEnglish  = /[A-Z]/ 

    if(isHiragana.test(randomAnswer[0])){
      // ひらがな
      const hiragana = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゃゅょ";
      createCharaSet(hiragana, randomAnswer);
    }else if(isKatakana.test(randomAnswer[0])){
      // カタカナ
      const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポャュョ";
      createCharaSet(katakana, randomAnswer);
    }else if(isEnglish.test(randomAnswer[0])){
      const english = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      // 英語
      createCharaSet(english, randomAnswer);
    }else{
      // 数字
      const number = "0123456789"
      createCharaSet(number, randomAnswer);
    }

    // 生成した文字列を一文字ずつセットする
    randomAnswer.shuffle();
    randomAnswer.forEach((val) => {
      $("<div>", {
        class: 'text-box',
        'data-text': val,
        text: val
      }).appendTo('#ans-area');
    } )
    resolve();
  });
}

// 誤答文字列生成
function createCharaSet(isGengo, randomAnswer) {
  let cl = isGengo.length;
  for(let i=0; i<3; i++){
    randomAnswer.push(isGengo[Math.floor(Math.random() * cl)]);
  }
}

// 答え入力
function inputAnswer(nowAnswerYomiEach) {
  return new Promise(resolve => {
  // 時間制限
  const interval = answerLimit(time);
  // 時間切れだったらresolveする
  const timeout = setTimeout(() => {
    if(isTimeout){
      clearInterval(timeout);
      resolve();
    }
  }, time + 5000);

  // 選択肢クリック処理
  $('.text-box').on("click", async function() {
    clearInterval(interval);
    let answer = $(this).data('text');
    userAnswer.push(answer);
    $("#user-input-text").text(userAnswer.join(""));
    $(".text-box").remove(); 
    if(userAnswer.length  === nowAnswerYomiEach.length || userAnswer[ansCount] !== nowAnswerYomiEach[ansCount]) await sleep(500);
    ansCount++;
    resolve();
  });
  });
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  })
}


// Socket.ioサーバへ接続
/* import { io } from 'socket.io-client';
const socket = io('http://localhost:8000');
 */
/* socket.on('connect-user', (data) => {
  console.log(data);
}) */



