function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

function loadStructure() {
  var z, i, elmnt, file, xhttp;
  
  // 공통 인증처리
  var currentUrl = document.location.pathname;

  if (!cookie.getCookie("userAccount") && currentUrl.indexOf("login") == -1) {
    location.href = "/login.html";
    return;
  }
  else if(cookie.getCookie("userAccount") && (currentUrl.indexOf("login") != -1 || currentUrl == '/')){
    location.href = '/stiexp.html';
    return;
  }


  
  const user= cookie.getCookie('userAccount') ?cookie.getCookie('userAccount') : null;
  const is_staff = cookie.getCookie('is_staff') ? cookie.getCookie('is_staff') : "false";

  
  if(is_staff=="false"&&(currentUrl.indexOf("license") >0||currentUrl.indexOf("member") >0))
  {
    location.href = '/stiexp.html';
    return;
  }
  /*loop through a collection of all HTML elements:*/
  const elem_s = document.getElementsByClassName("page-sidebar");
  const elem_h = document.getElementsByClassName("page-header");
  const elem_f = document.getElementsByClassName("page-footer");
  const header_file = "/header.html";
  const nav_file = "/nav.html";
  const footer_file = "/footer.html";

  console.log('current user:::::', user_id);
  console.log('is_staff:::::', is_staff);
  
  if(currentUrl.indexOf("signup.html") == -1){
    /*make an HTTP request using the attribute value as the file name:*/

    if(elem_s.length != 0){
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var thtml = this.responseText;
            thtml=this.responseText
            thtml=thtml.replace('{userid}',user_id);
            cur_urlpath_arr=getLocation(location.href).pathname.split("/")

            if(cur_urlpath_arr.length==3)
              current_menu_group=cur_urlpath_arr[1];
            else
              current_menu_group="";

            if(cur_urlpath_arr.length==3)
              current_menu=cur_urlpath_arr[2].replace(".html","");
            else if(cur_urlpath_arr.length==2)
              current_menu=cur_urlpath_arr[1].replace(".html","");
            else
            current_menu="";

            

            thtml=thtml.replace('id="menu_group_'+current_menu_group+'" class="','id="menu_group_'+current_menu_group+'" class="active open ');
            thtml=thtml.replace('id="menu_'+current_menu+'"' ,'id="menu_'+current_menu+'" class="active"');
            elem_s[0].innerHTML = thtml;
            if(is_staff=="true")
            {
              $(".staff").removeClass("d-none");
              console.log(is_staff);
            }
          }
          if (this.status == 404) {
            elem_s[0].innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
        }
        /*exit the function:*/
        return;
      };
    }

    if(elem_h.length != 0){
      xhttp.open("GET", nav_file, true);
      xhttp.send();
      xhttp2 = new XMLHttpRequest();
      xhttp2.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            thtml=this.responseText
            thtml=thtml.replace('{userid}',user_id);
            elem_h[0].innerHTML =thtml;
    /*         if(currentUrl.indexOf("device\/")>0)
              current_menu_group="device1";
            else if(currentUrl.indexOf("deviceService\/")>0)
              current_menu_group="device2";
            else if(currentUrl.indexOf("deviceStatus\/")>0)
              current_menu_group="device3";
            else if(currentUrl.indexOf("member\/")>0)
              current_menu_group="member";
            else if(currentUrl.indexOf("organization\/")>0)
              current_menu_group="organization";
            else if(currentUrl.indexOf("agency\/")>0)
              current_menu_group="agency";
    */          
    /* 
            $('#menu_group_'+current_menu_group).addClass("active");
            $('#menu_group_'+current_menu_group).addClass("open");
            $('#menu_'+current_menu).addClass("active");    */
          }
          if (this.status == 404) {
            elem_h[0].innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
        }
        /*exit the function:*/
        return;
      };
    }

    if(elem_f.length != 0){
      xhttp2.open("GET", header_file, true);
      xhttp2.send();
      xhttp3 = new XMLHttpRequest();
      xhttp3.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elem_f[0].innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elem_f[0].innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
          Func.versionInfo('.ver');
        }
        /*exit the function:*/
        return;
      };
      xhttp3.open("GET", footer_file, true);
      xhttp3.send();
    }
  }
};

