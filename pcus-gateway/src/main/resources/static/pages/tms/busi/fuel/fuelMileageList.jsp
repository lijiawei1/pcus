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
        .trans-highlight {
            color: red;
        }

        .dialog-container {
            display: none;
        }

        .search-toggle {
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

        .search-toggle:before {
            content: "\e62e";
            display: inline-block;
            transform: rotate(90deg);
        }

        .search-toggle.on:before {
            transform: rotate(-90deg);
        }

        .c000, .c000:hover {
            color: #000;
        }

        .trans-highlight {
            color: red;
        }

        .trans-editor-disabled {
            width: 100%;
            height: 100%;
            background-color: #ebebeb;
            display: block;
        }

        .trans-editor-editable {
            width: 100%;
            height: 100%;
            background-color: #00a2d4;
            display: block;
        }

        .trans-state-other {
            color: #fff;
            background-color: #ff0000;
        }

        .trans-state-new {
            color: #fff;
            background-color: #32CD32;
        }

        a.row-edit-btn {
            margin-right: 5px
        }

        .combobox-list-item {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .combobox-list-item.car_no-item {
            width: 25%;
            min-width: 70px;
        }

        .combobox-list-item.driver_name-item.item1 {
            width: 27%;
        }

        .combobox-list-item.driver_name-item.item2 {
            width: 26%;
        }

        .combobox-list-item.driver_name-item.item3 {
            width: 25%;
        }

        .combobox-list-item.driver_name-item.item4 {
            width: 22%;
        }

        .icon-type {
            display: none;
            top: 6px;
        }

        .haveicon {
            position: relative;
        }

        .haveicon .icon-type {
            display: block;
        }

        /* 表格状态完成程度 */
        .red-100, .orange-100, .blue-100, .cyan-100, .pink-100, .gray-100, .purple-100, .yellow-100, .void-100 {
            position: relative;
            z-index: 4;
        }

        .red-100:before, .orange-100:before, .blue-100:before, .cyan-100:before, .pink-100:before, .gray-100:before, .purple-100:before, .yellow-100:before, .void-100:before {
            content: "";
            position: absolute;
            z-index: -1;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
        }

        /* 各颜色 */
        .qs-item {
            cursor: default;
        }

        .quick-search .qs-item-red, .red-100:before {
            background-color: #fc9;
        }

        .quick-search .qs-item-orange, .orange-100:before {
            background-color: #ffc;
        }

        .quick-search .qs-item-blue, .blue-100:before {
            background-color: #cff;
        }

        .quick-search .qs-item-cyan, .cyan-100:before {
            background-color: #cfc;
        }

        .quick-search .qs-item-pink, .pink-100:before {
            background-color: #fcc;
        }

        .quick-search .qs-item-gray, .gray-100:before {
            background-color: #ccf;
        }

        .quick-search .qs-item-purple, .purple-100:before {
            background-color: #f9f;
        }

        .quick-search .qs-item-yellow, .yellow-100:before {
            background-color: #cf6;
        }

        .qs-item-void, .void-100:before {
            background-color: #dfdfdf;
        }

        .operated {
            position: relative;
            z-index: 10;
            color: #000;
        }

        .operated:before {
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

        .row-green {
            background-color: #008000;
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
        <div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span class="text">高级<br>搜索</span>
        </div>
        <form class="history-search-form" id="history-search-form"></form>
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
    <form id="download" method="POST" target="_blank" action="${path}/tms/bm/fuelMileage/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
        <input type="text" name="where"/>
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

    var manager = {};
    var data_bs_type_name = ${busiType}, //业务类型
            data_state = ${state}, //单据状态
            data_clients = ${clients}, //客户
            data_suppliers = ${suppliers}, //供应商
            data_carriers = ${carriers}, //供应商
            data_car = ${car}, //车牌
            data_driver = ${driver}, //司机
            data_dict = ${dict}; //数据字典

    data_car = data_car.map(function (item) {
        return {
            id: item,
            text: item
        }
    });
    data_driver = data_driver.map(function (item) {
        return {
            id: item,
            text: item
        }
    });

    var localStorageName = "FuelMileageList" + user.id + param.no;  // 本地存储名字;

    var SELECTED = 'selected';

    var filterFormFieldWidth = {
        w1: 155,
        w2: 310,
        w3_2: 405
    };

    //上下文路径
    var basePath = rootPath + '/tms/bm/fuelMileage/';

    var fontSize = 12 / detectZoom(top);

    //默认数据
    var emptyData = {};

    //页面元素
    var $toptoolbar = $("#toptoolbar"),
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            mainGrid, //列表
            mainForm; //编辑表单

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '是否确认',
                name: 'mile_confirm',
                align: 'left',
                minWidth: 60,
                width: '3%',
                frozen: false,
                quickSort: false,
                render: LG.render.boolean('mile_confirm')
            },
            {display: '车牌号', name: 'car_no', align: 'left', minWidth: 80, width: '5%'},
            {display: '司机', name: 'driver_name', align: 'left', minWidth: 80, width: '5%'},
            {display: '作业时间', name: 'work_time', minWidth: 80, width: '5%'},
            {
                display: '任务类型',
                name: 'task_type_name',
                align: 'left',
                minWidth: 60,
                width: '3%',
                frozen: false,
                quickSort: false,
//                render: LG.render.ref(BILL_CONST.DATA_TASK_TYPE, 'task_type')
            },
            {
                display: '标准耗油', name: 'theo_fuel_cost', align: 'left', minWidth: 60, width: '8%', quickSort: false,
                render: function (data, index, val) {
                    if (!val) {
                        return val;
                    }
                    var result = new Number(val);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                }
            }, {
                display: '<span class="trans-highlight">轻公里数</span>',
                name: 'e_km',
                align: 'left',
                minWidth: 80,
                width: '8%',
                quickSort: false,
                xlsHead: '轻公里数',
                xlsName: 'e_km',
                editor: {
                    type: 'spinner',
                    ext: {
                        decimalplace: 2,   //小数位 type=float时起作用
                        step: 1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        minValue: 0        //最小值
                    }
                },
                render: function (row, index, val) {
                    return row.mile_confirm ? '<div class="row-green">' + val + '</div>' : val;
                }
            },
            {
                display: '<span class="trans-highlight">重公里数</span>',
                name: 'f_km',
                align: 'left',
                minWidth: 60,
                width: '8%',
                quickSort: false,
                xlsHead: '重公里数',
                xlsName: 'f_km',
                editor: {
                    type: 'spinner',
                    ext: {
                        decimalplace: 2,   //小数位 type=float时起作用
                        step: 1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        minValue: 0        //最小值
                    }
                },
                render: function (row, index, val) {
                    return row.mile_confirm ? '<div class="row-green">' + val + '</div>' : val;
                }
            },
            {display: '<span class="trans-highlight">签收重量</span>', name: 'total_weight', align: 'left', minWidth: 60, width: '8%',
                editor: {
                    type: 'spinner',
                    ext: {
                        decimalplace: 2,   //小数位 type=float时起作用
                        step: 1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        minValue: 0        //最小值
                    }
                },
            },
            {display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '5%'},
            {display: '装卸单位', name: 'lau_orgs', align: 'left', minWidth: 100, width: '5%', quickSort: false},
            {display: '运输线路', name: 'trans_line', align: 'left', minWidth: 100, width: '15%'},
            {display: '所属项目', name: 'oper_unit_name', align: 'left', minWidth: 100, width: '5%'},
            {
                display: '单据状态',
                name: 'state',
                align: 'left',
                minWidth: 60,
                width: '3%',
                frozen: false,
                quickSort: false,
                xlsIgnore: true,
                render: LG.render.ref(data_state, 'state', null, null, function (text, item) {
                    return '<div class="l-grid-row-cell-inner pink-100">' + text + '</div>';
                })
            },
            {
                display: '甩挂', name: 'cntr_drop_trailer', align: 'left', minWidth: 40, width: '2%',
                render: LG.render.boolean('cntr_drop_trailer')
            },
            {
                display: '孖拖', name: 'cntr_twin', align: 'left', minWidth: 40, width: '2%',
                render: LG.render.boolean('cntr_twin')
            },
            {display: '柜号', name: 'cntr_no', align: 'left', minWidth: 100, width: '5%'},
            {display: '委托客户', name: 'client_name', align: 'left', minWidth: 80, width: '10%', frozen: false},
            {display: '客户委托号', name: 'client_bill_no', align: 'left', minWidth: 100, width: '5%'},
            /********************************************
             * 船信息
             ********************************************/
            {display: '订舱号/提单号', name: 'booking_no', align: 'left', minWidth: 120, width: '5%'},
            {display: '船公司', name: 'ship_corp', align: 'left', minWidth: 100, width: '5%', quickSort: false,},
            {display: '预约提柜时间', name: 'cntr_pick_time', minWidth: 120, width: '5%', xlsHead: '预约提柜时间'},

            {display: '提柜地', name: 'gate_out_dock', align: 'left', minWidth: 80, width: '5%'},
            {display: '还柜地', name: 'gate_in_dock', align: 'left', minWidth: 80, width: '5%'},
            {display: '手机号', name: 'driver_mobile', align: 'left', minWidth: 80, width: '5%'},
            {
                display: '外协',
                name: 'outsourcing',
                align: 'left',
                minWidth: 30,
                width: '2%',
                render: LG.render.boolean('outsourcing')
            },
            {display: '车型', name: 'car_type_name', align: 'left', minWidth: 60, width: '5%'},
            {display: '承运方', name: 'carrier_name', align: 'left', minWidth: 100, width: '5%'},
            /********************************************
             * 柜信息
             ********************************************/
            {display: '封条号', name: 'cntr_seal_no', align: 'left', minWidth: 100, width: '5%'},

            {display: '孖拖柜号', name: 'cntr_twin_no', align: 'left', minWidth: 100, width: '2%'},
            {display: '船名', name: 'ship_name', align: 'left', minWidth: 100, width: '5%'},
            {display: '航次', name: 'voyage', align: 'left', minWidth: 100, width: '5%'},
            /********************************************
             * 其它信息
             ********************************************/
            {display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 150, width: '10%'},
            {display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 80, width: '5%'},
            {display: '作业单号', name: 'bill_no', align: 'left', minWidth: 100, width: '8%'},
            {display: '创建人', name: 'create_psn', align: 'left', minWidth: 100, width: '5%', xlsIgnore: false},
            {display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%'}
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        dataAction: 'server',
        usePager: true,
        enabledEdit: true, //可编辑
        clickToEdit: false,
        fixedCellHeight: true,
        inWindowComplete: true,
        heightDiff: -160,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        colDraggable: true,
        localStorageName: localStorageName,
        sortName: 'modify_time',
        sortOrder: 'desc',
        onDblClickRow: function (rowdata, rowid, rowHtml, cellHtml) {
            if (cellHtml) {
                this._applyEditor(cellHtml);
                $(this.editor.input).focus();
            }
        },
        onBeforeEdit: function (editParm) {
            var column = editParm.column,
                    record = editParm.record;
            if (column === 'mile_confirm' && !record['mile_confirm']) {
                LG.tip("任务已确认公里数"); // 孖拖才能输入孖拖柜号
                return false;
            }
            if ((column.columnname === 'e_km' || column.columnname === 'f_km' || column.columnname === 'total_weight')  && record['mile_confirm']) {
                LG.tip("任务已确认公里数");
                return false;
            }
            //记录修改前的值
            manager.lastRecord = $.extend({}, record);
            return true;
        },
        onAfterEdit: function (editParm) {
            var column = editParm.column,
                    record = editParm.record;

            //判断值是否改变
            if (manager.lastRecord && manager.lastRecord[column.columnname] === editParm.value) {
                LG.tip("值未改变");
                return;
            }
            if ((column.columnname === 'e_km' || column.columnname === 'f_km') && editParm.value < 0) {
                LG.tip("修改的值错误");
                this.updateRow(record, manager.lastRecord);
                return;
            }
            var postData = {
                pk_id: record.pk_id,
                version: record.version,
                columnname: column.columnname
            };
            postData[column.columnname] = editParm.value;
            LG.ajax({
                url: basePath + 'updateInline',
                data: JSON.stringify(postData, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (sss, msg) {
                    mainGrid.isDataChanged = false;
                    mainGrid.updateRow(record['__id'], $.extend({}, record, postData));
                    LG.tip("值更新成功");
                },
                error: function (msg) {
                }
            });
        }
    };

    mainGrid = $mainGrid.ligerGrid(gridOption);

    // 高级搜索弹窗
    var seachForm = $('#filterForm').ligerSearchForm({
        fields: [{
            display: "作业时间",
            name: "work_time_s",
            newline: false,
            type: "date",
            editor: {
                format: "yyyy-MM-dd",
            },
            attr: {
                op: "greaterorequal", //操作符
                dateformat: "yyyy-MM-dd",
                "data-name": "work_time"
            }
        }, {
            display: "至",
            name: "work_time_e",
            newline: false,
            width: filterFormFieldWidth.w2,
            labelWidth: 24,
            type: "date",
            cssClass: "field",
            editor: {
                format: "yyyy-MM-dd",
            },
            attr: {
                op: "lessorequal", //操作符
                dateformat: "yyyy-MM-dd",
                "data-name": "work_time",
            }
        }, {
            display: "公里数确认",
            name: "mile_confirm",
            newline: false,
            type: "select",
            options: {
                autocomplete: true,
                autocompleteAllowEmpty: true,
                highLight: true,
                data: [{"id": "Y", "text": "是"}, {"id": "N", "text": "否"}]
            }
        }, {
            display: "是否有公里数",
            name: "have_km",
            newline: false,
            type: "select",
            options: {
                autocomplete: true,
                autocompleteAllowEmpty: true,
                highLight: true,
                data: [{"id": 1, "text": "是"}, {"id": 0, "text": "否"}]
            },
            attr: {
                op: "equal"
            }
        }, {
            display: "轻公里数",
            name: "e_km",
            newline: false,
            attr: {
                op: "equal"
            }
        }, {
            display: "重公里数",
            name: "f_km",
            newline: false,
            attr: {
                op: "equal"
            }
        }, {
            display: "运输路线",
            name: "trans_line",
            newline: false
        }, {
            display: "委托客户",
            name: "client_id",
            newline: false,
            type: "select",
            options: {
                autocomplete: true,
                autocompleteAllowEmpty: true,
                highLight: true,
                data: data_clients
            }
        }, {
            display: "司机名",
            name: "driver_name",
            newline: false,
            type: "select",
            options: {
                autocomplete: true,
                autocompleteAllowEmpty: true,
                highLight: true,
                data: data_driver
            }
        }, {
            display: "车牌号",
            name: "car_no",
            newline: false,
            type: "select",
            options: {
                autocomplete: true,
                autocompleteAllowEmpty: true,
                highLight: true,
                valueField: 'text',
                data: data_car
            }
        }, {
            display: "提柜地",
            name: "gate_out_dock",
            newline: false
        }, {
            display: "还柜地",
            name: "gate_in_dock",
            newline: false
        }, {
            display: "装卸单位",
            name: "lau_orgs",
            newline: false,
            type: "text"
        }, {
            display: "是否甩挂",
            name: "cntr_drop_trailer",
            newline: false,
            type: "select",
            cssClass: "field",
            options: {
                data: [{
                    id: 'Y',
                    text: '是'
                }, {
                    id: 'N',
                    text: '否'
                }]
            }
        }, {
            display: "是否孖拖",
            name: "cntr_twin",
            newline: false,
            type: "select",
            cssClass: "field",
            options: {
                data: [{
                    id: 'Y',
                    text: '是'
                }, {
                    id: 'N',
                    text: '否'
                }]
            }
        }, {
            display: "所属项目", name: "oper_unit", newline: false,
            type: "select", cssClass: "field", comboboxName: "oper_unit_c",
            options: {
                data: data_dict[DICT_CODE.oper_unit],
                absolute: true,
                cancelable: true,
                isMultiSelect: true,
                split: ',',
                autocomplete: true,
                highLight: true,
                keySupport: true
            },
            attr: {
                op: "in" //操作符
            }
        }, {
            display: "揽货公司",
            name: "supplier_id",
            newline: false,
            type: "select",
            options: {
                autocomplete: true,
                autocompleteAllowEmpty: true,
                highLight: true,
                data: data_suppliers
            }
        }, {
            display: "业务类型",
            name: "bs_type_code",
            newline: false,
            type: "select",
            options: {
                data: data_bs_type_name
            }
        }, {
            display: "作业单号",
            name: "bill_no",
            newline: false,
            type: "text"
        }, {
            display: "运输单号",
            name: "order_bill_no",
            newline: false,
            type: "text"
        }],
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
            storageId: "fuelMileageList" + user.id,
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
                "state": true,
                "client_name": true,
                "cntr_no": true
            },
            exFields: {
                "work_time_e": {
                    display: "(预约提柜时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 120 / detectZoom(top)
                },
                "work_time_e": {
                    display: "(作业时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 120 / detectZoom(top)
                }
            }
        },
        labelWidth: 90,
        inputWidth: 220,
        space: 30,
        prefixID: "s_"
    });

    var defaultActionOption = {
        items: [
            {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']},
            {id: 'updateLineInfo', text: '更新指标', click: defaultAction, icon: 'refresh', status: ['OP_INIT']},
            {id: 'submitBatch', text: '审核', click: defaultAction, icon: 'audit', status: ['OP_INIT']},
            {id: 'unsubmitBatch', text: '撤销', click: defaultAction, icon: 'withdraw', status: ['OP_INIT']},
            {
                text: '导出数据',
                icon: 'export',
                click: function () {

                    if (typeof defaultSearchFilter === "undefined") {
                        defaultSearchFilter = {
                            and: [],
                            or: []
                        };
                    }
                    //Excel数据下载
                    $("#download").attr("action", basePath + "excelExport");
                    xlsUtil.exp($("#download"), mainGrid, '公里数确认明细' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {where: seachForm.getSearchFormData(true, defaultSearchFilter)});
                }
            }
//            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };

    function defaultAction(item) {
        switch (item.id) {
            case "refresh":
                mainGrid.reload();
                break;
            case "updateLineInfo":
                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }

                //检查单据状态
                for (var i = 0; i < selected.length; i++) {
                    if (selected[i].mile_confirm == true) {
                        LG.showError("所选单据状态[公里数已审核]，不可更新");
                        return;
                    }
                }

                $.ligerDialog.confirm('确定更新吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'updateLineInfo',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, message, code) {
                            if (code == '201') {
                                LG.showError(parseMsg(data));
                            } else {
                                // refresh();
                                refresh(selected, data);
                                LG.tip('更新成功');
                            }
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;
                break;
            case "submitBatch":
                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }

                //检查单据状态
                for (var i = 0; i < selected.length; i++) {
                    if (selected[i].mile_confirm == true) {
                        LG.showError("所选单据状态[公里数已审核]，不可审核");
                        return;
                    }
                }

                $.ligerDialog.confirm('确定审核吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'submitBatch',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
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
                break;
            case "unsubmitBatch":
                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }

                //检查单据状态
                for (var i = 0; i < selected.length; i++) {
                    if (!selected[i].mile_confirm) {
                        LG.showError("所选单据状态[公里数未审核]，不可撤销");
                        return;
                    }
                }

                $.ligerDialog.confirm('确定撤销吗?', function (confirm) {
                    if (!confirm) return;
                    LG.ajax({
                        url: basePath + 'unsubmitBatch',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            refresh(selected, data);
                            LG.tip('撤销成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;
        }
    }

    //扩展按钮
    toptoolbar = LG.powerToolBar($toptoolbar, defaultActionOption);

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

    /**
     * 刷新
     * @param selected
     * @param data
     */
    function refresh(selected, data) {
        $(".l-grid-row-cell-rownumbers").removeClass('operated');
        if (!selected && !data) {
            mainGrid.reload();
            return;
        }
        var mapping = {};

        if (!(data instanceof Array)) {
            data = [data];
        }
        if (!(selected instanceof Array)) {
            selected = [selected];
        }
        $.map(data, function (item) {
            mapping[item.pk_id] = item;
            if (item.children && item.children.length > 0) {
                $.map(item.children, function (it) {
                    mapping[it.pk_id] = it;
                });
            }
        });

        $.each(selected, function (idx, obj) {
            //更新行数据的版本号
            var newData = $.extend({}, obj, mapping[obj.pk_id]);
            mainGrid.updateRow(obj['__id'], newData);
            mainGrid.isDataChanged = false;

            var dom = $(mainGrid.getRowObj(obj['__id'], true));
            dom.children('.l-grid-row-cell-rownumbers').addClass('operated');
            // $('.l-selected').each(function (index, e) {
            //     $(this).children('.l-grid-row-cell-rownumbers').addClass('operated');
            // })
        });
    }

    /**
     * 解析返回信息
     * @param data
     * @returns {string}
     */
    function parseMsg(data) {
        var msg = "检验不通过</br>";
        $.each(data, function (i, v) {
            var subMsg = data[i].tag + "</br>";

            if (data[i].error) {
                $.each(data[i].detailList, function (si, sv) {
                    subMsg += (sv.message + ",");
                });
            }
            msg += (subMsg + ";</br>");
        });
        return '<div style="max-height: 300px;">' + msg + '</div>'
    }
</script>
</html>
