let api_base_url; 

    api_base_url="http://localhost:8000"   // test

let user_id = cookie.getCookie('userAccount') ? cookie.getCookie('userAccount') : '';
let defaultValue;
let defaultValue2;
var api_client_ip="";
var api_requestUserCode='';
var api_organizationCode='';
var api_token=cookie.getCookie('accessToken');
var consecutive_login_error_cnt=0;
const api_gmtCode='GMT+0900';
const api_countryCode='KR';
const api_countryName='Korea';
const api_timezone='Asia/Seoul';

if(user_id){
    defaultValue  = {
        key: api_token
    }
}
//for registration
defaultValue2  = {
    requestDateTime:_getCurrentDateTime(),
}


var _____last_id='';
var _____last_pass='';


function _getSystemTime()
{
    return Date.now();
}
function _getDeviceKindCode()
{
    return 3;
}
function _recoveredSession(data)
{
    if(data.message=='SESSION_CLOSED')
    {
        if(consecutive_login_error_cnt<2)
        {
            consecutive_login_error_cnt++;
            autoLogin();
            return 1;
        }
    }
    return 0;
}
function _getCurrentDateTime()
{
    var today = new Date();
    var mm = today.getMonth() + 1; // getMonth() is zero-based
    var dd = today.getDate();
    var h = today.getHours();
    var M = today.getMinutes();
    var s = today.getSeconds();
    var d= [today.getFullYear(),
        '-',
        (mm>9 ? '' : '0') + mm,
        '-',
        (dd>9 ? '' : '0') + dd,
        ' ',
        (h>9 ? '' : '0') + h,
        ':',
        (M>9 ? '' : '0') + M,
        ':',
        (s>9 ? '' : '0') + s
         ].join('');
    return d;
}



