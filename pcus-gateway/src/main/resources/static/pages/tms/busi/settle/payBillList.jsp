<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/10
  Time: 18:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>应收账单</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        body.in-iframe {
            background-color: #d6dae6;
        }

        .in-iframe .content-wrapper {
            border: 1px solid #ececec;
            border-radius: 10px;
            margin: 4px 0 2px 0;
            padding: 6px;
            box-shadow: 0 0 3px 3px #D6D8E2;
        }

        .in-iframe .toolbar-wrapper {
            background-color: transparent;
        }

        .in-iframe .content-wrapper.single-search {
            padding: 0;
        }
    </style>
</head>
<body>
<div id="layout">
    <div class="content-wrapper single-search">
        <form id="filterForm"></form>
        <ul class="search-btn-con">
            <li class="search-btn s-btn limit-select" id="searchBtn"></li>
            <li class="search-btn r-btn limit-select" id="resetBtn"></li>
        </ul>
        <div class="l-clear"></div>
        <%--<div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn">--%>
            <%--<span class="text">高级<br>搜索</span>--%>
        <%--</div>--%>
        <%--<div class="search-box">--%>
            <%--<div class="input-box">--%>
                <%--<input type="text" placeholder="在此输入关键词" data-action="single-search-input">--%>
                <%--<span class="clear">&times;</span>--%>
                <%--<span class="search-btn limit-select" data-action="single-search"><i class="iconfont l-icon-search"></i>搜索</span>--%>
            <%--</div>--%>
            <%--<div class="search-history">--%>
                <%--<a href="javascript:;">珠海港</a>--%>
                <%--<a href="javascript:;">更多 &gt;</a>--%>
            <%--</div>--%>
        <%--</div>--%>
    </div>
    <div class="toolbar-wrapper search-toolbar-wrapper">
        <div class="hidden-search">
            <i class="l-icon l-icon-search" data-action="single-search"></i>
            <input class="hs-input" placeholder="在此输入关键字" data-action="single-search-input">
            <span class="clear">&times;</span>
            <span class="status2 hs-btn limit-select" data-action="single-search">&gt;</span>
            <span class="status1 text">搜索</span>
            <span class="status2 text cancel">取消</span>
        </div>
        <div id="toptoolbar"></div>
    </div>
    <!-- 卡片界面 -->
    <div class="content-wrapper grid-wrapper">
        <!-- 列表界面 -->
        <div id="mainGrid"></div>
        <!-- 快速搜索 -->
        <div class="quick-search">
            <a class="qs-item visited" href="javascript:;" onclick="quickQuery(0,this)">全部(${all})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(1,this)">新记录(${xinjilu})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(2,this)">已审核(${yishenhe})</a>
        </div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
<!-- 高级搜索 -->
<div class="advanced-search-wrap" id="advanced-search-wrap">
    <div class="rect border"></div>
    <div class="circle big border"></div>
    <div class="circle big inner"></div>
    <div class="circle small border"></div>
    <div class="circle small inner close limit-select" data-action="close-advanced-search">&times;</div>
    <div class="advanced-search" id="advanced-search">
        <div class="advanced-search-title">高级搜索</div>
        <div class="advanced-search-content">
            <form id="filterForm"></form>
        </div>
        <ul class="search-btn-con">
            <li class="search-btn s-btn limit-select" id="searchBtn"></li>
            <li class="search-btn r-btn limit-select" id="resetBtn"></li>
        </ul>
    </div>
</div>

