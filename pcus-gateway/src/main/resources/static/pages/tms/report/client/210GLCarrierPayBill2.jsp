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
    <title>高栏外协对账单（合并孖拖）</title>
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
    <form id="download" method="POST" target="_blank" action="/tms/report/client/210GLCarrierPayBill2/exportExcel">
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
    var basePath = rootPath + '/tms/report/client/GLCarrierPayBill2/';
    //页面控件
    var toptoolbar, mainGrid, searchForm;
    var gridColumnRender = [];

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '序号', name: 'rn', align: 'left', minWidth: 50, width: '10%',
                render: function (row, index) {
                    return index + 1;
                }
            },
            {
                display: '日期', name: 'd', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车队', name: 'carrier_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车牌', name: 'car_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '货物名称', name: 'cargo_info', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '装货地', name: 'load_address', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '卸货地', name: 'unload_address', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '签收重量', name: 'weight', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
//                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '数量', name: 'qty', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '单价', name: 'price', align: 'left', minWidth: 50, width: '10%'
            },

            {
                display: '运费', name: 'yf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '其他费', name: 'qtf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '洗箱费', name: 'xxf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '装卸费', name: 'zxf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '报关费', name: 'bgf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '垫付费', name: 'dff', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '压夜费', name: 'yyf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '路桥费', name: 'lqf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '住宿费', name: 'zsf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '加班补贴', name: 'jbbt', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '超时费', name: 'csf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '打单费', name: 'ddf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '港务费', name: 'gwf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '过磅费', name: 'gbf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '海运费', name: 'hyf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '码头综合费', name: 'mtzhf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '物流辅助服务费', name: 'wlfzfwf', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '邮费', name: 'yf2', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '额外补贴', name: 'ewbt', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        gridColumnRender.push({index: column.columnindex, isShow: !(info.sum === 0)});
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '合计', name: 'total', align: 'left', minWidth: 50, width: '10%',
                totalSummary: {
                    align: 'center', type: 'sum',
                    render: function (info, column) {
                        return info.sum.toFixed(2);
                    }
                }
            },
            {
                display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '10%'
            }

        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: true,		//初始化不加载数据
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
        title: '高栏通用外协集装箱对帐明细（合并孖拖）',
        colDraggable: true,            // 移动表头
        onShowDataed: function () {
            var g = this;
            for (var i = 0; i < gridColumnRender.length; i++) {
                var item = gridColumnRender[i];
                g.toggleCol(item.index, item.isShow);
            }
            gridColumnRender = [];
        }
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
                xlsUtil.exp($('#download'), mainGrid, "高栏通用外协对账单（合并孖拖）.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)})
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
                display: "账单号",
                name: "settle_bill_no",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text"
            },
            {
                display: "车队",
                name: "carrier_name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text"
            },
            {
                display: "车牌",
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
                display: "柜号",
                name: "cntr_no",
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
//          var y=$("#s_year").attr("value");
//          var m=$("#s_month").attr("value");
//          if(y && m){
//            $(".l-panel-header-text").html(y+'年'+m+'月份珠海旺事达对帐明细');
//          }
//          else if(y==''&& m){
//            $(".l-panel-header-text").html(m+'月份珠海旺事达对帐明细');
//          }
//          else if(y && m==''){
//            $(".l-panel-header-text").html(y+'年珠海旺事达对帐明细');
//          }else{
//            $(".l-panel-header-text").html('珠海旺事达对帐明细');
//          }
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
