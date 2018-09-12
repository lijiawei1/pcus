<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>客户资料</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style type="text/css">
        .shixiao {
            color: #fff;
            background-color: #ff0000;
        }

        .xinjilu {
            color: #fff;
            background-color: #32CD32;
        }
    </style>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div id="layout">
    <div class="content-wrapper single-search history-search-wrapper">
        <div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span class="text">高级<br>搜索</span>
        </div>
        <form class="history-search-form" id="history-search-form">
        </form>
        <div class="history-search-btn limit-select" id="history-search-btn" title="搜索">&gt;</div>
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
            <a class="qs-item" href="javascript:;" onclick="quickQuery(3,this)">新客户(${xinjilu})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(1,this)">使用中(${shiyongzhong})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(2,this)">已失效(${yishixiao})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(4,this)">无合同(${wuhetong})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(5,this)">无报价(${wubaojia})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(6,this)">合同预警(${yujing})</a>
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
<script>
    var SELECTED = 'selected';
    //上下文路径
    var basePath = rootPath + '/tms/bas/client/';
    //默认数据
    var emptyData = {
        name: '',
        fname: '',
        code: '',
        ename: '',
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
                display: '状态',
                name: 'state_name',
                sortname: 'state',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                render: function (item) {
                    if (item.state_name == '新记录') {
                        return '<div class="xinjilu bg-cell">' + item.state_name + '</div>';
                    }
                    else if (item.state_name == '已失效') {
                        return '<div class="shixiao bg-cell">' + item.state_name + '</div>';
                    }
                    return item.state_name;
                }
            },
            {
                display: '客户简称', name: 'name', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '客户代码', name: 'code', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '客户全称', name: 'fname', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '英文名称', name: 'ename', align: 'left', minWidth: 50, width: '15%'
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '30%'
            }
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
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
        sortName: 'STATE,CREATE_TIME', //多字段排序状态顺序，创建时间倒序
        sortOrder: 'ASC,DESC'
    };

    var fontSize = 12 / detectZoom(top);
    var filterFormOption = {
        //搜索框绑定信息
        searchBind: {
            //搜索按钮ID
            searchBtnId: "searchBtn",
            //重置按钮ID
            resetBtnId: "resetBtn",
            //绑定表格ID
            bindGridId: "mainGrid",
            //搜索后事件
            onAfterSearch: function () {
                //如果是在高级搜索里，则需关闭高级搜索
                var $advanced = $(this).parents(".advanced-search-wrap");
                if ($advanced.length > 0) {
                    $advanced.children('[data-action="close-advanced-search"]').trigger("click");
                }

                //清除tag选择样式
                $("a.qs-item.visited").removeClass("visited");
            }
        },

        historySearch: {
            formId: "history-search-form",
            storageId: "clientlist_ui" + user.id,
            searchBtnId: "history-search-btn",
            wordWidth: fontSize,
            fieldWidthDiff: fontSize,
            options: {
                labelWidth: 90,
                inputWidth: 170,
                space: 5,
                prefixID: "hs_"
            },
            defaultFields: {
                "fname": true,
                "code": true
            },
            exFields: {}
        },

        labelWidth: 90,
        inputWidth: 220,
        space: 30,
        prefixID: "s_",
        fields: [
            {
                display: "客户全称",
                name: "fname",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "客户简称",
                name: "name",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "客户代码",
                name: "code",
                newline: false,
                type: "text",
                cssClass: "field"
            }
        ]
    };

    var mainFormOption = {
        fields: [
            {
                display: "客户简称",
                name: "name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true},
                attr: {
                    maxlength: 10
                },
            },
            {
                display: "客户全称",
                name: "fname",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true},
                attr: {
                    maxlength: 20
                },
            },
            {
                display: "客户代码",
                name: "code",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true},
                attr: {
                    maxlength: 10
                },
            },
            {
                display: "英文名称",
                name: "ename",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 10,
                type: "text",
                cssClass: "field",
            },
            {
                display: "结算日期",
                name: "sellte_date_field",
                newline: true,
                labelWidth: 80,
                width: 170,
                space: 30,
                cssClass: "field",
                type: 'select',
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=settle_date_field'
                },
                validate: {required: true, messages: {required: '结算日期不能为空'}},
            },
            {
                display: "备注",
                name: "remark",
                newline: false,
                labelWidth: 80,
                width: 452,
                space: 10,
                rows: 4,
                type: "textarea"
            }
        ],
        validate: true,
        toJSON: JSON2.stringify
    };

    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 250,
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
                            dialog.hide();
                            //刷新角色列表
                            mainGrid.reload();
                            LG.showSuccess('保存成功!', function () {
                                //跳转到明细页面
                                jumpDetailEdit(data);
                            });
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

    //扩展按钮
    var toolbarOption = {
        // items: [
        //     {id: 'add', text: '增加', click: defaultAction, icon: 'add', status: ['OP_INIT']},
        //     {id: 'delete', text: '删除', click: defaultAction, icon: 'delete', status: ['OP_INIT']},
        // ]
    };
    // var btnClick = function (item) {};


    function jumpDetailEdit(rowdata) {
        top.f_addTab(rowdata.pk_id, '客户[' + rowdata.name + ']', basePath + 'loadCard'
                + '?module=' + param.module + '&function=' + param.fun + '&pk_id=' + rowdata.pk_id);
    }

</script>
<script src="${path}/js/tms/bas/client/clientList.js?t=${applicationScope.sys_version}"></script>
<script>
    $(function () {
        //双击事件
        mainGrid.bind('dblClickRow', function (rowdata) {
            //进入客户资料信息页签
            top.f_addTab(rowdata.pk_id, '客户[' + rowdata.name + ']', basePath + 'loadCard'
                    + '?module=' + param.module + '&function=' + param.fun + '&pk_id=' + rowdata.pk_id);
        });
    });
    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var selected = mainGrid.getRow(index);

        //进入客户资料信息页签
        top.f_addTab(selected.pk_id, '客户[' + selected.name + ']', basePath + 'loadCard'
                + '?module=' + param.module + '&function=' + param.fun + '&pk_id=' + selected.pk_id);

    });

    function quickQuery(type, obj) {
        $("a.qs-item.visited").removeClass("visited");
        $(obj).addClass("visited");
        if (defaultSearchFilter["and"].length > 0) {
            defaultSearchFilter["and"].pop();
        }
        if (type == 0) {
        }
        if (type == 1) {
            defaultSearchFilter["and"].push({field: 'state', value: 'STATE_11_USE', op: 'equal', type: 'string'});
        }
        if (type == 2) {
            defaultSearchFilter["and"].push({field: 'state', value: 'STATE_15_INVALID', op: 'equal', type: 'string'});
        }
        if (type == 3) {
            defaultSearchFilter["and"].push({field: 'state', value: 'STATE_10_NEW', op: 'equal', type: 'string'});
        }
        if (type == 4) {
            defaultSearchFilter["and"].push({field: 'contract_count', value: '0', op: 'equal', type: 'int'});
        }
        if (type == 5) {
            defaultSearchFilter["and"].push({field: 'fee_count', value: '0', op: 'equal', type: 'int'});
        }
        if (type == 6) {
            defaultSearchFilter["and"].push({field: 'yujing', value: '0', op: 'greater', type: 'int'});
        }
        mainGrid.set('parms', [{name: 'where', value: getSearchGridData(mainGrid, '', defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    }
</script>
</body>
</html>