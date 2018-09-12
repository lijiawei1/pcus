<%--
  Created by IntelliJ IDEA.
  User: MM
  Date: 2017/3/13
  Time: 14:10
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<head>
  <title>安盈物流结算清单</title>
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
  <form id="download" method="POST" target="_blank" action="/tms/report/client/anYingBillQuery/exportExcel">
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
  //上下文路径
  var basePath = rootPath + '/tms/report/client/anYingBillQuery/';
  //页面控件
  var toptoolbar, mainGrid, searchForm;

  //初始化表格选项
  var gridOption = {
    columns: [
      {
        display: '序号', name: '', align: 'left', minWidth: 50, width: '5%',
        render: function (row, index) {
          return index + 1;
        }
      },
      {
        display: '日期', name: 'd', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '车牌号', name: 'car_no', align: 'left', minWidth: 50, width: '8%'
      },
      {
        display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '10%'
      },
      {
        display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '8%'
      },
      {
        display: '金额', name: 'total_amount', align: 'left', minWidth: 50, width: '6%',totalSummary: {
        type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
        render: function (e) {
          //汇总渲染器，返回html加载到单元格
          //e 汇总Object(包括sum,max,min,avg,count)
          return "合计：" + e.sum;
        }
      }
      },
      {
        display: '码头', name: 'dock', align: 'left', minWidth: 50, width: '8%'
      },
      {
        display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '15%'
      }

    ],
    pageSize: 50,
    url: basePath + 'loadGrid',
    delayLoad: false,		//初始化不加载数据
    width: '100%',
    autoStretch: true,
    height: '100%',
    dataAction: 'local',
      localStorageName: basePath.match(/\w+\/$/)[0].split('/')[0] + user.id,
    checkbox: false,
    usePager: true,
    enabledEdit: false,
    clickToEdit: false,
    fixedCellHeight: true,
    heightDiff: -35,
    rowHeight: 30,
    headerRowHeight: 28,
    rowSelectable: true,
    selectable: true,
    frozen: true,
    rownumbers: true,
    title: '格力高栏港珠海市安盈物流有限公司结算清单'
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
        xlsUtil.exp($('#download'), mainGrid, "安盈物流结算清单表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
        display: "年份",
        name: "year",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "select",
        options: {
          data: QUERY_CONST.SELECT_YEAR
        },
        /*validate: {required: true},*/
        cssClass: "field"
        /*,
        attr: {
          "data-ignore": true,
          "data-default": (new Date()).getFullYear()
        }*/
      },
      {
        display: "月份",
        name: "month",
        newline: false,
        labelWidth: 80,
        width: 170,
        space: 30,
        type: "select",
        options: {
          data: QUERY_CONST.SELECT_MONTH
        },
        /*validate: {required: true},*/
        cssClass: "field"
       /* ,
        attr: {
          "data-ignore": true,
          "data-default": ((new Date()).getMonth() + 1)
        }*/
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
    width: 340,
    height: 200,
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
            $(".l-panel-header-text").html(y+'年'+m+'月份格力高栏港珠海市安盈物流有限公司结算清单');
          }
          else if(y==''&& m){
            $(".l-panel-header-text").html(m+'月份格力高栏港珠海市安盈物流有限公司结算清单');
          }
          else if(y && m==''){
            $(".l-panel-header-text").html(y+'年格力高栏港珠海市安盈物流有限公司结算清单');
          }else{
            $(".l-panel-header-text").html('格力高栏港珠海市安盈物流有限公司结算清单');
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