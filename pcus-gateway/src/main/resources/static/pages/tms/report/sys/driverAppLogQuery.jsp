<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/2/7
  Time: 14:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<!DOCTYPE html>
<head>
    <title>司机APP使用情况</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <script src="/js/lib/echarts/echarts.common.min.js"></script>
    <script src="/js/lib/echarts/theme/macarons.js"></script>
    <link href="/css/tms/report-sub.css" rel="stylesheet" type="text/css">
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
            <div id="mainGrid"></div>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/sys/driverAppLogQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/sys/driverAppLogQuery/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //初始化表格选项
    var gridOption = {
        columns: [
            {display: '项目组', name: 'oper_unit_name', align: 'left', minWidth: 50, width: '8%'},
            {display: '任务单号', name: 'bill_no', align: 'left', minWidth: 50, width: '8%'},
            {display: '客户', name: 'client_name', align: 'left', minWidth: 50, width: '8%'},
            {display: '司机', name: 'driver_name', align: 'left', minWidth: 50, width: '8%'},
            {display: '车牌', name: 'car_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '孖拖柜号', name: 'cntr_twin_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '预抵时间', name: 'cntr_work_time', align: 'left', minWidth: 50, width: '10%'},
            {display: '出车时间', name: 'depart', align: 'left', minWidth: 50, width: '10%'},
            {display: '完成时间', name: 'finish', align: 'left', minWidth: 50, width: '10%'},
            {display: '图片', name: 'upload', align: 'left', minWidth: 50, width: '10%'},
            {display: '完成时间-出车时间>30分钟', name: 'time_limit', align: 'left', minWidth: 50, width: '10%'},
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        localStorageName: basePath.match(/\w+\/$/)[0].split('/')[0] + user.id,
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
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
        selectRowButtonOnly: true,
        sortName: 'BILL_NO',
        sortOrder: 'DESC',
//        parms: [{name: 'where', value: where}],
//        onAfterShowData: function (data) {
//      loadChart(data);
//        }
    };
    var defaultAction = function (item) {
        switch (item.id) {
            case"search":
                $.ligerDialog.open(dialogOption);
                break;
            case"export":
                xlsUtil.exp($('#download'), mainGrid, "司机APP使用情况.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)});
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
        fields: [
            {
                display: "出车开始时间",
                name: "start_date",
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "greaterorequal", //操作符
                    datetimerange: true,
                    "data-name": "depart",
                    "dateformat": "yyyy-MM-dd hh:mm:ss"
                },
                validate: {required: true}
            },
            {
                display: "出车结束时间",
                name: "end_date",
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "lessorequal", //操作符
                    datetimerange: true,
                    "data-name": "depart",
                    "dateformat": "yyyy-MM-dd hh:mm:ss"
                },
                validate: {required: true}
            },
            {
                display: "装卸开始时间",
                name: "load_start_date",
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "greaterorequal", //操作符
                    datetimerange: true,
                    "data-name": "cntr_work_time",
                    "dateformat": "yyyy-MM-dd hh:mm:ss"
                },
                validate: {required: true}
            },
            {
                display: "装卸结束时间",
                name: "load_end_date",
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "lessorequal", //操作符
                    datetimerange: true,
                    "data-name": "cntr_work_time",
                    "dateformat": "yyyy-MM-dd hh:mm:ss"
                },
                validate: {required: true}
            },
            {
                display: "客户",
                name: "client_name",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "司机",
                name: "driver_name",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "操作单位", name: "oper_unit_name", newline: false, type: "select", cssClass: "field",
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=oper_unit',
                    split: ',',
                    valueField: 'text',
                    isMultiSelect: true,
                    autocomplete: true,
                    highLight: true,
                    keySupport: true
                },
                attr: {
                    op: "in" //操作符
                }
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
        width: 350,
        height: 250,
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