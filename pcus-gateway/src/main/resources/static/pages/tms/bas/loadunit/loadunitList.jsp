<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>装卸单位</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="/css/city-picker/city-picker.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <link href="/css/jquery-ui-css/Gray/jquery-ui-1.8.21.custom.css" rel="stylesheet">
    <style type="text/css">
        .shixiao {
            color: #fff;
            background-color: #ff0000;
        }

        .xinjilu {
            color: #fff;
            background-color: #32CD32;
        }

        ul.ui-autocomplete {
            z-index: 9999;
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
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/loadunit/excelTmpl">
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

<script>

    var SELECTED = 'selected';
    //上下文路径
    var basePath = rootPath + '/tms/bas/loadunit/';

    //默认数据
    var emptyData = {
        pk_id: '',
        fname: '',
        sname: '',
        code: '',
        address: '',
        region: '',
        link_man: '',
        mobile: '',
        modify_time: '',
        modify_psn: '',
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
                display: '编辑', align: '', minWidth: 50, width: '5%', sortable: false,
                render: function (item, index) {
                    return '<a class="row-edit-btn" data-index="' + index + '" title="编辑" ><i class="iconfont l-icon-edit"></i></a>';
                }
            },
        //    {
        //        display: '状态',
        //        name: 'state_name',
        //        sortname: 'state',
        //        align: 'left',
        //        minWidth: 50,
        //        width: '5%',
        //        quickSort: false,
        //        render: function (item) {
        //            if (item.state_name == '新记录') {
        //                return '<div class="xinjilu bg-cell">' + item.state_name + '</div>';
        //            }
        //            else if (item.state_name == '已失效') {
        //                return '<div class="shixiao bg-cell">' + item.state_name + '</div>';
        //            }
        //            return item.state_name;
        //        }
        //    },
            {display: '全称', name: 'fname', align: 'left', minWidth: 50, width: '15%'},
            {display: '简称', name: 'sname', align: 'left', minWidth: 50, width: '8%'},
            {display: '代码', name: 'code', align: 'left', minWidth: 50, width: '8%'},
            {display: '省', name: 'province', align: 'left', minWidth: 50, width: '5%'},
            {display: '市', name: 'city', align: 'left', minWidth: 50, width: '5%'},
            {display: '区', name: 'area', align: 'left', minWidth: 50, width: '5%'},
            {display: '详细地址', name: 'address', align: 'left', minWidth: 50, width: '20%'},
            {display: '报价区域', name: 'region', align: 'left', minWidth: 50, width: '10%'},
            {display: '联系人', name: 'link_man', align: 'left', minWidth: 50, width: '8%'},
            {display: '联系电话', name: 'mobile', align: 'left', minWidth: 50, width: '8%'},
            {display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '8%'}
        ],
        pageSize: 50,
        pageSizeOptions: [20, 50, 100, 500],
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
        heightDiff: -20,
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

    //调试用
    if (location.hostname == "localhost") {
        gridOption.columns.push(
                {display: '纬度', name: 'lat', align: 'left', minWidth: 50, width: '8%'},
                {display: '经度', name: 'lng', align: 'left', minWidth: 50, width: '8%'},
                {display: '创建人', name: 'create_psn', align: 'left', minWidth: 50, width: '8%'},
                {display: '创建时间', name: 'create_time', align: 'left', minWidth: 50, width: '8%'}
        );
    }

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
                "sname": true,
                "code": true
            },
            exFields: {
                'fname': {},
                'sname': {},
                'code': {}
            }
        },
        labelWidth: 90,
        inputWidth: 220,
        space: 30,
        prefixID: "s_",
        fields: [
            {
                display: "单位全称",
                name: "fname",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "单位简称",
                name: "sname",
                newline: false,
                type: "text",
                cssClass: "field"
            },
            {
                display: "代码",
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
                display: "代码",
                name: "code",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true}
            },
            {
                display: "简称",
                name: "sname",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true}
            },
            {
                display: "全称",
                name: "fname",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true}
            },
            {
                display: "省市区",
                name: "selectarea",
                newline: true,
                labelWidth: 80,
                width: 250,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true},
            },
            {
                display: "详细地址",
                name: "address",
                newline: true,
                labelWidth: 80,
                width: 452,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true},
            },
            {
                display: "报价区域",
                name: "region",
                newline: true,
                labelWidth: 80,
                width: 452,
                space: 30,
                type: "select",
                comboboxName: "region_c",
                cssClass: "field",
                attr: {
                    maxlength: 100
                },
                options: {
                    autocomplete: true,
                    cancelable: true,
                    highLight: true,
                    isTextBoxMode: true,
                    keySupport: true,
                    url: rootPath + '/tms/bas/transport/getRegions',
                    onBeforeOpen: function () {
                        this._setUrl(this.options.url);
                    }
                },
                validate: {required: true},
            },
            {
                display: "联系人",
                name: "link_man",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "联系方式",
                name: "mobile",
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
                width: 452,
                space: 10,
                rows: 4,
                type: "textarea"
            },
            {
                display: "创建人",
                name: "create_psn",
                newline: true,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: false},
                options: {
                    readonly: true,
                    disabled: true
                }
            },
            {
                display: "创建时间",
                name: "create_time",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "date",
                cssClass: "field",
                validate: {required: false},
                options: {
                    showTime: true,
                    readonly: true,
                    disabled: true
                }
            },
            {
                display: "修改人",
                name: "modify_psn",
                newline: true,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: false},
                options: {
                    readonly: true,
                    disabled: true
                }
            },
            {
                display: "修改时间",
                name: "modify_time",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "date",
                cssClass: "field",
                validate: {required: false},
                options: {
                    showTime: true,
                    readonly: true,
                    disabled: true
                }
            },
            {

                name: "pk_id",
                type: "hidden"
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
        height: 400,
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
                        modify_time: $mainForm.find("input[name=modify_time]").val(),
//                        client_id: client_id,
                        province: $mainForm.find("span[data-count=province]").text(),
                        city: $mainForm.find("span[data-count=city]").text(),
                        area: $mainForm.find("span[data-count=district]").text()

                    });

                    LG.singleAjax({
                        url: basePath + url,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (data, msg) {
                            LG.tip('保存成功!');
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
                    liger.get('sname')._setDisabled(false);
                    liger.get('code')._setDisabled(false);
                    dialog.hidden();
                }
            }
        ]
    };

    var filterxForm = $filterForm.ligerSearchForm(filterFormOption);
    var isFirst = true;
    //新增弹出窗自定义方法
    function defaultAction_add() {
        $("input[name=selectarea]").citypicker();
        $("input[name=selectarea]").citypicker('reset');
        InitAddress();
    }
    function InitAddress() {
        if (isFirst) {
            $('input[name="address"]').autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: rootPath + "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="address"]').val()) + "&region=" + encodeURIComponent($('span[data-count=city]').text()),
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        dataFilter: function (data) {
                            return data;
                        },
                        success: function (data) {
                            response($.map(data.data, function (item) {

                                return {
                                    label: item.address,
                                    value: item.address,
                                    province: item.province,
                                    city: item.city,
                                    area: item.district
                                }
                            }))
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert(errorThrown);
                        },

                    });
                },
                select: function (event, ui) {
                    if ($('span[data-count=province]').text().length == 0) {
                        $("input[name=selectarea]").citypicker('destroy');
                        $("input[name=selectarea]").citypicker({
                            province: ui.item.province,
                            city: ui.item.city,
                            district: ui.item.area
                        });
                    }
                }
            });
        }
        isFirst = false;
    }


    //扩展按钮
    var toolbarOption = {
        items: [
            {
                text: '导入导出',
                icon: 'download',
                menu: {
                    items: [
                        {id: 'excelTmpl', text: '下载模板', click: excelTmpl, status: ['OP_INIT']},
                        {id: 'excelExport', text: '导出单位', click: excelExport, status: ['OP_INIT']},
                        {id: 'excelImport', text: '导入单位', click: excelImport, status: ['OP_INIT']}
                    ]
                }
            },
            {id: 'clearcache', text: '清除缓存', click: clearCache, status: ['OP_INIT']}
        ]
    };
    var btnClick = function (item) {
    };

    user.account === 'admin' && toolbarOption.items.push({id: 'gpsInit', text: 'GPS初始化', click: gpsInit, icon: 'gps', status: ['OP_INIT']});

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

    /*
     * GPS初始化
     */
    function gpsInit() {
        var selected = mainGrid.getCheckedRows();
        if ((selected == null) || (selected == '') || (selected == 'undefined')) {
            LG.showError('请选择行');
            return;
        }

        //适配不同的主表
        $.ligerDialog.confirm('确认初始化坐标吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'initGps',
                data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                    LG.tip('初始化成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    function excelTmpl() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/bas/loadunit/excelTmpl");
        xlsUtil.exp($("#download"), mainGrid, '装卸资料导入模板' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
    }

    function excelExport() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/bas/loadunit/excelExport");
        xlsUtil.exp($("#download"), mainGrid, '装卸资料' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
    }

    function excelImport() {
        //Excel模板导入
        if (!uploadDlg) {
            uploadDlg = $.ligerDialog.open({
                target: $uploadDlg,
                title: '导入司机',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {
                        text: '只追加', onclick: function () {
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
        } else {
            uploadDlg.show();
        }

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
                            "全称": "fname",
                            "简称": "sname",
                            "代码": "code",
                            "省": "province",
                            "市": "city",
                            "区": "area",
                            "详细地址": "address",
                            "报价区域": "region",
                            "联系人": "link_man",
                            "联系电话": "mobile",
                            "备注": "remark"
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

    function clearCache () {
        LG.ajax({
            loading: '检查数据中...',
            url: "/tms/cache/initRegions",
            success: function (data, message) {
                LG.tip('清除成功');
            },
            error: function (message) {
                LG.tip('清除失败');
            }
        });
    }
</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.data.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms/jquery-ui.min.js?t=${applicationScope.sys_version}"></script>
<script>
    $(function () {
        //双击事件
        mainGrid.bind('dblClickRow', function (rowdata) {
            //进入客户资料信息页签
            top.f_addTab(rowdata.pk_id, '客户[' + rowdata.name + ']', basePath + 'loadCard'
                    + '?module=' + param.module + '&function=' + param.fun + '&pk_id=' + rowdata.pk_id  );
        });
        var localStorage;
        // 收起与展示高级搜索
        $('#searchToggle').on('click', function (e) {
            var $this = $(this),
                parent = $('#single-search');
            $this.toggleClass('on');
            parent.slideToggle('slow', function () {
                mainGrid._initHeight();
            });
            try {
                if (localStorage.getItem('searchToggle') === 'true') {
                    localStorage.setItem('searchToggle', 'false');
                } else {
                    localStorage.setItem('searchToggle', 'true');
                }
            } catch (err){
                console.log(err);
            }
        });

        try {
            localStorage = window.localStorage;
            if (localStorage.getItem('searchToggle') === 'true') {
                $('#searchToggle').click();
            } else {
                localStorage.setItem('searchToggle', 'false');
            }
        } catch (err) {
            console.log(err);
        }
    });
    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var selected = mainGrid.getRow(index);
        liger.get('sname')._setDisabled(true);
        liger.get('code')._setDisabled(true);
        inlineClineDialogEdit(this);
        InitAddress();
        if (selected.province) {
            $("input[name=selectarea]").citypicker('reset');
            $("input[name=selectarea]").citypicker('destroy');
            $("input[name=selectarea]").citypicker({
                province: selected.province,
                city: selected.city,
                district: selected.area
            });
        }
        else {
            $("input[name=selectarea]").citypicker();
        }
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