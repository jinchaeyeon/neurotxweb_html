/* #=========================================#
| Account 회원관련 공통 : 등록 / 수정            |
#=========================================# */
"use strict";

// 등록/수정
const Account = (function () {

  // 패스워드 찾기
  const findPassword = (function(){
    // COMMON VARIABLE
    const form = $('#findPasswordForm');

    // 최초 페이지 접속
    const initialize = function () {
      Func.versionInfo(".ver");

      form.submit(handleSubmit);
    };


    // SUBMIT
    const handleSubmit = function(e){
      e.preventDefault();

      const formData = Func.formParser(form);
      if(Func.formCheck(form)){
        getAPI(
          '/AccountUtil/FoundAccountPassword',
          formData, function(res){
            if(res.result){
             // alert('등록하신 이메일로 비밀번호를 전송하였습니다.');
              location.href = '/login.html';
            }else{
              alert('등록하신 아이디 또는 이메일이 정확하지 않습니다.');
            }
        });
      }
    }

    return initialize;
  })();

  // 아이디 찾기
  const findId = (function(){
    // COMMON VARIABLE
    const form = $('#findIdForm');

    // 최초 페이지 접속
    const initialize = function () {
     // Func.versionInfo(".ver");

      form.submit(handleSubmit);
    };


    // SUBMIT
    const handleSubmit = function(e){
      e.preventDefault();

      const formData = Func.formParser(form);
      if(Func.formCheck(form)){
        
        getAPI_withoutUserCode(
          '/findid/'+formData.email,
          {}, function(res){
            if(res){
              alert('회원님의 아이디는 '+res+' 입니다.');
             // alert('등록하신 이메일로 아이디를 전송하였습니다.');
              location.href = '/login.html';
            }else{
              alert('등록하신 이메일이 정확하지 않습니다.');
            }
        },function(){

          alert('등록하신 이메일이 정확하지 않습니다.');
        });
      }
    }

    return initialize;
  })();

  return {
    findPassword: findPassword,
    findId: findId,
  };
})();
