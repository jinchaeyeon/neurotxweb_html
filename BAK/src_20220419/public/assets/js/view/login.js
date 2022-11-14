/* #=========================================#
| Login 로그인                                |
#=========================================# */
"use strict";

const Login = function () {
  let id = $("input[name=id]"),
  pw = $("input[name=password]"),
  saveidChk = $('[name="saveid"]');

  Func.versionInfo(" .ver");

  // 저장된 쿠키값을 가져와서 ID 칸에 넣어준다. 없으면 공백으로 들어감.
  var key = cookie.getCookie('key');
  id.val(key); 

  if(id.val() != ''){ // 그 전에 ID를 저장해서 처음 페이지 로딩 시, 입력 칸에 저장된 ID가 표시된 상태라면,
    saveidChk.prop('checked', true); // ID 저장하기를 체크 상태로 두기.
  }

   // 체크박스에 변화가 있다면,
  saveidChk.on('change', function(e){
    const self = $(this);
    if(self.is(':checked')){ // ID 저장하기 체크했을 때,
        cookie.setCookie('key', id.val(), 7); // 7일 동안 쿠키 보관
    }else{ // ID 저장하기 체크 해제 시,
      cookie.deleteCookie('key');
    }
  });

  // ID 저장하기를 체크한 상태에서 ID를 입력하는 경우, 이럴 때도 쿠키 저장.
  id.on('keyup', function(){ // ID 입력 칸에 ID를 입력할 때,
    if(saveidChk.is(':checked')){ // ID 저장하기를 체크한 상태라면,
      cookie.setCookie('key', id.val(), 7); // 7일 동안 쿠키 보관
    }
  });

  var handleSubmit = function (e) {
    id = $("input[name=id]").val();
    pw = $("input[name=password]").val();
    getAPI_AccountLogin_Sync(id, pw, function (data) {
      console.log(data);
      if (data.access_token) {
        $(".login").removeClass("is-invalid");
        cookie.setCookie('userAccount', id,1);
        cookie.setCookie('accessToken', data.access_token,1);

        defaultValue  = {
          key: data.access_token
      };
      
        getAPI2("/users/me",{},"GET",function(data){
        
            cookie.setCookie('is_staff', data.is_staff,1);
         
            location.href = "/stiexp.html";
        });


        
      } else {
        $(".login").addClass("is-invalid");
      }
    });
    e.preventDefault();
  };
  

  $("#loginForm").on("submit", handleSubmit);
};