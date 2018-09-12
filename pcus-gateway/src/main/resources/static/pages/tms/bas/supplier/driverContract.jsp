<%--
  Created by IntelliJ IDEA.
  User: sujing
  Date: 2017/12/20
  Time: 13:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>司机合同</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="/css/city-picker/city-picker.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <style>
        .dialog-container {
            display: none;
        }
        .search-toggle{
            display: block;
            width: 16px;
            height: 16px;
            text-align: center;
            position: absolute;
            font-size: 15px;
            font-weight: bold;
            font-family: "iconfont";
            font-style: normal;
            color: #17a0f5;
            right: 0;
            top: -20px;
            z-index: 100;
        }
        .search-toggle:before{
            content: "\e62e";
            display: inline-block;
            transform: rotate(90deg);
        }
        .search-toggle.on:before{
            transform: rotate(-90deg);
        }
        .c000, .c000:hover{
            color: #000;
        }
        .state-new {
            background-color: #cfc;
        }
        .state-audit {
            background-color: #cff;
        }
        .state-invalid {
            color: #fff;
            background-color: #ff0000;
        }
    </style>
</head>
<body>
<%--<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>--%>

<div id="layout">
    <a class="search-toggle" id="searchToggle" href="javascript:;"></a>
    <div class="content-wrapper single-search history-search-wrapper" id="single-search">
        <div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span class="text">高级<br>搜索</span></div>
        <form class="history-search-form" id="history-search-form"> </form>
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
    </div>
</div>

<form id="mainForm" class="dialog-container"></form>

<!-- 高级搜索弹窗 -->
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


<div id="importFailDialog" class="dialog-container">
    <form id="failForm" method="POST" target="_blank" action="">
    </form>
</div>

<!-- excel导出 -->
<div class="dialog-container">
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/fuelCard/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

<!--Excel导入-->
<div id="uploadDlg" class="dialog-container">
    <form id="uploadForm" enctype="multipart/form-data">
        <table style="height: 100%; width: 100%">
            <tr style="height: 40px">
                <td><input type="file" style="width: 200px" id="fileupload" name="fileupload"/></td>
            </tr>
        </table>
    </form>
</div>

