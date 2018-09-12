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
    <title>上海泛亚对账单</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <%--  <script src="/js/lib/echarts/echarts.common.min.js"></script>
      <script src="/js/lib/echarts/theme/macarons.js"></script>--%>
    <link href="/css/tms/report-sub.css" rel="stylesheet" type="text/css">
    <style type="text/css">
        .l-panel-header {
            padding-left: 0px;
        }

        .l-panel-header-text {
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
            <div id="mainGrid" style="text-align: center!important;"></div>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/client/zhongyuanDailyBillQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/client/zhongyuanDailyBillQuery/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '序号', name: 'seq', align: 'left', minWidth: 50, width: '5%',
                render: function (row, index) {
                    return index + 1;
                }
            },
            {
                display: '出车日期', name: 'cntr_work_time', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车牌', name: 'car_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '封条号', name: 'cntr_seal_no', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '船公司', name: 'ship_corp', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '批号', name: 'batch_no', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: 'SO', name: 'booking_no', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '重量', name: 'weight', align: 'left', minWidth: 50, width: '6%', totalSummary: {
                align: 'center', //汇总单元格内容对齐方式:left/center/right
                type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                render: function (e) {
                    //汇总渲染器，返回html加载到单元格
                    //e 汇总Object(包括sum,max,min,avg,count)
                    return e.sum.toFixed(2);
                }
            }
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '15%'
            }

        ],
        pageSize: 50,
        pageSizeOptions: [50, 100, 200, 500],
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
        heightDiff: -15,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        title: '船公司日报表'
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
                xlsUtil.exp($('#download'), mainGrid, "船公司日报表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
                display: "出车日期始",
                name: "settle_date_start",
                width: 170,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: false,
                    format: "yyyy-MM-dd"
                },
                attr: {
                    op: "greaterorequal", //操作符
                    "data-name": "cntr_work_time", //查询字段名称
                    datetimerange: true,
                    dateformat: "yyyy-MM-dd hh:mm:ss"
                }
            }, {
                display: "出车日期至",
                name: "settle_date_end",
                width: 170,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: false,
                    format: "yyyy-MM-dd"
                },
                attr: {
                    op: "lessorequal", //操作符
                    "data-name": "cntr_work_time", //查询字段名称
                    datetimerange: true,
                    dateformat: "yyyy-MM-dd hh:mm:ss"
                }
            },
            {
                display: "船公司", name: "ship_corp", newline: false, type: "text", cssClass: "field",
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
        height: 370,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {
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
