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
    <title>可乐油耗统计表</title>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/fuel/colaFuelTotal/exportExcel">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="footers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="where"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>
</body>
<script type="text/javascript">
    //上下文路径
    var basePath = rootPath + '/tms/report/fuel/colaFuelTotal/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    var car_nos = ${car_nos},   //车牌号

    car_nos = car_nos.map(function (item) {
        return {
            id: item,
            text: item
        }
    });

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: 'NO.', name: 'no', align: 'left', minWidth: 50, width: '5%',
                render: function (row, index) {
                    return index + 1;
                }
            },
            {
                display: '发车日期', name: 'work_time', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '姓名', name: 'driver_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车号', name: 'car_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '货物名称', name: 'cargo_info', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '装货地', name: 'load_org', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '卸货地', name: 'unload_org', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '签收重量', name: 'total_weight', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '空车公里', name: 'e_km', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '重车公里', name: 'f_km', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '油耗', name: 'theo_fuel_cost', align: 'left', minWidth: 50, width: '8%',
                totalSummary: {
                align: 'center', //汇总单元格内容对齐方式:left/center/right
                type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                render: function (e) {
                    //汇总渲染器，返回html加载到单元格
                    //e 汇总Object(包括sum,max,min,avg,count)
                    return "合计：" + e.sum;
                }
            }
            },
            {
                display: '单号', name: 'bill_no', align: 'left', minWidth: 50, width: '8%'
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
        heightDiff: -15,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        title: '可乐油耗统计表'
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
                xlsUtil.exp($('#download'), mainGrid, "可乐油耗统计表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
                cssClass: "field"
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
                cssClass: "field"
            },
            {
                display: "车牌号",
                name: "car_no",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "select",
                options: {
                    data: car_nos
                }
            },
            {
                display: "货物名称",
                name: "cargo_info",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30
            },
            {
                display: "装货地",
                name: "load_org",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30
            },
            {
                display: "卸货地",
                name: "unload_org",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30
            },
            {
                display: "单号",
                name: "bill_no",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30
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
                    //校验数据
                    if (!searchForm.valid()) {
                        searchForm.showInvalid();
                        return;
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
