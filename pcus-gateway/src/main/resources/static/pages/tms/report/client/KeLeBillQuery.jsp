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
    <title>可乐业务数据汇总表</title>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/client/keleBillQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/client/keleBillQuery/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //初始化表格选项
    var gridOption = {
        columns: [
            {display: '结算日期', name: 'd', align: 'left', minWidth: 80, width: '3%'},
            {display: '配送类型', name: 'type_name', align: 'left', minWidth: 80, width: '3%'},
            {display: '司机', name: 'driver_name', align: 'left', minWidth: 80, width: '3%'},
            {display: '车牌号', name: 'car_no', align: 'left', minWidth: 80, width: '3%'},
            {display: '封条号', name: 'seal_no', align: 'left', minWidth: 80, width: '3%'},
            {display: '运输类型', name: 'bs_type_name', align: 'left', minWidth: 80, width: '3%'},
            {display: '收货单位名称', name: 'unload_org', align: 'left', minWidth: 60, width: '3%'},
            {display: '装货地', name: 'load_address', align: 'left', minWidth: 60, width: '3%'},
            {display: '卸货地', name: 'unload_address', align: 'left', minWidth: 60, width: '3%'},
            {display: '车次', name: 'car_seq', align: 'left', minWidth: 60, width: '3%'},
            {
                display: '重量', name: 'weight', align: 'left', minWidth: 50, width: '3%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum.toFixed(4);
                    }
                }
            },
            {
                display: '数量', name: 'qty', align: 'left', minWidth: 50, width: '3%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum;
                    }
                }
            },
            {display: '单价', name: 'charge_price', align: 'left', minWidth: 50, width: '3%'},
            {
                display: '客户产值', name: 'charge_amount', align: 'left', minWidth: 50, width: '3%',
                totalSummary: {
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
                display: '司机提成', name: 'tc', align: 'left', minWidth: 50, width: '3%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum.toFixed(2);
                    }
                }
            },
            {display: '装车单号', name: 'client_bill_no', align: 'left', minWidth: 80, width: '3%'},
            {display: '客户', name: 'client_name', align: 'left', minWidth: 80, width: '3%'},
            {display: '是否外协', name: 'outer_name', align: 'left', minWidth: 50, width: '3%'},
            {
                display: '外协产值', name: 'yf', align: 'left', minWidth: 50, width: '3%',
                totalSummary: {
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
                display: '空车公里数', name: 'empty_km', align: 'left', minWidth: 50, width: '3%',
                totalSummary: {
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
                display: '重车公里数', name: 'full_km', align: 'left', minWidth: 50, width: '3%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum.toFixed(2);
                    }
                }
            },
            {display: '油耗', name: 'fuel_cost', align: 'left', minWidth: 50, width: '3%'},
            {display: '是否带货', name: 'take_goods', align: 'left', minWidth: 50, width: '3%'},
            {display: '是否回单', name: 'ret_bill', align: 'left', minWidth: 50, width: '3%'},
            {display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '3%'},
            {display: '配载单号', name: 'trans_bill_no', align: 'left', minWidth: 110, width: '3%'},
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
        title: '可乐业务数据汇总表',
        localStorageName: basePath.match(/\w+\/$/)[0].split('/')[0] + user.id,
        colDraggable: true            // 移动表头
    };
    var defaultAction = function (item) {
        switch (item.id) {
            case"search":
                $.ligerDialog.open(dialogOption);
                break;
            case"export":
                xlsUtil.exp($('#download'), mainGrid, "可乐业务数据汇总表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
                display: "委托单位",
                name: "client_name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text"
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
//                    var y = $("#s_year").attr("value");
//                    var m = $("#s_month").attr("value");
//                    if (y && m) {
//                        $(".l-panel-header-text").html(y + '年' + m + '月份业务数据汇总表');
//                    }
//                    else if (y == '' && m) {
//                        $(".l-panel-header-text").html(m + '月份业务数据汇总表（高栏）');
//                    }
//                    else if (y && m == '') {
//                        $(".l-panel-header-text").html(y + '年业务数据汇总表（高栏）');
//                    } else {
//                        $(".l-panel-header-text").html('业务数据汇总表（高栏）');
//                    }
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
