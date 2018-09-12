<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/26
  Time: 15:25
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>订单明细</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link rel="stylesheet" href="${path}/css/tms/listicon.css">
    <style>
        .content-wrapper{
            height: calc( (100vh - 55px) / 2);
        }
        .l-panel-header-text{
            padding-left: 0;
        }

        .l-panel-header{
            display: none;
        }
        .grid-wrapper{
            font-size: 0;
        }
        .l-panel-title{
            width: 24px;
            height:100%;
            display: inline-block;
            vertical-align: top;
            margin-top: -1px;
            font-size: 12px;
            font-weight: bold;
            line-height: 200%;
            background-color: #e1edfc;
            border: 1px solid #d6d6d6;
            border-right: none;
            /*border-bottom-right-radius: 15px;;*/
        }
        .l-panel-title p{
            writing-mode: tb-rl;
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            padding: 10px  0;
        }
        .l-panel{
            display: inline-block;
            font-size:12px;
        }

        .combobox-list-item {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: top;
        }


        .combobox-list-item.car-no-item, .combobox-list-item.driver-name-item.item1 {
           width: 70px;
        }

        .combobox-list-item.driver-name-item.item2 {
            width: 50px;
        }

        .combobox-list-item.car-no-item.seq {
            width: 100px;
        }

        .fee-type-item {
            margin-left: 10px;
        }
    </style>
</head>
<body>
<div id="layout">
    <div class="toolbar-wrapper">
        <div id="toptoolbar"></div>
    </div>
    <!-- 卡片界面 -->
    <div class="content-wrapper grid-wrapper">
        <!-- 应收列表界面 -->
        <div class="l-panel-title"><p>应收列表</p></div>
        <div id="chargeGrid"></div>
    </div>
    <div class="content-wrapper grid-wrapper">
        <!-- 应付列表界面 -->
        <div class="l-panel-title"><p>应付列表</p></div>
        <div id="payGrid"></div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
