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
    <title>单车成本</title>
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
    var basePath = rootPath + '/tms/settle/carbilldetail/';
    var where = {
        op: 'and',
        rules: [],
        groups: []
    };

    var mstId = `${mst_id}`;
    var oper_unit = ${oper_unit};
    var suppliers = ${suppliers};

    var carNo =  ${carNoList};
    var years = [{"text":2017},{"text":2018},{"text":2019},{"text":2020},{"text":2021},{"text":2022},{"text":2023},{"text":2024},{"text":2025},{"text":2026},{"text":2027},{"text":2028},{"text":2029},{"text":2030},{"text":2031},{"text":2032},{"text":2033},{"text":2034},{"text":2035},{"text":2036},{"text":2037}];
    var months = [{"text":1},{"text":2},{"text":3},{"text":4},{"text":5},{"text":6},{"text":7},{"text":8},{"text":9},{"text":10},{"text":11},{"text":12}];

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

        carNo = carNo.map(function (item) {
            return {
                id: item,
                text: item
            }
        });

        var mainGrid, seachForm, mainForm, toolbar;
        // 是否关闭高级搜索
        var materialsSearchToggle = localStorage['materialsSearchToggle'] ? localStorage['materialsSearchToggle'] : false ;

        // 主要表格
        mainGrid = $('#mainGrid').ligerGrid({
            columns: [
               /* {
                    //行内按钮
                    display: '编辑', align: '', minWidth: 50, width: '5%', sortable: false,
                    render: function (item, index) {
                        return '<a class="row-edit-btn" data-index="' + index + '" title="编辑" ><i class="iconfont l-icon-edit"></i></a>';
                    }
                },*/
                {
                    display: '<span style="color: red;">车牌号<span>',
                    name: 'car_no',
                    xlsHead: '车牌号',
                    width: '100',
                    frozen:true,
                    editor: {
                        type: 'select',
                        ext: {
                            autocomplete: true,
                            highLight: true,
                            keySupport: true,
                            data: carNo
                        }
                    }
                },
                {
                    display: '业务收入',
                    name: 'busi_amount',
                    width: '100',
                    frozen:true


                },
                {
                    display: '开始时间 ',
                    name: 'start_date',
                    width: '100',
                    editor: {
                        type: 'date',
                        ext: {
                            format: "yyyy-MM-dd",
                            onChangeDate: function (val) {
                                if (!val) { return false;}
                                this.setValue(this.usedDate.setHours('00', '00', '00'))
                            }
                        }
                    },
                    render: function (item, index, text) {
                        if (!item.start_date && !item.start_date) {
                            return text;
                        }
                        if (typeof text === 'object') {
                            text = DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss', text);
                        }
                        return text;
                    }
                },
                {
                    display: '结束时间',
                    name: 'end_date',
                    width: '100',
                    editor: {
                        type: 'date',
                        ext: {
                            format: "yyyy-MM-dd",
                            onChangeDate: function (val) {
                                if (!val) { return false;}
                                this.setValue(this.usedDate.setHours('23', '59', '59'))
                                console.log(this.getValue());
                            }
                        }
                    } ,
                    render: function (item, index, text) {
                    if (!item.end_date && !item.end_date) {
                        return text;
                    }
                    if (typeof text === 'object') {
                        text = DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss', text);
                    }
                    return text;
                }


                },
                {
                    display: '<span style="color: red;">柴油费<span>',
                    name: 'cyf',
                    xlsHead: '柴油费',
                    width: '100',
                    editor: {
                        type: 'float',
                        ext: {
                            isNegative: false, //是否负数
                            decimalplace: 2,   //小数位 type=float时起作用

                            onChangeValue: false,    //改变值事件
                            minValue: 0        //最小值
                        }
                    }


                },
                {
                    display: '占比',
                    name: 'cbsrb_chy',
                    width: '50', render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                     }


                },
                {
                    display:'<span style="color: red;">路桥费<span>',
                    name: 'lqf',
                    xlsHead: '路桥费',
                    width: '100',
                    editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_lq',
                    width: '50', render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display:'<span style="color: red;">维配费<span>',
                    name: 'wpf',
                    xlsHead: '维配费',
                    width: '100',
                    editor: {
                        type: 'float',
                        ext: {
                            isNegative: false, //是否负数
                            decimalplace: 2,   //小数位 type=float时起作用

                            onChangeValue: false,    //改变值事件
                            minValue: 0        //最小值
                        }
                    }

                },
                {
                    display: '占比',
                    name: 'cbsrb_wp',
                    width: '50', render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display: '<span style="color: red;">轮胎费<span>',
                    name: 'ltf',
                    xlsHead: '轮胎费',
                    width: '100',
                    editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_lt',
                    width: '50',
                    render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display: '小计',
                    name: 'subtotal_amount',
                    width: '100',


                },
                {
                    display: '<span style="color: red;">折旧费<span>',
                    name: 'zjf',
                    xlsHead: '折旧费',
                    width: '100',
                    editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_zj',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display:'<span style="color: red;">人工费<span>',
                    name: 'rgf',
                    xlsHead: '人工费',
                    width: '100',
                    editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }

                },
                {
                    display: '占比',
                    name: 'cbsrb_rg',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display:'<span style="color: red;">保险费<span>',
                    name: 'bxf',
                    xlsHead: '保险费',
                    width: '100',
                    editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_bx',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }

                },
                {
                    display: '<span style="color: red;">使用税<span>',
                    name: 'sys',
                    xlsHead: '使用税',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_sys',
                    width: '50', render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display:'<span style="color: red;">隧道费<span>',
                    name: 'sdf',
                    xlsHead: '隧道费',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_sd',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }

                },
                {
                    display: '<span style="color: red;">年审费<span>',
                    name: 'nsf',
                    xlsHead: '年审费',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_ns',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }

                },
                {
                    display: '<span style="color: red;">社保费<span>',
                    name: 'sbf',
                    xlsHead: '社保费',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }


                },
                {
                    display: '占比',
                    name: 'cbsrb_sb',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display:'<span style="color: red;">福利费<span>',
                    name: 'flf',
                    xlsHead: '福利费',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }

                },
                {
                    display: '占比',
                    name: 'cbsrb_fl',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }

                },
                {
                    display:'<span style="color: red;">电话费<span>',
                    name: 'dhf',
                    xlsHead: '电话费',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }

                },
                {
                    display: '占比',
                    name: 'cbsrb_dh',
                    width: '50', render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }
                },
                {
                    display: '<span style="color: red;">年金<span>',
                    name: 'nianjing',
                    xlsHead: '年金',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }

                },
                {
                    display: '占比',
                    name: 'cbsrb_nianjing',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display: '<span style="color: red;">住房公积金<span>',
                    name: 'zfgjj',

                    xlsHead: '住房公积金',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }

                },
                {
                    display: '占比',
                    name: 'cbsrb_zfgjj',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display:'<span style="color: red;">其他<span>',
                    xlsHead: '其他',

                    name: 'elsefee',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }

                },
                {
                    display: '占比',
                    name: 'cbsrb_else',
                    width: '50', render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display: '成本小计',
                    name: 'cost_subtotal_amount',
                    width: '100',


                },
                {
                    display: '<span style="color: red;">租金<span>',
                    xlsHead: '租金',
                    name: 'zj',
                    width: '100', editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 2,   //小数位 type=float时起作用

                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }

                },
                {
                    display: '占比',
                    name: 'cbsrb_zjb',
                    width: '50',render: function (data, index, val) {
                    return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                }


                },
                {
                    display: '<span style="color: red;">收益<span>',
                    xlsHead: '收益',
                    name: 'income_amount',
                    width: '100',
                    editor: {
                        type: 'float',
                        ext: {
                            isNegative: false, //是否负数
                            decimalplace: 2,   //小数位 type=float时起作用

                            onChangeValue: false,    //改变值事件
                            minValue: 0        //最小值
                        }
                    }
                },
                {
                    display: '占比',
                    name: 'cbsrb_income',
                    width: '50',
                    render: function (data, index, val) {
                        return val ? Number.parseFloat(val * 100).toFixed(2) + '%' : '';
                    }
                },
                {
                    display: '备注',
                    name: 'remark',
                    width: '100',


                }
            ],
            pageSize: 50,
            pageSizeOptions: [20, 50, 100, 500],
            url: basePath + 'loadGrid/'+ mstId,  // 请求链接

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
            frozen:true,
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
            onDblClickRow: function (rowdata, rowid, rowHtml, cellHtml) {
                var column = this.getColumn(cellHtml);
                if (!column || !column.editor) {
                } else {
                    if (cellHtml) {
                        this._applyEditor(cellHtml);
                    }
                }
            },
            onAfterEdit: function (e) {

                //    立即编辑立即更新模式
                var data = {
                    pk_id: e.record.pk_id,
                    columnname: e.column.columnname,
                }
                if (e.value instanceof Date) {
                    e.value = DateUtil.dateToStr('', e.value);
                }
                data[e.column.columnname] = e.value;
                //判断值是否改变
                if (this.lastRecord && this.lastRecord[e.column.columnname] === e.value) {
                    LG.tip("值未改变");
                    return;
                }
                var row = this.getRow(e.rowindex);

                row[e.column.columnname] = e.value;
                LG.ajax({
                    url: basePath + 'update',
                    data: JSON.stringify(row),
                    contentType: "application/json",
                    success: function (data, msg) {
                        mainGrid.updateRow(row, data)
//                        mainGrid.loadData();
                    },
                    error: function (msg) {
                    }
                });
            },
            onBeforeEdit: function (editParm) {
                if (disabledButtons.indexOf('updata') >= 0) return false;
                var g = this, p = this.options;
                var column = editParm.column,
                        record = editParm.record;

                //记录修改前的值
                this.lastRecord = $.extend({}, record);
                return true;
            }
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
                    display: '车牌号',
                    name: 'car_no',
                    newline: false,
                    type: "select",
                    options: {
                        autocomplete: true,
                        highLight: true,
                        keySupport: true,
                        data: carNo
                    },
                    cssClass: "field"
                    // render: LG.render.ref(suppliers, 'supplier_id')
                }

            ]
        });

        mainForm = $('#mainForm').ligerForm({
            fields: [


                {
                    name: 'mst_id',
                    type: 'hidden'
                },
                {
                    display: '名称字段',
                    name: 'name'

                },
                {
                    display: '类型',
                    name: 'type'


                },
                {
                    display: '到达地点',
                    name: 'display'
                }, {
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
                    id: 'more',
                    text: '导入导出',
                    icon: 'download',
                    menu: {
                        items: [
//                            {id: 'downloadExcel', text: '下载模板', click: excelTmpl, status: ['OP_INIT']},
                            {id: 'exportExcel', text: '导出', click: excelExport, status: ['OP_INIT']},
                            {id: 'importExcel', text: '导入', click: excelImport, status: ['OP_INIT']}
                        ]
                    }
                },
//                {id: 'excelExport',
//                    icon: 'export',
//                    text: '导出',
//                    click: excelExport,
//                    status: ['OP_INIT']}
                /*,
                {
                    text: '审核',
                    icon: 'audit',
                    click: auditBatch
                },
                {
                    text: '撤销审核',
                    icon: 'return',
                    click: cancelBatch
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

        mainGrid.grid.on('click', 'a.row-edit-btn', function (e) {
            var index = $(this).data("index");
            var selected = mainGrid.getRow(index);
            /*if(selected.state !== TMS_STATE_NAME.STATE_10_NEW) {
                LG.showError("所选档案状态不是[新记录]，不可修改");
                return;
            }*/
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

        materialsSearchToggle && $('#searchToggle').click();

        function refresh () {
            mainGrid.reload();
        }
        function add () {
//            mainForm.reset();
//            openForm();
            addData({
                mst_id: mstId,
                end_date: '2018-02-28 23:59:59',
                start_date: '2018-02-01 00:00:00'
            });
        }
        function addData(data) {
            LG.ajax({
                url: basePath + 'add',
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (data, msg) {
                    mainGrid.loadData();
                },
                error: function (msg) {
                }
            });
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
            $("#download").attr("action", basePath + "excelExport/" + mstId);
            xlsUtil.exp($("#download"), mainGrid, '单据' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
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
                            pk_id: mstId, //业务主键
                            name: "fileupload",
                            cover: false,
                            only_contain: false,
                            header_row: 2,
                            data_start_row: 2,
                            data_start_col: 2,
                            meta: {
                                "车牌号": "car_no",
                                "柴油费": "cyf",
                                "路桥费": "lqf",
                                "维配费": "wpf",
                                "轮胎费": "ltf",

                                "工资": "rgf",
                                "折旧费": "zjf",
                                "保险费": "bxf",
                                "使用税": "sys",
                                "遂道费": "sdf",
                                "年审费": "nsf",
                                "社保费": "sbf",
                                "福利费": "flf",
                                "年金": "nianjing",
                                "住房公积金": "zfgjj",
                                "其他": "elsefee"
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
                            formData.mst_id = mstId;
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
