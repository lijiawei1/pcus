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
    <title>合同预警</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <%--  <script src="/js/lib/echarts/echarts.common.min.js"></script>
      <script src="/js/lib/echarts/theme/macarons.js"></script>--%>
    <style>
        /*.wrapper100{*/
            /*padding-top: 0;*/
        /*}*/
        .yujing {
            color: #fff;
            background-color: #ff0000;
        }
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
    <form id="download" method="POST" target="_blank" action="/tms/report/client/contractQuery/exportExcel">
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
    var basePath = rootPath + '/tms/report/client/contractQuery';
    //页面控件
    var toptoolbar, mainGrid, searchForm;

    //    年份
    var filterFormOption = {
        prefixID: "s_",
        fields: [
            {
                display: "合同类型",
                name: "type",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                cssClass: "field",
                options: {
                    data: [{id: "客户合同", text: "客户合同"}, {id: "供应商合同", text: "供应商合同"}]
                }
            },
            {
                display: "自定义编号",
                name: "contract_own",
                labelWidth: 80,
                width: 170,
                space: 30,
            },
            {
                display: "状态",
                name: "state_name",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                cssClass: "field",
                options: {
                    data: [{id:"使用中", text:"使用中"}, {id: "已失效", text: "已失效"}, {id: "新记录", text: "新记录"}]
                }
            },{
                display: "合同名称",
                name: "contract_name",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                cssClass: "field",
                options: {
                    data: QUERY_CONST.SELECT_MONTH
                }
            }, {
                display: "甲方",
                name: "first_name",
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            }, {
                display: "乙方",
                name: "second_name",
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
                display: '类型',
                name: 'type',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                isSort: false,
            },
            {
                display: '状态',
                name: 'state_name',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                isSort: false,
            },
            {
                display: '预警',
                align: 'left',
                minWidth: 50,
                width: '5%',
                isSort: false,
                quickSort: false,
                render: function (item) {
                    if (item.end_date) {
                        var totalDate = DateUtil.dateDiff('d', new Date(), DateUtil.strToDate(item.end_date));
                        if (totalDate < 30 && totalDate >= 0)
                            return '<div class="yujing">' + totalDate + '</div>';
                        else if (totalDate < 0) {
                            return '<div class="yujing">已失效</div>';
                        }
                    }
                    return '';
                }
            },
            {
                display: '合同编号', name: 'contract_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '合同名称', name: 'contract_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '合同自定义编号', name: 'contract_own', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '甲方', name: 'first_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '乙方', name: 'second_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '合同币种', name: 'currency_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '生效日期', name: 'begin_date', align: 'left', minWidth: 50, width: '10%', type: 'date'
            },
            {
                display: '失效日期', name: 'end_date', align: 'left', minWidth: 50, width: '10%', type: 'date'
            },
            {
                display: '报价记录', name: 'count', align: 'left', minWidth: 50, width: '5%'
            }
        ],
        pageSize: 50,
        url: basePath + '/loadGrid',
        localStorageName: 'contractQuery' + user.id,
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
        title:'合同预警汇总表'
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
                xlsUtil.exp($('#download'), mainGrid, "合同预警汇总表.xls", {where: searchForm.getSearchFormData(false, defaultSearchFilter)});
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
        height: 260,
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

