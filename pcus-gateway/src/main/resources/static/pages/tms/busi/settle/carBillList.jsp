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
    <title>单车账单</title>
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
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/fuelCard/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="where"/>
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
    var basePath = rootPath + '/tms/settle/carbill/';
    var where = {
        op: 'and',
        rules: [],
        groups: []
    };
    var oper_unit = ${oper_unit};
    var suppliers = ${suppliers};

    var isReset = true;
    var years = [{"id":2017, "text":2017},{"id":2018,"text":2018},{"id":2019,"text":2019},{"id":2020,"text":2020},{"id":2021,"text":2021},{"id":2022,"text":2022},{"id":2023,"text":2023},{"id":2024,"text":2024},{"id":2025,"text":2025},{"id":2026,"text":2026},{"id":2027,"text":2027},{"id":2028,"text":2028},{"id":2029,"text":2029},{"id":2030,"text":2030},{"id":2031,"text":2031},{"id":2032,"text":2032},{"id":2033,"text":2033},{"id":2034,"text":2034},{"id":2035,"text":2035},{"id":2036,"text":2036},{"id":2037,"text":2037}];
    var months = [{"id":1,"text":1},{"id":2,"text":2},{"id":3,"text":3},{"id":4,"text":4},{"id":5,"text":5},{"id":6,"text":6},{"id":7,"text":7},{"id":8,"text":8},{"id":9,"text":9},{"id":10,"text":10},{"id":11,"text":11},{"id":12,"text":12}];

    //默认数据

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

        //全局查询过滤
        var defaultSearchFilter = {
            and: [],
            or: []
        };

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
                    }
                },
                {
                    display: '账单号',
                    name: 'bill_no'
                },
                {
                    display: '结算单位',
                    name: 'com_name'
                },
                {
                    display: '年',
                    name: 'bill_year'

                },
                {
                    display: '月',
                    name: 'bill_month'
                },
                {
                    display: '制单人',
                    name: 'create_psn'
                },
                {
                    display: '制单时间',
                    name: 'create_time'
                },
                {
                    display: '备注',
                    name: 'remark'
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

                    "state": true
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
                    display: "结算单位",
                    name: "com_name",
                    newline: false,

                    type: "text",
                    cssClass: "field"
                },
                {
                    display: "账单年份",
                    name: "bill_year",
                    newline: false,
                    type: "select",
                    options: {
                        data: years
                    }


                },
                {
                    display: "账单月份",
                    name: "bill_month",
                    newline: false,
                    type: "select",
                    options: {
                        data: months
                    }



                },
                {
                    display: "账单号",
                    name: "bill_no",
                    newline: false,

                    type: "text",
                    cssClass: "field"
                },
                {
                    display: "制单人",
                    name: "create_psn",
                    newline: false,

                    type: "text",
                    cssClass: "field"
                },
                {
                    display: "备注",
                    name: "remark",
                    newline: false,

                    type: "text",
                    cssClass: "field"
                }
            ]
        });

        mainForm = $('#mainForm').ligerForm({
            fields: [
                {
                    display: '结算单位',
                    name: 'com_name',
                    type: "select",
                    options: {
                        data: suppliers,
                        valueField: 'text'
                    },
                    validate: {
                        required: true
                    },
                    cssClass: "field"
                }, {
                    display: '年',
                    name: 'bill_year',
                    newline: false,
                    type: "select",
                    options: {
                        data: years
                    },
                    cssClass: "field"

                },
                {
                    display: '月',
                    name: 'bill_month',
                    newline: false,
                    type: "select",
                    options: {
                        data: months
                    },
                    cssClass: "field"
                },
                 {
                    display: '备注',
                    name: 'remark',
                    type: 'text'
                }, {
                    name: 'pk_id',
                    type: 'hidden'
                }, {
                    name: 'state',
                    type: 'hidden'
                }, {
                    name: 'create_psn',
                    type: 'hidden'
                }, {
                    name: 'create_time',
                    type: 'hidden'
                }, {
                    name: 'corp_id',
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
                    text: '失效',
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
                }/*,
                {
                    text: '导入导出',
                    icon: 'download',
                    menu: {
                        items: [
                            {id: 'excelTmpl', text: '下载模板', click: excelTmpl, status: ['OP_INIT']},
                            {id: 'excelExport', text: '导出档案', click: excelExport, status: ['OP_INIT']},
                            {id: 'excelImport', text: '导入档案', click: excelImport, status: ['OP_INIT']}
                        ]
                    }
                }*/
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


        //初始化下载按钮
  /*      $mainGrid.on('click', 'a.row-download-btn', function (e) {
            var index = $(this).data("index");
            var selected = mainGrid.getRow(index);

//        excel(selected.pk_id, '应付账单[' + selected.com_name + selected.bill_year + '年' + selected.bill_month + '月' + ']明细' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
            var filename = '单车账单[' + selected.com_name + selected.bill_year + '年' + selected.bill_month + '月' + ']明细.xls';
            var headers = "结算日期,司机,车牌号,费用名称,应付,含税,提柜码头,装卸单位信息,还柜码头,柜号,柜型,预抵时间,客户,订舱号,封条号,业务类型,计费方式,计费单位,备注,工作号,任务号,急单类型,提柜堆场,还柜堆场,散货数量,船公司,船名,航次,揽货公司,操作单位,录单人,录单时间"
            var names = "car_no"

            xlsUtil.exp($('#download'), mainGrid, filename, { pk_id: selected.pk_id}, headers, names);
        });*/

        mainGrid.grid.on('click', 'a.row-edit-btn', function (e) {
            var index = $(this).data("index");
            // var selected = mainGrid.getRow(index);
            /*if(selected.state !== "新记录") {
             LG.showError("所选档案状态不是[新记录]，不可修改");
             return;
             }*/
            var rowdata = mainGrid.getRow(index);
            jumpDetailEdit(rowdata);
            //set(selected);
        });


        /**
         * 跳转到具体的页签
         * @param data
         */
        function jumpDetailEdit(rowdata) {
            var title = '单据明细' ;
            top.f_addTab(rowdata.pk_id, title, rootPath + '/tms/settle/carbilldetail/loadPage/' + rowdata.pk_id + '?module=' + param.module + '&function=' + param.fun);

        }

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
            isReset = false;
            mainForm.reset();
            mainForm.setData(data);
            isReset = true;
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

        // 模板下载
        function excelTmpl () {
            $("#download").attr("action", basePath + "excelTmpl");
            xlsUtil.exp($("#download"), mainGrid, '油卡档案导入模板' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
        }

        function excelExport () {
            //Excel数据下载
            $("#download").attr("action", basePath + "excelExport");
            var weee = seachForm.getSearchFormData(false, defaultSearchFilter);
            xlsUtil.exp($("#download"), mainGrid, '油卡档案' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {where: weee});
        }

        function excelImport () {
            //Excel模板导入
            var uploadDlg = $.ligerDialog.open({
                target: $("#uploadDlg"),
                title: '导入油卡档案',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {
                        text: '确认', onclick: function () {
                            upload();
                        }
                    },
                    {
                        text: '追加并覆盖', onclick: function () {
                            upload(true);
                        }
                    },
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
//                        pk_id: client_id, //业务主键
                        name: 'fileupload', //上传控件名称
                        cover: cover || false, //是否覆盖
                        meta: {
                            "卡号": "card_no",
                            ///"车牌": "car_no",
                            "使用人": 'driver_name',
                            "项目组(全称）": 'oper_unit',
                            "所属公司(全称）": 'supplier_id',
                            "初始余额": "amount"
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
                if (selected[i].state !== "新记录") {
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
