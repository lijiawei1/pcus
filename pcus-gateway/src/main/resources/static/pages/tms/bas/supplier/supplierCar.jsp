<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/20
  Time: 11:09
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <title>车辆信息</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
  <jsp:include page="/pages/common/pagesV2.jsp"/>
</head>
<body>
<div id="layout">
  <div class="toolbar-wrapper search-toolbar-wrapper">
    <div class="hidden-search">
      <i class="l-icon l-icon-search" data-action="single-search"></i>
      <input class="hs-input" placeholder="在此输入关键字" data-action="single-search-input">
      <span class="clear">&times;</span>
      <span class="status2 hs-btn limit-select" data-action="single-search">&gt;</span>
      <span class="status1 text">搜索</span>
      <span class="status2 text cancel">取消</span>
    </div>
    <div id="toptoolbar"></div>
  </div>
  <!-- 卡片界面 -->
  <div class="content-wrapper grid-wrapper">
    <!-- 列表界面 -->
    <div id="mainGrid"></div>
  </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
  <form id="mainForm"></form>
</div>
</body>
<script>

  var client_id = '${supplier_id}';
  var mainId = client_id;
  var SELECTED = 'selected';

  //上下文路径
  var basePath = rootPath + '/tms/bas/car/';


  //默认数据
  var emptyData = {
    pk_id:'',
    car_attr: '',
    car_no: '',
    register_no: '',
    car_owner: '',
    id_name: '',
    outsourcing: false,
    id_no: '',
    type: '',
    trailer_no: '',
    default_driver: '',
    register_office: '',
    register_date: '',
    brand: '',
    model_no: '',
    color: '',
    frame_no: '',
    engine_no: '',
    engine_model: '',
    fuel_type: '',
    power: '',
    displacement: '',
    factory: '',
    out_length: '',
    out_width: '',
    out_height: '',
    in_length: '',
    in_width: '',
    in_height: '',
    wheel_base: '',
    load_mass: '',
    use_nature: '',
    production_date: '',
    highway_fee: '',
    tire_qty: '',
    tire_spec: '',
    qualification: ''
  };

  //页面元素
  var $gridWrapper = $(".grid-wrapper"),
          $filterWrapper = $(".filter-wrapper"),
          $filterForm = $("#filterForm"),
          $mainDlg = $("#mainDlg"), //编辑弹窗
          $mainForm = $("#mainForm"), //编辑表单
          $mainGrid = $("#mainGrid"); //显示表格

  //页面控件
  var toptoolbar, //工具栏
          filterForm, //快速查询
          mainGrid, //列表
          mainForm, //编辑表单
          mainDlg; //弹窗

  var where = JSON2.stringify({
    op: 'and',
    rules: [{field: 'DR', value: '0', op: 'equal'}, {field: 'supplier_id', value: client_id, op: 'equal'}]
  });

  //初始化表格选项
  var gridOption = {
    columns: [
      {
        //行内按钮
        display: '', align: '', minWidth: 50, width: '5%', sortable: false,
        render: function (item, index) {
          return '<a class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-edit"></i></a>';
        },
        hide: disabledButtons.indexOf('update') >= 0
      },
      {
        display: '车牌号', name: 'car_no', align: 'left', minWidth: 50, width: 80
      },
      {
        display: '是否外协', name: 'outsourcing', align: 'left', minWidth: 50, render: function (item) {
        if (!item.outsourcing) return '<input type="checkbox" name="checkbox" disabled="disabled" style="margin-top:4px;">';
        return '<input type="checkbox" name="checkbox" checked="checked" disabled="disabled" style="margin-top:4px;">';
      }
      },
      {
        display: '机动车登记证书', name: 'register_no', align: 'left', width: '10%'
      },
      {
        display: '机动车所有人', name: 'car_owner', align: 'left', width: '10%'
      },
      {
        display: '证件名称', name: 'id_name', align: 'left', width: '10%'
      },
      {
        display: '证件号', name: 'id_no', align: 'left', width: '10%'
      },
      {
        display: '车辆类型', name: 'type_name', align: 'left', width: 100
      },
      {
        display: '车辆属性', name: 'car_attr', align: 'left', minWidth: 50
      },
      {
        display: '主拖卡', name: 'trailer_no', align: 'left', width: '10%'
      },
      {
        display: '默认司机', name: 'default_driver', align: 'left', width: '10%'
      },
      {
        display: '登记机关', name: 'register_office', align: 'left', width: '10%'
      },
      {
        display: '登记日期', name: 'register_date', align: 'left', width: '10%'
      },
      {
        display: '品牌', name: 'brand', align: 'left', width: '10%'
      },
      {
        display: '型号', name: 'model_no', align: 'left', width: '10%'
      },
      {
        display: '颜色', name: 'color', align: 'left', width: '10%'
      },
      {
        display: '车架号码', name: 'frame_no', align: 'left', width: '10%'
      },
      {
        display: '发动机号', name: 'engine_no', align: 'left', width: '10%'
      },
      {
        display: '发动机型号', name: 'engine_model', align: 'left', width: '10%'
      },
      {
        display: '燃料种类', name: 'fuel_type', align: 'left', width: 80
      },
      {
        display: '功率', name: 'power', align: 'left', width: 80
      },
      {
        display: '排量', name: 'displacement', align: 'left', width: 80
      },
      {
        display: '制造厂名称', name: 'factory', align: 'left', width: '10%'
      },
      {
        display: '外廓长', name: 'out_length', align: 'left', width: 80
      },
      {
        display: '外廓宽', name: 'out_width', align: 'left', width: 80
      },
      {
        display: '外廓高', name: 'out_height', align: 'left', width: 80
      },
      {
        display: '货箱内部长', name: 'in_length', align: 'left', width: 80
      },
      {
        display: '货箱内部宽', name: 'in_width', align: 'left', width: 80
      },
      {
        display: '货箱内部高', name: 'in_height', align: 'left', width: 80
      },
      {
        display: '轴距', name: 'wheel_base', align: 'left', width: 80
      },
      {
        display: '核定载重', name: 'load_mass', align: 'left', width: 80
      },
      {
        display: '使用性质', name: 'use_nature', align: 'left', width:80
      },
      {
        display: '车辆出厂日期', name: 'production_date', align: 'left', width:80
      },
      {
        display: '高速费用标准', name: 'highway_fee', align: 'left', width: 80
      },
      {
        display: '轮胎数', name: 'tire_qty', align: 'left', width: 80
      },
      {
        display: '轮胎规格', name: 'tire_spec', align: 'left', width: '10%'
      },
      {
        display: '车辆资质', name: 'qualification', align: 'left', width: '10%'
      },
    ],
    pageSize: 20,
    url: basePath + 'loadGrid',
    delayLoad: false,		//初始化不加载数据
    checkbox: true,
    width: '100%',
    height: '100%',
    dataAction: 'server',
    checkbox: true,
    usePager: true,
    enabledEdit: false,
    clickToEdit: false,
    fixedCellHeight: true,
    heightDiff: -15,
    rowHeight: 30,
    headerRowHeight: 28,
    rowSelectable: true,
    selectable: true,
    // frozen: true,
    rownumbers: true,
    selectRowButtonOnly: true,
    sortName: 'car_no',
    sortOrder: 'asc',
    parms: [{name: 'where', value: where}]
  };

  var filterFormOption = {
    fields: [
      {
        display: "车牌号",
        name: "car_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field"
      },
      {

        name: "supplier_id",
        type: "hidden",
        cssClass: "field",
        options: {
          value: client_id
        }
      }
    ]
  };

  var mainFormOption = {
    fields: [
      {
        display: "车牌号",
        name: "car_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
        validate: {required: true},
      },
      {
        display: "车辆属性",
        name: "car_attr",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "机动车登记证书",
        name: "register_no",
        newline: false,
        labelWidth: 100,
        width: 150,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "机动车所有人",
        name: "car_owner",
        newline: false,
        labelWidth: 100,
        width: 150,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "证件名称",
        name: "id_name",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "证件号",
        name: "id_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "车辆类型",
        name: "type",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "select",
        cssClass: "field",
        options: {
          url: rootPath + '/tms/bas/dict/getData?query=car_type',
        },
        validate: {required: true},
      },
      {
        display: "主拖卡",
        name: "trailer_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "默认司机",
        name: "default_driver",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "select",
        cssClass: "field",
        options: {
          url: basePath + '/getDriver?supplier_id=' + client_id,
          cancelable: true,
          autocomplete: true,
          keySupport: true,
          highLight: true,
          isTextBoxMode: true
        },
      },
      {
        display: "登记机关",
        name: "register_office",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "登记日期",
        name: "register_date",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "date",
        cssClass: "field",
      },
      {
        display: "品牌",
        name: "brand",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "型号",
        name: "model_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "颜色",
        name: "color",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "车架号码",
        name: "frame_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "发动机号",
        name: "engine_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "发动机型号",
        name: "engine_model",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "燃料种类",
        name: "fuel_type",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "功率",
        name: "power",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "排量",
        name: "displacement",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "制造厂名称",
        name: "factory",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "外廓长",
        name: "out_length",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "外廓宽",
        name: "out_width",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "外廓高",
        name: "out_height",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "货箱内部长",
        name: "in_length",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "货箱内部宽",
        name: "in_width",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "货箱内部高",
        name: "in_height",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "轴距",
        name: "wheel_base",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "核定载重",
        name: "load_mass",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "number",
        cssClass: "field",
      },
      {
        display: "使用性质",
        name: "use_nature",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "出厂日期",
        name: "production_date",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "date",
        cssClass: "field",
      },
      {
        display: "高速费用",
        name: "highway_fee",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "轮胎数",
        name: "tire_qty",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "int",
        cssClass: "field",
      },
      {
        display: "轮胎规格",
        name: "tire_spec",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {
        display: "车辆资质",
        name: "qualification",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
      },
      {

        name: "pk_id",
        type: "hidden"
      }
    ],
    validate: true,
    toJSON: JSON2.stringify
  };

  //对话框
  var dialogOption = {
    target: $("#mainDialog"),
    title: '资料编辑',
    width: 650,
    height: 350,
    buttons: [
      {
        text: '确定',
        onclick: function (item, dialog) {

          //校验数据
          if (!mainForm.valid()) {
            mainForm.showInvalid();
            return;
          }

          var selected = $mainForm.data(SELECTED);
          //地址
          var url = !!selected ? 'update' : 'add';
          //数据
          var data = $.extend({}, selected, mainForm.getData(), {
            create_time: $mainForm.find("input[name=create_time]").val(),
            modify_time: $mainForm.find("input[name=modify_time]").val(),
            supplier_id: client_id,
            register_date: $mainForm.find("input[name=register_date]").val(),
            production_date: $mainForm.find("input[name=production_date]").val(),
          });

          LG.singleAjax({
            url: basePath + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data, msg) {
              LG.tip('保存成功!')
              dialog.hide();
              //刷新角色列表
              mainGrid.reload();
            },
            error: function (message) {
              LG.showError(message);
            }
          }, item);

        }
      },
      {
        text: '取消',
        onclick: function (item, dialog) {
          dialog.hidden();
        }
      }
    ]
  };

  //扩展按钮
  var toolbarOption = {
    items: [
      {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
    ]
  };
  var btnClick = function (item) {
  };

  var supplier =${supplier};
  //新增弹出窗自定义方法
  function defaultAction_add() {
    //打开弹出窗 默认参数outer
    //liger.get("outsourcing").setValue(supplier.outsourcing);
  }
</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>

<script type="text/javascript">
  defaultSearchFilter["and"].push({field: 'supplier_id', value: client_id, op: 'equal', type: 'string'});
  $(function () {
    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
      inlineClineDialogEdit(this);
    });
  });

  // 手机号码验证
  jQuery.validator.addMethod("isMobile", function (value, element) {

    var length = value.length;
    if (length == 0) {
      return true
    }
    ;
    return this.optional(element) || (length == 11 && ( /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|170)+\d{8})$/.test(value) ));
  }, "请填写正确的手机号。");

  // 手机号码验证
  jQuery.validator.addMethod("isPhone", function (value, element) {
    var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
    var length = value.length;
    if (length == 0) {
      return true
    }
    ;
    return this.optional(element) || tel.test(value);
  }, "请填写正确的联系电话。");


</script>
</html>
