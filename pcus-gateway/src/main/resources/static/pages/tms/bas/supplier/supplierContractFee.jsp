<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/3
  Time: 17:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>报价明细</title>
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


<!-- 增加弹出框 -->
<div id="loadDialog" style="display: none;">
    <form id="loadForm"></form>
</div>

<div id="importFailDialog" style="display: none;">
    <form id="failForm" method="POST" target="_blank" action="">
    </form>
</div>

<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/contractfee/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
        <input type="text" name="contract_id"/>
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

    var client_id = '${client_id}';
    var contract_id = '${contract_id}';
    var mainId = contract_id;
    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/bas/contractfee_s/';


    //默认数据
    var emptyData = {
        pk_id: '',
        amount: '',
        car_type: null,
        cntr_type: null,
        cargo_type: null,
        load_unit: null,
        load_address: null,
        unload_unit: null,
        unload_address: null,
        cntr_in_place: null,
        cntr_out_place: null,
        oper_unit: null,
        urgent_order: null,
        twindrag_main: false,
        twindrag_second: false,
        take_goods: false,
        assignment: false,
        trailer: false,
        client: null,
        create_psn: '',
        create_time: '',
        modify_time: '',
        modify_psn: '',
        remark: ''
    };

    //页面元素
    var $gridWrapper = $(".grid-wrapper"),
            $filterWrapper = $(".filter-wrapper"),
            $filterForm = $("#filterForm"),
            $uploadDlg = $("#uploadDlg"),
            $mainDlg = $("#mainDlg"), //编辑弹窗
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            uploadDlg, //导入框
            mainGrid, //列表
            mainForm, //编辑表单
            mainDlg; //弹窗

    var where = JSON2.stringify({
        op: 'and',
        rules: [{field: 'DR', value: '0', op: 'equal'}]
    });

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '', align: '', minWidth: 50, width: '5%', sortable: false,
                render: function (item, index) {
                    return '<a class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-edit"></i></a>';
                },
                hide: disabledButtons.indexOf('update') >= 0
            },
            {display: '客户', name: 'client_name', id: 'client_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '车型', name: 'car_type_name', id: 'car_type_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '柜型', name: 'cntr_type_name', id: 'cntr_type_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '货物类型', name: 'cargo_type_name', id: 'cargo_type_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '装货单位', name: 'load_unit_name', id: 'load_unit_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '装货地', name: 'load_address_name', id: 'load_address_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '装货报价区域', name: 'load_region_name', id: 'load_region_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '卸货单位', name: 'unload_unit_name', id: 'unload_unit_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '卸货地', name: 'unload_address_name', id: 'unload_address_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '卸货报价区域', name: 'unload_region_name', id: 'unload_region_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '提柜地', name: 'cntr_in_place_name', id: 'cntr_in_place_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '提柜报价区域', name: 'gate_out_region_name', id: 'gate_out_region_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '还柜地', name: 'cntr_out_place_name', id: 'cntr_out_place_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '还柜报价区域', name: 'gate_in_region_name', id: 'gate_in_region_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '货物重量范围', name: 'cargo_weight_range_name', id: 'cargo_weight_range_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '货物体积范围', name: 'cargo_volume_range_name', id: 'cargo_volume_range_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '货物数量范围', name: 'cargo_qty_range_name', id: 'cargo_qty_range_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '操作单位', name: 'oper_unit_name', id: 'oper_unit_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '急单类型', name: 'urgent_order_name', id: 'urgent_order_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '自定义业务', name: 'client_busi_name', id: 'client_busi_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '自定义收款方', name: 'receiver_name_name', id: 'receiver_name_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '船公司', name: 'ship_corp_name', id: 'ship_corp_name', align: 'left', minWidth: 50, width: '10%', hide: true},
            {display: '孖拖（主）', name: 'twindrag_main_name', id: 'twindrag_main_name', align: 'left', quickSort: false, minWidth: 50, width: '10%', hide: true,
                render: function (item) {
                    if (!item.twindrag_main) return '<input type="checkbox" name="checkbox" disabled="disabled" style="margin-top:4px;">';
                    return '<input type="checkbox" name="checkbox" checked="checked" disabled="disabled" style="margin-top:4px;">';
                }
            },
            {
                display: '孖拖（副）', name: 'twindrag_second_name', id: 'twindrag_second_name', align: 'left', minWidth: 50, quickSort: false, width: '10%', hide: true,
                render: function (item) {
                    if (!item.twindrag_second) return '<input type="checkbox" name="checkbox" disabled="disabled" style="margin-top:4px;">';
                    return '<input type="checkbox" name="checkbox" checked="checked" disabled="disabled" style="margin-top:4px;">';
                }
            },
            {
                display: '带货', name: 'take_goods_name', id: 'take_goods_name', align: 'left', quickSort: false, minWidth: 50, width: '10%', hide: true,
                render: function (item) {
                    if (!item.take_goods) return '<input type="checkbox" name="checkbox" disabled="disabled" style="margin-top:4px;">';
                    return '<input type="checkbox" name="checkbox" checked="checked" disabled="disabled" style="margin-top:4px;">';
                }
            },
            {display: '外派', name: 'assignment_name', id: 'assignment_name', align: 'left', quickSort: false, minWidth: 50, width: '10%', hide: true,
                render: function (item) {
                    if (!item.assignment) return '<input type="checkbox" name="checkbox" disabled="disabled" style="margin-top:4px;">';
                    return '<input type="checkbox" name="checkbox" checked="checked" disabled="disabled" style="margin-top:4px;">';
                }
            },
            {display: '甩挂', name: 'trailer_name', id: 'trailer_name', quickSort: false, align: 'left', minWidth: 50, width: '10%', hide: true,
                render: function (item) {
                    if (!item.trailer) return '<input type="checkbox" name="checkbox" disabled="disabled" style="margin-top:4px;">';
                    return '<input type="checkbox" name="checkbox" checked="checked" disabled="disabled" style="margin-top:4px;">';
                }
            },
            {display: '报价', name: 'amount', id: 'amount', align: 'left', minWidth: 50, width: '10%'},
            {display: '最小金额', name: 'min_amount', id: 'min_amount', align: 'left', minWidth: 50, width: '10%'},
            {display: '最大金额', name: 'max_amount', id: 'max_amount', align: 'left', minWidth: 50, width: '10%'},


        ],
        pageSize: 20,
        url: basePath + 'loadGrid/' + client_id,
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        checkbox: true,
//        noHideWidth : false,
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
        sortName: 'create_time',
        sortOrder: 'desc',
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
            {
                display: "客户",
                name: "client",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    url: basePath + 'getClient'
                },
            },
            {
                display: "车型",
                name: "car_type",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=car_type'
                },
            },
            {
                display: "柜型",
                name: "cntr_type",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=cntr_type'
                },
            },
            {
                display: "货物类型",
                name: "cargo_type",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=cargo_type'
                },
            },
            {
                display: "装货单位",
                name: "load_unit",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                comboBoxName: 'load_unit_c',
                options: {
                    selectBoxWidth: 450,
                    selectBoxHeight: 220,
                    valueField: 'code',
                    textField: 'sname',
                    url: basePath + "getloadUnloadUnit",
                    autoFiler: 'sname',
                    onSuccess: function (data) {
                        this.setData(data.Rows);
                    },
                    renderItem: function (data) {
                        return data.data.sname + ' ' + data.data.address;
                    }
                },
            },
            {
                display: "装货地",
                name: "load_address",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    autoFiler: 'sname',
                    selectBoxWidth: 450,
                    selectBoxHeight: 220,
                    valueField: 'code',
                    textField: 'sname',
                    url: basePath + "getloadUnloadUnit",
                    onSuccess: function (data) {
                        this.setData(data.Rows);
                    },
                    renderItem: function (data) {
                        return data.data.sname + ' ' + data.data.address;
                    }
                },
            },
            {
                display: "装货报价区域", name: "load_region", newline: true, labelWidth: 90, width: 470, space: 30, type: "taginput", cssClass: "field",
                options: {
                    url: basePath + 'getRegions',
                    isTextBoxMode: true
                    // onBeforeOpen: function () {
                    //     this._setUrl(this.options.url);
                    // }
                }
            },
            {
                display: "卸货单位",
                name: "unload_unit",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    autoFiler: 'sname',
                    selectBoxWidth: 450,
                    selectBoxHeight: 220,
                    valueField: 'code',
                    textField: 'sname',
                    url: basePath + "getloadUnloadUnit",
                    onSuccess: function (data) {
                        this.setData(data.Rows);
                    },
                    renderItem: function (data) {
                        return data.data.sname + ' ' + data.data.address;
                    }
                },
            },
            {
                display: "卸货报价区域", name: "unload_region", newline: true, labelWidth: 90, width: 470, space: 30, type: "taginput", cssClass: "field",
                options: {
                    url: basePath + 'getRegions',
                   onBeforeOpen: function () {
                       this._setUrl(this.options.url);
                   }
                }
            },
            {
                display: "卸货地",
                name: "unload_address",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    autoFiler: 'sname',
                    selectBoxWidth: 450,
                    selectBoxHeight: 220,
                    valueField: 'code',
                    textField: 'sname',
                    url: basePath + "getloadUnloadUnit",
                    onSuccess: function (data) {
                        this.setData(data.Rows);
                    },
                    renderItem: function (data) {
                        return data.data.sname + ' ' + data.data.address;
                    }
                },
            },
            {
                display: "提柜地",
                name: "cntr_in_place",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    autoFiler: 'sname',
                    selectBoxWidth: 450,
                    selectBoxHeight: 220,
                    valueField: 'code',
                    textField: 'sname',
                    url: basePath + "getloadUnloadUnit",
                    onSuccess: function (data) {
                        this.setData(data.Rows);
                    },
                    renderItem: function (data) {
                        return data.data.sname + ' ' + data.data.address;
                    }
                }
            },
            {
                display: "提柜报价区域", name: "gate_out_region", newline: true, labelWidth: 90, width: 470, space: 30, type: "taginput", cssClass: "field",
                options: {
                    url: basePath + 'getRegions',
                   onBeforeOpen: function () {
                       this._setUrl(this.options.url);
                   }
                }
            },
            {
                display: "还柜地",
                name: "cntr_out_place",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    autoFiler: 'sname',
                    selectBoxWidth: 450,
                    selectBoxHeight: 220,
                    valueField: 'code',
                    textField: 'sname',
                    url: basePath + "getloadUnloadUnit",
                    onSuccess: function (data) {
                        this.setData(data.Rows);
                    },
                    renderItem: function (data) {
                        return data.data.sname + ' ' + data.data.address;
                    }
                },
            },
            {
                display: "还柜报价区域", name: "gate_in_region", newline: true, labelWidth: 90, width: 470, space: 30, type: "taginput", cssClass: "field",
                options: {
                    url: basePath + 'getRegions',
                   onBeforeOpen: function () {
                       this._setUrl(this.options.url);
                   }
                }
            },
            {display: "货物数量范围", name: "cargo_qty_range", newline: false, labelWidth: 90, width: 170, space: 30, cssClass: "field", type: "set"},
            {display: "货物重量范围", name: "cargo_weight_range", newline: false, labelWidth: 90, width: 170, space: 30, cssClass: "field", type: "set"},
            {display: "货物体积范围", name: "cargo_volume_range", newline: false, labelWidth: 90, width: 170, space: 30, cssClass: "field", type: "set"},
            {
                display: "操作单位",
                name: "oper_unit",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=oper_unit'
                },
            },
            {
                display: "急单类型",
                name: "urgent_order",
                newline: false,
                labelWidth: 90,
                width: 370,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=urgent_order'
                },
            },
            {
                display: "自定义业务",
                name: "client_busi",
                newline: true,
                labelWidth: 90,
                width: 460,
                space: 30,
                type: "taginput",
                cssClass: "field",
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=client_busi',
                    freeInput: true
                }
            },
            {
                display: "自定义收款方",
                name: "receiver_name",
                newline: true,
                labelWidth: 90,
                width: 460,
                space: 30,
                type: "text"
//                type: "taginput",
//                cssClass: "field",
//                options: {
//                    url: rootPath + '/tms/bas/dict/getData?query=client_busi',
//                    freeInput: true
//                }
            },
            {display: "船公司", name: "ship_corp", newline: false, labelWidth: 90, width: 300, space: 30, type: "text", cssClass: "field"},
            {
                display: "孖拖（主）",
                name: "twindrag_main",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "checkbox",
                cssClass: "field"
            },
            {
                display: "孖拖（副）",
                name: "twindrag_second",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "checkbox",
                cssClass: "field"
            },
            {
                display: "带货",
                name: "take_goods",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "checkbox",
                cssClass: "field"
            },
            {
                display: "外派",
                name: "assignment",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "checkbox",
                cssClass: "field"
            },
            {
                display: "甩挂",
                name: "trailer",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "checkbox",
                cssClass: "field"
            },
            {
                display: "报价",
                name: "amount",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "number",
                cssClass: "field",
                validate: {required: true, min: 0}
            },
            {
                display: "最小金额",
                name: "min_amount",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "number",
                cssClass: "field",
                validate: {required: false, min: 0}
            },
            {
                display: "最大金额",
                name: "max_amount",
                newline: false,
                labelWidth: 90,
                width: 170,
                space: 30,
                type: "number",
                cssClass: "field",
                validate: {required: false, min: 0}
            },
            {

                name: "pk_id",
                type: "hidden"
            }
        ],
        validate: true,
        toJSON: JSON2.stringify
    };

    function getGridOptions(checkbox) {

        var options = {
            columns: [
                {display: '简称', name: 'sname', align: 'left', width: 80, minWidth: 50},
                {display: '地址', name: 'address', width: 250},
            ], switchPageSizeApplyComboBox: false,
            url: basePath + "getloadUnloadUnit",
            usePager: false,
            checkbox: checkbox
        };
        return options;
    }

    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 350,
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
                        mst_id: client_id,
                        contract_id: contract_id
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
                    }, item)

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

    var failForm = $("#failForm");
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

    var myEditFileds;
    $.ajax({
        url: basePath + "/getShowFields?id=" + client_id,
        dataType: 'json',
        success: function (result) {
            myEditFileds = result;
            for (var i = 0; i < result.length; i++) {
                //隐藏表格字段
                var column = mainGrid.getColumn(result[i].related_prop.toLowerCase() + "_name");
                mainGrid.toggleCol(column, true,false);

            }
        }
    });


    var isFirst = true;
    //新增弹出窗自定义方法
    function defaultAction_add() {
        initFields();
    }

    function initFields() {
        if (isFirst) {
            for (var i = 0; i < Object.keys(mainForm.editors).length; i++) {
                var name = mainForm.getField(i).name;
                if (name == "create_psn" || name == "create_time" || name == "modify_psn" || name == "modify_time" || name == "amount") {
                    continue;
                }
                mainForm.setVisible(mainForm.getField(i).name, false);

            }
            for (var i = 0; i < myEditFileds.length; i++) {
                mainForm.setVisible(myEditFileds[i].related_prop.toLowerCase(), true);
                var name = myEditFileds[i].related_prop.toLowerCase();
                if (name == "twindrag_main" || name == "twindrag_second" || name == "take_goods" || name == "assignment" || name == "trailer") {
                    continue;
                }
                mainForm.setFieldValidate(myEditFileds[i].related_prop.toLowerCase(), {required: true});
            }
        }
        isFirst = false;
    }
    //扩展按钮
    var toolbarOption = {
        items: [
            //{id:'add',ignore:true},
            {
                id: 'more',
                text: '导入导出',
                icon: 'download',
                menu: {
                    items: [
                        {id: 'excelTmpl', text: '下载模板', click: excelTmpl, status: ['OP_INIT']},
                        {id: 'excelExport', text: '导出报价', click: excelExport, status: ['OP_INIT']},
                        {id: 'excelImport', text: '导入报价', click: excelImport, status: ['OP_INIT']}
                    ]
                }
            },
            {id: 'selectMenu', text: '返回', click: myback, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };
    var btnClick = function (item) {
    };

    function myback() {
        history.go(-1);
    }

    function excelTmpl() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/bas/contractfee_s/excelTmpl")
        xlsUtil.exp($("#download"), mainGrid, '报价导入模板' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {pk_id: client_id, contract_id: contract_id});
    }
    function excelExport() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/bas/contractfee_s/excelExport");
        xlsUtil.exp($("#download"), mainGrid, '报价' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {pk_id: client_id, contract_id: contract_id});
    }
    function excelImport() {
        //Excel模板导入
        if (!uploadDlg) {
            uploadDlg = $.ligerDialog.open({
                target: $uploadDlg,
                title: '导入线路',
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
                        text: '取消', onclick: function () {
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
            var url = basePath + 'excelImport';

            uploadDlg.hide();
            LG.showLoading('正在上传中...');

            var formData = new FormData();
            var uform = $("#uploadForm");

            var meta = {'报价': 'amount', '最小金额': 'min_amount', '最大金额': 'max_amount',};
            for (var i = 0; i < myEditFileds.length; i++) {
                var prop = myEditFileds[i].related_prop.toLowerCase();
                var prop_name = prop + "_name";
                var display = $.grep(gridOption.columns, function (item) {
                    return item.name == prop_name;
                })[0].display;
                meta[display] = prop;
            }

            formData.append('excel',
                    JSON2.stringify({
                        pk_id: contract_id + "#" + client_id, //业务主键
                        name: 'fileupload', //上传控件名称
                        cover: cover || false, //是否覆盖
                        meta: meta
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
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>

<script type="text/javascript">
//    defaultSearchFilter["and"].push({field: 'mst_id', value: client_id, op: 'equal', type: 'string'});

    $(function () {
        //初始化编辑按钮
        $mainGrid.on('click', 'a.row-edit-btn', function (e) {
            inlineClineDialogEdit(this);
            initFields();
        });
        $("#searchBtn").click();
        var contractState = '${state}';
        if (contractState == "STATE_11_USE") {
            $(".l-dialog-buttons").remove();
            $("div[toolbarid='add']").remove();
            $("div[toolbarid='delete']").remove();
            $("div[toolbarid='more']").remove();
//            $("div[toolbarid=excelImport]").remove();
        }
    });

    // 手机号码验证
    jQuery.validator.addMethod("isMobile", function (value, element) {

        var length = value.length;
        if (length == 0) {
            return true
        }
        ;
        return this.optional(element) || (length == 11 && ( /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|170)+\d{8})$/.test(value) ));
    }, "请填写正确的手机号。");

    // 手机号码验证
    jQuery.validator.addMethod("isPhone", function (value, element) {
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        var length = value.length;
        if (length == 0) {
            return true
        }
        ;
        return this.optional(element) || (length == 11 && ( tel.test(value)));
    }, "请填写正确的联系电话。");


</script>
</html>