var prv_menu_id;
function toggleNavMenu(id) {
  if (prv_menu_id != id && prv_menu_id) {
    $("#menu_group_" + prv_menu_id).removeClass("open");
    $("#menu_group_" + prv_menu_id).removeClass("active");
  }

  if ($("#menu_group_" + id).hasClass("open"))
    $("#menu_group_" + id).removeClass("open");
  else $("#menu_group_" + id).addClass("open");

  if ($("#menu_group_" + id).hasClass("active"))
    $("#menu_group_" + id).removeClass("active");
  else $("#menu_group_" + id).addClass("active");

  prv_menu_id = id;
}

function refineDisplayValue(v) {
  if (v == null) {
    v = "";
  }

  return v;
}

function getPagingHTML(curpage, pagesize, totalcnt, pagingFunctionName) {
  var totalpagecnt = 0;
  if (totalcnt > 0) totalpagecnt = parseInt((totalcnt - 1) / pagesize) + 1;
  thtml = "";
  var spage = curpage - (curpage % 10) + 1;
  if (curpage % 10 == 0) spage = curpage - 9;
  var epage = spage + 9;
  if (epage > totalpagecnt) epage = totalpagecnt;
  if (curpage > 10) thtml += '<li class="page-item">';
  else thtml += '<li class="page-item disabled">';

  thtml +=
    '<a class="page-link" href="javascript:' +
    pagingFunctionName +
    "(" +
    eval(spage - 10) +
    ')" aria-label="Previous">';
  thtml += '<i class="fal fa-chevron-left"></i>';
  // '<span aria-hidden="true"><i class="fal fa-chevron-left"></i></span>';
  thtml += "</a>";
  thtml += "</li>";
  for (i = spage; i <= epage; i++) {
    if (i == curpage)
      thtml +=
        '<li class="page-item active" aria-current="page"><span class="page-link">' +
        i +
        '<span class="sr-only">(current)</span></span></li>';
    else
      thtml +=
        '<li class="page-item"><a class="page-link" href="javascript:' +
        pagingFunctionName +
        "(" +
        i +
        ')">' +
        i +
        "</a></li>";
  }

  if (epage < totalpagecnt) thtml += '<li class="page-item">';
  else thtml += '<li class="page-item disabled">';
  thtml +=
    '<a class="page-link" href="javascript:' +
    pagingFunctionName +
    "(" +
    eval(spage + 10) +
    ')" aria-label="Next">';
  thtml += '<i class="fal fa-chevron-right"></i>';
  // '<span aria-hidden="true"><i class="fal fa-chevron-right"></i></span>';
  thtml += "</a>";
  thtml += "</li>";
  return thtml;
}

function __numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function __getDateTimeFormatText(txt)
{
  if(!txt)
  return '';
  
var today = new Date();
  var theday = new Date(txt);

  var mm = theday.getMonth() + 1; // getMonth() is zero-based
  var dd = theday.getDate();
  var h = theday.getHours();
  var M = theday.getMinutes();
  var s = theday.getSeconds();

  var d;
  if (
    today.getMonth() == theday.getMonth() &&
    dd == today.getDate() &&
    today.getFullYear() == theday.getFullYear()
  ) {
    d = [
      (h > 9 ? "" : "0") + h,
      ":",
      (M > 9 ? "" : "0") + M,
      ":",
      (s > 9 ? "" : "0") + s,
    ].join("");
  } else {
    d = [
      /*       theday.getFullYear(),
             '-', */
      (mm > 9 ? "" : "0") + mm,
      "/",
      (dd > 9 ? "" : "0") + dd,
      " ",
    ].join("");
  }

  return d;
}

function logout() {
//  getAPI("/rest-auth/logout/", {}, function (res) {
    //if (res) {
      cookie.deleteCookie('accessToken')
      cookie.deleteCookie('userAccount')
      location.href = "/login.html";
    
    //}
  //});
}

