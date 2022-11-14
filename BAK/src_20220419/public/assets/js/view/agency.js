/* #=========================================#
| Agency 사무소 : 목록 / 등록 / 수정          |
#=========================================# */
"use strict";

// Agency화면 상태 공유데이터
const tableWrapper = $("#agencyListTabel");

// 리스트
const List = (function () {
  const initialize = function(){
    App.Initialize.setListPage({
      cate: 'AGENCY',
      render: render,
    });
  };

  // 화면렌더링
  const render = function (page, searchOrganizationCode) {

    const reqOgranizationCode = searchOrganizationCode
      ? searchOrganizationCode
      : user.organizationCode;

    const view = new App.View('AGENCY',{
      table: tableWrapper,
      api: '/Manager/SelectAgencyManagementSimplePage',
      delapi: '/Manager/DeleteAgencyManagement',
      dataName: 'agencyManagementSimpleList',
      components: Components.agencyListItem,
      requestOpt: {
        organizationCode:
        searchOrganizationCode != 0 && searchOrganizationCode != undefined
          ? searchOrganizationCode
          : user.organizationCode,
        search: null,
        order: "DESC",
        pageNumber: page,
        count: global.pagination.count,
      },
    });

    view.ListRendering(page, reqOgranizationCode);

  }; //

  return {
    initialize: initialize,
    render: render,
  };
})();

// 등록, 수정
const Detail = (function () {

  // 초기화
  const initialize = function () {

    App.Initialize.setDetailPage({
      cate: 'AGENCY',
      name: '사무소',
      checkUrl: '/Manager/CheckBusinessDepartment'
    });

    render.DetailRendering({
      dataName: 'agencyManagement',
      redirectUrl: '/agency/agencyList.html',
      requestOpt: {
        organizationCode: global.param.organizationCode,
        agencyCode: global.param.agencyCode,
      },
      form: '#agencyDetail',
    });

  }; //

  // 화면렌더링
  const render = new App.View('AGENCY', {
    api: '/Manager/SelectAgencyManagement',
    updateApi: '/Manager/UpdateAgencyManagement',
    createApi: '/Manager/InsertAgencyManagement',
  });

  return {
    initialize: initialize,
  };
})();