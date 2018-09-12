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
    <title>用户在线统计</title>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/sys/userOnlineQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/sys/userOnlineQuery/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //初始化表格选项
    var gridOption = {
        columns: [
            {display: '用户名', name: 'username', align: 'left', minWidth: 50, width: '8%'},
            {display: '登录时间', name: 'login_time', align: 'left', minWidth: 50, width: '8%'},
            {display: '登出时间', name: 'logout_time', align: 'left', minWidth: 50, width: '8%'},
            {display: '最后访问时间', name: 'last_accessed_time', align: 'left', minWidth: 50, width: '10%'},
            {display: '在线时长', name: 'd', align: 'left', minWidth: 50, width: '10%',
                render: function(item) {
                    return item.hour + '时' + item.minute + '分' + item.second + '秒';
                }
            },
            {display: '小时', name: 'hour', align: 'left', minWidth: 50, width: '10%'},
            {display: '分钟', name: 'minute', align: 'left', minWidth: 50, width: '10%'},
            {display: '秒', name: 'second', align: 'left', minWidth: 50, width: '10%'}
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
        sortName: 'LOGIN_TIME',
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
                xlsUtil.exp($('#download'), mainGrid, "用户在线统计.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)});
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
                display: "开始时间",
                name: "start_date",
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "greaterorequal", //操作符
                    "data-name": "login_time",
                    "dateformat": "yyyy-MM-dd"
                },
                validate: {required: true}
            },
            {
                display: "结束时间",
                name: "end_date",
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "lessorequal", //操作符
                    "data-name": "login_time",
                    "dateformat": "yyyy-MM-dd"
                },
                validate: {required: true}
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
        width: 320,
        height: 200,
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
                    loadChart();
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