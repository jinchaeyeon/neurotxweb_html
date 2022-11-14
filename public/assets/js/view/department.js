/* #=========================================#
| Department 사업부 : 목록 / 등록 / 수정      |
#=========================================# */
"use strict";

// Organization화면 상태 공유데이터
const tableWrapper = $("#departmentListTable");

// 리스트
const List = (function () {

  const initialize = function () {
    App.Initialize.setListPage({
      cate: 'DEPARTMENT',
      render: render,
    });
  };

  const render = function (page, searchOrganizationCode) {

    const reqOgranizationCode = searchOrganizationCode
      ? searchOrganizationCode
      : user.organizationCode;
    
    const view = new App.View('DEPARTMENT',{
      table: tableWrapper,
      api: '/Manager/SelectBusinessDepartmentSimplePage',
      delapi: '/Manager/DeleteBusinessDepartment',
      dataName: 'businessDepartmentSimpleList',
      components: Components.departmentListItem,
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
      cate: 'DEPARTMENT',
      name: '사업부',
      checkUrl: '/Manager/CheckBusinessDepartment'
    });
          
    render.DetailRendering({
      dataName: 'businessDepartment',
      requestOpt: {
        organizationCode: selectOrgState.selectedOrganizationCode
          ? selectOrgState.selectedOrganizationCode
          : global.user.organizationCode,
        departmentCode: global.param.departmentCode,
      },
      redirectUrl: '/department/departmentList.html',
      form: '#departmentDetail',
    });
    
  };

  const render = new App.View('DEPARTMENT', {
    api: '/Manager/SelectBusinessDepartment',
    updateApi: '/Manager/UpdateBusinessDepartment',
    createApi: '/Manager/InsertBusinessDepartment',
  });

  return {
    initialize: initialize,
  };
})();