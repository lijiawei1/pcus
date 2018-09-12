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
    <title>应收账单制作--查询</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        body.in-iframe{
            background-color: #d6dae6;
        }
        .in-iframe .content-wrapper {
            border: 1px solid #ececec;
            border-radius: 10px;
            margin: 4px 0 2px 0;
            padding: 6px;
            box-shadow: 0 0 3px 3px #D6D8E2;
        }
        .in-iframe .toolbar-wrapper{
            background-color: transparent;
        }
        .in-iframe .content-wrapper.single-search{
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
        <%--<div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span--%>
                <%--class="text">高级<br>搜索</span></div>--%>
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
<script>

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/settle/makebillrecieve/';

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

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '', align: '', minWidth: 50, width: '5%', sortable: false,
                render: function (item, index) {
                    return '<a class="row-edit-btn" data-index="' + index + '" title="编辑" ><i class="iconfont l-icon-edit"></i></a>';
                }
            },
            {
                display: '结算单位', name: 'fname', align: 'left', minWidth: 50, width: '23%'
            },
            {
                display: '记账公司', name: 'supplier_name', align: 'left', minWidth: 50, width: '23%'
            },
            {
                display: '结算币种', align: 'left', minWidth: 50, width: '23%', render: function (item) {
                return "人民币";
            }
            },
            {
                display: '应收总额', name: 'total', align: 'left', minWidth: 50, width: '23%'
            }
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: false,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -15,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'total',
        sortOrder: 'desc',
        pageSizeOptions:[30,50,100,500,1000],
        pageSize:50
    };

    var filterFormOption = {
        fields: [
            {
                display: "结算单位",
                name: "fname",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "记账公司",
                name: "supplier_name",
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

                break;
            default:
                break;
        }
    };

    //扩展按钮
    var toolbarOption = {
        items: [
            {id: 'add', icon: 'add', status: ['OP_INIT'], ignore: true},
            {id: 'delete', icon: 'add', status: ['OP_INIT'], ignore: true}
        ]
    };


</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>
<script>
    $(function () {
        //双击事件
        mainGrid.bind('dblClickRow', function (rowdata) {


            //进入客户资料信息页签
            top.f_addTab(rowdata.pk_id + "1", '应收账单制作[' + rowdata.name + ']', basePath + 'loadCard'
                    + '?module=' + param.module + '&function=应收账单制作&pk_id=' + rowdata.pk_id + '&supplier_id=' + rowdata.supplier_id);
        });
    });
    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var selected = mainGrid.getRow(index);

        //进入客户资料信息页签
        top.f_addTab(selected.pk_id + "1", '应收账单制作[' + selected.name + ']', basePath + 'loadCard'
                + '?module=' + param.module + '&function=应收账单制作&pk_id=' + selected.pk_id + '&supplier_id=' + selected.supplier_id);

    });
</script>
</body>
</html>
