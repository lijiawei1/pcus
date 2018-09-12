<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/3
  Time: 10:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>价格合约</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
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
</body>
<script>

    //字典数据
    var data_dict = ${dict};
    var price_base = priceBaseUtil.processPriceBase(data_dict);
    var remap_price_base = price_base.remap;
    var data_price_base = price_base.base;

    function renderFeeUnit(item) {
        if (!data_price_base || data_price_base.length == 0) return item.unit;
        if (!item.price_base || !item.unit || !remap_price_base[item.price_base]
                || !remap_price_base[item.price_base].unitMap
        ) {
            return '';
        } else {
            var fee_unit = remap_price_base[item.price_base].unitMap[item.unit];
            return !!fee_unit ? fee_unit.text : '';
        }
    }

    var client_id = '${client_id}';
    var mainId = client_id;
    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/bas/contractitem/';

    //默认数据
    var emptyData = {
        pk_id: '',
        service_type: '',
        fee_name: '',
        is_tax: false,
        tax_point: '0',
        price_model: '',
        price_base: '',
        unit: '',
        event: '',
        fee_prop: null,
        create_time: '',
        create_psn: '',
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
        rules: [{field: 'DR', value: '0', op: 'equal'}, {field: 'mst_id', value: client_id, op: 'equal'}]
    });

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '编辑', align: '', minWidth: 50, width: 60, sortable: false,
                render: function (item, index) {
                    return '<a  name="edit_data"  class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-clause"></i></a>';
                },
                hide: disabledButtons.indexOf('edit') >= 0
            },
            {
                //行内按钮
                display: '报价', align: '', minWidth: 50, width: 60, sortable: false,
                render: function (item, index) {
                    return '<a name="edit_fee" class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-price"></i></a>';
                }
            },
            {display: '业务类型', name: 'service_type_name', align: 'left', minWidth: 50, width: 120, quickSort: false, isSort: false,},
            {display: '费用名称', name: 'fee_name_show', align: 'left', minWidth: 50, width: 120},
            {
                display: '是否含税', name: 'is_tax', align: 'left', minWidth: 50, width: 60, render: function (item) {
                if (!item.is_tax) return '<input type="checkbox" name="checkbox" disabled="disabled" style="margin-top:8px;">';
                return '<input type="checkbox" name="checkbox" checked="checked" disabled="disabled" style="margin-top:8px;">';
            }
            },
            {display: '税点', name: 'tax_point', align: 'left', minWidth: 50, width: 50},
            {display: '价格模式', name: 'price_model_name', align: 'left', minWidth: 50, width: 100, quickSort: false, isSort: false,},
            {display: '计价基准', name: 'price_base', align: 'left', minWidth: 50, width: 100, quickSort: false, isSort: false,
                render: LG.render.ref(data_price_base, 'price_base')},
            {display: '计量单位', name: 'unit', align: 'left', minWidth: 50, width: 100, quickSort: false, isSort: false,
                render: renderFeeUnit},
            {display: '对应事件', name: 'event_name', align: 'left', minWidth: 50, width: 100},
            {display: '报价记录', name: 'count', align: 'left', minWidth: 50, width:  80},
            {display: '合并规则', name: 'combine_type_name', align: 'left', minWidth: 50, width: 100 },
            {display: '计费条件关联属性', name: 'prop_name', align: 'left', minWidth: 50, width: '25%'},
