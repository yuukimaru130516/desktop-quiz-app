'use strict';

// main 処理
// モジュール読み込み
import $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";


let num = 0;


// TODO トップ画面
$(function(){
  $("#quiz_question").hide();
  $('#ans').on('click', () => {
    $("#quiz_question").show(100);
    });
});