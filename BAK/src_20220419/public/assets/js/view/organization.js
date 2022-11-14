/* #=========================================#
| Organization 기관 : 목록 / 등록 / 수정      |
#=========================================# */
"use strict";

// Organization화면 상태 공유데이터
const tableWrapper = $("#organizationListTable");

// 리스트
const List = (function () {
  const initialize = function () {
    App.Initialize.setListPage({
      cate: 'ORGANIZATION',
      render: render,
    });
  };

  const render = function (page, searchOrganizationCode) {

    const reqOgranizationCode = searchOrganizationCode
      ? searchOrganizationCode
      : user.organizationCode;
    
    const view = new App.View('ORGANIZATION',{
      table: tableWrapper,
      api: '/Manager/SelectClientOrganizationSimplePage',
      delapi: '/Manager/DeleteOrganization',
      dataName: 'organizationSimpleList',
      components: Components.organizationListItem,
      requestOpt: {
        organizationCode: reqOgranizationCode,
        // departmentCode: global.user.departmentCode,
        orderParameter: "dateTime",
        order: "DESC",
        pageNumber: page,
        count: global.pagination.count,
        includeMyOrg: false,
      },
    });

    view.ListRendering(page, searchOrganizationCode);

  };

  return {
    initialize: initialize,
    render: render,
  };
})();


// 등록, 수정
const Detail = (function () {

  const initialize = function () {

    App.Initialize.setDetailPage({
      cate: 'ORGANIZATION',
      name: '기관',
      checkUrl: '/Manager/CheckAccount'
    });

    render.DetailRendering({
      dataName: 'organization',
      requestOpt: {
        organizationCode: selectOrgState.selectedOrganizationCode
          ? selectOrgState.selectedOrganizationCode : global.user.organizationCode,
        clientOrgCode: global.param.organizationCode,
      },
      redirectUrl: '/organization/organizationList.html',
      form: '#organizationDetail',
    });
    
  };

  const render = new App.View('ORGANIZATION', {
    api: '/Manager/SelectClientOrganization',
    updateApi: '/Manager/UpdateClientOrganization',
    createApi: '/Manager/InsertOrganization',
  });

  return {
    initialize: initialize,
  };
})();