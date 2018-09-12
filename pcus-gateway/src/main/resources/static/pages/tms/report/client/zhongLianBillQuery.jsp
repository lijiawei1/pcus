<%--
  Created by IntelliJ IDEA.
  User: MM
  Date: 2017/3/13
  Time: 14:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<head>
  <title>业务数据汇总表（高栏）</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
  <jsp:include page="/pages/common/pagesV2.jsp"/>
  <%--  <script src="/js/lib/echarts/echarts.common.min.js"></script>
    <script src="/js/lib/echarts/theme/macarons.js"></script>--%>
  <link href="/css/tms/report-sub.css" rel="stylesheet" type="text/css">
  <style type="text/css">
    .l-panel-header{
      padding-left: 0px;
    }
    .l-panel-header-text{
      padding-left: 0px;
      font-size: 15px;
    }
  </style>
</head>
<body>
<div id="layout">
  <div class="toolbar-wrapper">
    <div id="toptoolbar"></div>
  </div>
  <!-- 卡片界面 -->
  <div class="wrapper100">
    <div class="wrapper100-inner content-wrapper grid-wrapper">
      <!-- 列表界面 -->
      <div id="mainGrid"style="text-align: center!important;"></div>
      <%--<div id="echart"></div>--%>
    </div>
  </div>
</div>
<!-- 增加弹出框 -->
<div id="searchDialog" style="display: none;">
  <form id="searchForm"></form>
</div>
<!-- excel导出 -->
<div style="display: none">
  <form id="download" method="POST" target="_blank" action="/tms/report/client/zhongLianBillQuery/exportExcel">
    <input type="text" name="pk_id"/>
    <input type="text" name="names"/>
    <input type="text" name="headers"/>
    <input type="text" name="file_name"/>
    <input type="text" name="where"/>
    <input type="text" name="sortname"/>
    <input type="text" name="sortorder"/>

  </form>
