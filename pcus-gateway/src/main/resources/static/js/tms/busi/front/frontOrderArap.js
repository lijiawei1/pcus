var basePath = rootPath + '/tms/busi/frontOrderArap/';

//缓存数据
var manager = {};

var $chargeGrid = $('#chargeGrid'),
    $payGrid = $('#payGrid'),
    $toptoolbar = $('#toptoolbar')
    ;

var chargeGrid,
    payGrid,
    toptoolbar
    ;

//显示计费单位
function renderFeeUnit(item) {
    if (!data_price_base || data_price_base.length == 0) return item.fee_unit;

    if (!item.fee_type || !item.fee_unit || !remap_price_base[item.fee_type]
        || !remap_price_base[item.fee_type].unitMap
    ) {
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
 * @param tax_amount 税金
 * @param total_amount 总额
 */
function amount(price, qty, contain_tax, tax_rate) {

    //合计值和税金有待修正 计算的值需要保留两位小数 税金计算=总额/（1+税点）*税点

    price = price || 0;
    qty = qty || 0;
    tax_rate = tax_rate || 0;

    var total_amount = price * qty;
    var tax_amount = 0;

    //计算税金
    if (total_amount > 0 && contain_tax) {
        tax_amount = (total_amount / (1 + tax_rate / 100)) * (tax_rate / 100);
        tax_amount = tax_amount.toFixed(2);
    }

    //返回税金和总额
    return {
        tax_amount: tax_amount,
        total_amount: total_amount
    }

}

//应付列表
var chargeGridOption = {
    columns: [
        {
            display: '状态', name: 'state_name', sortname: 'state', align: 'left', minWidth: 50, width: '5%'
        },
        {
            display: '费用名称', name: 'fee_name', align: 'left', minWidth: 120, width: '5%',
            editor: {
                type: 'select',
                data: data_dict[DICT_CODE.fee_type],
                ext: function (record, rowindex, value, column) {
                    return {
                        cancelable: true,
                        keySupport: true
                    }
                }
            },
            render: LG.render.ref(data_dict[DICT_CODE.fee_type], 'fee_name')
        },
        {
            display: '计费方式', name: 'fee_type', align: 'left', minWidth: 100, width: '5%',
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
            display: '计价单位', name: 'fee_unit', align: 'left', minWidth: 100, width: '5%',
            editor: {
                type: 'select',
                data: [],
            },
            render: renderFeeUnit
        },
        {
            display: '币种', name: 'currency', align: 'left', minWidth: 100, width: '5%',
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
            display: '单价', name: 'price', align: 'left', minWidth: 100, width: '5%',
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
            display: '数量', name: 'qty', align: 'left', minWidth: 100, width: '5%',
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
            display: '含税', name: 'contain_tax', align: 'left', minWidth: 80, width: '5%',
            editor: {type: 'checkbox'},
            render: LG.render.boolean("contain_tax")
        },
        {
            display: '税点', name: 'tax_rate', align: 'left', minWidth: 100, width: '5%',
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
            },
        },
        {
            display: '税金', name: 'tax_amount', align: 'left', minWidth: 100, width: '5%',
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
            },
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
                    minValue: 0,        //最小值
                }
            }
        },
        {display: '客户', name: 'client_name', align: 'left', minWidth: 100, width: '8%'},
        // {display: '客户主键', name: 'client_id', align: 'left', minWidth: 100, width: '8%'},
        {
            display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%', editor: {type: 'text'}
        }
    ],
    pageSize: 50,
    url: basePath + 'loadChargeGrid/' + mst_id,
    delayLoad: false,		//初始化不加载数据
    checkbox: true,
    width: 'calc(100% - 27px)',
    height: '100%',
    autoStretch: true,
    dataAction: 'server',
    usePager: true,
    enabledEdit: true,
    clickToEdit: true,
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
    onAfterEdit: function (e) {

        //立即编辑立即更新模式
        var record = e.record;
        var rowid = e.record['__id'];

        var data = {
            pk_id: e.record.pk_id,
            mst_id: e.record.mst_id,
            columnname: e.column.columnname,
        }
        data[e.column.columnname] = e.value;

        //判断值是否改变
        if (manager.lastRecord && manager.lastRecord[e.column.columnname] === e.value) {
            LG.tip("值未改变");
            return;
        }

        //修改单价，重新计算税金和总额
        if (['price', 'tax_rate', 'qty', 'contain_tax'].indexOf(data.columnname) != -1) {
            var amountData = amount(record['price'], record['qty'], record['contain_tax'], record['tax_rate']);
            data = $.extend({}, data, amountData);
            data.columnname += (',' + Object.keys(amountData).join(","));
        }

        LG.ajax({
            url: basePath + 'updateCharge',
            data: JSON.stringify(data, DateUtil.datetimeReplacer),
            contentType: "application/json",
            success: function (sss, msg) {

                chargeGrid.updateRow(rowid, $.extend({}, record, data));

                chargeGrid.isDataChanged = false;
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

var payStorageId = 'lastOrderPay';

//应付列表
var payGridOption = {
    columns: [
        {
            display: '状态', name: 'state_name', sortname: 'state', align: 'left', minWidth: 50, width: '5%'
        },
        {
            display: '费用名称', name: 'fee_name', align: 'left', minWidth: 120, width: '5%',
            editor: {
                type: 'select',
                data: data_dict[DICT_CODE.fee_type],
                ext: function (record, rowindex, value, column) {
                    return {
                        cancelable: true,
                        keySupport: true
                    }
                }
            },
            render: LG.render.ref(data_dict[DICT_CODE.fee_type], 'fee_name')
        },
        {
            display: '车牌号', name: 'car_no', align: 'left', minWidth: 180, width: '8%',
            editor: {
                type: 'select',
                data: data_car,
                ext: function (record, rowindex, value, column) {
                    return {
                        cancelable: true,
                        autocomplete: true,
                        autocompleteKeyField: 'key_text',
                        keySupport: true,
                        highLight: true,
                        isTextBoxMode: true,
                        selectBoxWidth: 350,
                        selectBoxHeight: 200,
                        renderItem: function (data, value, text, key) {

                            var g = this;
                            var item = data.data;

                            var key_text = '<span class="combobox-list-item car_no-item seq">' + item.id + '</span>';
                            key_text += '<span class="combobox-list-item car_no-item">' + item.key_text + '</span>'
                            key_text += '<span class="combobox-list-item driver_name-item item1">' + (item.driver_name || '') + '</span>';
                            key_text += '<span class="combobox-list-item driver_name-item item2">' + (item.task_type || '') + '</span>';
                            key_text += '<span class="combobox-list-item car_no-item">' + (item.carrier_name || '') + '</span>';
                            return g._highLight(key_text, $.trim(data.key));
                        },
                        onSelected: function (newValue, newText, rowData) {
                            //暂存选中的司机
                            manager.car = !!rowData ? $.extend({}, rowData) : {};
                        },
                        onClear: function() {
                            //清空选择
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
                            return car_no + "  " + driver_name + "  " + task_type;
                        }
                    }
                }
                return item.car_no;
            }
        },
        {
            display: '承运方', name: 'client_name', align: 'left', minWidth: 100, width: '8%',
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
            display: '计费方式', name: 'fee_type', align: 'left', minWidth: 100, width: '5%',
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
            display: '计价单位', name: 'fee_unit', align: 'left', minWidth: 100, width: '5%',
            editor: {
                type: 'select',
                data: [],
            },
            render: renderFeeUnit
        },
        {
            display: '币种', name: 'currency', align: 'left', minWidth: 100, width: '5%',
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
            display: '单价', name: 'price', align: 'left', minWidth: 100, width: '5%',
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
            display: '数量', name: 'qty', align: 'left', minWidth: 100, width: '5%',
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
            display: '含税', name: 'contain_tax', align: 'left', minWidth: 80, width: '5%',
            editor: {type: 'checkbox'},
            render: LG.render.boolean("contain_tax")
        },
        {
            display: '税点', name: 'tax_rate', align: 'left', minWidth: 100, width: '5%',
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
            },
        },
        {
            display: '税金', name: 'tax_amount', align: 'left', minWidth: 100, width: '5%',
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
            },
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
                    minValue: 0,        //最小值
                }
            },
        },
        {
            display: '揽货公司', name: 'supplier_id', align: 'left', minWidth: 150, width: '8%', editable: false,
            render: LG.render.ref(data_suppliers, 'supplier_id')
        },
        {display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%', editor: {type: 'text'}}

    ],
    pageSize: 50,
    url: basePath + 'loadPayGrid/' + mst_id,
    delayLoad: false,		//初始化不加载数据
    checkbox: true,
    width: 'calc(100% - 27px)',
    height: '100%',
    autoStretch: true,
    dataAction: 'server',
    usePager: true,
    enabledEdit: true,
    clickToEdit: true,
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
    onAfterEdit: function (e) {
        var record = e.record;
        var rowid = e.record['__id'];

        // 立即编辑立即更新模式
        var data = {
            pk_id: e.record.pk_id,
            mst_id: e.record.mst_id,
            columnname: e.column.columnname,
        }
        data[e.column.columnname] = e.value;

        //判断值是否改变
        if (manager.lastRecord && manager.lastRecord[e.column.columnname] === e.value) {
            LG.tip("值未改变");
            return;
        }

        if (localStorage && data.columnname == 'fee_name') {
            //TODO 处理默认费用字段
            // var key = payStorageId + '#' + data.columnname + '#' + data[data.columnname];
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
            success: function (sss, msg) {

                payGrid.updateRow(rowid, $.extend({}, record, data));

                //去除保存提示
                payGrid.isDataChanged = false;
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

if (data_order.bs_catalog == 'CARGO'){
    chargeGridOption.columns.splice(2, 0, {display: '预抵时间', name: 'cntr_work_time', minWidth: 50, width: '5%'});
    chargeGridOption.columns.splice(2, 0, {
        display: '车牌号', name: 'car_no', align: 'left', minWidth: 180, width: '8%',
        editor: {
            type: 'select',
            data: data_car,
            ext: function (record, rowindex, value, column) {
                return {
                    cancelable: true,
                    autocomplete: true,
                    autocompleteKeyField: 'key_text',
                    keySupport: true,
                    highLight: true,
                    isTextBoxMode: true,
                    selectBoxWidth: 350,
                    selectBoxHeight: 200,
                    renderItem: function (data, value, text, key) {

                        var g = this;
                        var item = data.data;

                        var key_text = '<span class="combobox-list-item car_no-item seq">' + item.id + '</span>';
                        key_text += '<span class="combobox-list-item car_no-item">' + item.key_text + '</span>'
                        key_text += '<span class="combobox-list-item driver_name-item item1">' + (item.driver_name || '') + '</span>';
                        key_text += '<span class="combobox-list-item driver_name-item item2">' + (item.task_type || '') + '</span>';
                        key_text += '<span class="combobox-list-item car_no-item">' + (item.carrier_name || '') + '</span>';
                        return g._highLight(key_text, $.trim(data.key));
                    },
                    onSelected: function (newValue, newText, rowData) {
                        //暂存选中的司机
                        manager.car = !!rowData ? $.extend({}, rowData) : {};
                    },
                    onClear: function () {
                        //清空选择
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
                        return car_no + "  " + driver_name + "  " + task_type;
                    }
                }
            }
            return item.car_no;
        }
    });
    payGridOption.columns.splice(2, 0, {display: '预抵时间', name: 'cntr_work_time', minWidth: 50, width: '5%'});
}

payGrid = $payGrid.ligerGrid(payGridOption);
chargeGrid = $chargeGrid.ligerGrid(chargeGridOption);

var defaultActionOption = {
    items: [
        {id: 'addCharge', text: '增加应收', click: defaultAction, icon: 'add', status: ['OP_INIT']},
        {id: 'addPay', text: '增加应付', click: defaultAction, icon: 'add', status: ['OP_INIT']},
        //{id: 'edit', text: '修改', click: defaultAction, icon: 'edit', status: ['OP_INIT']},
        {id: 'delete', text: '删除', click: defaultAction, icon: 'delete', status: ['OP_INIT']},
        {id: 'auditBatch', text: '审核', click: defaultAction, icon: 'audit', status: ['OP_INIT']},
        // {id: 'submit', text: '提交', click: defaultAction, icon: 'submit', status: ['OP_INIT']},
        {id: 'cancel', text: '撤销', click: defaultAction, icon: 'withdraw', status: ['OP_INIT']},
        {id: 'importFee', text: '导入', click: defaultAction, icon: 'dataimport', status: ['OP_INIT']},
        {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']},
        {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
    ]
};

function defaultAction(item) {
    switch (item.id) {
        case "cancel":
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
                    data: {pay_ids: payIds, charge_ids: chargeIds, mst_id: mst_id},
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
            break;
        case "auditBatch":
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
            break;
        case "addCharge":

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
            break;
        case "addPay":

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
            break;
        case "delete":
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
                    data: {pay_ids: payIds, charge_ids: chargeIds, mst_id: mst_id},
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
            break;
        case "refresh":
            payGrid.reload();
            chargeGrid.reload();
            break;
        case "importFee":
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
                        data.charge_message_list.length  > 0 && (function () {
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
                    $.ligerDialog.success(text, title,function(){}, {
                        width: 400
                    });
                    payGrid.reload();
                    chargeGrid.reload();
                },
                error: function (message) {
                    LG.showError(message);
                    payGrid.reload();
                    chargeGrid.reload();
                }
            });
            break;
    }
}

toptoolbar = LG.powerToolBar($toptoolbar, defaultActionOption);