</body>
<script>

    //主表主键
    var mst_id = "${mst_id}";
    var data_order = ${order};


    //字典数据
    var data_dict = ${dict};

    //车辆数据
    var data_car = ${car};

    //承运方数据
    var data_suppliers = ${suppliers};
    var data_carriers = ${carriers};
    var data_clients = ${clients};

    var price_base = priceBaseUtil.processPriceBase(data_dict);
    var remap_price_base = price_base.remap;
    var data_price_base = price_base.base;

    var basePath = rootPath + '/tms/busi/orderArap/';

    // 缓存数据
    var manager = {};

    var chargeGrid, payGrid, toptoolbar;

    var defaultValue = {
        cntr: {
            'fee_type': 'BASE_CAR', //计费方式
            'fee_unit': 'UNIT_CAR', //计费单位
            'currency': 'RMB', //币种
            'price': 0, //单价
            'qty': 1, //数量
            'contain_tax': true, //含税
            'tax_rate': 11,
            'tax_amount': 0,
            'total_amount': 0
        }
    }

    function toFloat(num, scale) {
        return parseFloat((num || 0).toFixed(scale));
    }

    //应付列表
    var chargeGridOption = {
        columns: [
            {
                display: '状态', name: 'state_name', sortname: 'state', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '费用名称', name: 'fee_name', align: 'left', minWidth: 60, width: '5%',
                editor: {
                    type: 'select',
                    data: data_dict[DICT_CODE.fee_type],
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            autocomplete: true,
                            autocompleteKeyField: 'key_text',
                            keySupport: true,
                            highLight: true,
                            selectBoxWidth: 350,
                            selectBoxHeight: 200,
                            onSelected: function (newValue, newText, rowData) {
                                manager.fee = !!rowData ? $.extend({}, {fee_name: newValue}) : {};
                            },
                            onClear: function () {
                                manager.fee = {};
                            }
                        }
                    }
                },
                render: LG.render.ref(data_dict[DICT_CODE.fee_type], 'fee_name')
            },
            {
                display: '计费方式', name: 'fee_type', align: 'left', minWidth: 60, width: '5%',
                editor: {
                    type: 'select',
                    data: data_price_base,
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            keySupport: true
                        }
                    }
                },
                render: LG.render.ref(data_price_base, 'fee_type')
            },
            {
                display: '计价单位', name: 'fee_unit', align: 'left', minWidth: 60, width: '5%',
                editor: {
                    type: 'select',
                    data: []
                },
                render: renderFeeUnit
            },
            {
                display: '币种', name: 'currency', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'select',
                    data: data_dict[DICT_CODE.currency],
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            keySupport: true
                        }
                    }
                },
                render: LG.render.ref(data_dict[DICT_CODE.currency], 'currency')
            },
            {
                display: '单价', name: 'price', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0,        //最小值
                    }
                }
            },
            {
                display: '数量', name: 'qty', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(3));
                    }
                },
                render: function (item) {
                    return parseFloat((item.qty || 0).toFixed(3));
                }
            },
            {
                display: '含税', name: 'contain_tax', align: 'left', minWidth: 50, width: '5%',
                editor: {type: 'checkbox'},
                render: LG.render.boolean("contain_tax")
            },
            {
                display: '税点', name: 'tax_rate', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }
            },
            {
                display: '税金', name: 'tax_amount', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }
            },
            {
                display: '总额', name: 'total_amount', align: 'left', minWidth: 80, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    calValue: function (item) {
                        return toFloat(item.total_amount, 2);
                    },
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return toFloat(e.sum, 2);
                    }
                },
                render: function (item) {
                    return toFloat(item.total_amount, 2);
                }
            },
            {
                display: '付款方(客户)',
                name: 'client_name',
                align: 'left',
                minWidth: 100,
                width: '8%',
                editor: {
                    type: 'select',
                    data: data_clients,
                    ext: {
                        cancelable: false,
                        valueField: 'text',
                        autocomplete: true,
                        keySupport: true,
                        highLight: true
                    }
                }
            },
            {
                display: '收款方(揽货公司)', name: 'supplier_id', align: 'left', minWidth: 80, width: '8%', editable: false,
                editor: {
                    type: 'select',
                    data: data_suppliers,
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: false,
                            autocomplete: true,
                            keySupport: true,
                            highLight: true,
                            isTextBoxMode: false,
                            selectBoxWidth: 350,
                            selectBoxHeight: 250,
                            onSelected: function (newValue, newText, rowData) {
                                //暂存选中的司机
                                // manager.carrier = !!rowData ? $.extend({}, rowData) : {};
                                manager.supplier = !!rowData ? $.extend({}, rowData) : {};
                            },
                            onClear: function () {
                                //清空选择
                                manager.supplier = {};
                            }
                        }
                    }
                },
                render: LG.render.ref(data_suppliers, 'supplier_id')
            },
            // {display: '客户主键', name: 'client_id', align: 'left', minWidth: 100, width: '8%'},
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 80, width: '8%', editor: {type: 'text'}
            },
            {
                display: '货物信息', name: 'cargo_info', align: 'left', minWidth: 80, width: '8%'
            }
        ],
        pageSize: 50,
        url: basePath + 'loadChargeGrid/' + mst_id,
        delayLoad: false,       //初始化不加载数据
        checkbox: true,
        width: 'calc(100% - 27px)',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        usePager: true,
        enabledEdit: true,
        clickToEdit: false,
        fixedCellHeight: true,
        inWindow: false,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'CREATE_TIME',
        sortOrder: 'DESC',
        colDraggable: true,
        localStorageName: 'orderArapCharge' + user.id + data_order.bs_type_code,
        onDblClickRow: function (data, id, row, cellHtml) {
            this._applyEditor(cellHtml);
            $(this.editor.input).focus();
        },
        onAfterEdit: function (editParm) {
            var g = this,
                    p = this.options;
            //立即编辑立即更新模式
            var record = editParm.record;
            var rowid = editParm.record['__id'];

            var data = {
                pk_id: editParm.record.pk_id,
                mst_id: editParm.record.mst_id,
                columnname: editParm.column.columnname
            };
            data[editParm.column.columnname] = editParm.value;

            //判断值是否改变
            if (editParm.column.columnname === 'car_no' && manager.car['id'] === manager.oldCar) {
                LG.tip("值未改变");
                return;
            } else if (manager.lastRecord && manager.lastRecord[editParm.column.columnname] === editParm.value) {
                LG.tip("值未改变");
                return;
            }

            if (localStorage && data.columnname === 'fee_name') {
                var relatedColumns = ['fee_type', 'fee_unit', 'currency', 'price', 'contain_tax', 'qty', 'tax_rate', 'tax_amount']
                data.columnname += (',' + relatedColumns.join(','));
                data = $.extend({}, data, defaultValue.cntr, manager.fee);
            }

            // 修改单价，重新计算税金和总额
            if (['price', 'tax_rate', 'qty', 'contain_tax'].indexOf(data.columnname) !== -1) {
                var amountData = amount(record['price'], record['qty'], record['contain_tax'], record['tax_rate']);
                data = $.extend({}, data, amountData);
                data.columnname += (',' + Object.keys(amountData).join(","));
            }

            //结算客户-自定义
            if (data.columnname == 'client_name') {

                var clients = $.grep(data_clients, function (n, i) {
                    return data_clients[i].text == editParm.value;
                });

                //写入主键
                if (clients && clients.length > 0) {
                    data.client_name = clients[0].text;
                    data.client_id = clients[0].id;
                    data.columnname += ',client_id';
                } else {
                    data.client_id = '';
                }
            }

            //选择车牌号
            if (data.columnname == 'car_no') {
                var car = manager.car;
                if ($.isEmptyObject(car)) {
                    data = $.extend({}, data, {
                        trans_id: '', client_id: '', client_name: ''
                    });
                } else {
                    data = $.extend({}, data, {
                        car_no: (car.key_text || ''),
                        trans_id: (car.trans_id || '')
                    });
                }
                data.columnname += (',trans_id');
            }

            LG.ajax({
                url: basePath + 'updateCharge',
                data: JSON.stringify(data, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (sss, msg) {
                    g.updateRow(rowid, $.extend({}, record, data));

                    g.isDataChanged = false;
                    LG.tip("值更新成功");
                },
                error: function (msg) {
                }
            });
        },
        onBeforeEdit: function (editParm) {
            if (disabledButtons.indexOf('edit') >= 0) return false;
            var g = this, p = this.options;
            var column = editParm.column,
                    record = editParm.record;

            //检查行记录状态
            if (record.state == TMS_STATE.STATE_30_AUDIT) {

                throttle(function () {
                    LG.tip("记录已审核，不能修改");
                }, 10, true)();

                return false;
            }

            switch (column.columnname) {
                case "fee_unit":
                    var price_base = $.grep(data_price_base, function (n, i) {
                        return data_price_base[i].id == record.fee_type;
                    });
                    column.editor.data = price_base.length > 0 ? price_base[0].unitList : [];
                    break;
                case "":
                    break;
            }

            //记录修改前的值
            manager.lastRecord = $.extend({}, record);

            return true;
        }
    };

    //应付列表
    var payGridOption = {
        columns: [
            {
                display: '状态', name: 'state_name', sortname: 'state', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '费用名称', name: 'fee_name', align: 'left', minWidth: 60, width: '5%',
                editor: {
                    type: 'select',
                    data: data_dict[DICT_CODE.fee_type],
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            autocomplete: true,
                            autocompleteKeyField: 'key_text',
                            keySupport: true,
                            highLight: true,
                            selectBoxWidth: 350,
                            selectBoxHeight: 200,
                            onSelected: function (newValue, newText, rowData) {
                                manager.fee = !!rowData ? $.extend({}, {fee_name: newValue}) : {};
                            },
                            onClear: function () {
                                manager.fee = {};
                            }
                        }
                    }
                },
                render: LG.render.ref(data_dict[DICT_CODE.fee_type], 'fee_name')
            },
            {
                display: '车牌号', name: 'car_no', align: 'left', minWidth: 60, width: '8%',
                editor: {
                    type: 'select',
                    data: data_car,
                    ext: function (record, rowindex, value, column) {
                        manager.listData = record;
                        return {
                            cancelable: true,
                            autocomplete: true,
                            autocompleteKeyField: 'key_text',
                            keySupport: true,
                            highLight: true,
                            isTextBoxMode: true,
                            selectBoxWidth: 500,
                            selectBoxHeight: 200,
                            onBeforeShowData: function (data) {
                                var gridData = payGrid.getData();
                                this.feeTypeHash = {};
                                gridData.forEach(function (item) {
                                    if (item.trans_id && item.fee_type) {
                                        this.feeTypeHash[item.trans_id] = item.fee_name;
                                    }
                                }, this);
                            },
                            renderItem: function (data) {
                                var g = this;
                                var item = data.data;
                                var key_text = '<span class="combobox-list-item car-no-item seq">' + (item.bill_no || '') + '</span>';
                                key_text += '<span class="combobox-list-item car-no-item">' + item.key_text + '</span>';
                                key_text += '<span class="combobox-list-item driver-name-item item1">' + (item.driver_name || '') + '</span>';
                                key_text += '<span class="combobox-list-item driver-name-item item2">' + (item.task_type || '') + '</span>';
                                key_text += '<span class="combobox-list-item car-no-item">' + (item.carrier_name || '') + '</span>';
                                key_text += '<span class="combobox-list-item fee-type-item">' + ((LG.render.ref(data_dict['fee_type'], 'id'))({id: this.feeTypeHash[item['trans_id']]}) || '') + '</span>';
                                return g._highLight(key_text, $.trim(data.key));
                            },
                            onBeforeSelect: function (value, text) {
                                manager.oldCar = value;
                                return true;
                            },
                            onSelected: function (newValue, newText, rowData) {
                                manager.listData = {};
                                manager.car = !!rowData ? $.extend({}, rowData) : {};
                            },
                            onClear: function () {
                                //清空选择
                                manager.listData = {};
                                manager.car = {};
                            }
                        }
                    }
                },
                render: function (item) {
                    if (!!item.trans_id) {
                        for (var i = 0; i < data_car.length; i++) {
                            var trans = data_car[i];
                            if (trans.trans_id === item.trans_id) {
                                var car_no = trans.key_text || '';
                                var driver_name = trans.driver_name || '';
                                var task_type = trans.task_type || '';
                                var bill_no = trans.bill_no || '';
                                return car_no + "  " + driver_name + "  " + task_type + " " + bill_no;
                            }
                        }
                    }
                    return item.car_no;
                }
            },
            {
                display: '收款方(承运)', name: 'client_name', align: 'left', minWidth: 80, width: '8%',
                editor: {
                    type: 'select',
                    data: data_carriers,
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            autocomplete: true,
                            keySupport: true,
                            highLight: true,
                            isTextBoxMode: true,
                            selectBoxWidth: 350,
                            selectBoxHeight: 250,
                            onSelected: function (newValue, newText, rowData) {
                                //暂存选中的司机
                                manager.carrier = !!rowData ? $.extend({}, rowData) : {};
                            },
                            onClear: function () {
                                //清空选择
                                manager.carrier = {};
                            }
                        }
                    }
                },
                // render: LG.render.ref(data_carriers, 'client_id')
            },
            // {display: '承运方主键', name: 'client_id', align: 'left', minWidth: 100, width: '8%'},
            {
                display: '计费方式', name: 'fee_type', align: 'left', minWidth: 60, width: '5%',
                editor: {
                    type: 'select',
                    data: data_price_base,
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            keySupport: true
                        }
                    }
                },
                render: LG.render.ref(data_price_base, 'fee_type')
            },
            {
                display: '计价单位', name: 'fee_unit', align: 'left', minWidth: 60, width: '5%',
                editor: {
                    type: 'select',
                    data: []
                },
                render: renderFeeUnit
            },
            {
                display: '币种', name: 'currency', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'select',
                    data: data_dict[DICT_CODE.currency],
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            keySupport: true
                        }
                    }
                },
                render: LG.render.ref(data_dict[DICT_CODE.currency], 'currency')
            },
            {
                display: '单价', name: 'price', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }
            },
            {
                display: '数量', name: 'qty', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(3));
                    }
                },
                render: function (item) {
                    return parseFloat((item.qty || 0).toFixed(3));
                }
            },
            {
                display: '含税', name: 'contain_tax', align: 'left', minWidth: 50, width: '5%',
                editor: {type: 'checkbox'},
                render: LG.render.boolean("contain_tax")
            },
            {
                display: '税点', name: 'tax_rate', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }
            },
            {
                display: '税金', name: 'tax_amount', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                }
            },
            {
                display: '总额', name: 'total_amount', align: 'left', minWidth: 80, width: '5%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 3,   //小数位 type=float时起作用
                        step: 0.1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0        //最小值
                    }
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    calValue: function (item) {
                        return toFloat(item.total_amount, 2);
                    },
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return toFloat(e.sum, 2);
                    }
                },
                render: function (item) {
                    return toFloat(item.total_amount, 2);
                }
            },
            {
                display: '付款方(揽货公司)', name: 'supplier_id', align: 'left', minWidth: 80, width: '8%', editable: false,
                editor: {
                    type: 'select',
                    data: data_suppliers,
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: false,
                            autocomplete: true,
                            keySupport: true,
                            highLight: true,
                            isTextBoxMode: false,
                            selectBoxWidth: 350,
                            selectBoxHeight: 250,
                            onSelected: function (newValue, newText, rowData) {
                                //暂存选中的司机
                                // manager.carrier = !!rowData ? $.extend({}, rowData) : {};
                                manager.supplier = !!rowData ? $.extend({}, rowData) : {};
                            },
                            onClear: function () {
                                //清空选择
                                manager.supplier = {};
                            }
                        }
                    }
                },
                render: LG.render.ref(data_suppliers, 'supplier_id')
            },
            {display: '备注', name: 'remark', align: 'left', minWidth: 80, width: '10%', editor: {type: 'text'}},
            {
                display: '货物信息', name: 'cargo_info', align: 'left', minWidth: 80, width: '8%'
            }
        ],
        pageSize: 50,
        url: basePath + 'loadPayGrid/' + mst_id,
        delayLoad: false,       //初始化不加载数据
        checkbox: true,
        width: 'calc(100% - 27px)',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        usePager: true,
        enabledEdit: true,
        clickToEdit: false,
        fixedCellHeight: true,
        inWindow: false,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'CREATE_TIME',
        sortOrder: 'DESC',
        colDraggable: true,
        localStorageName: 'orderArapPay' + user.id + data_order.bs_type_code,
        onDblClickRow: function (data, id, row, cellHtml) {
            this._applyEditor(cellHtml);
            $(this.editor.input).focus();
        },
        onAfterEdit: function (e) {
            var g = this;
            var record = e.record;
            var rowid = e.record['__id'];

            // 立即编辑立即更新模式
            var data = {
                pk_id: e.record.pk_id,
                mst_id: e.record.mst_id,
                columnname: e.column.columnname
            };
            data[e.column.columnname] = e.value;

            //判断值是否改变
            if (e.column.columnname === 'car_no' && manager.car['id'] === manager.oldCar) {
                LG.tip("值未改变");
                return;
            } else if (manager.lastRecord && manager.lastRecord[e.column.columnname] === e.value) {
                LG.tip("值未改变");
                return;
            }

            if (localStorage && data.columnname == 'fee_name') {
                //TODO 处理默认费用字段
                // var key = 'lastOrderPay#' + data.columnname + '#' + data[data.columnname];
                // console.log('key:' + key);

                var relatedColumns = ['fee_type', 'fee_unit', 'currency', 'price', 'contain_tax', 'qty', 'tax_rate', 'tax_amount']
                data.columnname += (',' + relatedColumns.join(','));
                data['fee_type'] = 'BASE_CAR'; //计费方式
                data['fee_unit'] = 'UNIT_CAR'; //计费单位
                data['currency'] = 'RMB'; //币种
                data['price'] = 0; //单价
                data['qty'] = 1; //数量
                data['contain_tax'] = false; //含税
                data['tax_rate'] = 0;
                data['tax_amount'] = 0;
                data['total_amount'] = 0;

                data = $.extend({}, data, manager.fee);
            }

            //修改单价，重新计算税金和总额
            if (['price', 'tax_rate', 'qty', 'contain_tax'].indexOf(data.columnname) != -1) {
                var amountData = amount(record['price'], record['qty'], record['contain_tax'], record['tax_rate']);
                data = $.extend({}, data, amountData);
                data.columnname += (',' + Object.keys(amountData).join(","));
            }

            //结算客户-自定义
            if (data.columnname == 'client_name') {

                var carriers = $.grep(data_carriers, function (n, i) {
                    return data_carriers[i].text == manager.carrier.text;
                });

                //写入主键
                if (carriers && carriers.length > 0) {
                    data.client_id = carriers[0].id;
                    data.columnname += ',client_id';
                } else {
                    data.client_id = '';
                }
            }

            //选择车牌号
            if (data.columnname == 'car_no') {
                var car = manager.car;
                if ($.isEmptyObject(car)) {
                    data = $.extend({}, data, {
                        trans_id: '', client_id: '', client_name: ''
                    });
                } else {
                    data = $.extend({}, data, {
                        car_no: (car.key_text || ''),
                        trans_id: (car.trans_id || ''),
                        client_id: (car.carrier_id || ''),
                        client_name: (car.carrier_name || '')
                    });
                }
                data.columnname += (',trans_id');
                data.columnname += (',client_id');
                data.columnname += (',client_name');
            }

            LG.ajax({
                url: basePath + 'updatePay',
                data: JSON.stringify(data, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (result, msg) {

                    g.updateRow(rowid, $.extend({}, record, result));

                    //去除保存提示
                    g.isDataChanged = false;
                    LG.tip("值更新成功");
                },
                error: function (msg) {
                }
            });
        },
        onBeforeEdit: function (editParm) {
            if (disabledButtons.indexOf('edit') >= 0) return false;
            var g = this, p = this.options;
            var column = editParm.column,
                    record = editParm.record;

            //检查行记录状态
            if (record.state == TMS_STATE.STATE_30_AUDIT) {
                throttle(function () {
                    LG.tip("记录已审核，不能修改");
                }, 10, true)();
                return false;
            }

            switch (column.columnname) {
                case "fee_unit":
                    var price_base = $.grep(data_price_base, function (n, i) {
                        return data_price_base[i].id == record.fee_type;
                    });
                    column.editor.data = price_base.length > 0 ? price_base[0].unitList : [];
                    break;
                case "":
                    break;
            }

            //记录修改前的值
            manager.lastRecord = $.extend({}, record);

            return true;
        }
    };

    if (data_order.bs_catalog == 'CARGO') {
        chargeGridOption.columns.splice(2, 0, {
            display: '预约装卸时间', name: 'cntr_work_time', minWidth: 50, width: '5%',
            render: function (item, index, text) {
                // console.log(item);
                if (!text || text <= 0) {
                    return text;
                }
                if (typeof text === 'object') {
                    text = DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss', text);
                }
                var iconName = 'load';
                if (TMS_BUSI_TYPE.TYPE_TRANS_CNTR_IMPORT == item.bs_type_code) {
                    iconName = 'unload';
                } else if (TMS_BUSI_TYPE.TYPE_TRANS_CNTR_EXPORT == item.bs_type_code) {
                    iconName = 'load';
                }
                return '<span class="list-icon arrived"></span>' + '<span class="list-icon ' + iconName + '"></span>' + '<span class="list-text">' + text + '</span>'
            }
        });

        chargeGridOption.columns.splice(2, 0, {
            display: '车牌号', name: 'car_no', align: 'left', minWidth: 80, width: '8%',
            editor: {
                type: 'select',
                data: data_car,
                ext: function (record, rowindex, value, column) {
                    manager.listData = record;
                    return {
                        cancelable: true,
                        autocomplete: true,
                        autocompleteKeyField: 'key_text',
                        keySupport: true,
                        highLight: true,
                        isTextBoxMode: true,
                        selectBoxWidth: 500,
                        selectBoxHeight: 200,
                        onBeforeShowData: function (data) {
                            var gridData = payGrid.getData();
                            this.feeTypeHash = {};
                            gridData.forEach(function (item) {
                                if (item.trans_id && item.fee_type) {
                                    this.feeTypeHash[item.trans_id] = item.fee_name;
                                }
                            }, this);
                        },
                        renderItem: function (data) {
                            var g = this;
                            var item = data.data;
                            var key_text = '<span class="combobox-list-item car-no-item seq">' + (item.bill_no || '') + '</span>';
                            key_text += '<span class="combobox-list-item car-no-item">' + item.key_text + '</span>';
                            key_text += '<span class="combobox-list-item driver-name-item item1">' + (item.driver_name || '') + '</span>';
                            key_text += '<span class="combobox-list-item driver-name-item item2">' + (item.task_type || '') + '</span>';
                            key_text += '<span class="combobox-list-item car-no-item">' + (item.carrier_name || '') + '</span>';
                            key_text += '<span class="combobox-list-item fee-type-item">' + ((LG.render.ref(data_dict['fee_type'], 'id'))({id: this.feeTypeHash[item['trans_id']]}) || '') + '</span>';
                            return g._highLight(key_text, $.trim(data.key));
                        },
                        onBeforeSelect: function (value, text) {
                            manager.oldCar = value;
                            return true;
                        },
                        onSelected: function (newValue, newText, rowData) {
                            manager.listData = {};
                            manager.car = !!rowData ? $.extend({}, rowData) : {};
                        },
                        onClear: function () {
                            //清空选择
                            manager.listData = {};
                            manager.car = {};
                        }
                    }
                }
            },
            render: function (item) {
                if (!!item.trans_id) {
                    for (var i = 0; i < data_car.length; i++) {
                        var trans = data_car[i];
                        if (trans.trans_id === item.trans_id) {
                            var car_no = trans.key_text || '';
                            var driver_name = trans.driver_name || '';
                            var task_type = trans.task_type || '';
                            var bill_no = trans.bill_no || '';
                            return car_no + "  " + driver_name + "  " + task_type + ' ' + bill_no;
                        }
                    }
                }
                return item.car_no;
            }
        });

        payGridOption.columns.splice(2, 0, {
            display: '预约装卸时间', name: 'cntr_work_time', minWidth: 50, width: '5%',
            render: function (item, index, text) {
                // console.log(item);
                if (!text || text <= 0) {
                    return text;
                }
                if (typeof text === 'object') {
                    text = DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss', text);
                }
                var iconName = 'load';
                if (TMS_BUSI_TYPE.TYPE_TRANS_CNTR_IMPORT == item.bs_type_code) {
                    iconName = 'unload';
                } else if (TMS_BUSI_TYPE.TYPE_TRANS_CNTR_EXPORT == item.bs_type_code) {
                    iconName = 'load';
                }
                return '<span class="list-icon arrived"></span>' + '<span class="list-icon ' + iconName + '"></span>' + '<span class="list-text">' + text + '</span>'
            }
        });
    }


    payGrid = $('#payGrid').ligerGrid(payGridOption);

    chargeGrid = $('#chargeGrid').ligerGrid(chargeGridOption);

    toptoolbar = LG.powerToolBar($('#toptoolbar'), {
        items: [{
            id: 'addCharge',
            text: '增加应收',
            click: addCharge,
            icon: 'add',
            status: ['OP_INIT']
        }, {
            id: 'addPay',
            text: '增加应付',
            click: addPay,
            icon: 'add',
            status: ['OP_INIT']
        }, {
            id: 'delete',
            text: '删除',
            click: deleteRow,
            icon: 'delete',
            status: ['OP_INIT']
        }, {
            id: 'auditBatch',
            text: '审核',
            click: auditBatch,
            icon: 'audit',
            status: ['OP_INIT']
        }, {
            id: 'cancel',
            text: '撤销',
            click: cancel,
            icon: 'withdraw',
            status: ['OP_INIT']
        }, {
            id: 'importFee',
            text: '导入',
            click: importFee,
            icon: 'dataimport',
            status: ['OP_INIT']
        }, {
            id: 'refresh',
            text: '刷新',
            click: refeshAll,
            icon: 'refresh',
            status: ['OP_INIT']
        }, {
            id: 'selectMenu',
            text: '返回',
            click: backtrackFun,
            icon: 'backtrack',
            status: ['OP_INIT']
        }]
    });


    function cancel() {
        var payIds = null;
        var chargeIds = null;
        var selectedPay = payGrid.getCheckedRows();
        var selectedCharge = chargeGrid.getCheckedRows();

        if (selectedPay && selectedPay.length > 0) {

            if ($.grep(selectedPay, function (n, i) {
                        return selectedPay[i].state == TMS_STATE.STATE_10_NEW;
                    }).length > 0) {
                LG.showError("选择的应付记录未审核，不能撤销");
                return;
            }

            payIds = $.map(selectedPay, function (item, index) {
                return item["pk_id"];
            }).join(',');
        }

        if (selectedCharge && selectedCharge.length > 0) {

            if ($.grep(selectedCharge, function (n, i) {
                        return selectedCharge[i].state == TMS_STATE.STATE_10_NEW;
                    }).length > 0) {
                LG.showError("选择的应收记录未审核，不能撤销");
                return;
            }

            chargeIds = $.map(selectedCharge, function (item, index) {
                return item["pk_id"];
            }).join(',');
        }

        if (!payIds && !chargeIds) {
            LG.showError('请选择行');
            return;
        }

        //适配不同的主表
        $.ligerDialog.confirm('确定撤销审核吗?', function (confirm) {

            if (!confirm) return;

            $.ajax({
                url: basePath + 'cancel',
                data: {
                    pay_ids: payIds,
                    charge_ids: chargeIds,
                    mst_id: mst_id
                },
                success: function (data, msg) {

                    LG.tip('撤销成功');
                    payGrid.reload();
                    chargeGrid.reload();
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    function auditBatch() {
        var payIds = null;
        var chargeIds = null;
        var selectedPay = payGrid.getCheckedRows();
        var selectedCharge = chargeGrid.getCheckedRows();

        if (selectedPay && selectedPay.length > 0) {

            if ($.grep(selectedPay, function (n, i) {
                        return selectedPay[i].state == TMS_STATE.STATE_30_AUDIT;
                    }).length > 0) {
                LG.showError("选择的应付记录已审核，不能审核");
                return;
            }

            payIds = $.map(selectedPay, function (item, index) {
                return item["pk_id"];
            }).join(',');
        }

        if (selectedCharge && selectedCharge.length > 0) {

            if ($.grep(selectedCharge, function (n, i) {
                        return selectedCharge[i].state == TMS_STATE.STATE_30_AUDIT;
                    }).length > 0) {
                LG.showError("选择的应收记录已审核，不能审核");
                return;
            }

            chargeIds = $.map(selectedCharge, function (item, index) {
                return item["pk_id"];
            }).join(',');
        }

        if (!payIds && !chargeIds) {
            LG.showError('请选择行');
            return;
        }

        var postData = {
            mst_id: mst_id,
            charges: selectedCharge,
            pays: selectedPay
        }

        //适配不同的主表
        $.ligerDialog.confirm('确定审核吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'auditBatch',
                // data: {pay_ids: payIds, charge_ids: chargeIds, mst_id: mst_id},
                data: JSON.stringify(postData, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {

                    LG.tip('审核成功');
                    payGrid.reload();
                    chargeGrid.reload();
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    function addCharge() {
        LG.ajax({
            url: basePath + 'addCharge',
            data: JSON.stringify({
                mst_id: mst_id,
                client_id: data_order.client_id,
                client_name: data_order.client_name,
                supplier_id: data_order.supplier_id,
            }, DateUtil.datetimeReplacer),
            contentType: "application/json",
            success: function (data, msg) {
                chargeGrid.addRow(data);
                chargeGrid.isDataChanged = false;
            },
            error: function (msg) {
                LG.showError(msg);
            }
        });
    }

    function addPay() {
        LG.ajax({
            url: basePath + 'addPay',
            data: JSON.stringify({
                mst_id: mst_id,
                supplier_id: data_order.supplier_id,
            }, DateUtil.datetimeReplacer),
            contentType: "application/json",
            success: function (data, msg) {
                payGrid.addRow(data);
                payGrid.isDataChanged = false;
            },
            error: function (msg) {
                LG.showError(msg);
            }
        });
    }

    function deleteRow() {
        var payIds = null;
        var chargeIds = null;
        var selectedPay = payGrid.getCheckedRows();
        var selectedCharge = chargeGrid.getCheckedRows();

        if (selectedPay && selectedPay.length > 0) {

            if ($.grep(selectedPay, function (n, i) {
                        return selectedPay[i].state == TMS_STATE.STATE_30_AUDIT;
                    }).length > 0) {
                LG.showError("选择的应付记录已审核，不能删除");
                return;
            }

            payIds = $.map(selectedPay, function (item, index) {
                return item["pk_id"];
            }).join(',');
        }

        if (selectedCharge && selectedCharge.length > 0) {

            if ($.grep(selectedCharge, function (n, i) {
                        return selectedCharge[i].state == TMS_STATE.STATE_30_AUDIT;
                    }).length > 0) {
                LG.showError("选择的应收记录已审核，不能删除");
                return;
            }

            chargeIds = $.map(selectedCharge, function (item, index) {
                return item["pk_id"];
            }).join(',');
        }


        if (!payIds && !chargeIds) {
            LG.showError('请选择行');
            return;
        }

        //适配不同的主表
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {

            if (!confirm) return;

            $.ajax({
                url: basePath + 'remove',
                data: {
                    pay_ids: payIds,
                    charge_ids: chargeIds,
                    mst_id: mst_id
                },
                success: function (data, msg) {

                    LG.tip('删除成功');
                    //刷新角色列表
                    if (!!payIds) {
                        payGrid.deleteSelectedRow();
                        payGrid.isDataChanged = false;

                    }

                    if (!!chargeIds) {
                        chargeGrid.deleteSelectedRow();
                        chargeGrid.isDataChanged = false;
                    }
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    function refeshAll() {
        payGrid.reload();
        chargeGrid.reload();
    }

    function importFee() {
        LG.ajax({
            url: basePath + "importFee",
            data: {
                order_id: mst_id
            },
            success: function (data, msg) {
                // console.log('%o, %o', data, msg);
                var text = "费用导入成功",
                        title = "费用导入";
                if (data) {
                    title = '<p class="title">' + data.title + '</p>';
                    text = '';
                    data.charge_message_list.length > 0 && (function () {
                        text += '<h5>应收账单：</h5>';
                        for (var i = data.charge_message_list.length - 1; i >= 0; i--) {
                            var item = data.charge_message_list[i];
                            text += '<p class="">' + item + '</p>';
                        }
                    })();
                    data.pay_message_list.length > 0 && (function () {
                        text += '<h5>应付账单：</h5>';
                        for (var i = data.pay_message_list.length - 1; i >= 0; i--) {
                            var item = data.pay_message_list[i];
                            text += '<p class="">' + item + '</p>';
                        }
                    })();
                }
                // $.ligerDialog.success(text, title,function(){}, {
                //     width: 400
                // });
                LG.tip("<h5>费用导入成功</h5>" + text);
                payGrid.reload();
                chargeGrid.reload();
            },
            error: function (message) {
                LG.showError(message);
                payGrid.reload();
                chargeGrid.reload();
            }
        });
    }

    //显示计费单位
    function renderFeeUnit(item) {
        if (!data_price_base || data_price_base.length == 0) return item.fee_unit;
        if (!item.fee_type || !item.fee_unit || !remap_price_base[item.fee_type] || !remap_price_base[item.fee_type].unitMap) {
            return '';
        } else {
            var fee_unit = remap_price_base[item.fee_type].unitMap[item.fee_unit];
            return !!fee_unit ? fee_unit.text : '';
        }
    }


    /**
     *
     * 计算税金和总额
     * @param price 单价
     * @param qty 数量
     * @param contain_tax 是否含税
     * @param tax_rate 税率
     */
    function amount(price, qty, contain_tax, tax_rate) {
        //合计值和税金有待修正 计算的值需要保留两位小数 税金计算=总额/（1+税点）*税点
        price = price || 0;
        qty = qty || 0;
        tax_rate = tax_rate || 0;

        // 物价总额
        var tax_amount = 0;
        var total_amount = price * qty;

        // 总额是否含税
        if (!contain_tax) {
            tax_amount = total_amount * tax_rate / 100;
            total_amount += tax_amount;
        } else {
            // 税金
            tax_amount = total_amount > 0 ? parseFloat(((total_amount / (1 + tax_rate / 100)) * (tax_rate / 100)).toFixed(2)) : 0;
        }

        //返回税金和总额
        return {
            tax_amount: tax_amount,
            total_amount: total_amount
        }
    }



</script>
<%--<script src="/js/tms/busi/order/orderArap.js?t=${applicationScope.sys_version}"></script>--%>
</html>