</div>
</body>
<script type="text/javascript">

  var data_dict = ${dict},
          data_clients = ${clients}; //客户;

  //上下文路径
  var basePath = rootPath + '/tms/report/client/zhongLianBillQuery/';
  //页面控件
  var toptoolbar, mainGrid, searchForm;

  //初始化表格选项
  var gridOption = {
    columns: [
      {
        display: '日期', name: 'd', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '司机', name: 'driver_name', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '车号', name: 'car_no', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '货物名称', name: 'cargo_info', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '收货单位名称', name: 'charge_client', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '装货地', name: 'load_address', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '卸货地', name: 'unload_address', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '船号', name: 'ship_info', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '类别', name: 'bs_type_name', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '签收重量', name: 'weight', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '数量', name: 'qty', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '客户单价(元)', name: 'charge_price', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '客户产值(元)', name: 'charge_amount', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '外协单价(元)', name: 'pay_price', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '外协产值(元)', name: 'pay_amount', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '司机产值(九洲项目)', name: 'driver_tc', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '提成工资', name: 'tc', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '配载单号', name: 'trans_bill_no', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '委托单位', name: 'client_name', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '项目组', name: 'oper_unit_name', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '空车公里', name: 'empty_km', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '重车公里', name: 'full_km', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '油耗', name: 'fuel_cost', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '封条号', name: 'cntr_seal_no', align: 'left', minWidth: 50, width: '3%'
      },
      {
          display: '外协压车费', name: 'ycf', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '客户压夜费', name: 'yyf', align: 'left', minWidth: 50, width: '3%'
      },
      {
        display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '3%'
      }
    ],
    pageSize: 50,
    url: basePath + 'loadGrid',
    delayLoad: true,		//初始化不加载数据
    width: '100%',
    autoStretch: true,
    height: '100%',
    dataAction: 'server',
    checkbox: false,
    usePager: true,
    enabledEdit: false,
    clickToEdit: false,
    fixedCellHeight: true,
    heightDiff: -15,
    rowHeight: 30,
    headerRowHeight: 28,
    rowSelectable: true,
    selectable: true,
    frozen: true,
    rownumbers: true,
    title:'业务数据汇总表（高栏）'
    /* ,
     sortName: 'd',
     sortOrder: 'ASC'*/
    /*onAfterShowData: function (data) {

     loadChart(data);
     }*/
  };
  var defaultAction = function (item) {
    switch (item.id) {
      case"search":
        $.ligerDialog.open(dialogOption);
        break;
      case"export":
        xlsUtil.exp($('#download'), mainGrid, "业务数据汇总表（高栏）.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
        break;
      case "refresh":
        mainGrid.reload();
        break;
      default:
        break;
    }
  };

  //默认动作
  var defaultActionOption = {
    items: [
      {id: 'search', text: '查询', click: defaultAction, icon: 'search', status: ['OP_INIT']},
      {id: 'export', text: '导出', click: defaultAction, icon: 'export', status: ['OP_INIT']},
      {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']}
    ]
  };


  //初始化工具栏
  toptoolbar = $("#toptoolbar").ligerToolBar(defaultActionOption);
  //初始化表格
  mainGrid = $("#mainGrid").ligerGrid(gridOption);


  var filterFormOption = {
    prefixID: "s_",
    fields: [

      {
        display: "结算日期始",
        name: "settle_date_start",
        labelWidth: 80,
        width: 170,
        space: 30,
        newline: false,
        type: "date",
        cssClass: "field",
        editor: {
          showTime: false,
          format: "yyyy-MM-dd"
        },
        attr: {
          op: "greaterorequal", //操作符
          "data-name": "d", //查询字段名称
          dateformat: "yyyy-MM-dd"
        }
      }, {
        display: "结算日期至",
        name: "settle_date_end",
        labelWidth: 80,
        width: 170,
        space: 30,
        newline: false,
        type: "date",
        cssClass: "field",
        editor: {
          showTime: false,
          format: "yyyy-MM-dd"
        },
        attr: {
          op: "lessorequal", //操作符
          "data-name": "d", //查询字段名称
          dateformat: "yyyy-MM-dd"
        }
      },
      {
        display: "司机",
        name: "driver_name",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "车号",
        name: "car_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "货物名称",
        name: "cargo_info",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "收货单位名称",
        name: "charge_client",
        newline: false,
        labelWidth: 90,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "装货地",
        name: "load_address",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "卸货地",
        name: "unload_address",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "船号",
        name: "ship_info",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "柜号",
        name: "cntr_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "类别",
        name: "bs_type_name",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "配载单号",
        name: "trans_bill_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "委托单位", name: "client_name", newline: true,
        labelWidth: 80,
        width: 450,
        space: 30,
        type: "select", cssClass: "field", comboboxName: "client_name_c",
        options: {
          data: data_clients,
          absolute: true,
          cancelable: true,
          isMultiSelect: true, //多选
          split: ',',
          autocomplete: true,
          autocompleteAllowEmpty: true,
          valueField: 'text',
          highLight: true,
          keySupport: true
        },
        attr: {
          op: "in" //操作符
        }
      },
      {
        display: "项目组", name: "oper_unit", newline: true,
        labelWidth: 80,
        width: 450,
        space: 30,
        type: "select", cssClass: "field", comboboxName: "oper_unit_c",
        options: {
          data: data_dict[DICT_CODE.oper_unit],
          absolute: true,
          cancelable: true,
          isMultiSelect: true,
          split: ',',
          autocomplete: true,
          highLight: true,
          keySupport: true
        },
        attr: {
          op: "in" //操作符
        }
      },
      {
        display: "组别",
        name: "oper_unit_name",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "司机",
        name: "driver_name",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "柜型",
        name: "cntr_type",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      },
      {
        display: "封条号",
        name: "cntr_seal_no",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "text"
      }
    ]
  };
  searchForm = $("#searchForm").ligerForm(filterFormOption);

  var defaultSearchFilter = {
    and: [],
    or: []
  };
  //对话框
  var dialogOption = {
    target: $("#searchDialog"),
    title: '查询',
    width: 650,
    height: 350,
    buttons: [
      {
        text: '确定',
        onclick: function (item, dialog) {
          /*//校验数据
           if (!searchForm.valid()) {
           searchForm.showInvalid();
           return;
           }*/
          var y=$("#s_year").attr("value");
          var m=$("#s_month").attr("value");
          if(y && m){
            $(".l-panel-header-text").html(y+'年'+m+'月份业务数据汇总表（高栏）');
          }
          else if(y==''&& m){
            $(".l-panel-header-text").html(m+'月份业务数据汇总表（高栏）');
          }
          else if(y && m==''){
            $(".l-panel-header-text").html(y+'年业务数据汇总表（高栏）');
          }else{
            $(".l-panel-header-text").html('业务数据汇总表（高栏）');
          }
          mainGrid.set('parms', [{
            name: 'where',
            value: searchForm.getSearchFormData(false, defaultSearchFilter)
          }])
          mainGrid.changePage('first');
          mainGrid.loadData();
//          loadChart();
          dialog.hidden();
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



</script>
</html>
