<%--
  Created by IntelliJ IDEA.
  User: MM
  Date: 2017/3/1
  Time: 16:01
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<head>
    <title>里程报表</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <%--  <script src="/js/lib/echarts/echarts.common.min.js"></script>
      <script src="/js/lib/echarts/theme/macarons.js"></script>--%>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/settle/mileageQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/settle/mileageQuery/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '装卸时间', name: 'cntr_work_time', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '出车时间', name: 'depart_time', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '运输完成时间', name: 'finish_time', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车牌号', name: 'car_no', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '司机名称', name: 'driver_name', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '任务类型', name: 'task_type_name', align: 'left', minWidth: 50, width: '4%'
            },
            {
                display: '路线', name: 'line_info', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '出发地', name: 'start_org', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '目的地', name: 'end_org', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '公里数', name: 'kilometers', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '客户', name: 'client_name', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '承运方', name: 'supplier_name', align: 'left', minWidth: 50, width: '12%'
            },
            {
                display: '是否外协', name: 'is_outer', align: 'left', minWidth: 50, width: '4%'
            },
            {
                display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '7%'
            },
            {
                display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '操作单位', name: 'oper_unit_name', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '任务号', name: 'bill_no', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '备注', name: 'note', align: 'left', minWidth: 50, width: '10%'
            }


        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        localStorageName: basePath.match(/\w+\/$/)[0].split('/')[0] + user.id,
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
        sortName: 'depart_time',
        sortOrder: 'ASC'
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
                xlsUtil.exp($('#download'), mainGrid, "里程报表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
                display: "账单年",
                name: "bill_year",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    "date-isrange": false
                }
            },
            {
                display: "账单月",
                name: "bill_month",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    "date-isrange": false
                }
            },
            {
                display: "装卸日期始",
                name: "settle_date_start",
                labelWidth: 90,
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
                    "data-name": "cntr_work_time", //查询字段名称
                    dateformat: "yyyy-MM-dd"
                }
            }, {
                display: "装卸日期至",
                name: "settle_date_end",
                labelWidth: 90,
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
                    "data-name": "cntr_work_time", //查询字段名称
                    dateformat: "yyyy-MM-dd"
                }
            },
            {
                display: "车牌号",
                name: "car_no",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    "date-isrange": false
                }
            },
            {
                display: "司机",
                name: "driver_name",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    "date-isrange": false
                }
            },
            {
                display: "发车时间最早",
                name: "depart_time_s",
                newline: true,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "greaterorequal",//操作符
//                    "data-range": "allStart",
                    "data-name": "depart_time",
                    dateformat: "yyyy-MM-dd hh:mm:ss",
//                    N: 7
                },
                validate: {required: true}
            },
            {
                display: "发车时间最后",
                name: "depart_time_e",
                newline: true,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "lessorequal",//操作符
//                    "data-range": "allEnd",
                    "data-name": "depart_time",
                    dateformat: "yyyy-MM-dd hh:mm:ss",
//                    N: 7
                },
                validate: {required: true}
            },
            {
                display: "操作单位", name: "oper_unit_name", newline: false, type: "select", cssClass: "field",
                labelWidth: 90,
                width: 170,
                space: 30,
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
        width: 650,
        height: 350,
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
