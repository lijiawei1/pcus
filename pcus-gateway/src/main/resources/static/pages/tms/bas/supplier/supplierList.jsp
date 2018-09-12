<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/20
  Time: 9:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>供应商资料</title>
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
        <div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span class="text">高级<br>搜索</span></div>
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
            <a class="qs-item" href="javascript:;" onclick="quickQuery(3,this)">新车队(${xinjilu})</a>
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


<div id="importFailDialog" style="display: none;">
    <form id="failForm" method="POST" target="_blank" action="">
    </form>
</div>
<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/supplier/driver/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

<!--Excel导入-->
<div id="uploadDlg" style="display: none;">
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

    //上下文路径
    var basePath = rootPath + '/tms/bas/supplier/';

    //默认数据
    var emptyData = {
        code: '',
        name: '',
        fname: '',
        remark: ''
    };

    //页面元素
    var $gridWrapper = $(".grid-wrapper"),
            $filterWrapper = $(".filter-wrapper"),
            $filterForm = $("#filterForm"),
            $uploadDlg = $("#uploadDlg"),
            $failForm = $("#failForm"),
            $mainDlg = $("#mainDlg"), //编辑弹窗
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            uploadDlg, //上传对话框
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
                    return '<a class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-edit"></i></a>';
                }
            },
            {
                display: '状态',
                name: 'state_name',
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
                display: '车队简称', name: 'name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车队代码', name: 'code', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '车队全称', name: 'fname', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '是否外协', name: 'outsourcing', align: 'left', minWidth: 50, width: '5%',
                render: LG.render.boolean('outsourcing')
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '35%'
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
        sortName: 'name',
        sortOrder: 'asc'
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
            storageId: "supplierlist_ui" + user.id,
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
                "code": true,
                "outsourcing": true
            },
            exFields: {}
        },

        labelWidth: 90,
        inputWidth: 220,
        space: 30,
        prefixID: "s_",
        fields: [
            {
                display: "车队名称",
                name: "fname",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "车队代码",
                name: "code",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "是否外协",
                name: "outsourcing",
                comboboxName: "outer_c",
                newline: false,
                type: "select",
                cssClass: "field",
                attr: {"op": "equels"},
                options: {
                    data: [{text: "外协", id: "Y"}, {text: "自有", id: "N"}]
                }
            }


        ],

    };

    var mainFormOption = {
        fields: [
            {
                display: "车队简称",
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
                display: "车队全称",
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
                display: "车队代码",
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
                display: "是否外协",
                name: "outsourcing",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "checkbox",
                cssClass: "field"
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
        width: 620,
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

    function jumpDetailEdit(rowdata) {
        top.f_addTab(rowdata.pk_id, '车队[' + rowdata.name + ']', basePath + 'loadCard'
                + '?module=' + param.module + '&function=' + param.fun + '&pk_id=' + rowdata.pk_id);
    }

    //导入失败对话框
    var dialogOption_importFail = {
        target: $("#importFailDialog"),
        title: '导入失败',
        width: 500, height: 120,
        buttons: [
            {
                text: '查看详细',
                onclick: function (item, dialog) {
                    $failForm.submit();
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

    function excelTmpl() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/bas/supplier/driver/excelTmpl")
        xlsUtil.exp($("#download"), mainGrid, '供应商相关导入模板' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
    }

    function driverImport() {
        //Excel模板导入
        if (!uploadDlg) {
            uploadDlg = $.ligerDialog.open({
                target: $uploadDlg,
                title: '导入司机',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {
                        text: '只追加', onclick: function () {
                        uploadDriver();
                    }
                    },
                    {
                        text: '追加并覆盖', onclick: function () {
                        uploadDriver(true);
                    }
                    },
                    {
                        text: '取消', cls: 'c000', onclick: function () {
                        uploadDlg.hide();
                    }
                    }
                ]
            });
        } else {
            uploadDlg.show();
        }

        /**
         *
         * @param cover 是否覆盖旧记录
         * @returns {boolean}
         */
        function uploadDriver(cover) {
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
            var url = basePath + '/driver/excelImport';

            uploadDlg.hide();
            LG.showLoading('正在上传中...');

            var formData = new FormData();
            var uform = $("#uploadForm");
            formData.append('excel',
                    JSON2.stringify({
                    //    pk_id: client_id, //业务主键
                        name: 'fileupload', //上传控件名称
                        cover: cover || false, //是否覆盖
                        meta: {
                            '车队名称': 'supplier_id',  //模板元数据
                            '是否外协': 'outsourcing',
                            '司机姓名': 'name',
                            '身份证号': 'id_no',
                            '联系电话': 'mobile',
                            '短号': 'short_no',
                            '备注': 'remark'
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
                    } else {
                        LG.hideLoading();
                        LG.tip(result.message);
                        mainGrid.reload();
                    }
                },
                error: function (message) {
                }
            });
        }

    }

    function carImport() {
        //Excel模板导入
        if (!uploadDlg) {
            uploadDlg = $.ligerDialog.open({
                target: $uploadDlg,
                title: '导入车辆',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {
                        text: '只追加', onclick: function () {
                        uploadCar();
                    }
                    },
                    {
                        text: '追加并覆盖', onclick: function () {
                        uploadCar(true);
                    }
                    },
                    {
                        text: '取消', cls: 'c000', onclick: function () {
                        uploadDlg.hide();
                    }
                    }
                ]
            });
        } else {
            uploadDlg.show();
        }

        /**
         *
         * @param cover 是否覆盖旧记录
         * @returns {boolean}
         */
        function uploadCar(cover) {
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
            var url = basePath + '/car/excelImport';

            uploadDlg.hide();
            LG.showLoading('正在上传中...');

            var formData = new FormData();
            var uform = $("#uploadForm");
            formData.append('excel',
                    JSON2.stringify({
                    //    pk_id: client_id, //业务主键
                        name: 'fileupload', //上传控件名称
                        cover: cover || false, //是否覆盖
                        meta: {
                            "车队名称": "supplier_id",
                            "是否外协": "outsourcing",
                            "车牌号": "car_no",
                            "车辆类型": "type",
                            "默认司机": "default_driver"
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
                    } else {
                        LG.hideLoading();
                        LG.tip(result.message);
                        mainGrid.reload();
                    }
                },
                error: function (message) {
                }
            });
        }

    }

</script>
<script src="${path}/js/tms/bas/supplier/supplierList.js?t=${applicationScope.sys_version}"></script>
<script>
    $(function () {
        //双击事件
        mainGrid.bind('dblClickRow', function (rowdata) {
            //进入客户资料信息页签
            top.f_addTab(rowdata.pk_id, '车队[' + rowdata.name + ']', basePath + 'loadCard'
                    + '?module=' + param.module + '&function=' + param.fun + '&pk_id=' + rowdata.pk_id);
        });
    });
    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var selected = mainGrid.getRow(index);

        //进入客户资料信息页签
        top.f_addTab(selected.pk_id, '车队[' + selected.name + ']', basePath + 'loadCard'
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
</html>