<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/settle/pay/download">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>
<script>

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/settle/pay/';

    //默认数据
    var emptyData = {
        rule_name: '',
        rule_code: '',
        consuming: 0,
        modify_time: '',
        modify_psn: '',
        remark: ''
    };

    //页面元素
    var $gridWrapper = $(".grid-wrapper"),
            $filterWrapper = $(".filter-wrapper"),
            $filterForm = $("#filterForm"),
            $mainDlg = $("#mainDlg"), //编辑弹窗
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            mainGrid, //列表
            mainForm, //编辑表单
            mainDlg; //弹窗

    var where = JSON2.stringify({
        op: 'and',
        rules: [{field: 'DR', value: '0', op: 'equal'}, {field: 'bill_type', value: '2', op: 'equal'}]
    });

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '编辑', name: 'edit', align: '', minWidth: 50, width: '3%', sortable: false,
                render: function (item, index) {
                    return '<a class="row-btn row-edit-btn" data-index="' + index + '" title="编辑" ><i class="iconfont l-icon-edit"></i></a>';
                }
            },
            {
                display: '下载', name: 'download', align: 'left', minWidth: 50, width: '3%', quickSort: false,
                render: function (item, index) {
                    return '<a class="row-btn row-download-btn" data-index="' + index + '" title="下载" ><i class="iconfont l-icon-download"></i></a>';
                },
                hide: disabledButtons.indexOf('download') >= 0
            },
            {
                display: '预览', name: 'preview', align: 'left', minWidth: 50, width: '3%', quickSort: false,
            },
            {
                display: '状态',
                name: 'state_name',
                align: 'left',
                minWidth: 50,
                width: '5%',
                isSort: false,
                quickSort: false
            },
            {
                display: '账单号', name: 'bill_no', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '结算单位', name: 'com_name', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '年', name: 'bill_year', align: 'left', minWidth: 50, width: '50'
            },
            {
                display: '月', name: 'bill_month', align: 'left', minWidth: 50, width: '50'
            },
            {
                display: '应付账单总额', name: 'bill_amount', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '账单税金', name: 'tax_amount', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '结算币种', align: 'left', minWidth: 50, width: '15%', render: function (item) {
                return '人民币';
            },
            },
            {
                display: '记账公司', name: 'name', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '制单人', name: 'create_psn', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '制单时间', name: 'create_time', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '15%'
            },
        ],
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        checkbox: true,
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -40,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'bill_year,bill_month,create_time',
        sortOrder: 'desc,desc,desc',
        parms: [{name: 'where', value: where}],
        pageSizeOptions:[30,50,100,500,1000],
        pageSize:50,
        colDraggable: true,
        localStorageName: 'payBill' + user.id
    };

    var filterFormOption = {
        fields: [
            {
                display: "结算单位",
                name: "com_name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "账单年份",
                name: "bill_year",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "账单月份",
                name: "bill_month",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "账单号",
                name: "bill_no",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "制单人",
                name: "create_psn",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "备注",
                name: "remark",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            }
        ]
    };

    var mainFormOption = {
        fields: [],
        validate: true,
        toJSON: JSON2.stringify
    };


    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 300,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {

                    //校验数据
                    if (!mainForm.valid()) {
                        mainForm.showInvalid();
                        return;
                    }

                    var selected = $mainForm.data(SELECTED);
                    //地址
                    var url = !!selected ? 'update' : 'add';
                    //数据
                    var data = $.extend({}, selected, mainForm.getData(), {
                        create_time: $mainForm.find("input[name=create_time]").val(),
                        modify_time: $mainForm.find("input[name=modify_time]").val()
                    });

                    LG.singleAjax({
                        url: basePath + url,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (data, msg) {
                            LG.tip('保存成功!')
                            dialog.hide();
                            //刷新角色列表
                            mainGrid.reload();
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    }, item);

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

    var btnClick = function (item) {
        switch (item.id) {
            case "add":
                //跳转到新页签 编辑
                //进入客户资料信息页签
                top.f_addTab('pay_bill_do', '应付账单制作', rootPath + '/tms/settle/makebillpay/loadPage'
                        + '?module=' + param.module + '&function=应付账单制作&from=' + basePath + 'loadPage');
                break;
            case "audit":
                $.ligerDialog.confirm('是否确认审核账单？', function (yes) {
                    if (yes) {

                        var selected = mainGrid.getCheckedRows();
                        if ((selected == null) || (selected == '') || (selected == 'undefined')) {
                            LG.showError('请选择行');
                            return;
                        }
                        ;
                        var order_id = [];
                        for (var i = 0; i < selected.length; i++) {
                            order_id.push(selected[i].pk_id)
                        }
                        $.ajax({
                            url: basePath + 'audit',
                            data: {ids: order_id.join(',')},
                            success: function (data, msg) {
                                if (JSON2.parse(data).error) {
                                    LG.showError(JSON2.parse(data).message);
                                } else {
                                    LG.tip("审核成功。");
                                }
                                //刷新角色列表
                                mainGrid.reload();
                            },
                            error: function (message) {
                                LG.showError(message);
                            }
                        });
                    }
                });
                break;
            case "cancel":
                $.ligerDialog.confirm('是否确认取消审核账单？', function (yes) {
                    if (yes) {

                        var selected = mainGrid.getCheckedRows();
                        if ((selected == null) || (selected == '') || (selected == 'undefined')) {
                            LG.showError('请选择行');
                            return;
                        }
                        ;
                        var order_id = [];
                        for (var i = 0; i < selected.length; i++) {
                            order_id.push(selected[i].pk_id)
                        }
                        $.ajax({
                            url: basePath + 'reAudit',
                            data: {ids: order_id.join(',')},
                            success: function (data, msg) {
                                if (JSON2.parse(data).error) {
                                    LG.showError(JSON2.parse(data).message);
                                } else {
                                    LG.tip("操作成功。");
                                }
                                //刷新角色列表
                                mainGrid.reload();
                            },
                            error: function (message) {
                                LG.showError(message);
                            }
                        });
                    }
                });
              break;
            default:
                break;
        }
    };

    //扩展按钮
    var toolbarOption = {
        items: [
            {id: 'add', ignore: true},
            {id: 'audit', text: '审核', click: btnClick, icon: 'audit', status: ['OP_INIT']},
            {id: 'cancel', text: '撤销', click: btnClick, icon: 'withdraw', status: ['OP_INIT']}
        ]
    };


</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>
<script>
    defaultSearchFilter["and"].push({field: 'bill_type', value: '2', op: 'equal', type: 'string'});
    $(function () {
        //双击事件
        mainGrid.bind('dblClickRow', function (rowdata) {
            //进入客户资料信息页签
            top.f_addTab(rowdata.pk_id, '应付账单[' + rowdata.bill_no + ']', rootPath + '/tms/settle/pay/loadCard'
                    + '?module=' + param.module + '&function=应付账单&pk_id=' + rowdata.pk_id + '&from=' + basePath + 'loadPage');
        });
    });
    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var selected = mainGrid.getRow(index);

        //进入客户资料信息页签
        top.f_addTab(selected.pk_id, '应付账单[' + selected.bill_no + ']', rootPath + '/tms/settle/pay/loadCard'
                + '?module=' + param.module + '&function=应付账单&pk_id=' + selected.pk_id + '&from=' + basePath + 'loadPage');

    });

    //初始化下载按钮
    $mainGrid.on('click', 'a.row-download-btn', function (e) {
        var index = $(this).data("index");
        var selected = mainGrid.getRow(index);

//        excel(selected.pk_id, '应付账单[' + selected.com_name + selected.bill_year + '年' + selected.bill_month + '月' + ']明细' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
        var filename = '应付账单[' + selected.com_name + selected.bill_year + '年' + selected.bill_month + '月' + ']明细.xls';
        var headers = "结算日期,司机,车牌号,费用名称,应付,含税,提柜码头,装卸单位信息,还柜码头,柜号,柜型,预抵时间,客户,订舱号,封条号,业务类型,计费方式,计费单位,备注,工作号,任务号,急单类型,提柜堆场,还柜堆场,散货数量,船公司,船名,航次,揽货公司,操作单位,录单人,录单时间"
        var names = "settle_date,driver_name,car_no,fee_name,total,tax,gate_out_dock,load_org,gate_in_dock,cntr_no,cntr_type,cntr_work_time,client_name,booking_no,cntr_seal_no,bs_type_name,fee_type_name,fee_unit_name,remark,bill_no,trans_bill_no,urgen_name,gate_out_yard,gate_in_yard,cargo_qty,ship_corp,ship_name,voyage,supplier_name,oper_name,create_psn,create_time"

        xlsUtil.exp($('#download'), mainGrid, filename, { pk_id: selected.pk_id}, headers, names);
    });

    function quickQuery(type, obj) {
        $("a.qs-item.visited").removeClass("visited");
        $(obj).addClass("visited");
        if (defaultSearchFilter["and"].length > 1) {
            defaultSearchFilter["and"].pop();
        }
        if (type == 0) {
        }
        if (type == 1) {
            defaultSearchFilter["and"].push({field: 'state', value: 'STATE_10_NEW', op: 'equal', type: 'string'});
        }
        if (type == 2) {
            defaultSearchFilter["and"].push({field: 'state', value: 'STATE_30_AUDIT', op: 'equal', type: 'string'});
        }
        mainGrid.set('parms', [{name: 'where', value: getSearchGridData(mainGrid, '', defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    }
</script>
</body>
</html>
