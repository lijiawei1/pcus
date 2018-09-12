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
    <title>汽水运输情况汇总表</title>
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

        .l-grid-hd-cell-inner {
            line-height: 20px;
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
    <form id="download" method="POST" target="_blank" action="/tms/report/kele/client/keleDetailBillQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/kele/client/keleDetailBillQuery/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //初始化表格选项
    var gridOption = {
        columns: [
            {display: '送达目的地', name: 'a', align: 'left', minWidth: 100, width: '5%'},
            {display: '车号', name: 'b', align: 'left', minWidth: 80, width: '5%'},
            {display: '日期', name: 'c', align: 'left', minWidth: 80, width: '5%'},
            {display: '出货单号', name: 'd', align: 'left', minWidth: 80, width: '5%'},
            {display: '玻璃瓶装', name: 'e', align: 'left', minWidth: 50, width: '5%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }},
            {display: '糖浆', name: 'f', align: 'left', minWidth: 50, width: '5%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }},
            {display: '易拉罐', name: 'g', align: 'left', minWidth: 50, width: '5%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }},
            {display: 'PET300ml/ 350ml*24', name: 'h', align: 'left', minWidth: 80, width: '7%', heightAlign: 'center',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }},
            {display: 'PET500ml/ 550ml/ 600ml*24', name: 'i', align: 'left', minWidth: 80, width: '8%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }},
            {display: 'PET1.25L/2L/ 2.3L/2.5L 5加仑', name: 'j', align: 'left', minWidth: 80, width: '8%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }},
            {display: '268ml咖啡/ 180ml咖啡/ 200ml美汁源/ 250ml果粒奶优/ 330mlQoo', name: 'k', align: 'left', minWidth: 80, width: '10%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: 'PET(250ml/ 268ml)1*24/ PET/420-450ml美汁源/ 480ml/ 550ml*12冰露水/600ml*15',
                name: 'l', align: 'left', minWidth: 80, width: '10%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: 'PET450ml*24 (果粒橙)',
                name: 'm',
                align: 'left',
                minWidth: 80,
                width: '7%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: 'PET1.25L 美汁源系列',
                name: 'n',
                align: 'left',
                minWidth: 80,
                width: '7%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: 'PET1.5L/ 1.8L果粒橙',
                name: 'o',
                align: 'left',
                minWidth: 80,
                width: '7%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: '雪柜/现调机',
                name: 'p',
                align: 'left',
                minWidth: 80,
                width: '5%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: '广告品',
                name: 'q',
                align: 'left',
                minWidth: 80,
                width: '5%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: '包装物',
                name: 'r',
                align: 'left',
                minWidth: 80,
                width: '5%',
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '5%'
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
        headerRowHeight: 100,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        title: '汽水运输情况汇总表'
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
                xlsUtil.exp($('#download'), mainGrid, "汽水运输情况明细表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
                    "data-name": "settle_date", //查询字段名称
                    dateformat: "yyyy-MM-dd"
                }
            }, {
                display: "结算日期至",
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
                    "data-name": "settle_date", //查询字段名称
                    datetimerange: true,
                    dateformat: "yyyy-MM-dd hh:mm:ss"
                }
            },
            {
                display: "车型",
                name: "booking_car_type",
                width: 170,
                newline: false,
                type: "select",
                cssClass: "field",
                comboboxName: "car_type_c",
                options: {
                    data: [
                        {
                            id: 'XC',
                            text: '箱车'
                        },
                        {
                            id: 'QYC',
                            text: '牵引车'
                        }
                    ],
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true //多选
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

//                    var y = $("#s_year").attr("value");
//                    var m = $("#s_month").attr("value");
//                    if (y && m) {
//                        $(".l-panel-header-text").html(y + '年' + m + '月份邓杨金（外协）运输明细表');
//                    }
//                    else if (y == '' && m) {
//                        $(".l-panel-header-text").html(m + '月份邓杨金（外协）运输明细表');
//                    }
//                    else if (y && m == '') {
//                        $(".l-panel-header-text").html(y + '年邓杨金（外协）运输明细表');
//                    } else {
//                        $(".l-panel-header-text").html('邓杨金（外协）运输明细表');
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
