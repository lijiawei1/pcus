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
    <title>司机产值报表</title>
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
            <div id="echart"></div>
        </div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="searchDialog" style="display: none;">
    <form id="searchForm"></form>
</div>
<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="/tms/report/settle/driverOutputQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/settle/driverOutputQuery/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //初始化表格选项
    var gridOption = {
        columns: [

            {
                display: '结算月份', name: 'work_time', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '司机', name: 'driver_name', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '总产值', name: 'total_amount', align: 'left', minWidth: 50, width: '5%', totalSummary: {
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
                display: '财务确认产值', name: 'unconfirmed_amount', align: 'left', minWidth: 50, width: '5%', totalSummary: {
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
                display: '司机确认产值', name: 'confirmed_amount', align: 'left', minWidth: 50, width: '5%', totalSummary: {
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
                display: '疏港进口', name: 'cntr_import', align: 'left', minWidth: 50, width: '5%', totalSummary: {
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
                display: '集港出口', name: 'cntr_export', align: 'left', minWidth: 50, width: '5%', totalSummary: {
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
                display: '散货整车', name: 'cargo', align: 'left', minWidth: 50, width: '5%', totalSummary: {
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
                display: '配送运输', name: 'distr', align: 'left', minWidth: 50, width: '5%', totalSummary: {
                align: 'center', //汇总单元格内容对齐方式:left/center/right
                type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                render: function (e) {
                    //汇总渲染器，返回html加载到单元格
                    //e 汇总Object(包括sum,max,min,avg,count)
                    return "合计：" + e.sum;
                }
            }
            }
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        width: '100%',
        autoStretch: true,
        height: '50%',
        dataAction: 'local',
        localStorageName: basePath.match(/\w+\/$/)[0].split('/')[0] + user.id,
        checkbox: false,
        usePager: false,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: 0,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        sortName: 'SETTLE_DATE',
        sortOrder: 'ASC',
        onAfterShowData: function (data) {

            loadChart(data);
        },
    };
    var defaultAction = function (item) {
        switch (item.id) {
            case"search":
                $.ligerDialog.open(dialogOption);
                break;
            case"export":
                xlsUtil.exp($('#download'), mainGrid, "司机产值表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)});
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
                display: "结算开始时间",
                name: "start_date",
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "greaterorequal", //操作符
                    "data-name": "work_time",
                    "dateformat": "yyyy-MM-dd"
                },
                validate: {required: true}
            },
            {
                display: "结算结束时间",
                name: "end_date",
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {format: "yyyy-MM-dd"},
                attr: {
                    op: "lessorequal", //操作符
                    "data-name": "work_time",
                    "dateformat": "yyyy-MM-dd"
                },
                validate: {required: true}
            },
            {
                display: "司机",
                name: "driver_name",
                newline: false,
                type: "text",
                cssClass: "field",
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

    var myChart;
    $(function () {

        //$("#echart").css("height", $("#mainGrid").height() + 30 + "px");
        //初始化图表
        myChart = echarts.init(document.getElementById('echart'), 'macarons');

        //美滋滋的自适应；
        $(window).on("resize", function () {
            myChart.resize();
        });
    });


    function loadChart(gridData) {
        var option = {
                    title: {
                        text: '司机产值'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: [],
                            axisLabel: {    // 轴标记
                                interval: 0,
                                rotate: -45
                            }
                        }
                    ],
                    grid: { // 控制图的大小，调整下面这些值就可以，
                        x: 50,
                        y: 50
                    },
                    legend: {
                        data: ['总产值']
                    },
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '总产值',
                            type: 'bar',
                            data: [],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'top'
                                    }
                                }
                            }
                        }
                    ]
                }
                ;
        if (gridData && gridData.Rows.length > 0) {

            for (var i = 0; i < gridData.Rows.length; i++) {
//                option.xAxis[0].data.push(gridData.Rows[i].work_time + gridData.Rows[i].car_no);
                option.xAxis[0].data.push(gridData.Rows[i].driver_name);

                option.series[0].data.push(gridData.Rows[i].total_amount);
//                option.series[1].data.push(gridData.Rows[i].cntr_export);
//                option.series[2].data.push(gridData.Rows[i].cargo);
//                option.series[3].data.push(gridData.Rows[i].distr);
//                option.series[4].data.push(gridData.Rows[i].total);
            }
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

</script>
</html>