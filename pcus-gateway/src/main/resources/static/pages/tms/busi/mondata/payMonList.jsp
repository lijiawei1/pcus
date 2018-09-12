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
  <title>应收数据监控</title>
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
        .grid-check{margin: 8px;}
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


<div id="row-edit-btnimportFailDialog" class="dialog-container">
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
    var basePath = rootPath + '/tms/busi/payMonList/';
   // var basePath = rootPath + '/tms/bas/fuelCardFilling/';
    var where = {
        op: 'and',
        rules: [],
        groups: []
    };

    var clients = ${clients};


    var bassname = ${bassname};
    var basregion = ${basregion};

    var car_nos = ${car_nos};



    var bs_type_code = ${bs_type_code};
    var enums = [{"id": 0, "text": "否"}, {"id": 1, "text": "是"}];


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
        bassname = bassname.map(function (item) {
            return {
                id: item,
                text: item
            }
        });
        basregion = basregion.map(function (item) {
            return {
                id: item,
                text: item
            }
        });

        car_nos = car_nos.map(function (item) {
            return {
                id: item.car_no,
                text: item.car_no,

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
                    display: '编辑', align: '', minWidth: 30, width: 30, sortable: false,
                    render: function (item, index) {
                        return '<a class="row-edit-btn" data-index="' + index + '" title="编辑" ><i class="iconfont l-icon-edit"></i></a>';
                    }
                },{
                    display: '单号',
                    name: 'bill_no', minWidth: 100, width: 100, sortable: false,
                },{
                    display: '收款方',
                    name: 'client_name', minWidth: 100, width: 100, sortable: false,

                },{
                    display: '费用名称',
                    name: 'fee_name', minWidth: 100, width: 300, sortable: false,
                },{
                    display: '任务单号',
                    name: 'trans_bill_no', minWidth: 100, width: 100, sortable: false,
                },{
                    display: '结算日期',
                    name: 'settle_date', minWidth: 150, width: 150, sortable: false,
                },{
                    display: '收款方主键为空',
                    name: 'null_payee_id', minWidth: 90, width: 80, sortable: false,
                    render:function(item) {
                        return '<input class="grid-check" type="checkbox" '+(item.null_payee_id == 1 ? 'checked' : '')+' onclick="return false"/>'
                    }
                },{
                    display: '收款方名称无效',
                    name: 'payee_name_invalid', minWidth: 90, width: 80, sortable: false,
                    render:function(item) {
                        return '<input class="grid-check" type="checkbox" '+(item.payee_name_invalid == 1 ? 'checked' : '')+' onclick="return false"/>'
                    }
                },{
                    display: '付款方主键为空',
                    name: 'null_payer_id', minWidth: 90, width: 80, sortable: false,
                    render:function(item) {
                        return '<input class="grid-check" type="checkbox" '+(item.null_payer_id == 1 ? 'checked' : '')+' onclick="return false"/>'
                    }
                },{
                    display: '更新语句',
                    name: 'update_sql', minWidth: 300, width: 800, sortable: false,
                }
            ],
            pageSize: 50,
            pageSizeOptions: [20, 50, 100, 500],
            url: basePath + 'loadGrid',
           // url: basePath + 'loadGrid',
            delayLoad: false,		//初始化不加载数据
            checkbox: true,
            width: '100%',
            height: '100%',
            autoStretch: true,
            usePager: true,
            enabledEdit: false,
            clickToEdit: false,
            fixedCellHeight: true,
            heightDiff: -20,
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
                exFields: {
                    'fname': {},
                    'code': {}
                }
            },
            labelWidth: 90,
            inputWidth: 220,
            space: 30,
            prefixID: "s_",
            fields: [
                {
                    display: '单号',
                    name: 'bill_no',
                    //render: LG.render.ref(clients, 'client_id')
                },{
                    display: '费用名称',
                    name: 'fee_name',
                    newline: false,
                    type: "text",
                    cssClass: "field"
                    // render: LG.render.ref(bs_type_code, 'bs_type_code')
                },{
                    display: "结算日期",
                    name: "settle_date_s",
                    newline: false,
                    type: "date",
                    editor: {
                        format: "yyyy-MM-dd",
                    },
                    attr: {
                        op: "greaterorequal", //操作符
                        dateformat: "yyyy-MM-dd",
                        "data-name": "settle_date"
                    }
                }, {
                    display: "至",
                    name: "settle_date_e",
                    newline: false,
                    type: "date",
                    cssClass: "field",
                    editor: {
                        format: "yyyy-MM-dd",
                    },
                    attr: {
                        op: "lessorequal", //操作符
                        dateformat: "yyyy-MM-dd",
                        "data-name": "settle_date"
                    }
                }, {
                    display: "收款方",
                    name: "client_name",
                    newline: false,
                    type: "select",
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: clients,
                        valueField: 'text'
                        //不写默认为id
                    },
                    cssClass: "field"
                }, {
                    display: '收款方主键为空',
                    name: 'null_payee_id',
                    newline: false,
                    type: "select",
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: enums
                    },
                    cssClass: "field"
                    // render: LG.render.ref(suppliers, 'supplier_id')
                },{
                    display: '收款方名称无效',
                    name: 'payee_name_invalid',
                    newline: false,
                    type: "select",
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: enums
                    },
                    cssClass: "field"
                    // render: LG.render.ref(suppliers, 'supplier_id')
                },{
                    display: '付款方主键为空',
                    name: 'null_payer_id',
                    newline: false,
                    type: "select",
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: enums
                    },
                    cssClass: "field"
                    // render: LG.render.ref(suppliers, 'supplier_id')
                }

            ]
        });

        mainForm = $('#mainForm').ligerForm({
            fields: [

                {
                    display: '客户主键',
                    name: 'client_id',
                    /*type: 'select',
                    options: {
                        data: clients
                    }*/
                    /*validate: {
                        required: true
                    }*/
                }, {
                    display: '单据类型',
                    name: 'bill_type'

                }, {
                    display: '单据模板',
                    name: 'template_js'

                }, {
                    display: '业务类型',
                    name: 'bs_type_code',
                    type: 'select',
                    options: {
                        data: bs_type_code
                    }
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
                    text: '刷新',
                    icon: 'refresh',
                    click: refresh
                },
                {id: 'excelExport', icon: 'export', text: '导出', click: excelExport, status: ['OP_INIT']}
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
            top.f_addTab(rowdata.pk_id, title, rootPath + '/tms/bm/BillConfig/loadPage/' + rowdata.pk_id + '?module=' + param.module + '&function=' + param.fun);

        }


     /*   //初始化编辑按钮
        mainGrid.grid.on('click', 'a.row-edit-btn', function (e) {
            var index = $(this).data("index");
            var rowdata = mainGrid.getRow(index);
            jumpDetailEdit(rowdata);
        });*/




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
            /*for(var i = 0; i<row.length; i++) {
                if(row[i].state !== "新记录") {
                    LG.showError("所选档案状态不是[新记录]，不可删除");
                    return;
                }
            }*/
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
                debugger;
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
            xlsUtil.exp($("#download"), mainGrid, '应付费用数据监控' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
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
                // debugger;
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
                                "车牌": "car_no",
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
    });
</script>
</html>