</body>
<script>
    var SELECTED = 'selected';
    var basePath = rootPath + '/tms/bas/driverContract/';
    var where = {
        op: 'and',
        rules: [],
        groups: []
    };
    var oper_unit = ${oper_unit};
    var suppliers = ${suppliers};
    var driver_id = '${driver_id}';
    var supplier_id = '${supplier_id}';
    var drivers = ${driver};
    /*JSON.parse*/

    //默认数据
    var emptyData = {
        pk_id: '',
        fname: '',
        sname: '',
        code: '',
        remark: ''
    };

    var fontSize = 12 / detectZoom(top);

    $(function () {

        var mainGrid, seachForm, mainForm, toolbar;
        // 是否关闭高级搜索
        var materialsSearchToggle = localStorage['materialsSearchToggle'] ? localStorage['materialsSearchToggle'] : false ;

        // 主要表格
        mainGrid = $('#mainGrid').ligerGrid({
            columns: [
                {
                    //行内按钮
                    display: '编辑', align: '', minWidth: 50, width: '5%', sortable: false,
                    render: function (item, index) {
                        return '<a class="row-edit-btn" data-index="' + index + '" title="编辑" ><i class="iconfont l-icon-edit"></i></a>';
                    }
                },
                {
                    display: '状态', minWidth: 50, width: '5%', sortable: false,
                    name: 'state',
                    render: function (item, index, value) {
                        if (value ===  'STATE_10_NEW') {
                            return '<div style="background-color: #cfc;">新记录</div>';
                        } else if(value ===  'STATE_11_USE'){
                            return '<div style="background-color: #cff;">使用中</div>';
                        }else {
                            return '<div style="background-color: red;">已失效</div>';
                        }
                    }
                },//数据库存的是字母 orderStateNew.getCode()



/*
                {
                    display: '状态', minWidth: 50, width: '5%', sortable: false,
                    name: 'state',
                    render: function (item) {
                        if (item.state == '新记录') {
                            return '<div class="state-new">' + item.state + '</div>';
                        }
                        else if (item.state == '已审核') {
                            return '<div class="state-audit">' + item.state + '</div>';
                        }
                        else if (item.state == '已失效') {
                            return '<div class="state-invalid">' + item.state + '</div>';
                        }
                        return item.state;
                    }//数据库存的是文字 orderStateNew.getName()
                },*/

















                {
                    display: '合同名称',
                    name: 'contract_name',

                },
                {
                    display: '司机',
                    name: 'driver_id',
                    render: LG.render.ref(drivers, 'driver_id')

                },
                {
                    display: '车队',
                    name: 'supplier_id',
                    render: LG.render.ref(suppliers, 'supplier_id')
                },
                {
                    display: '开始时间',
                    name: 'begin_time'
                },{
                    display: '结束时间',
                    name: 'end_time'
                },{
                    display: '基本工资',
                    name: 'wage'
                },{
                    display: '提成比例',
                    name: 'tc',
                    render: function (data, index, val) {
                        return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                    }


                },{
                    display: '创建人',
                    name: 'create_psn'
                },{
                    display: '创建时间',
                    name: 'create_time'
                },{
                    display: '修改人',
                    name: 'modify_psn'
                },{
                    display: '修改时间',
                    name: 'modify_time'
                },
                {
                    display: '备注',
                    name: 'remark'
                }
            ],
            pageSize: 50,
            pageSizeOptions: [20, 50, 100, 500],
            url: basePath + 'loadGrid/'+ driver_id,
            delayLoad: false,		//初始化不加载数据
            checkbox: true,
            width: '100%',
            height: '100%',
            autoStretch: true,
            usePager: true,
            enabledEdit: false,
            clickToEdit: false,
            fixedCellHeight: true,
            heightDiff: -10,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            rownumbers: true,
            selectRowButtonOnly: true,
            parms: [{
                name: 'where',
                value: JSON.stringify(where)
            }]
//            sortName: 'CREATE_TIME',
//            sortOrder: 'DESC'
        });

        // 高级搜索弹窗
        seachForm = $('#filterForm').ligerSearchForm({
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
            historySearch:{
                formId: "history-search-form",
                storageId: "fuelCardList" + user.id,
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
                    "card_no": true,
                    "car_no": true
                }
            },
            labelWidth: 90,
            inputWidth: 220,
            space: 30,
            prefixID: "s_",
            fields: [
                {
                    display: "状态",
                    name: "state",
                    newline: false,
                    type: 'select',
                    options: {
                        data: [{id: 'STATE_10_NEW', text: '新记录'}, {id: 'STATE_11_USE', text: '使用中'}, {id: 'STATE_15_INVALID', text: '已失效'}]
                    }
                },{
                    display: '司机',
                    name: 'driver_id',
                    newline: false,
                    type: 'select',
                    options: {
                        data: drivers
                    }
                },{
                    display: '车队',
                    name: 'supplier_id',
                    newline: false,
                    type: 'select',
                    options: {
                        data: suppliers
                    }
                },{
                    display: "开始时间",
                    name: "begin_time",
                    newline: false,
                    type: "date",
                    editor: {
                        format: "yyyy-MM-dd",
                    },
                    attr: {
                        op: "greaterorequal", //操作符
                        dateformat: "yyyy-MM-dd",
                        "data-name": "begin_time"
                    }
                }, {
                    display: "至",
                    name: "end_time",
                    newline: false,
                    type: "date",
                    cssClass: "field",
                    editor: {
                        format: "yyyy-MM-dd",
                    },
                    attr: {
                        op: "lessorequal", //操作符
                        dateformat: "yyyy-MM-dd",
                        "data-name": "end_time"
                    }
                }



            ]
        });

        mainForm = $('#mainForm').ligerForm({
            fields: [
                {

                    display: '合同名称',
                    name: 'contract_name',
                    validate: {
                        required: true
                    }
                    //type: "date",
                    /*editor: {
                        showTime: true,
                        format: "yyyy-MM-dd hh:mm:ss"
                    },
                    validate: {
                    required: true
                }*/
                },
                {
                    display: '开始时间',
                    name: 'begin_time',
                    type: "date",
                    editor: {
                        showTime: true,
                        format: "yyyy-MM-dd hh:mm:ss"
                    }
                    /*validate: {
                        required: true
                    }*/
                },{
                    display: '结束时间',
                    name: 'end_time',
                    type: "date",
                    editor: {
                        showTime: true,
                        format: "yyyy-MM-dd hh:mm:ss"
                    }
                    /*validate: {
                     required: true
                     }*/
                },{
                    display: '基本工资',
                    name: 'wage',
                    /*validate: {
                     required: true
                     }*/
                },{
                    display: '提成比例',
                    name: 'tc',
                    /*validate: {
                     required: true
                     }*/
                },
                {
                    display: '备注',
                    name: 'remark'
                },
                {name: "pk_id", type: "hidden"},
                {name: "state", type: "hidden"}
            ],
            labelWidth: 140,
            inputWidth: 160,
            validate: true,
            prefixID: 'main_'
        });

        toolbar = $('#toptoolbar').ligerToolBar({
            items: [
                {
                    text: '添加',
                    icon: 'add',
                    click: add
                },
                {
                    text: '删除',
                    icon: 'delete',
                    click: deleteFn
                },
                {
                    text: '刷新',
                    icon: 'refresh',
                    click: refresh
                },
                {
                    text: '审核',
                    icon: 'audit',
                    click: auditBatch
                },
                {
                    text: '撤销审核',
                    icon: 'return',
                    click: cancelBatch
                }

            ]
        });


        //导入失败对话框
        var dialogOption_importFail = {
            target: $("#importFailDialog"),
            title: '导入失败',
            width: 800, height: 120,
            buttons: [
                {
                    text: '查看详细',
                    onclick: function (item, dialog) {
                        failForm.submit();
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

        mainGrid.grid.on('click', 'a.row-edit-btn', function (e) {
            var index = $(this).data("index");
            var selected = mainGrid.getRow(index);
            if(selected.state !== "STATE_10_NEW") {
                LG.showError("所选档案状态不是[新记录]，不可修改");
                return;
            }

            set(selected);
        });

        //历史表单搜索
        $('body').on({
            "keypress": function (e) {
                var $advancedSearchWrap = $("#advanced-search-wrap");
                //在高级搜索关闭时
                if (e.keyCode == 13 && (!$advancedSearchWrap.length || $advancedSearchWrap.is(":hidden"))) {
                    e.stopPropagation();
                    e.preventDefault();
                    historySearch();
                    return false;
                }
            },
            "single-search": function (e, value, target, target_e) {
                value = $.trim(value);
                mainGrid.set('parms', [{name: 'where', value: mainGrid.getSearchGridData(true, value, {
                    and: [],
                    or: []
                })}]);
                mainGrid.changePage('first');
                mainGrid.loadData();
            }
        });
        function historySearch() {
            seachForm.historySearch();
            //清除tag选择样式
            $(".quick-search>.qs-item.visited").removeClass("visited");
        }

        $('#searchToggle').on('click', function (e) {
            var $this = $(this),
                    parent = $('#single-search');

            $this.toggleClass('on');
            parent.slideToggle('slow', function () {
                mainGrid._initHeight();
            });
            localStorage.setItem('materialsSearchToggle', !localStorage['materialsSearchToggle']);
        });

        materialsSearchToggle && $('#searchToggle').click();

        function refresh () {
            mainGrid.reload();
        }
        function add () {
            mainForm.reset();
            openForm();
        }
        function set (data) {
            mainForm.reset();
            mainForm.setData(data);
            openForm('update');
        }
        function deleteFn () {
            var row = mainGrid.getSelecteds();
            if (row.length < 1) {
                LG.showError('请选择数据');
                return;
            }
            for(var i = 0; i<row.length; i++) {
                if(row[i].state !== "STATE_10_NEW") {
                    LG.showError("所选档案状态不是[新记录]，不可删除");
                    return;
                }
            }
            $.ligerDialog.confirm('确定删除数据？', '删除数据', function (result) {
                if (!result) {
                    LG.tip('已取消');
                    return;
                }

                var data = {
                    ids: row.map(function (item) {
                        return item['pk_id'];
                    }).join(',')
                };
//                debugger;
                LG.ajax({
                    url: basePath + 'remove',
                    data: data,
                    success: function (data, msg) {
                        LG.tip('删除成功');
                        refresh();
                    },
                    error: LG.showError
                });
            });
        }



        function openForm (type, title) {
            var url = type === 'update' ? 'update' : 'add';
            var title = title ? title : type === 'update' ? '修改成功' : '添加成功';
            $.ligerDialog.open({
                target: $('#mainForm'),
                width: 400,
                height: 400,
                buttons: [
                    {
                        text: '保存',
                        onclick: function (e, dialog) {
                            if (!mainForm.valid()) {
                                mainForm.showInvalid();
                                return;
                            }
                            var formData = mainForm.getData();
                            formData['supplier_id'] = supplier_id;
                            formData['driver_id'] = driver_id;
//                            console.log(formData);
                            LG.ajax({
                                url: basePath + url,
                                data: JSON.stringify(formData),
                                dataType: 'json',
                                type: 'post',
                                contentType: "application/json",
                                success: function () {
                                    refresh();
                                    dialog.hide();
                                    LG.tip(title);
                                },
                                error: LG.showError
                            });

                        }
                    },
                    {
                        text: '取消',
                        onclick: function (e, dialog) {
                            dialog.hide();
                        }
                    }
                ]
            });
        }

        /**
         * 审核
         */
        function auditBatch() {
            var selected = mainGrid.getCheckedRows();
            if (!selected || selected.length == 0) {
                LG.showError("请选择行");
                return;
            }

            //检查单据状态
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].state !== "STATE_10_NEW") {
                    LG.showError("所选单据状态不是[新记录]，不可审核");
                    return;
                }
            }
            $.ligerDialog.confirm('确定审核吗?', function (confirm) {

                if (!confirm) return;
                LG.ajax({
                    url: basePath + 'auditBatch',
                    data: JSON.stringify(selected),
                    contentType: "application/json",
                    success: function (data, message, code) {
                        if (code == '201') {
                            LG.showError(parseMsg(data));
                        } else {
                            // refresh();
                            refresh(selected, data);
                            LG.tip('审核成功');
                        }
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
            });
        }

        /**
         * 取消审核
         */
        function cancelBatch() {
            var selected = mainGrid.getCheckedRows();
            if (!selected || selected.length == 0) {
                LG.showError("请选择行");
                return;
            }

            //检查单据状态
            for (var i = 0; i < selected.length; i++) {
                if (selected[i].state !== "STATE_11_USE") {
                    LG.showError("所选单据状态不是[已审核]，不可撤销");
                    return;
                }
            }
            $.ligerDialog.confirm('确定撤销吗?', function (confirm) {

                if (!confirm) return;
                LG.ajax({
                    url: basePath + 'cancelBatch',
                    data: JSON.stringify(selected),
                    contentType: "application/json",
                    success: function (data, message, code) {
                        if (code == '201') {
                            LG.showError(parseMsg(data));
                        } else {
                            // refresh();
                            refresh(selected, data);
                            LG.tip('撤销成功');
                        }
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
            });
        }
    });
</script>
</html>
