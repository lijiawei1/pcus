<%--
  Created by IntelliJ IDEA.
  User: MM
  Date: 2017/3/13
  Time: 14:29
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<head>
    <title>业务数据汇总表</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <%--  <script src="/js/lib/echarts/echarts.common.min.js"></script>
      <script src="/js/lib/echarts/theme/macarons.js"></script>--%>
    <style>
        /*.wrapper100{*/
            /*padding-top: 0;*/
        /*}*/
    </style>
</head>
<body>
<div id="layout">
    <div class="toolbar-wrapper">
        <div id="toptoolbar"></div>
    </div>
    <!-- 卡片界面 -->
    <div class="content-wrapper grid-wrapper">
        <!-- 列表界面 -->
        <div id="mainGrid"style="text-align: center!important;"></div>
        <%--<div id="echart"></div>--%>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="searchDialog" style="display: none;">
    <form id="searchForm"></form>
</div>
<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="/tms/report/client/singleCarValueQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/client/singleCarValueQuery';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //    年份
    var filterFormOption = {
        prefixID: "s_",
        fields: [
            {
                display: "年份",
                name: "year",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                cssClass: "field",
                options: {
                    data: QUERY_CONST.SELECT_YEAR
                }
            }, {
                display: "月份",
                name: "month",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                cssClass: "field",
                options: {
                    data: QUERY_CONST.SELECT_MONTH
                }
            }, {
                display: "客户",
                name: "client_name",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "司机",
                name: "driver_name",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            }
        ]
    };
    searchForm = $("#searchForm").ligerForm(filterFormOption);

    var showIndex = 0,
        searchFormArray = [];
    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '客户', name: 'client_name', width: '80'
            },
            {
                display: '柜号', name: 'cntr_no', width: '120'
            },
            {
                display: '车牌号', name: 'car_no', width: '80'
            },
            {
                display: '司机', name: 'driver_name'
            },
            {
                display: '装卸单位', name: 'org', width: '120'
            },
            {
                display: '码头', name: 'dock'
            },
            {
                display: '预定车型', name: 'cntr_type'
            },
            {
                display: '日期', name: 'cntr_work_time', width: '80'
            },
            {
                display: '应收', name: 'yf'
            },
            {
                display: '应付', name: 'cz'
            },
            {
                display: '公里数', name: 'kilometers'
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50
            }
        ],
        pageSize: 50,
        url: basePath + '/loadGrid',
        delayLoad: false,		//初始化不加载数据
        width: '100%',
        autoStretch: true,
        height: '100%',
        dataAction: 'server',
        checkbox: false,
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -10,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        title:'业务数据汇总表'
    };

    // 条件
    var defaultSearchFilter = {
        and: [],
        or: []
    };


    //  导出
    var defaultAction = function (item) {
        switch (item.id) {
            case"search":
                $.ligerDialog.open(dialogOption);
                break;
            case"export":
                xlsUtil.exp($('#download'), mainGrid, "业务数据汇总表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)});
                break;
            case "refresh":
                mainGrid.reload();
                break;
            default:
                break;
        }
    }

    //  默认动作
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

    //对话框
    var dialogOption = {
        target: $("#searchDialog"),
        title: '查询',
        width: 340,
        height: 200,
        buttons: [
            {
                text: '确定',
                onclick: function (item,dialog,a,b,c,d) {
                    var y=$("#s_year").attr("value");
                    var m=$("#s_month").attr("value");
                    var cname=$("#s_client_name").attr("value");
                    var title = "";
                    if(y){
                        title = y + '年';
                    }
                    if(m){
                        title = title + m + '月';
                    }
                    if(cname){
                        title = title + cname;
                    }
                    title = title + '内部司机单车产值';
                    mainGrid.set('parms', [{
                        name: 'where',
                        value: searchForm.getSearchFormData(false, defaultSearchFilter)
                    }]);
//                    mainGrid.changePage('first');
                    mainGrid.setTitle(title);
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

