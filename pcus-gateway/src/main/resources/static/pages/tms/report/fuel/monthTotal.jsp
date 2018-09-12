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
    <title>车辆月汇总油耗表</title>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/fuel/monthTotal/exportExcel">
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
    var basePath = rootPath + '/tms/report/fuel/monthTotal/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    var car_nos = ${car_nos},   //车牌号
        cards = ${cards},
        oper_units = ${oper_units},
        suppliers = ${suppliers}

    car_nos = car_nos.map(function (item) {
        return {
            id: item,
            text: item
        }
    });
    cards = cards.map(function (item) {
        return {
            id: item,
            text: item
        }
    });
    oper_units = oper_units.map(function (item) {
        return {
            id: item,
            text: item
        }
    });
    suppliers = suppliers.map(function (item) {
        return {
            id: item,
            text: item
        }
    });

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: 'No', name: 'No', align: 'left', minWidth: 50, width: '5%',
                render: function (row, index) {
                    return index + 1;
                }
            },
            {
                display: '年月', name: 'yd', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '卡号', name: 'fuel_card_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车牌号', name: 'car_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '加油升数', name: 'fuel_qty', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '优惠后金额', name: 'amount', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '所属项目', name: 'oper_unit_name', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '所属公司', name: 'supplier_name', align: 'left', minWidth: 50, width: '8%'
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
        title: '车辆月汇总油耗表'
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
                xlsUtil.exp($('#download'), mainGrid, "车辆月汇总油耗表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
                display: "油卡",
                name: "fuel_card_no",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                options: {
                    data: cards
                }
            },
            {
                display: "所属项目",
                name: "oper_unit_name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                options: {
                    data: oper_units
                }
            },
            {
                display: "所属公司",
                name: "supplier_name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                options: {
                    data: suppliers
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
