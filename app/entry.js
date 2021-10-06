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
// TODO 問題数取得
const max = $("#max").data('max');

// 難易度取得
const rank = $("#rank").data('rank');

// 問題数選択されてから難易度を表示する 
$(".form-select").change(function() {
  $("#select-degree").css("visibility", "visible");
})

//難易度を選択してから持ち時間を表示する
$("#select-degree").on("click", function() {
  $("#select-time").css("visibility", "visible");
})

// suffle メソッド
Array.prototype.shuffle = function() {
  this.sort(() => Math.random() - 0.5);
}


// 持ち時間(ミリ秒)
const time = 5000;


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

// answerボタンがクリックされた処理
$("#ans-btn").on("click", () => {
  stop = true;
  $('.popup').addClass('show').fadeIn();

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
  while(true){
    let quizNumber = quizIndex + 1;
    $("#Q").text("Q"+quizNumber);  
    await quizMain();
    if(quizIndex === max){
      break;
    }
  }
};

mainRoop();

// 出題部分
const syutudai = () => {
  return new Promise(resolve => {
    $("#quiz-area").text(' ');
    $("#ans-area").text('');
    $("#user-input-text").text(userAnswer);
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
    const intervalId = setInterval(async() => {
      str_output();
      if(counter === content.length){
        clearInterval(intervalId);
        // 待ち時間
        $("#countdown-bar").animate({width: "0%"}, time, function() {
          $(this).css({width:"100%"});
          // TODO ストップが押されたらanimateを中止する
          resolve();
        });

        // ans-btn が押された時の処理
        $("#ans-btn").on("click", function() {
          $("#countdown-bar").stop(async function() {
            await toAnswer();
            $(this).css({width: "100%"});
            resolve();
          })
        });
      }else if(stop) {
        clearInterval(intervalId);
        //TODO 回答処理、正答処理
        await toAnswer();
        resolve();

      }
    }, 100);
  })
}

let userAnswer = [];
let ansCount = 0;

function toAnswer(){
  // 正答
  return new Promise(resolve => {
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
      stop = false;
      ansCount = 0;
      userAnswer = [];
      resolve();  
      })();
  });
} 

function createAnswser(nowAnswerYomiEach){
  // 配列で4文字を作成する
  let randomAnswer = [];
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
        class: 'card text-center mx-1 justify-content-center',
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
  $('.card').on("click", async function() {
    let answer = $(this).data('text');
    userAnswer.push(answer);
    $("#user-input-text").text(userAnswer.join(""));
    $(".card").remove(); 
    if(userAnswer.length  === nowAnswerYomiEach.length || userAnswer[ansCount] !== nowAnswerYomiEach[ansCount]) await waitOneStep();
    ansCount++;
    resolve();
  });
  })
}

function waitOneStep() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  })
}