function getAPI_withoutUserCodePatchSync(url,obj,onSuccessFunc,onErrorFunc){
    let state = obj;

    $.ajax({
        url: api_base_url+url,
        type: "PATCH",
        cache:false,
        async: false,
        timeout : 30000, 
        headers: {
            "Content-Type":"application/json"
          //  'SX-Auth-Token': api_token,
          //  'SX-Client-IP':api_client_ip
        },
        dataType:"json",
        data:JSON.stringify(state),
        success: function(data){

                onSuccessFunc(data);

        },
        error:function(request,status,error){
            onErrorFunc(request.responseText);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}


function getAPI_withoutUserCodeGetSync(url,obj,onSuccessFunc,onErrorFunc){
    let state = defaultValue2;


    if(obj){
      
        state = [defaultValue2, obj].reduce(function (r, o) {
            Object.keys(o).forEach(function (k) {
                r[k] = o[k];
            });
            return r;
        }, {});
    }

   

    $.ajax({
        url: api_base_url+url,
        type: "GET",
        cache:false,
        async: false,
        timeout : 30000, 
        headers: {
            "Content-Type":"application/json"
          //  'SX-Auth-Token': api_token,
          //  'SX-Client-IP':api_client_ip
        },
        dataType:"json",
        data:JSON.stringify(state),
        success: function(data){

                onSuccessFunc(data);

        },
        error:function(request,status,error){
            onErrorFunc(request.responseText);
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}
function getAPI_withoutUserCode(url,obj,onSuccessFunc,onErrorFunc){
    let state = defaultValue2;


    if(obj){
        console.log("obj"); console.log(obj);
        state = [defaultValue2, obj].reduce(function (r, o) {
            Object.keys(o).forEach(function (k) {
                r[k] = o[k];
            });
            return r;
        }, {});
    }

   

    $.ajax({
        url: api_base_url+url,
        type: "POST",
        cache:false,
        timeout : 30000, 
        headers: {
            "Content-Type":"application/json"
          //  'SX-Auth-Token': api_token,
          //  'SX-Client-IP':api_client_ip
        },
        dataType:"json",
        data:JSON.stringify(state),
        success: function(data){

                onSuccessFunc(data);

        },
        error:function(request,status,error){
            onErrorFunc(JSON.parse(request.responseText));
            
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

function getAPI3(url,obj,rtype,onSuccessFunc, onErrorFunc){
    if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());
  
    let state = defaultValue;
/* 
    if(obj){
        state = [defaultValue, obj].reduce(function (r, o) {
            Object.keys(o).forEach(function (k) {
                r[k] = o[k];
            });
            return r;
        }, {});
    }
    if(url.indexOf("http")>-1) */
        state = obj;

 var turl=api_base_url+url; 
 if(url.indexOf("http")>-1)
    turl=url;

    $.ajax({
        url: turl,
        type: rtype,
        cache:false,
        timeout : 300000, 
        headers: {
            "Content-Type":"application/json;charset=UTF-8",
            "Authorization": "Bearer "+defaultValue.key
        },
  
        dataType:"json",
        data:JSON.stringify(state),
        success: function(data){
                $(".spinner-grow").remove();
                onSuccessFunc(data);
        },
        error:function(request,status,error){
            if(request.status==401)
                logout();
            onErrorFunc();
          
        }
    });
  }
function getAPI2(url,obj,rtype,onSuccessFunc){
    if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());
  
    let state = defaultValue;

    /* if(obj){
        state = [defaultValue, obj].reduce(function (r, o) {
            Object.keys(o).forEach(function (k) {
                r[k] = o[k];
            });
            return r;
        }, {});
    } */
/*     if(url.indexOf("http")>-1) */
      //  state = obj;

 var turl=api_base_url+url; 
 if(url.indexOf("http")>-1)
    turl=url;

    $.ajax({
        url: turl,
        type: rtype,
        cache:false,
        timeout : 300000, 
        headers: {
            "Content-Type":"application/json;charset=UTF-8",
            "Authorization": "Bearer "+defaultValue.key
        },
  
        dataType:"json",
        data:obj,
        success: function(data){
                $(".spinner-grow").remove();
                onSuccessFunc(data);
        },
        error:function(request,status,error){
            if(request.status==401)
                logout();
           
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
  }
  function getAPI_sync(url,obj,rtype,onSuccessFunc){
    if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());
  
    let state = defaultValue;

    /* if(obj){
        state = [defaultValue, obj].reduce(function (r, o) {
            Object.keys(o).forEach(function (k) {
                r[k] = o[k];
            });
            return r;
        }, {});
    } */
/*     if(url.indexOf("http")>-1) */
      //  state = obj;

 var turl=api_base_url+url; 
 if(url.indexOf("http")>-1)
    turl=url;

    $.ajax({
        url: turl,
        async:false,
        type: rtype,
        cache:false,
        timeout : 300000, 
        headers: {
            "Content-Type":"application/json;charset=UTF-8",
            "Authorization": "Bearer "+defaultValue.key
        },
  
        dataType:"json",
        data:obj,
        success: function(data){
            $(".spinner-grow").remove();
            onSuccessFunc(data);
        },
        error:function(request,status,error){
            if(request.status==401)
                logout();
           
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
  }
  function patchAPI(url,obj,onSuccessFunc){
    if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());

    var turl=api_base_url+url; 
    if(url.indexOf("http")>-1)
       turl=url;
   
    $.ajax({
        url: turl,
        type: "PATCH",
        cache:false,
        timeout : 300000, 
        headers: {
            "Content-Type":"application/json;charset=UTF-8",
            "Authorization": "Bearer "+defaultValue.key
        },
       // processData:false,
        dataType:"json",
        data:JSON.stringify(obj),
        success: function(data){
                $(".spinner-grow").remove();
                onSuccessFunc(data);
        },
        error:function(request,status,error){
            if(request.status==401)
                logout();
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
  }
  
  function deleteAPI(url,obj,onSuccessFunc){
    if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());

    var turl=api_base_url+url; 
    if(url.indexOf("http")>-1)
       turl=url;
   
    $.ajax({
        url: turl,
        type: "DELETE",
        cache:false,
        timeout : 300000, 
        headers: {
            "Content-Type":"application/json;charset=UTF-8",
            "Authorization": "Bearer "+defaultValue.key
        },
       // processData:false,
        dataType:"json",
        data:JSON.stringify(obj),
        success: function(data){
                $(".spinner-grow").remove();
                onSuccessFunc(data);
        },
        error:function(request,status,error){
            if(request.status==401)
                logout();
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
  }
  
  
  function uploadFile(){
    var form = $('#FILE_FORM')[0];
    var formData = new FormData(form);
    formData.append("fileObj", $("#FILE_TAG")[0].files[0]);
    formData.append("fileObj2", $("#FILE_TAG2")[0].files[0]);

    $.ajax({
        url: '',
                processData: false,
                contentType: false,
                data: formData,
                type: 'POST',
                success: function(result){
                    alert("업로드 성공!!");
                }
        });
}


  function uploadAPI(url,form_id,onSuccessFunc){
    if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());
        var turl=api_base_url+url; 
        if(url.indexOf("http")>-1)
        turl=url;
    
        var form = $('#'+form_id)[0]
        var data = new FormData(form);
console.log(data);
        $.ajax({
            url: turl,
            type: "POST",
            enctype: 'multipart/form-data',
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            headers: {
                //"Content-Type":"application/json;charset=UTF-8",
                "Authorization": "Bearer "+defaultValue.key
            },
        // processData:false,
            dataType:"json",
         //   data:JSON.stringify(obj),
            success: function(data){
                    $(".spinner-grow").remove();
                    onSuccessFunc(data);
            },
            error:function(request,status,error){
                if(request.status==401)
                    logout();
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
  }
function postAPI(url,obj,onSuccessFunc){
    if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());

    var turl=api_base_url+url; 
    if(url.indexOf("http")>-1)
       turl=url;
   
    $.ajax({
        url: turl,
        type: "POST",
        cache:false,
        timeout : 300000, 
        headers: {
            "Content-Type":"application/json;charset=UTF-8",
            "Authorization": "Bearer "+defaultValue.key
        },
       // processData:false,
        dataType:"json",
        data:JSON.stringify(obj),
        success: function(data){
                $(".spinner-grow").remove();
                onSuccessFunc(data);
        },
        error:function(request,status,error){
            if(request.status==401)
                logout();
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
  }
  
  
function getAPI(url,obj,onSuccessFunc){
  if ($(".spinner-grow").length < 1) $(".subheader + .panel").append(Components.spinner());

/*   let state = defaultValue;
  if(obj){
      state = [defaultValue, obj].reduce(function (r, o) {
          Object.keys(o).forEach(function (k) {
              r[k] = o[k];
          });
          return r;
      }, {});
  } */

  $.ajax({
      url: api_base_url+url,
      type: "POST",
      cache:false,
      timeout : 300000, 
      headers: {
            "accept": "application/json",
          "Content-Type":"application/json;charset=UTF-8",
          "Authorization": "Bearer "+defaultValue.key
      },
      dataType:"json",
      data:JSON.stringify(obj),
      success: function(data){
              $(".spinner-grow").remove();
              onSuccessFunc(data);
      },
      error:function(request,status,error){
        if(request.status==401)
        logout();
          console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      }
  });
}



function getAPI_AccountLogin_Sync(id,pass,onSuccessFunc)
{
    _____last_id=id;
    _____last_pass=pass;
    $.ajax({
        url: api_base_url+"/token",
        type: "POST",
        async: false,
        cache:false,
        timeout : 30000, 
        headers: {
            "Content-Type":"application/x-www-form-urlencoded",
     
        },
        //dataType:"json",
        data:{
            "username":id,
            "password":pass,

        },
        success: onSuccessFunc,
        error:function(request,status,error){
            console.log(error);
            alert("Please check your ID or Password.");
        }
    });
}