var g_pass_validation_check;
function validateCheck(ctype, name) {
  item = $(ctype + "[name='" + name + "']");
  v = item.val();
  need_msg = '<div id="invalid-feedback-'+name+'" class="invalid-feedback">필수 입력 항목입니다.</div>';

  if (v == "") {
    g_pass_validation_check = false;
    item.addClass("is-invalid");
    item.after(need_msg);
  }

  return v;
}
function clear_valid_check() {
  g_pass_validation_check = true;
  $(".invalid-feedback").remove();
  $(".is-invalid").removeClass("is-invalid");
}
function isAllValidated() {
  return g_pass_validation_check;
}


function validCheckFunction()
{
    n=$( this ).attr("name");
    v = $( this ).val();

    $('#invalid-feedback-'+n).remove();
    if($( this ).hasClass("is-invalid"))
        $( this ).removeClass("is-invalid");

    need_msg = '<div id="invalid-feedback-'+n+'" class="invalid-feedback">필수 입력 항목입니다.</div>';
    if (v == "") {
        $('#'+n+'-feedback').hide();
        $( this ).addClass("is-invalid");
        $( this ).after(need_msg);
    }
}


var delayTimer;
function dupCheckFunction() {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(checkDup, 700); 
}


function showPasswordChangeModal()
{
  thtml='';
  thtml+='<div class="modal fade" id="password_update_modal" tabindex="-1" role="dialog" style="display: none;" data-modal-index="1" aria-hidden="true">';
  thtml+='<div class="modal-dialog modal-xs modal-dialog-centered" role="document">';
  thtml+='<div class="modal-content">';

  thtml+='<div class="modal-header">';
  thtml+='<h5 class="modal-title"></h5>';
  thtml+='<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
  thtml+='<span aria-hidden="true"><i class="fal fa-times"></i></span>';
  thtml+='</button>';
  thtml+='</div>';
  thtml+='<div class="modal-body">';

  thtml+='<table class="table table-bordered">';
  thtml+='<tbody>';
  thtml+='<tr>';
  thtml+='<td style="width:40%">변경할 비밀번호</td><td style="width:60%">';
  thtml+='<input name="password1" id="password1" type="password" class="form-control">';
  thtml+='</td>';
  thtml+='</tr>';
  thtml+='<tr>';
  thtml+='<td style="width:40%">비밀번호 확인</td><td style="width:60%">';
  thtml+='<input name="password2" id="password2" type="password" class="form-control">';
  thtml+='</td>';
  thtml+='</tr>';

  thtml+='</tbody>';
  thtml+='</table>';
  thtml+='</div>';
  thtml+='<div class="modal-footer">';
  thtml+='<button type="button" class="btn btn-primary waves-effect waves-themed" onclick="updateUserPassword()">비밀번호 수정</button>';
  thtml+='<button type="button" class="btn btn-secondary waves-effect waves-themed" data-dismiss="modal">취소</button>';
  thtml+='</div>';
  thtml+='</div>';
  thtml+='</div>';
  thtml+='</div>';
  
  $("body").append(thtml);
  
    $("#password_update_modal").modal();
}
function updateUserPassword()
{
    if($("#password1").val()!=$("#password2").val())
        alert("비밀번호가 동일하지 않습니다.");
    else
    {

      nv=$("#password1").val();
      if(passwordValidationCheck(nv))
      {
        obj={"requestUserCode":user.userCode,"userCode":user.userCode,"password":nv,"encryption":0};
        getAPI("/Manager/UpdatePassword",obj,function(data){
                alert("변경되었습니다.");
                
                $("#password_update_modal").modal('hide');
                
        });
      }
    }
     


}

function passwordValidationCheck(pass)
{
  
  var paswd=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/;
  if(pass.match(paswd)) 
  { 
    return true;
  }
  else
  { 
    alert("패스워드는 영문,숫자,특수문자의 조합으로 6자~15자 사이로 구성되어야 합니다.");
    return false;
  }

}

