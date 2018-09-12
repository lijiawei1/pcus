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
    <title>加油记录</title>
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

        .operated{
            position: relative;
            z-index: 10;
            color:#000;
        }
        .operated:before{
            content: "";
            background-color: #79e6e6;
            position: absolute;
            width: 20px;
            height: 20px;
            top: 16px;
            left: 14px;
            z-index: -1;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: bgBreadth 2s linear 0s infinite alternate;
        }

        @keyframes bgBreadth {
            from {
                background-color: #30bfff;
            }
            to {
                background-color: #BEE6FF;
            }
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
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/fuelCardFilling/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="where">
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
    var basePath = rootPath + '/tms/bas/fuelCardFilling/';
    var where = {
        op: 'and',
        rules: [],
        groups: []
    };
    var fuel_type = ${fuel_type};
    var suppliers = ${suppliers};
    var oper_unit = ${oper_unit};
    var cards = ${cards};
    var driver_names;
    var isChanging = false;

    var years = [{"text":2017},{"text":2018},{"text":2019},{"text":2020},{"text":2021},{"text":2022},{"text":2023},{"text":2024},{"text":2025},{"text":2026},{"text":2027},{"text":2028},{"text":2029},{"text":2030},{"text":2031},{"text":2032},{"text":2033},{"text":2034},{"text":2035},{"text":2036},{"text":2037}];
    var months = [{"text":1},{"text":2},{"text":3},{"text":4},{"text":5},{"text":6},{"text":7},{"text":8},{"text":9},{"text":10},{"text":11},{"text":12}];
    var payers = [{"id": "个人","text": "个人"},{"id": "公司","text": "公司"}];

        //默认数据
    var emptyData = {
        pk_id: '',
        fname: '',
        sname: '',
        code: '',
        remark: ''
    };

    var filterFormFieldWidth = {
        w1: 155,
        w2: 310,
        w3_2: 405
    };

    //全局查询过滤
    var defaultSearchFilter = {
        and: [],
        or: []
    };

    var fontSize = 12 / detectZoom(top);

    $(function () {
        cards = cards.map(function (item) {
            return {
                id: item.card_no,
                text: item.card_no,
                driver_name: item.driver_name,
                oper_unit: item.oper_unit,
                supplier_id: item.supplier_id,
                car_no: item.car_no
            }
        });
        driver_names = cards.map(function(item) {
            return {
                id: item.driver_name,
                text: item.driver_name
            }
        });

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
                    display: '状态',
                    name: 'state',
                    width: 60,
                    render: function (item) {
                        if (item.state == '新记录') {
                            return '<div class="state-new">' + item.state + '</div>';
                        }
                        else if (item.state == '已审核') {
                            return '<div class="state-audit">' + item.state + '</div>';
                        }
                        return item.state;
                    }
                },
                {
                    display: '油卡编号',
                    name: 'card_no',
                    width: 200
                },
                {
                    display: '加油时间',
                    name: 'work_time',
                    width: 150
                },
                {
                    display: '燃油类型',
                    name: 'fuel_type',
                    width: 100,
                    render: LG.render.ref(fuel_type, 'fuel_type'),
                    xlsName: 'fuel_type_name'
                },
                {
                    display: '归属年份',
                    name: 'year',
                    width: 100
                },
                {
                    display: '归属月份',
                    name: 'month',
                    width: 100
                },
                {
                    display: '单价',
                    name: 'price',
                    width: 100,
                    render: function (data, index , val) {
                        if (!val) { return val; } var result = new Number(val); return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                },
                {
                    display: '数量',
                    name: 'qty',
                    width: 100
                },
                {
                    display: '金额',
                    name: 'amount',
                    width: 100,
                    render: function (data, index , val) {
                        if (!val) { return val; } var result = new Number(val); return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                },
                {
                    display: '付款方',
                    name: 'payer',
                    width: 100
                },
                {
                    display: '使用人',
                    name: 'driver_name',
                    width: 100
                },
                {
                    display: '车牌号',
                    name: 'car_no',
                    width: 100
                },
                {
                    display: '操作单位',
                    name: 'oper_unit',
                    width: 150,
                    render: LG.render.ref(oper_unit, 'oper_unit'),
                    xlsName: 'oper_unit_name'
                },
                {
                    display: '所属公司',
                    name: 'supplier_id',
                    width: 200,
                    render: LG.render.ref(suppliers, 'supplier_id'),
                    xlsName: 'supplier_name'
                },
                {
                    display: '备注',
                    name: 'remark',
                    width: 350
                }
            ],
            pageSize: 50,
            pageSizeOptions: [20, 50, 100, 500],
            url: basePath + 'loadGrid',
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
            }],
            sortName: 'STATE',
            sortOrder: 'ASC'
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
                storageId: "FuelCardFilling" + user.id,
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
                    "car_no": true,
                    'state': true
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
                        data: [{id: '新记录', text: '新记录'}, {id: '已审核', text: '已审核'}, {id: '已失效', text: '已失效'}]
                    }
                }, {
                    display: "油卡编号",
                    name: "card_no",
                    newline: false,
                    type: "text",
                    cssClass: "field"
                }, {
                    display: "燃油类型",
                    name: "fuel_type",
                    newline: false,
                    type: "select",
                    options: {
                        data: fuel_type
                    },
                    cssClass: "field"
                }, {
                    display: "归属年份",
                    name: "year",
                    newline: false,
                    type: "select",
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        valueField: 'text',
                        data: years
                    },
                    cssClass: "field"
                }, {
                    display: "归属月份",
                    name: "month",
                    newline: false,
                    type: "select",
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    valueField: 'text',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        valueField: 'text',
                        data: months
                    },
                    cssClass: "field"
                }, {
                    display: "使用人",
                    name: "driver_name",
                    newline: false,
                    type: "select",
                    options: {
                        data: driver_names
                    },
                    cssClass: "field"
                }, {
                    display: "车牌号",
                    name: "car_no",
                    newline: false,
                    type: "text",
                    cssClass: "field"
                }, {
                    display: "操作单位",
                    name: "oper_unit",
                    newline: false,
                    type: "select",
                    options: {
                        data: oper_unit
                    },
                    cssClass: "field"
                }, {
                    display: "所属公司",
                    name: "supplier_id",
                    newline: false,
                    type: "select",
                    options: {
                        data: suppliers
                    },
                    cssClass: "field"
                }
            ]
        });

        mainForm = $('#mainForm').ligerForm({
            fields: [
                {
                    display: '油卡编号',
                    name: 'card_no',
                    type: 'select',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: cards,
                        onSelected: function (val, text, data) {
                            data && mainForm.setData({driver_name: data.driver_name});
                            data && mainForm.setData({oper_unit: data.oper_unit});
                            data && mainForm.setData({supplier_id: data.supplier_id});
                            data && mainForm.setData({car_no: data.car_no});
                        }
                    },
                    validate: {
                        required: true
                    }
                },{
                    display: '加油时间',
                    name: 'work_time',
                    type: "date",
                    editor: {
                        showTime: true,
                        format: "yyyy-MM-dd hh:mm:ss"
                    },
                    validate: {
                        required: true
                    }
                }, {
                    display: '燃油类型',
                    name: 'fuel_type',
                    type: 'select',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: fuel_type
                    },
                    validate: {
                        required: true
                    }
                },{
                    display: '归属年份',
                    name: 'year',
                    type: 'select',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        valueField: 'text',
                        data: years
                    }
                },{
                    display: '归属月份',
                    name: 'month',
                    type: 'select',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        valueField: 'text',
                        data: months
                    },
                },{
                    display: '单价',
                    name: 'price',
                    options: {
                        number: true,
                        precision: 2,
                        onChangeValue: function () {
                            var data = mainForm.getData();
                            if (data.qty  && data.price) {
                                liger.get('main_amount').setValue((data.qty * 100) * (data.price * 100) / 1000);
                            }
                        }
                    },
                    validate: {
                        required: true
                    }
                },{
                    display: '数量',
                    name: 'qty',
                    options: {
                        number: true,
                        precision: 2,
                        onChangeValue: function () {
                            var data = mainForm.getData();
                            if (data.qty  && data.price) {
                                liger.get('main_amount').setValue((data.qty * 100) * (data.price * 100) / 1000);
                            }
                        }
                    },
                    validate: {
                        required: true
                    }
                }, {
                    display: '金额',
                    name: 'amount',
                    type: 'text',
                    options: {
                        value: 0,
                        number: true,
                        precision: 2
                    },
                    validate: {
                        required: true
                    }
                }, {
                    display: '付款方',
                    name: 'payer',
                    type: 'select',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: payers
                    },
                    validate: {
                        required: true
                    }
                },{
                    display: '司机名称',
                    name: 'driver_name'
                },{
                    display: '车牌号',
                    name: 'car_no',
                    validate: {
                        required: true
                    }
                },{
                    display: '操作单位',
                    name: 'oper_unit',
                    type: 'select',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: oper_unit
                    },
                    validate: {
                        required: true
                    }
                }, {
                    display: '所属公司',
                    name: 'supplier_id',
                    type: 'select',
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: suppliers
                    }
                },{
                    display: '备注',
                    name: 'remark'
                }, {
                    name: 'state',
                    type: 'hidden'
                },{
                    name: 'pk_id',
                    type: 'hidden'
                }
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
                },
                {
                    text: '导入导出',
                    icon: 'download',
                    menu: {
                        items: [
                            {id: 'excelTmpl', text: '下载模板', click: excelTmpl, status: ['OP_INIT']},
                            {id: 'excelExport', text: '导出记录', click: excelExport, status: ['OP_INIT']},
                            {id: 'excelImport', text: '导入记录', click: excelImport, status: ['OP_INIT']}
                        ]
                    }
                }
            ]
        });


        //导入失败对话框
        var dialogOption_importFail = {
            target: $("#importFailDialog"),
            title: '导入失败',
            width: 500, height: 120,
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
            if(selected.state !== "新记录") {
                LG.showError("所选档案状态不是[新记录]，不可修改");
                return;
            }
            set(selected);
        });

        $('#searchToggle').on('click', function (e) {
            var $this = $(this),
                parent = $('#single-search');

            $this.toggleClass('on');
            parent.slideToggle('slow', function () {
                mainGrid._initHeight();
            });
            localStorage.setItem('materialsSearchToggle', !localStorage['materialsSearchToggle']);
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
            // 清除 tag 选择样式
            $(".quick-search>.qs-item.visited").removeClass("visited");
        }

        materialsSearchToggle && $('#searchToggle').click();

        function refresh () {
            mainGrid.reload();
        }
        function add () {
            mainForm.reset();
            openForm();
        }
        function set (data) {
            isChanging = true;
            mainForm.reset();
            mainForm.setData(data);
            isChanging = false;
            openForm('update', data);
        }
        function deleteFn () {
            var row = mainGrid.getSelecteds();
            if (row.length < 1) {
                LG.showError('请选择数据');
                return;
            }
            for(var i = 0; i<row.length; i++) {
                if(row[i].state !== "新记录") {
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

        // 模板下载
        function excelTmpl () {
            $("#download").attr("action", basePath + "excelTmpl");
            xlsUtil.exp($("#download"), mainGrid, '油卡使用记录导入模板' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
        }

        function excelExport () {
            //Excel数据下载
            $("#download").attr("action", basePath + "excelExport");
            var weee = seachForm.getSearchFormData(false, defaultSearchFilter)
            xlsUtil.exp($("#download"), mainGrid, '油卡使用记录' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {where: weee});
        }

        function excelImport () {
            //Excel模板导入
            var uploadDlg = $.ligerDialog.open({
                target: $("#uploadDlg"),
                title: '导入油卡使用记录',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {
                        text: '确认', onclick: function () {
                            upload();
                        }
                    },
//                    {
//                        text: '追加并覆盖', onclick: function () {
//                            upload(true);
//                        }
//                    },
                    {
                        text: '取消', cls: 'c000', onclick: function () {
                            uploadDlg.hide();
                        }
                    }
                ]
            });
            /**
             *
             * @param cover 是否覆盖旧记录
             * @returns {boolean}
             */
            function upload(cover) {
                // 上传文件
                var filepath = $("#fileupload").val();
                if (filepath == "") {
                    LG.showError("请选择上传文件");
                    return false;
                } else {
                    var stuff = filepath.match(/^(.*)(\.)(.{1,8})$/)[3];
                    var type = "xls,xlsx";
                    if (type.indexOf(stuff) < 0) {
                        LG.showError('文件类型不正确,只能上传xls或xlsx');
                        return;
                    }
                }
                var url = basePath + '/excelImport';

                uploadDlg.hide();
                LG.showLoading('正在上传中...');

                var formData = new FormData();
                var uform = $("#uploadForm");
                formData.append('excel',
                    JSON2.stringify({
                        name: 'fileupload', //上传控件名称
                        cover: cover || false, //是否覆盖
                        only_contain: true,
                            meta: {
                                "卡号": "card_no",
                                "时间": "work_time",
                                "归属年": 'year',
                                "归属月": 'month',
                                "单价": 'price',
                                "数量": "qty",

                                "金额": "amount",
                                "金额(分值)": "amount",

                                "燃油类型": "fuel_type",
                                "品种": "fuel_type",

                                "备注": "remark",

                                "地点": "fuel_station",
                                "加油油站": "fuel_station",

                                "业务类型": "a",
                                "操作员": "b",
                                "余额": "c"

                        }
                    })
                );

                //选中的文件
                uform.find('input[type=file]').each(function (i, item) {
                    var field_name = $(this).attr('name');
                    var files = item.files;
                    if (files && files.length > 0) {
                        for (var f = 0; f < files.length; f++) {
                            formData.append(field_name, files[f]);
                        }
                    }
                });

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function (result) {
                        if (result.error) {
                            var op = $.extend({}, dialogOption_importFail, {content: result.message});
                            LG.hideLoading();
                            //显示查看详细的按钮
                            if (result.data) {
                                $("#failForm").attr("action", result.data);
                                $.ligerDialog.open(op);
                            } else {
                                LG.showError(result.message);
                            }
                            mainGrid.reload();
                        } else {
                            LG.hideLoading();
                            if(result.message != "") {
                                LG.tip(result.message);
                            }
                            mainGrid.reload();
                        }
                    },
                    error: function (message) {
                    }
                });
            }
        }

        function clearCache () {
            LG.ajax({
                beforeSend: function () {
                    LG.showLoading('检查数据中...');
                },
                complete: function () {
                    LG.hideLoading();
                },
                url: rootPath + "/tms/cache/initRegions",
                success: function (data, message) {
                    LG.tip('清除成功');
                    refresh();
                },
                error: function (message) {
                    LG.tip('清除失败');
                }
            });
        }

        function openForm (type, Rowdata) {
            var url = type === 'update' ? 'update' : 'add';
            var tips = url === 'update' ? '修改成功' : '添加成功';
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
                            LG.ajax({
                                url: basePath + url,
                                data: JSON.stringify(formData),
                                dataType: 'json',
                                type: 'post',
                                contentType: "application/json",
                                success: function (result) {
                                    if (url === 'update' && Rowdata) {
                                        mainGrid.updateRow(Rowdata['__id'], $.extend({}, Rowdata, result));
                                        $(mainGrid.getRowObj(Rowdata['__id'])).children('.l-grid-row-cell-rownumbers').addClass('operated');
                                    } else {
                                        refresh();
                                    }
                                    dialog.hide();
                                    LG.tip(tips);
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
                if (selected[i].state !== TMS_STATE_NAME.STATE_10_NEW) {
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
                if (selected[i].state !== TMS_STATE_NAME.STATE_30_AUDIT) {
                    LG.showError("所选单据状态不是[已审核]，不可撤销");
                    return;
                }
            }
            $.ligerDialog.confirm('确定撤销吗?', function (confirm) {

                if (!confirm) return;

//                debugger;
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
