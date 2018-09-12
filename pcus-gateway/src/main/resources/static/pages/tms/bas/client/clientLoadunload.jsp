<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/1
  Time: 14:39
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>关联装卸单位</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="${path}/css/city-picker/city-picker.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <link href="${path}/css/jquery-ui-css/Gray/jquery-ui-1.8.21.custom.css" rel="stylesheet">

    <style type="text/css">
        ul.ui-autocomplete {
            z-index: 9999;
        }
    </style>
</head>
<body>
<div id="layout">
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
    <!-- 左右布局-内容 -->
    <div class="left-right-content">
        <div class="content-wrapper grid-wrapper inner">
            <!-- 列表界面 -->
            <div id="mainGrid"></div>
            <!-- 快速搜索 -->
            <div class="quick-search">
                <a class="qs-item visited" href="javascript:;" >全部</a>
                <a class="qs-item" href="javascript:;" >快速搜索</a>
                <a class="qs-item" href="javascript:;" >快速搜索</a>
                <a class="qs-item" href="javascript:;" >快速搜索</a>
                <a class="qs-item" href="javascript:;" >快速搜索</a>
            </div>
        </div>
    </div>
    <!-- 左右布局-选择 -->
    <div class="left-right-select">
        <div class="vertical-list-wrap inner">
            <div class="vertical-list">
                <ul class="vertical-list-inner">
                    <li class="item active">
                        <div class="business-card content">
                            <div class="top">
                                <div class="card">
                                    <div class="card-icon">
                                        <div class="text">格</div>
                                    </div>
                                    <div class="card-info">
                                        <div class="info-item">联系人：管理员</div>
                                        <div class="info-item">联系电话：13900000000</div>
                                        <div class="info-item">地址：广东省珠海市香洲区九洲大道中海珠大厦</div>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom">
                                <i class="iconfont l-icon-edit edit"></i>
                            </div>
                        </div>
                    </li>
                    <li class="item">
                        <div class="business-card content active">
                            <div class="top">
                                <div class="card">
                                    <div class="card-icon">
                                        <div class="text">格</div>
                                    </div>
                                    <div class="card-info">
                                        <div class="info-item">联系人：管理员</div>
                                        <div class="info-item">联系电话：13900000000</div>
                                        <div class="info-item">地址：广东省珠海市香洲区九洲大道中海珠大厦</div>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom">
                                <i class="iconfont l-icon-edit edit"></i>
                            </div>
                        </div>
                    </li>
                    <li class="item">
                        <div class="business-card content">
                            <div class="top">
                                <div class="card">
                                    <div class="card-icon">
                                        <div class="text">格</div>
                                    </div>
                                    <div class="card-info">
                                        <div class="info-item">联系人：管理员</div>
                                        <div class="info-item">联系电话：13900000000</div>
                                        <div class="info-item">地址：广东省珠海市香洲区九洲大道中海珠大厦</div>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom">
                                <i class="iconfont l-icon-edit edit"></i>
                            </div>
                        </div>
                    </li>
                    <li class="item">
                        <div class="business-card add">
                            <div class="top">
                                <i class="iconfont l-icon-plus plus"></i>
                            </div>
                            <div class="bottom">
                                添加关联单位
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="vertical-list-btn up disabled" data-action="vertical-list-slide"></div>
            <div class="vertical-list-btn down" data-action="vertical-list-slide"></div>
        </div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
</body>
<script>

    var client_id = '${client_id}';
    var mainId = client_id;
    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/bas/loadunload/';


    //默认数据
    var emptyData = {
        pk_id:'',
        fname: '',
        sname: '',
        code: '',
        address: '',
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
        rules: [{field: 'DR', value: '0', op: 'equal'}, {field: 'client_id', value: client_id, op: 'equal'}]
    });

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
                display: '代码', name: 'code', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '简称', name: 'sname', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '全称', name: 'fname', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '省市区',
                name: 'selectarea',
                align: 'left',
                minWidth: 50,
                width: '15%',
                render: function (item, index) {
                    return item.province + " " + item.city + " " + item.area;
                }
            },
            {
                display: '详细地址', name: 'address', align: 'left', minWidth: 50, width: '20%'
            },
            {
                display: '联系人', name: 'link_man', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '联系方式', name: 'mobile', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '35%'
            }
        ],
        pageSize: 20,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -61,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'code',
        sortOrder: 'asc',
        parms: [{name: 'where', value: where}]
    };

    var filterFormOption = {
        fields: [
            {
                display: "代码",
                name: "code",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {
                display: "单位全称",
                name: "fname",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {

                name: "client_id",
                type: "hidden",
                cssClass: "field",
                options: {
                    value: client_id
                }
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
                validate: {required: true},
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
                validate: {required: true},
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
                        client_id: client_id,
                        province: $mainForm.find("span[data-count=province]").text(),
                        city: $mainForm.find("span[data-count=city]").text(),
                        area: $mainForm.find("span[data-count=district]").text()

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

    //扩展按钮
    var toolbarOption = {
        items: [
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };
    var btnClick = function (item) {

    };

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
                        url: rootPath + "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="address"]').val()) + "&reion=" + encodeURIComponent($('span[data-count=city]').text()),
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
                        $("input[name=selectarea]").citypicker('reset');
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


</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.data.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms/jquery-ui.min.js?t=${applicationScope.sys_version}"></script>
<script type="text/javascript">
    defaultSearchFilter["and"].push({field: 'client_id', value: client_id, op: 'equal', type: 'string'});

    $(function () {
        //初始化编辑按钮
        $mainGrid.on('click', 'a.row-edit-btn', function (e) {
            var index = $(this).data("index");
            var selected = mainGrid.getRow(index);
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
        $("#searchBtn").click();
    });

</script>
</html>