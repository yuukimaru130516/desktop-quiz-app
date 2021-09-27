'use strict';

// main 処理
// モジュール読み込み
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// TODO トップ画面
$(function(){
  $("#quiz_question").hide();
  $('#ans').on('click', () => {
    $("#quiz_question").show(100);
    });

  $("#ques").hide();
  const stdQuiz = $("#ques").text();
  // 出題
  syutudai(stdQuiz);
  
  
  
});

// 出題部分
const syutudai = (stdQuiz) => {
  return new Promise(resolve => {
    let content = [];
    let counter = 0;

    for(let i in stdQuiz){
      content.push(stdQuiz[i]);
    }


    const str_output = () => {
      $("<div>", {
        class: 'quiz',
        text: content[counter]
      }).appendTo('#quiz-area');
      counter++;
    }

    
    const intervalId = setInterval(() => {
      str_output();
      if(counter === content.length){
        clearInterval(intervalId);
        resolve();
      }
    }, 100);
  })
}
