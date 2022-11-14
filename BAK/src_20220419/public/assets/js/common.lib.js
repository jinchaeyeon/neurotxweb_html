const Func = (function () {
  "use strict";

  const modal = (function(){

    const modalPopup = $('.modal');
  
    const modalClose = function(){
      modalPopup.modal('hide');
    }
    const modalOpen = function(){
      modalPopup.modal();
    }
  
    return {
      modalClose: modalClose,
      modalOpen: modalOpen
    }
  })();

  // 버전표시
  const versionInfo = function(versionEl) {
    $(versionEl).text("Version. " + appver);
  };//

  const getUrlParam = function(){
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str,key,value) {
      params[key] = decodeURIComponent(value);
    });
    return params;
  }


  const searchHandler = function(searchform, render) {
    
    let form;

    $(searchform).find('input, select').each(function (i) {
      const self = $(this);

      self.off().on('change', function(){

        form = formParser(searchform);
        searchOption = form;
        global.pagination.current = 1;
        localStorage.setItem('search', JSON.stringify(form));

        console.log('form', form);

        render(global.pagination.current);
      });
    });
    
  }

  const checkedAllHandle = function(checkbox){
    let isChecked = false;
    const deleteButton = $('.deleteHandle');

    $('.checkedAll').on('click', function(){
      const self = $(this);

      if(!isChecked){
        isChecked = true;
        self.text('전체선택해제');
        deleteButton.show();
        checkbox.prop('checked', true);
      }else{
        isChecked = false;
        self.text('전체선택');
        deleteButton.hide();
        checkbox.prop('checked', false);
      }
    });
  }

  const orgReflesh = function () {
    $('[name="organizationCode"]').val(global.user.organizationCode);
    $('[name="organizationCode"]').trigger('change');
  };

  const formParser = function (wrap) {
    const form = {};

    $(wrap)
      .find("input, select, textarea")
      .each(function (i) {
        const name = $(this).attr("name");
        form[name] = $('[name="' + name + '"]').val();

        if($('[name="' + name + '"]').attr('type') == 'radio'){
          form[name] = $('[name="' + name + '"]:checked').val();
        }
        // if (name == "agencyCode") {
          if($('[name="' + name + '"]').val() == 0) form[name] = null;
        // }else{
          // if($('[name="' + name + '"]').val() == '') {
          //   form[name] = null;
          // }
        // }
      });

    return form;
  };

  const formInit = function (wrap, obj) {
    Object.keys(obj).forEach(function (key) {
      const value = obj[key];


      $(wrap)
        .find('[name="' + key + '"]')
        .val(value);
    });
  };//

  const titleChange = function (el, text) {
    $('.subheader-title').find(".subheader-icon").after(" " + text);
    $('button[type="submit"]').find("small").text(text);
  };//

  const fetch_unix_timestamp = function(date){
    return Math.floor(date.getTime() / 1000);
  }

  const phoneNumber = function(el){
    el.val(el.val().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-") );
  }

  const emailValidate = function(el){
    const check = $('.email-valid');

    check.off().on('keyup', function(e){
      const self = $(this);
      const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

      if(self.val() != ''){

        if(regExp.test(self.val())){
          self.removeClass('is-invalid').addClass('is-valid');
        }else{
          self.removeClass('is-valid').addClass('is-invalid');
          self.nextAll(".invalid-feedback").text("이메일 형식이 잘못되었습니다.");
        }

      }else{

        self.nextAll(".invalid-feedback").text("필수입력 항목 입니다.");
        
      }
    });
  }

  const submitButtonChange = function (el) {
    switch (pageState.type) {
      case "create":
        el.submitButton.text("등록");
        break;
      case "modify":
        el.submitButton.text("수정");
        break;
      default:
        break;
    }
  };//

  const existCheck = function (url, organizationCode) {
    const input = $(".validate");
    let value = {
      organizationCode: organizationCode != 0 && organizationCode != undefined ? organizationCode : user.organizationCode,
    };

    let timeout = 0;
    input.off("keyup").off().on("keyup", function (e) {
      const self = $(this);
      const name = self.attr("name");

      value[name] = self.val();

      if (self.val() != "") {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function () {
          if (self.val() == "") return;

          getAPI(url, value, function (res) {
            successFunc(res, name);
          });
        }, 700);
      } else {
        self.removeClass("is-valid");
        self.nextAll(".invalid-feedback").text("필수입력 항목 입니다.");
      }
    });

    const successFunc = function (res, name) {
      const text = $('[name="' + name + '"]')
        .prev(".form-label")
        .contents()[0]
        .textContent.trim();

      if (res.result) {
        $('[name="' + name + '"]')
          .nextAll(".valid-feedback")
          .text('사용가능한 "' + text + '"입니다.');
        $('[name="' + name + '"]')
          .removeClass("is-invalid")
          .addClass("is-valid");
      } else {
        $('[name="' + name + '"]')
          .nextAll(".invalid-feedback")
          .text(
            '"' +
              text +
              '"가 중복되었습니다. 다른 "' +
              text +
              '"를 입력해주세요.'
          );
        $('[name="' + name + '"]')
          .removeClass("is-valid")
          .addClass("is-invalid");
      }
    };
  };//

  const passwordValidate = function () {
    const check = $('[name="passwordMatch"]');
    const password = $('[name="password"]');

    check.off().on("keyup", function (e) {
      const self = $(this);

      if (pageState.type == "create") {
        if (self.attr("name") == "passwordMatch") {
          if (self.val() == "") {
            self.removeClass("is-valid").addClass("is-invalid");
            self
              .nextAll(".invalid-feedback")
              .text("비밀번호 일치여부 확인은 필수입니다.");
          } else if (password.val() != self.val()) {
            self.removeClass("is-valid").addClass("is-invalid");
            self
              .nextAll(".invalid-feedback")
              .text("비밀번호를 다르게 입력하셨습니다.");
          } else {
            self.removeClass("is-invalid").addClass("is-valid");
            self.nextAll(".valid-feedback").text("비밀번호가 일치합니다..");
          }
        } else {
          if (self.val() == "") {
            self.removeClass("is-valid").addClass("is-invalid");
            self.nextAll(".invalid-feedback").text("필수입력 항목 입니다.");
          } else {
            self.removeClass("is-invalid");
          }
        }
      }
    });
  };

  const formCheck = function (id) {
    let isValidate = true;
    const check = $(id).find(".check");
    const password = $('[name="password"]');

    check.on("change", function () {
      const self = $(this);
      const name = self.attr("name");
      if (self.val() != "" && name != "passwordMatch") {
        self.removeClass("is-invalid");
      }
    });

    // if (pageState.type == "create") {
      for (let i in check) {
        const input = $(".check:eq(" + i + ")");

        if (input.val() == "") {
          isValidate = false;
          input.removeClass("is-valid").addClass("is-invalid");
          input.nextAll(".invalid-feedback").text("필수입력 항목 입니다.");
          input.focus();
          // break;
        }

        if (input.attr("name") == "passwordMatch") {
          if (password.val() != input.val()) {
            isValidate = false;
            input.addClass("is-invalid");
            input.focus();
          }
        }
      }
    // }

    return isValidate;
  };

  const pagination = function (
    totalData,
    dataPerPage,
    pageCount,
    currentPage,
    successFunc
  ) {

    var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹
    
    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if(last > totalPage) last = totalPage;

    var first = last - (pageCount-1) < 1 ? 1 : last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last+1;
    var prev = first-1;

    const prvDisabled = prev < 1 ? " disabled" : "";
    const nextDisabled = last == totalPage ? " disabled" : "";

    const currentActive = function (i) {
      return global.pagination.current == i ? " active" : "";
    };

    var pagingView = $("#pagination");
    var html = "";
    // if(prev > 0)
    html +=
      '<li class="page-item' +
      prvDisabled +
      '"><a class="page-link" href="#" aria-label="Previous"><i class="fal fa-chevron-left"></i></a></li>';

    for (let i = first; i <= last; i++) {
      html +=
        '<li class="page-item' +
        currentActive(i) +
        '" aria-current="page"><span class="page-link">' +
        i +
        "</span></li>";
    }

    // if(last < totalPage)
    html +=
      '<li class="page-item' +
      nextDisabled +
      '"><a class="page-link" href="#" aria-label="Next"><i class="fal fa-chevron-right"></i></a></li>';

    pagingView.html(html); // 페이지 목록 생성
    pagingView.find("li").click(function () {
      const $item = $(this);
      const $id = $item.find("a").attr("aria-label");
      // var pager = $item.attr('aria-current');
      let selectedPage = $item.children("span").text();
      global.pagination.current = selectedPage;

      if ($id == "Previous") {
        if (prev < 1) return;
        global.pagination.current = prev;
        selectedPage = prev;
      }

      if ($id == "Next") {
        if (last == totalPage) return;
        global.pagination.current = next;
        selectedPage = next;
      }
      successFunc(selectedPage);
    });
  };

  return {
    modal:modal,
    phoneNumber:phoneNumber,
    emailValidate:emailValidate,
    versionInfo:versionInfo,
    getUrlParam:getUrlParam,
    searchHandler:searchHandler,
    checkedAllHandle:checkedAllHandle,
    orgReflesh:orgReflesh,
    formInit:formInit,
    formParser:formParser,
    pagination:pagination,
    titleChange:titleChange,
    submitButtonChange:submitButtonChange,
    formCheck:formCheck,
    passwordValidate:passwordValidate,
    existCheck:existCheck,
  };
})();
