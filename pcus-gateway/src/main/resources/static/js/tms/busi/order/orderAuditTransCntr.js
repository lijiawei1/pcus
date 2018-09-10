//下拉框相对定位
$.ligerDefaults.ComboBox.absolute = false;

var price_base = priceBaseUtil.processPriceBase(data_dict);
var data_cargo_unit = priceBaseUtil.processCargoUnit(price_base.remap);

var basePath = rootPath + '/tms/busi/orderAudit/';
var $mainForm = $("#mainForm");
//数据管理
var manager = {
    data: data_bill,

    init: function () {
        var g = this;
        mainForm.setData(g.data);
        renderOrgs(g.data);
    },
    setData: function (data) {
        var g = this;
        g.data = data;
        mainForm.setData(g.data);
        renderOrgs(g.data);
    },
    getChanges: function () {
        var g = this,
            orignData = g.data,
            newData = mainForm.getData(),
            changes = {};

        //只能通过表单定义的控件去修改
        for (var o in newData) {
            var newo = newData[o],
                origno = orignData[o];

            if (newo instanceof Date) {
                newo = DateUtil.dateToStr(null, newo);
                if (origno && origno.length <= 10) origno += " 00:00:00";
            }

            if (typeof newo === "number") newo += "";
            if (typeof origno === "number") origno += "";

            if (!(newo && origno && newo == origno) && (newo || origno)) {
                changes[o] = newo;
            }
        }

        return changes;
    },
};
//页面-父容器(考虑滚动条),labelWidth,space
var defaultFieldWidth = (function getInputWidth(diff, lw, sw) {
    var clientWidth = document.documentElement.clientWidth,
        w,
        n;
    if (clientWidth > 1366) {
        n = 4;
    }
    else {
        n = 3;
    }
    w = Math.floor((clientWidth - ((lw + sw) * n + diff)) * (Math.floor(100 / n)) / 100);//截取小数点后两位（向下取整）

    var o = {
        lw: lw,
        sw: sw,
        w1: w,
        w2: (w << 1) + lw + sw, //2倍
        w3: (w + lw + sw) * 2 + w,//3倍
        wA: (w + lw + sw) * (n - 1) + w//整行
    };

    if (o.w3 > o.wA) o.w3 = o.wA;

    return o;
})(290, 90, 20);

