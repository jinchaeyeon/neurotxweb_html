/* #=========================================#
| 공지사항 : 목록 / 등록 / 수정                |
#=========================================# */
"use strict";

const tableWrapper = $("#noticeListTable");
let currentSearch;

// 리스트
// 리스트
const List = (function () {

  // 최초화면접속
  const initialize = function () {
    App.Initialize.setListPage({
      cate: 'NOTICE',
      render: render,
    });
  };

  // 화면 렌더링
  const render = function (page, searchOrganizationCode) {

    const view = new App.View('NOTICE',{
      table: tableWrapper,
      api: '/Board/SelectNoticeSimplePage',
      delapi: '/Board/DeleteNotice',
      dataName: 'noticeSimpleList',
      components: Components.noticeListItem,
      requestOpt: {
        noticeLevel: 1,
        search: null,
        order: "DESC",
        orderParameter: 'dateTime',
        pageNumber: page,
        count: global.pagination.count,
      },
    });

    view.ListRendering(page, searchOrganizationCode);
    
  }

  return {
    initialize: initialize,
    render: render,
  };
})();

// 등록, 수정
const Detail = (function () {
  let state = {
    noticeLevel: 1
  };

  // 초기화
  const initialize = function () {
    pageState.type = "create";
    pageState.cate = "NOTICE";
    pageState.name = "공지사항 등록";
    CKEDITOR.replace('body', options.editor);
    const cancelButton = $('button.cancel');
    cancelButton.on('click', function(e){
      console.log(111);
      localStorage.setItem("switchModify", "return");
      location.href = '/notice/noticeList.html';
    });

    render();
  }; //

  // 화면렌더링
  const render = function () {

    // ##### 수정화면
    if (pageState.type != "list") {
      if (global.param.noticeCode) {
        pageState.type = "modify";
        pageState.name = "공지사항 수정";

        getAPI(
          "/Board/SelectNotice",
          {
            noticeCode: global.param.noticeCode,
          },
          function (res) {
            state = res.notice;
            Func.formInit("#noticeDetail", state);
          }
        );
      }
    } // e: ##### 수정화면

    Func.titleChange(Components.common, pageState.name);
    Func.submitButtonChange(Components.common);
    $("#noticeDetail").submit(handleSubmit);
  }; //


  // 서브밋 핸들러
  const handleSubmit = function (e) {
    e.preventDefault();
    
    state.title = $('[name="title"]').val();
    state.body = CKEDITOR.instances.body.getData();

    if (Func.formCheck("#noticeDetail")) {

      // 수정
      if (global.param.noticeCode) {
        getAPI("/Board/UpdateNotice", state, function (res) {
          if (res.result) {
            alert("수정되었습니다.");
            localStorage.setItem("switchModify", "return");
            location.href = "/notice/noticeList.html";
          } else {
            alert(res.message);
          }
        });
        
      } else { // 등록
        
        getAPI("/Board/InsertNotice", state, function (res) {
          if (res.result) {
            alert("등록 되었습니다.");
            location.href = "/notice/noticeList.html";
          } else {
            alert(res.message);
          }
        });
      }
    }
  }; //

  return {
    initialize: initialize,
  };
})();


// 보기페이지
const View = (function () {
  let state = {};
  const contentWrapper = $('.subheader + .panel');

  // 초기화
  const initialize = function () {
    pageState.cate = "NOTICE";
    pageState.type = "view";
    pageState.name = "공지사항";

    render();
  }; //

  // 화면렌더링
  const render = function () {
    getAPI(
      "/Board/SelectNotice",
      {
        noticeCode: global.param.noticeCode,
      },
      function (res) {
        state = res.notice;

        contentWrapper.find('.panel-hdr h2').text(state.title)
        contentWrapper.find('.panel-container > .panel-content .date').prepend(state.dateTime)
        contentWrapper.find('.panel-container > .panel-content .author').prepend(state.name)
        contentWrapper.find('.panel-container > .panel-content.body').prepend(state.body)
      }
    );

    Func.titleChange(Components.common, pageState.name);
    Func.submitButtonChange(Components.common);
  }; //

  return {
    initialize: initialize,
  };
})();
