const appver = "1.0.0";

const stylesheet = [
  '/common.css?ver=' + appver,
  '/assets/css/fonts.css?ver=' + appver,
  '/assets/css/layout.css?ver=' + appver,
  '/assets/css/default.css?ver=' + appver,
  '/assets/css/pages.css?ver=' + appver,
  '/assets/css/editor.css?ver=' + appver
]

function loadScript(src, callback) {

  var head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.src = src;
  script.onload = function(){
    callback(null, script)
  };
  script.onerror = function(){
    callback(new Error(src+"를 불러오는 도중 문제가 발생하였습니다."));
  }
  head.appendChild(script);
  
}

function loadStyle(src){

  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');

  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = src;

  head.appendChild(link);
  
}

loadScript('/js/common_functions.js?ver' + appver, step1);
function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/assets/js/cookie.js?ver' + appver, step2);
  }
}
function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/assets/js/common.lib.js?ver' + appver, step5);
  }
}/* 
function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/assets/js/common.struct.js?ver' + appver, step4);
  }
}
function step4(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/assets/js/common.modules.js?ver' + appver, step5);
  }
}*/
function step5(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/assets/js/components.js?ver' + appver, step6);
    
  }
} 
function step6(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/js/dictionary.js?ver' + appver, step7);
  }
}
function step7(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/js/api_functions.js?ver' + appver, step8);
  }
}
function step8(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('/assets/js/app.js?ver' + appver, step9);
  }
}
function step9(error, script) {

  if (error) {
    handleError(error);
  } else {
    // ...

    var url = decodeURIComponent(location.href);
    url = decodeURIComponent(url);
    var params = url.split("/");
    var cate = params[3];
    var arSplitFileName = cate.split(".");
    var fname = arSplitFileName[0];

    if(fname == ''){
      loadScript('/assets/js/view/login.js?ver' + appver, final);
      loadScript('/assets/js/view/member.js?ver' + appver, final);
    }else{
   //   loadScript('/assets/js/view/' + fname + '.js?ver' + appver, final);
    }

    for(var i=0; i< stylesheet.length; i++){
      loadStyle(stylesheet[i]);
    }
  }

}

function final(error, script) {

  var body = document.querySelector('body');
  body.classList.add('init');

  if (error) {
    handleError(error);
  } else {
    // ...
  }
  
}
