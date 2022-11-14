/* #=========================================#
| Member 회원 : 목록 / 등록 / 수정            |
#=========================================# */
"use strict";

const tableWrapper = $("#memberListTable");

// 리스트
const List = (function () {

  // 최초화면접속
  const initialize = function () {
    App.Initialize.setListPage({
      cate: 'MEMBER',
      render: render,
    });
  };

  // 화면 렌더링
  const render = function (page, searchOrganizationCode) {

    const view = new App.View('MEMBER',{
      table: tableWrapper,
      api: '/Manager/SelectAccountSimplePage',
      delapi: '/Manager/DeleteAccount',
      dataName: 'userAccountSimpleList',
      components: Components.memberListItem,
      requestOpt: {
        organizationCode: searchOrganizationCode != 0 && searchOrganizationCode != undefined ? searchOrganizationCode : user.organizationCode,
        order: "DESC",
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


// 등록/수정
const Detail = (function () {

  // 최초 페이지 접속
  const initialize = function () {

    App.Initialize.setDetailPage({
      cate: 'MEMBER',
      name: '회원',
      checkUrl: '/Manager/CheckAccount'
    });

    render.DetailRendering({
      dataName: 'userAccount',
      requestOpt: {
        organizationCode: global.param.organizationCode,
        userCode: global.param.userCode,
      },
      redirectUrl: '/member/memberList.html',
      form: '#memberDetail',
    });
    
  };

  // 화면 렌더링
  const render = new App.View('MEMBER', {
    api: '/Manager/SelectAccount',
    updateApi: '/Manager/UpdateAccount',
    createApi: '/Manager/CreateAccount',
  });

  return {
    initialize: initialize,
  };
})();