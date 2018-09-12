<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/18
  Time: 10:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
  <title>联系人</title>
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
  var basePath = rootPath + '/tms/bas/supplierlinkman/';


  //默认数据
  var emptyData = {
    pk_id:'',
    name: '',
    mobile: '',
    email: '',
    sex: '',
    ename: '',
    fax: '',
    phone: '',
    modify_time: '',
    modify_psn: '',
    remark: ''
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
        display: '姓名', name: 'name', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '性别', name: 'sex', align: 'left', minWidth: 50, width: '5%', render: function (item) {
        if (item.sex == "1") {
          return '男'
        }
        else if (item.sex == "2")
          return '女';
      }
      },
      {
        display: '手机号', name: 'mobile', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '邮箱', name: 'email', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '英文名称', name: 'ename', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '联系电话', name: 'phone', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '传真', name: 'fax', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '35%'
      }
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
    sortName: 'create_time',
    sortOrder: 'desc',
    parms: [{name: 'where', value: where}]
  };

  var filterFormOption = {
    fields: [
      {
        display: "姓名",
        name: "name",
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
        display: "姓名",
        name: "name",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
        validate: {required: true},
        attr: {
          maxlength: 5
        },
      },
      {
        display: "手机号",
        name: "mobile",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
        validate: {required: true, isMobile: true},
      },
      {
        display: "邮箱",
        name: "email",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
        attr: {
          maxlength: 50
        },
      },
      {
        display: "性别", name: "sex", newline: false, type: "radiolist", labelWidth: 80,
        width: 170,
        editor: {rowSize: 5}, options: {
        data: [{id: 1, text: '男'}, {id: 2, text: '女'}]
      }
      },
      {
        display: "英文名",
        name: "ename",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
        attr: {
          maxlength: 50
        },
      },
      {
        display: "联系电话",
        name: "phone",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
        validate: {isPhone: true}
      },
      {
        display: "传真",
        name: "fax",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text",
        cssClass: "field",
        attr: {
          maxlength: 20
        },
      },
      {
        display: "备注",
        name: "remark",
        newline: false,
        labelWidth: 80,
        width: 452,
        space: 10,
        rows: 4,
        type: "textarea",
        attr: {
          maxlength: 200
        },
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
            supplier_id: client_id
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
    return this.optional(element) || (( tel.test(value)));
  }, "请填写正确的联系电话。");


</script>
</html>
