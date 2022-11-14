/* #=========================================#
| COMMON 공통상태 Struct
#=========================================# */
let global,
pageState,
lv,
options,
address,
el,
selectOrgState,
searchOption = null,
isEmployee,
selectedPage,
switchModify;

if(cookie.getCookie('userAccount')){
  global = {
    user: cookie.getCookie('userAccount') ? cookie.getCookie('userAccount') : null, //
    pagination: {
      count: 10, // 화면에 보여질 리스트 갯수
      pager: 10, // 화면에 보여질 페이지 수
      current: 1, // 현재 페이지
    },
    param: Func.getUrlParam(),
    currentUrl: window.location.href,
  };

  pageState = {
    name: "",
    type: "",
    cate: "",
  };

  lv = {
    userLevel: {
      admin: 14,
      masterManager: 10,
      superManager: 8,
      agencyManager: 7,
      agent: 5,
      doctor: 4,
      reviewer: 2,
    },
    // 기관레벨
    groupLevel: {
      hospital: 1,
      management: 5,
      admin: 10,
    },
  }

  options = {
    gender: [
      { value: 1, text: "남자" },
      { value: 2, text: "여자" },
    ],
    editor: {
      width: '100%',
      height: 310,
      skin: 'bootstrapck,/assets/theme/bootstrapck/',
      allowedContent: true
    }
  };

  address = {
    area0: ["시/도 선택","서울특별시","인천광역시","대전광역시","광주광역시","대구광역시","울산광역시","부산광역시","경기도","강원도","충청북도","충청남도","전라북도","전라남도","경상북도","경상남도","제주도"],
    area1: ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"],
    area2: ["계양구","남구","남동구","동구","부평구","서구","연수구","중구","강화군","옹진군"],
    area3: ["대덕구","동구","서구","유성구","중구"],
    area4: ["광산구","남구","동구",     "북구","서구"],
    area5: ["남구","달서구","동구","북구","서구","수성구","중구","달성군"],
    area6: ["남구","동구","북구","중구","울주군"],
    area7: ["강서구","금정구","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구","기장군"],
    area8: ["고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시","가평군","양평군","여주군","연천군"],
    area9: ["강릉시","동해시","삼척시","속초시","원주시","춘천시","태백시","고성군","양구군","양양군","영월군","인제군","정선군","철원군","평창군","홍천군","화천군","횡성군"],
    area10: ["제천시","청주시","충주시","괴산군","단양군","보은군","영동군","옥천군","음성군","증평군","진천군","청원군"],
    area11: ["계룡시","공주시","논산시","보령시","서산시","아산시","천안시","금산군","당진군","부여군","서천군","연기군","예산군","청양군","태안군","홍성군"],
    area12: ["군산시","김제시","남원시","익산시","전주시","정읍시","고창군","무주군","부안군","순창군","완주군","임실군","장수군","진안군"],
    area13: ["광양시","나주시","목포시","순천시","여수시","강진군","고흥군","곡성군","구례군","담양군","무안군","보성군","신안군","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"],
    area14: ["경산시","경주시","구미시","김천시","문경시","상주시","안동시","영주시","영천시","포항시","고령군","군위군","봉화군","성주군","영덕군","영양군","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군"],
    area15: ["거제시","김해시","마산시","밀양시","사천시","양산시","진주시","진해시","창원시","통영시","거창군","고성군","남해군","산청군","의령군","창녕군","하동군","함안군","함양군","합천군"],
    area16: ["서귀포시","제주시","남제주군","북제주군"],
  };

  el = {
    modalOpenButton: $('.open-modal'),
    modalPopup: $('.modal'),
    phoneInput: $('[name="phoneNumber"], [name="representativePhoneNumber"]'),
    cancelButton: $('button.cancel'),
    levelSelectBox: $('[name="level"]'),
    employeeRadio: $('[name="isEmployee"]'),
    organizationSelectBox: $('[name="organizationCode"]'),
    departmentSelectBox: $('[name="departmentCode"]'),
    agencySelectBox: $('[name="agencyCode"]'),
    radioWrapper: $('.btn-group-toggle'),
    subtitle: $('.subheader-title'),
    submitButton: $('[type="submit"]')
  }

  selectOrgState = {
//    selectedOrganizationCode: localStorage.getItem("seletedOgrnizationCode") ? localStorage.getItem("seletedOgrnizationCode") : global.user.organizationCode,
 //   selectedOrganizationLevel: localStorage.getItem('selectedOrganizationLevel'),
  }
}