//            {display: '费用合并规则', name: 'combine_type', align: 'left', minWidth: 50, width: 200, quickSort: false, isSort: false},
            {display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '25%'}
        ],
        pageSize: 20,
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
        heightDiff: -15,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'service_type',
        sortOrder: 'asc',
        parms: [{name: 'where', value: where}]
    };

    var filterFormOption = {
        fields: [
            {
                display: "姓名",
                name: "name",
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
            {display: "业务类型", name: "service_type", newline: false, labelWidth: 80, width: 170, space: 30, type: "select", cssClass: "field", validate: {required: true},
                options: {url: basePath + 'getServiceType?id=' + client_id}},
            {display: "费用名称", name: "fee_name", newline: false, labelWidth: 80, width: 170, space: 30, type: "select", cssClass: "field", validate: {required: true},
                options: {url: rootPath + '/tms/bas/dict/getData?query=fee_type'}},
            {display: "是否含税", name: "is_tax", newline: false, labelWidth: 80, width: 170, space: 30, type: "checkbox", cssClass: "field"},
            {display: "税点", name: "tax_point", newline: false, labelWidth: 80, width: 170, space: 30, type: "number", cssClass: "field", validate: {range: [0, 100]}},
            {display: "价格模式", name: "price_model", newline: false, labelWidth: 80, width: 170, space: 30, type: "select", cssClass: "field",
                options: {url: basePath + 'getPriceModel'}, validate: {required: true}},
            {display: "计价基准", name: "price_base", newline: false, labelWidth: 80, width: 170, space: 30, type: "select", cssClass: "field", comboboxName: 'price_base_c',
                validate: {required: true}, options: {data: []}},
            {display: "计量单位", name: "unit", newline: false, labelWidth: 80, width: 170, space: 30, type: "select", cssClass: "field",
                validate: {required: true}, comboboxName: 'unit_c', options: {data: []},},
            {display: "对应事件", name: "event", newline: false, labelWidth: 80, width: 170, space: 30, type: "select", cssClass: "field",
                options: {url: rootPath + '/tms/bas/dict/getData?query=event'}},
            {display: "关联属性", name: "fee_prop", newline: true, labelWidth: 80, width: 450, space: 30, type: "select", cssClass: "field", validate: {required: true},
                options: {
                    data: data_dict['fee_prop'],
                    isMultiSelect: true,
                    split: ',',
                }
            },
            {display: "合并规则", name: "combine_type", newline: false, labelWidth: 80, width: 170, space: 30, type: "select", cssClass: "field", validate: {required: true},
                options: {url: rootPath + '/tms/bas/dict/getData?query=fee_combine_type'}
            },
            {display: "备注", name: "remark", newline: false, labelWidth: 80, width: 452, space: 10, rows: 4, type: "textarea"},

            {name: "pk_id", type: "hidden"}
        ],
        validate: true,
        toJSON: JSON2.stringify
    };

    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 330,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {

                    var state = '${state}';
                    if (state == "STATE_11_USE") {
                        LG.showError("已使用的合同无法修改数据。");
                        return;
                    }

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
                        mst_id: client_id
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

    function initDrop() {
        var price_base_c = liger.get("price_base_c");
        price_base_c._setData(data_price_base);

    }

    var isFirst = true;
    //新增弹出窗自定义方法
    function defaultAction_add() {
        initDrop();
        initSelect();
    }

    function initSelect() {
        if (isFirst) {
            liger.get("price_base_c").bind('selected', function (value, text) {

                var price_base = $.grep(data_price_base, function (n, i) {
                    return data_price_base[i].id == value;
                });
                var unit_c = liger.get("unit_c");
                unit_c._setData(price_base.length > 0 ? price_base[0].unitList : []);
            });
        }
        isFirst = false;
    }

    //扩展按钮
    var toolbarOption = {
        items: [
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };
    var btnClick = function (item) {
    };

</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>

<script type="text/javascript">
    defaultSearchFilter["and"].push({field: 'mst_id', value: client_id, op: 'equal', type: 'string'});

    $(function () {
                //初始化编辑按钮
                $mainGrid.on('click', 'a[name=edit_data]', function (e) {
                    inlineClineDialogEdit(this);
                    initDrop();
                    initSelect();
                    //需要初始化值
                    var index = $(this).data("index");
                    var selected = mainGrid.getRow(index);
                    var price_base = $.grep(data_price_base, function (n, i) {
                        return data_price_base[i].id == selected.price_base;
                    });
                    var unit_c = liger.get("unit_c");
                    unit_c._setData(price_base.length > 0 ? price_base[0].unitList : []);

                    mainForm.setData({unit: selected.unit});

                });

                //初始化编辑按钮
                $mainGrid.on('click', 'a[name=edit_fee]', function (e) {
                    var index = $(this).data("index");
                    var selected = mainGrid.getRow(index);
                    var url = rootPath + "/tms/bas/contractfee/loadPage?pk_id=" + selected.pk_id + "&contract_id=" + client_id;
                    var iframe = window.parent.document.getElementById("linkmanGrid");
                    iframe.src = url;
                });
                $("#searchBtn").click();
                var contractState = '${state}';
                if (contractState == "STATE_11_USE") {
                    $(".l-dialog-buttons").remove();
                    $("div[toolbarid=add]").remove();
                    $("div[toolbarid=delete]").remove();
                }
            }
    );

</script>
</html>