var fields = (function (data_bill) {

    var busi_type = data_bill.bs_type_code; //业务类型代码
    var task_type = data_bill.task_type; //任务类型
    var bill_sub = (BILL_CONST.BILL_SUB == data_bill.bill_main); //是否副单
    var cntr_drop_trailer = data_bill.cntr_drop_trailer; //是否甩挂
    var cntr_twin = data_bill.cntr_twin; //是否孖拖

    //获取任务类型名称
    var task_type_name = (function() {
        var task_types = $.grep(BILL_CONST.DATA_TASK_TYPE, function (item, index) {
            return BILL_CONST.DATA_TASK_TYPE[index].id == task_type;
        });
        return task_types.length > 0 ? task_types[0].text : task_type;
    })();

    //字段声明
    var mainFormFields = [
        {display: '委托客户', group: "基础信息", name: 'client_name', newline: true, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '单据状态', name: 'state_name', newline: false, type: 'text', options: {readonly: true}},
        {display: '作业单号', name: 'bill_no', newline: false, type: 'text', options: {readonly: true}},
        // {display: '拼单单号', name: 'main_bill_no', newline: false, type: 'text', options: {readonly: true}},
        {display: '运单号', name: 'order_bill_no', newline: false, type: 'text', options: {readonly: true}},
        {display: '业务类型', name: 'bs_type_name', newline: false, type: 'text', options: {readonly: true}},
        {display: '客户委托号', name: 'client_bill_no', newline: false, type: 'text', options: {readonly: true}},
        {display: '客户联系人', name: 'linkman', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '客户联系电话', name: 'linkman_mobile', newline: false, type: 'text', options: {readonly: true}},
        {display: '结算日期', name: 'settle_date', newline: false, type: 'date', options: {readonly: true}},
        {display: '揽货公司', name: 'supplier_name', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '操作单位', name: 'oper_unit_name', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '负责人', name: 'manager', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '任务类型', name: 'task_type', newline: false, cssClass: "field", type: "select", comboboxName: "task_type_c",
            options: {data: BILL_CONST.DATA_TASK_TYPE, readonly: true}},
        {display: '急单类型', name: 'urgen_order_type', newline: false, cssClass: "field", type: "select", comboboxName: "urgen_order_type_c",
            options: {data: data_dict[DICT_CODE.urgent_order], cancelable: true, readonly: true}},
        {display: '带货', name: 'take_goods', newline: false, cssClass: "field", type: "checkbox", options: {disabled: true, readonly: true}},
        // {display: '特殊运输要求', name: 'trans_require', width: defaultFieldWidth.w2, newline: true, type: 'text', options: {readonly: true}},
        // {display: '特殊备注', name: 'remark', width: defaultFieldWidth.w2, newline: false, type: 'text', options: {readonly: true}},
        /**************************************************************************
         * 运输信息
         **************************************************************************/
        {display: '车牌号', group: "调度信息", name: 'car_no', newline: false, cssClass: "field", options: {readonly: true}},
        {display: '司机', name: 'driver_name', newline: false, cssClass: "field", options: {readonly: true}},
        {display: '司机电话', name: 'driver_mobile', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '车架号', name: 'trailer_no', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '跟车司机', name: 'follow_driver', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '车型', name: 'booking_car_type', newline: false, cssClass: "field", type: "select",
            options: {data: data_dict[DICT_CODE.car_type], readonly: true, cancelable: true}},
        {display: '承运方', name: 'carrier_name', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '是否外协', name: 'outer', newline: false, cssClass: "field", type: "checkbox", options: {readonly: true}},
        /**************************************************************************
         * 装卸货地址信息
         **************************************************************************/
        // {display: '预约装货时间', group: "装货单位信息", name: 'load_work_time', newline: false, cssClass: "field", type: "date",
        //     editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}, options: {readonly: true}},
        {display: '预约装货时间', group: "装货单位信息", name: 'load_work_time', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '装货单位', name: 'load_org', newline: true, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '所属区域', name: 'load_pca', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {}},
        {display: '详细地址', name: 'load_address', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {
            display: '装货报价区域',
            name: 'load_region',
            width: defaultFieldWidth.w1,
            newline: false,
            // cssClass: "field",
            type: "select",
            options: {
                // readonly: true,
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    if(!text) return;
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        },
        // {display: '装货报价区域', name: 'load_region', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '联系人', name: 'load_linkman', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '联系电话', name: 'load_mobile', newline: false, cssClass: "field", type: "text", options: {readonly: true}},

        // {display: '预约卸货时间', group: "卸货单位信息", name: 'unload_work_time', newline: false, cssClass: "field", type: "date",
        //     editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}},
        {display: '预约卸货时间', group: "卸货单位信息", name: 'unload_work_time', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '卸货单位', name: 'unload_org', newline: true, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '所属区域', name: 'unload_pca', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {}},
        {display: '详细地址', name: 'unload_address', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {
            display: '卸货报价区域',
            name: 'unload_region',
            width: defaultFieldWidth.w1,
            newline: false,
            // cssClass: "field",
            type: "select",
            options: {
                // readonly: true,
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    if(!text) return;
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        },
        // {display: '卸货报价区域', name: 'unload_region', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '联系人', name: 'unload_linkman', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '联系电话', name: 'unload_mobile', newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        /**************************************************************************
         * 集装箱业务
         **************************************************************************/
        {display: '柜型', group: '柜信息', name: 'cntr_type', newline: false, cssClass: "field", type: "select", comboboxName: 'cntr_type_c',
            options: {data: data_dict[DICT_CODE.cntr_type],cancelable: true, autocomplete: true, keySupport: true, isTextBoxMode: true}, validate: {required: true}},
        {display: '甩挂', name: 'cntr_drop_trailer', width: defaultFieldWidth.w1 / 6, newline: false, cssClass: "field", type: "checkbox", options: {readonly: true}},
        {display: '孖柜', name: 'cntr_twin', width: defaultFieldWidth.w1 / 6, newline: false, cssClass: "field", type: "checkbox", options: {readonly: true}},
        {display: '主柜号', name: 'cntr_no', newline: true, cssClass: "field", type: "text", validate: {containerCode: true}, options: {}},
        {display: '封条号', name: 'cntr_seal_no', newline: false, cssClass: "field", type: "text", validate: {}, options: {}},
        {display: '柜重', name: 'cntr_weight', newline: false, cssClass: "field", type: "text", validate: {}, options: {range: [0, 999999]}},
        {display: '孖拖柜号', name: 'cntr_twin_no', newline: true, cssClass: "field", type: "text", validate: {containerCode: true}, options: {}},
        {display: '孖拖柜封条号', name: 'cntr_twin_seal_no', newline: false, cssClass: "field", type: "text", options: {}},
        {display: '孖拖柜重', name: 'cntr_twin_weight', newline: false, cssClass: "field", type: "text", options: {range: [0, 999999]}},
        /**************************************************************************
         * 提还柜信息
         **************************************************************************/
        {
            display: '预约提柜时间', name: 'cntr_pick_time', newline: false, cssClass: "field", type: "date",
            editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}, options: {}
        },
        {display: '预约装卸时间', name: 'cntr_work_time', newline: false, cssClass: "field", type: "date",
            editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss",
                onRendered: function (value, text, a2, a3, a4) {
                    var $this = $(this.element);
                    $this.after('<span class="list-icon arrived"></span>');
                }},
            options: {}
         },
        {display: '提柜地', name: 'gate_out_dock', newline: true, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '提柜详细地址', name: 'gate_out_yard', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {
            display: '提柜报价区域',
            name: 'gate_out_region',
            width: defaultFieldWidth.w1,
            newline: false,
            // cssClass: "field",
            type: "select",
            options: {
                // readonly: true,
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    if(!text) return;
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        },
        // {display: '提柜报价区域', name: 'gate_out_region', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '还柜地', name: 'gate_in_dock', newline: true, cssClass: "field", type: "text", options: {readonly: true}},
        {display: '还柜详细地址', name: 'gate_in_yard', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        {
            display: '还柜报价区域',
            name: 'gate_in_region',
            width: defaultFieldWidth.w1,
            newline: false,
            // cssClass: "field",
            type: "select",
            options: {
                // readonly: true,
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    if(!text) return;
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        },
        // {display: '还柜报价区域', name: 'gate_in_region', width: defaultFieldWidth.w1, newline: false, cssClass: "field", type: "text", options: {readonly: true}},
        /**************************************************************************
         * 船业务
         **************************************************************************/
        {display: '船公司', group: "船务信息", name: 'ship_corp', newline: true, cssClass: "field", type: "text"},
        {display: '订舱号', name: 'booking_no', newline: false, cssClass: "field", type: "text"},
        {display: '船名', name: 'ship_name', newline: false, cssClass: "field", type: "text"},
        {display: '航次', name: 'voyage', newline: false, cssClass: "field", type: "text"},
        {display: '码头', name: 'dock', newline: false, cssClass: "field", type: "text"},
        {display: '船代', name: 'agency', newline: false, cssClass: "field", type: "text"},
        {display: '到港日期', name: 'arrival_date', newline: false, cssClass: "field", type: "date"},
        {display: '制单公司', name: 'bill_org', newline: false, cssClass: "field", type: "text"},
        /************************
         * 关务信息
         ************************/
        {display: '报关时间', name: 'bill_time', newline: false, cssClass: "field", type: "date", group: "关务信息",
            editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}},
        {display: '报关方式', name: 'declare_type', newline: false, type: 'text'},
        {display: '封关地', name: 'close_customs', newline: false, type: 'text'},
        {display: '报关行', name: 'customs_broker', newline: false, type: 'text'},
        {display: '联系人', name: 'broker_linkman', newline: false, type: 'text'},
        {display: '联系方式', name: 'broker_mobile', newline: false, type: 'text'},
        {display: '报关行地址', name: 'broker_address', width: defaultFieldWidth.w3, newline: true, type: 'text', options: {readonly: true}},
    ];

    //模板分组
    var MAIN_FORM_GROUP = {
        //分栏模板
        group_base: {
            client_name: '委托客户', bs_type_name: '业务类型', supplier_name: '揽货公司', oper_unit_name: '操作单位',
            state_name: '单据状态', bill_no: '作业单号', task_type: '任务类型', urgen_order_type: '急单类型', linkman: '客户联系人',
            linkman_mobile: '客户联系电话', client_bill_no: '客户委托号', manager: '负责人', settle_date: '结算日期',
            main_bill_no: '拼单单号', take_goods: '带货', trans_require: '特殊运输要求', remark: '特殊备注'
        },
        group_dispatch: {
            carrier_id: '承运人主键',
            driver_id: '司机主键',
            car_no: '车牌号',
            driver_name: '司机',
            driver_mobile: '司机电话',
            follow_driver: '跟车司机',
            booking_car_type: '车型',
            carrier_name: '承运方',
            outer: '是否外协'

        },
        group_cargo: {
            cargo_info: '货物信息',
            cargo_type: '货物类型',
            cargo_qty: '货物数量',
            cargo_unit: '单位'
        },
        group_cntr: {
            cntr_type: '柜型',
            cntr_pick_time: '预约提柜时间',
            cntr_work_time: '预约装卸时间',
            cntr_drop_trailer: '甩挂',
            cntr_twin: '孖柜',
            cntr_no: '主柜号',
            cntr_seal_no: '封条号',
            cntr_weight: '柜重',
            // cntr_twin_no: '孖拖柜号',
            // cntr_twin_seal_no: '孖拖柜封条号',
            // cntr_twin_weight: '孖拖柜重',
            gate_out_dock: '提柜地',
            gate_out_yard: '提柜详细地址',
            gate_out_region: '提柜报价区域',
            gate_in_dock: '还柜地',
            gate_in_yard: '还柜详细地址',
            gate_in_region: '还柜报价区域'
        },
        //
        group_cntr_twin: {
            cntr_type: '柜型',
            cntr_pick_time: '预约提柜时间',
            cntr_work_time: '预约装卸时间',
            cntr_drop_trailer: '甩挂',
            cntr_twin: '孖柜',
            cntr_no: '主柜号',
            cntr_seal_no: '封条号',
            cntr_weight: '柜重',
            cntr_twin_no: '孖拖柜号',
            cntr_twin_seal_no: '孖拖柜封条号',
            cntr_twin_weight: '孖拖柜重',
            gate_out_dock: '提柜地',
            gate_out_yard: '提柜详细地址',
            gate_in_dock: '还柜地',
            gate_in_yard: '还柜详细地址'
        },
        group_load: {
            load_work_time: '预约装货时间',
            load_linkman: '联系人',
            load_mobile: '联系电话',
            load_org: '装货单位',
            load_address: '详细地址',
            load_region: '装货报价区域'
        },
        group_unload: {
            unload_work_time: '预约卸货时间',
            unload_linkman: '联系人',
            unload_mobile: '联系电话',
            unload_org: '卸货单位',
            unload_address: '详细地址',
            unload_region: '卸货报价区域'
        },
        group_ship: {
            ship_corp: '柜信息',
            booking_no: '订舱号',
            ship_name: '船名',
            voyage: '航次',
            dock: '码头',
            agency: '船代',
            arrival_date: '到港日期',
            bill_org: '制单公司'

        },
        group_custom: {
            bill_time: '报关时间',
            declare_type: '报关方式',
            close_customs: '封关地',
            customs_broker: '报关行',
            broker_linkman: '联系人',
            broker_mobile: '联系方式',
            broker_address: '报关行地址'
        },
        group_audit: {
            audit_psn: '审核人',
            audit_time: '审核时间'
        }
    };

    // 加载的个性配置
    if (FORM_CONFIG) {
        mainFormFields = mainFormFields.concat(FORM_CONFIG.field);
        $.extend(true, MAIN_FORM_GROUP, FORM_CONFIG.formGroup);
        FORM_CONFIG = null;
    }

    //单据模板
    var MAIN_FORM_TEMPLATE = [
        MAIN_FORM_GROUP.group_base,
        MAIN_FORM_GROUP.group_dispatch,
        TMS_BUSI_TYPE.TYPE_TRANS_CNTR_IMPORT == busi_type ? MAIN_FORM_GROUP.group_unload : MAIN_FORM_GROUP.group_load,
        cntr_twin ? MAIN_FORM_GROUP.group_cntr_twin : MAIN_FORM_GROUP.group_cntr,
        MAIN_FORM_GROUP.group_cargo,
        MAIN_FORM_GROUP.group_ship,
        MAIN_FORM_GROUP.group_custom
    ];

    var fields = [],
        fieldsMapping = {};

    $.each(mainFormFields, function (i, v) {
        fieldsMapping[v.name] = v;
    });


    var cntrFields = ['cntr_type', 'cntr_no', 'cntr_seal_no', 'cntr_weight']; //主柜信息字段
    var twinfields = ['cntr_twin_no', 'cntr_twin_seal_no', 'cntr_twin_weight']; //孖拖柜信息字段

    //设置副单界面中主柜信息不可修改
    for (var i = 0; i < cntrFields.length; i++) {
        var fieldOption = fieldsMapping[cntrFields[i]];
        if (fieldOption) {
            if (bill_sub) {
                fieldOption.options.readonly = true;
            } else {
                delete fieldOption.options.readonly;
            }
        }
    }

    //设置副单界面中孖柜信息可修改
    for (var i = 0; i < twinfields.length; i++) {
        var fieldOption = fieldsMapping[twinfields[i]];
        if (fieldOption) {
            fieldOption.options.readonly = true;
            if (bill_sub) {
                delete fieldOption.options.readonly;
            } else {
                fieldOption.options.readonly = true;
            }
        }
    }

    //遍历模板
    $.each(MAIN_FORM_TEMPLATE, function (i, v) {

        //遍历group，添加字段
        $.each(v, function (name, value) {
            //name: value
            //broker_address: '报关行地址',
            var fieldOption = fieldsMapping[name];
            if (fieldOption) {

                if ('booking_no' === name) {
                    if (busi_type === TMS_BUSI_TYPE.TYPE_TRANS_CNTR_IMPORT) {
                        //进口业务
                        fieldOption.display = '提单号';
                    } else if (busi_type === TMS_BUSI_TYPE.TYPE_TRANS_CNTR_EXPORT) {
                        //出口业务
                        fieldOption.display = '订舱号';
                    }
                }

                //分组名称更新
                if ('cntr_type' === name) {
                    fieldOption.group = fieldOption.group + '-' + task_type_name;
                }

                fields.push(fieldOption);
            }
        });
    });
    return fields;

})(data_bill);

var mainForm = $mainForm.ligerForm({
    inputWidth: defaultFieldWidth.w1,
    labelWidth: defaultFieldWidth.lw,
    space: defaultFieldWidth.sw,
    labelAlign: "right",
    fields: fields,
    validate: true,
    toJSON: JSON2.stringify
});

var $formGroups = [], formGroups = [],
    $subFormList = $("#subFormList");

var subFormOption = {
    inputWidth: defaultFieldWidth.w1,
    labelWidth: defaultFieldWidth.lw,
    space: defaultFieldWidth.sw,
    labelAlign: "right",
    prefixID: "s_",
    fields: [
        {display: '装卸单位', group: "子表信息", name: 'org', newline: false, type: 'text', options: {readonly: true}},
        {display: '联系人', name: 'linkman', newline: false,type: 'text', options: {readonly: true}},
        {display: '联系电话', name: 'mobile', newline: false, type: 'text', options: {readonly: true}},
        {display: '甩挂点', name: 'drop_trailer', newline: false, cssClass: "field", type: "checkbox", options: {readonly: true}},
        {display: '所属区域', name: 'loadarea', width: defaultFieldWidth.w2, newline: false, type: 'text', options: {readonly: true}},
        {display: '详细地址', name: 'address', width: defaultFieldWidth.w3, newline: false, type: 'text', options: {readonly: true}},
        {display: '预约作业时间', name: 'work_time', newline: false, cssClass: "field", type: "date",
            options: {readonly: true}, editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}},
        {display: '操作注意事项', name: 'oper_note', width: defaultFieldWidth.w2, newline: true, type: 'text', options: {readonly: true}},
        {display: '调度注意事项', name: 'dispatch_note', width: defaultFieldWidth.w2, newline: false, type: 'text', options: {readonly: true}},
        {display: '司机注意事项', name: 'driver_note', width: defaultFieldWidth.w2, newline: false, type: 'text', options: {readonly: true}},
    ],
    validate: true,
    toJSON: JSON2.stringify
};

//渲染装卸单位
function renderOrgs(data) {

    //子表单
    var orgs = data.loadUnloadOrgList;

    var busi_type = data.bs_type_code;

    var CLS_L_FORM_CONTAINER = ".l-form-container";
    //主表容器
    var mainFormContainer = $mainForm.find(CLS_L_FORM_CONTAINER);

    var selector = "ul:eq(8)";
    if (busi_type == TMS_BUSI_TYPE.TYPE_TRANS_DISTR) {
        selector = "ul:eq(4)";
    } else if (busi_type == TMS_BUSI_TYPE.TYPE_TRANS_CARGO) {
        selector = "ul:eq(4)";
    }

    var ul4 = mainFormContainer.children(selector);

    if (orgs && orgs.length > 0) {

        //清空插入的表单
        if (formGroups.length > 0) {
            for (var i = 0; i < formGroups.length; i++) {
                formGroups[i].destroy();
            }
            formGroups.length = 0;
        }

        // 初始化
        for (var i = 0; i < orgs.length; i++) {
            //初始化form
            var $subForm = $("<form id=" + ("subForm" + i) + "></form>");
            $subFormList.append($subForm);
            $formGroups.push($subForm);

            var option = $.extend(true, {}, subFormOption, {
                prefixID: "s" + i + "_",
            });

            var groupName = orgs[i].type == 'LOAD' ? "装货单位" : "卸货单位";

            $.each(option.fields, function (i, v) {
                v.group = groupName;
            });

            var subForm = $subForm.ligerForm(option);
            formGroups.push(subForm);
            $formGroups.push($subForm);

            $subForm.insertAfter(ul4);

            subForm.setData(orgs[i]);
        }
    }
}

//保存数据
function save() {
    //提交数据
    if (mainForm.valid()) {

        var columnname = Object.keys(manager.getChanges()).join(',');

        if (!columnname) {
            // LG.tip("单据没有修改");
            // return;
            columnname = 'dock';
        }

        var postData = $.extend({}, manager.data, mainForm.getData(), { columnname: columnname});

        LG.ajax({
            url: basePath + "updateAuditCntr",
            data: JSON2.stringify(postData, DateUtil.datetimeReplacer),
            contentType: 'application/json',
            dataType: "json",
            success: function (data, msg) {
                manager.setData(data);
                LG.tip('保存成功!');
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    } else {
        LG.tip("部分字段不合法");
    }
}

//刷新
function refresh() {
    LG.ajax({
        url: basePath + "loadAuditCntr",
        data: {
            pk_id: trans_id,
            order_id: order_id
        },
        success: function (data, msg) {
            manager.setData(data);
            LG.tip("刷新成功");
        },
        error: function (msg) {
        }
    })
}

//渲染数据
manager.init();