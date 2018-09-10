//下拉框相对定位
$.ligerDefaults.ComboBox.absolute = false;

var basePath = rootPath + '/tms/busi/trans/';
var $mainForm = $("#mainForm");
//数据管理
var manager = {
    data: data_trans,
    init: function () {
        var g = this;
        mainForm.setData(g.data);
        renderOrgs(g.data);
    }
};
//页面-父容器(考虑滚动条),labelWidth,space
var defaultFieldWidth = (function getInputWidth(diff, lw, sw) {
    var clientWidth = document.documentElement.clientWidth,
        w,
        n;
    if(clientWidth > 1366){
        n = 4;
    }
    else{
        n = 3;
    }
    w =  Math.floor((clientWidth - ((lw + sw)  * n + diff)) * (Math.floor(100/n ))/100);//截取小数点后两位（向下取整）

    var o = {
        lw: lw,
        sw: sw,
        w1: w,
        w2: (w << 1) + lw + sw, //2倍
        w3: (w + lw + sw) * 2 + w,//3倍
        wA: (w + lw + sw) * (n - 1) + w//整行
    };

    if(o.w3 > o.wA) o.w3 = o.wA;

    return o;
})(89,110,30);
var fields = (function(busi_type) {

    //字段声明
    var mainFormFields = [
        {
            display: '委托客户', group: "基础信息",
            name: 'client_name',

            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '单据状态',
            name: 'state_name',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '作业单号',
            name: 'bill_no',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '拼单单号',
            name: 'main_bill_no',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '运单号',
            name: 'order_bill_no',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '业务类型',
            name: 'bs_type_name',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '客户委托号',
            name: 'client_bill_no',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '客户联系人',
            name: 'linkman',
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '客户联系电话',
            name: 'linkman_mobile',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '结算日期',
            name: 'settle_date',

            newline: false,
            type: 'date',
            options: {
                readonly: true
            }
        },
        {
            display: '揽货公司',
            name: 'supplier_name',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '操作单位',
            name: 'oper_unit_name',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            },
        },
        {
            display: '负责人',
            name: 'manager',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '任务类型',
            name: 'task_type',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "task_type_c",
            options: {
                data: BILL_CONST.DATA_TASK_TYPE,
                readonly: true
            },
        },
        {
            display: '急单类型',
            name: 'urgen_order_type',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "urgen_order_type_c",
            options: {
                data: data_dict[DICT_CODE.urgent_order],
                cancelable: true,
                readonly: true
            },
        },
        {
            display: '带货',
            name: 'take_goods',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                disabled: true,
                readonly: true
            }
        },
        {
            display: '特殊运输要求', name: 'trans_require',
            width: defaultFieldWidth.w2, newline: true, type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '特殊备注', name: 'remark',
            width: defaultFieldWidth.w2,
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        /**************************************************************************
         * 运输信息
         **************************************************************************/

        {name: 'carrier_id', type: 'hidden'},
        {name: 'driver_id', type: 'hidden'},
        {
            display: '车牌号', group: "调度信息",
            name: 'car_no',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "car_no_c",
            options: {
                data: data_car,
                cancelable: true,
                autocomplete: true,
                autocompleteKeyField: 'key_text',
                keySupport: true,
                highLight: true,
                isTextBoxMode: true,
                selectBoxWidth: 350,
                selectBoxHeight: 300,
                renderItem: function (data, value, text, key) {
                    // var g = this;
                    // var item = data.data;
                    //
                    // //TODO 样式待调整
                    // var key_text = '<span class="combobox-list-item car_no-item">' + item.key_text + '</span>';
                    // key_text += '<span class="combobox-list-item car_no-item">' + '产值:' + ('' + (item.output || 0).toFixed(2)) + '</span>';
                    // key_text += '<span class="combobox-list-item car_no-item">' + '提成:' + ('' + (item.percentage || 0).toFixed(2)) + '</span>';
                    // key_text += '<span class="combobox-list-item car_no-item">' + item.type_name + '</span>';
                    // return g._highLight(key_text, $.trim(data.key));

                    var g = this;
                    var item = data.data;

                    //TODO 样式待调整
                    var key_text = '<span class="combobox-list-item car_no-item">' + item.key_text + '</span>';
                    key_text += '<span class="combobox-list-item car_no-item">' + item.driver_name + '</span>';
                    key_text += '<span class="combobox-list-item car_no-item">' + item.carrier_name + '</span>';
                    // key_text += '<span class="combobox-list-item car_no-item">' + '产值:' + ('' + (item.output || 0).toFixed(2)) + '</span>';
                    // key_text += '<span class="combobox-list-item car_no-item">' + '提成:' + ('' + (item.percentage || 0).toFixed(2)) + '</span>';
                    key_text += '<span class="combobox-list-item car_no-item">' + item.type_name + '</span>';
                    // key_text += '<span class="combobox-list-item car_no-item">' + (item.outer == 'Y' ? '外协' : '自有') + '</span>';

                    return g._highLight(key_text, $.trim(data.key));
                },
                onBlur: function (text) {
                    selectCar(text);
                },
                onSelected: function (newValue, newText) {
                    selectCar(newText);
                }
            },
            validate: {required: true}
        },

        {
            display: '司机',
            name: 'driver_name',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "driver_name_c",
            options: {
                data: data_driver,
                cancelable: true,
                autocomplete: true,
                autocompleteKeyField: 'key_text',
                keySupport: true,
                highLight: true,
                isTextBoxMode: true,
                selectBoxWidth: 350,
                selectBoxHeight: 300,
                renderItem: function (data, value, text, key) {

                    var g = this,
                        item = data.data,
                        key_text_arr = item.key_text.split(/\s+/),
                        key_text = "";
                    key_text += '<span class="combobox-list-item driver_name-item item1">' + key_text_arr[0] + '</span>';
                    key_text += '<span class="combobox-list-item driver_name-item item2">' + key_text_arr[1] + '</span>';
                    key_text += '<span class="combobox-list-item driver_name-item item3">' + key_text_arr[2] + '</span>';
                    key_text += '<span class="combobox-list-item driver_name-item item4">' + (item.outer == 'Y' ? '外协' : '自有') + '</span>';
                    return g._highLight(key_text, $.trim(data.key));
                },
                onSelected: function (newValue, newText,data) {
                    if (data != null) {
                        selectCar(data);
                    }
                }
            },
            validate: {required: true}
        },
        {
            display: '司机电话',
            name: 'driver_mobile',

            newline: false,
            cssClass: "field",
            type: "text"
        },
        {
            display: '车架号',
            name: 'trailer_no',

            newline: false,
            cssClass: "field",
            type: "text"
        },
        {
            display: '跟车司机',
            name: 'follow_driver',

            newline: false,
            cssClass: "field",
            type: "text"
        },
        {
            display: '车型',
            name: 'booking_car_type',

            newline: true,
            cssClass: "field",
            type: "select",
            options: {
                data: data_dict[DICT_CODE.car_type],
                readonly: true,
                cancelable: true
            }
        },
        {
            display: '承运方',
            name: 'carrier_name',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '是否外协',
            name: 'outer',
            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                disabled: true,
                readonly: true
            }
        },

        /**************************************************************************
         * 散货信息
         **************************************************************************/
        {
            display: '货物信息', group: '货物概况',
            name: 'cargo_info',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '货物类型',
            name: 'cargo_type',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: 'cargo_type_c',
            options: {
                data: data_dict[DICT_CODE.cargo_type],
                cancelable: true,
                readonly: true
            }
        },
        {
            display: '货物数量',
            name: 'cargo_qty',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            },
            validate: {
                range: [1, 999999]
            }
        },
        {
            display: '单位',
            name: 'cargo_unit',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "cargo_unit_c",
            options: {
                data: [],
                cancelable: true,
                isTextBoxMode: true,
                readonly: true
            },
        },
        /**************************************************************************
         * 集装箱业务
         **************************************************************************/
        {
            display: '柜型', group: '柜信息',
            name: 'cntr_type',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: 'cntr_type_c',
            options: {
                data: data_dict[DICT_CODE.cntr_type],
                cancelable: true,
            },
            validate: {}
        },
        {
            display: '甩挂',
            name: 'cntr_drop_trailer',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                disabled: true,
                readonly: true
            }
        },
        {
            display: '孖柜',
            name: 'cntr_twin',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                disabled: true,
                readonly: true
            }
        },
        {
            display: '主柜号',
            name: 'cntr_no',

            newline: true,
            cssClass: "field",
            type: "text",
            validate: {
                containerCode: true
            },
            options: {}
        },
        {
            display: '封条号',
            name: 'cntr_seal_no',

            newline: false,
            cssClass: "field",
            type: "text",
            validate: {},
            options: {}
        },
        {
            display: '柜重',
            name: 'cntr_weight',

            newline: false,
            cssClass: "field",
            type: "text",
            validate: {},
            options: {
                range: [0, 999999]
            }
        },
        {
            display: '孖拖柜号',
            name: 'cntr_twin_no',

            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                // readonly: true
            }
        },
        {
            display: '孖拖柜封条号',
            name: 'cntr_twin_seal_no',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                // readonly: true
            }
        },
        {
            display: '孖拖柜重',
            name: 'cntr_twin_weight',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                // readonly: true
                range: [0, 999999]
            }
        },
        /**************************************************************************
         * 提还柜信息
         **************************************************************************/
        {
            display: '提柜地',
            name: 'gate_out_dock',

            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '提柜详细地址',
            name: 'gate_out_yard',
            width: defaultFieldWidth.w3,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '还柜地',
            name: 'gate_in_dock',

            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '还柜详细地址',
            name: 'gate_in_yard',
            width: defaultFieldWidth.w3,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        /**************************************************************************
         * 船业务
         **************************************************************************/
        {
            display: '船公司', group: "船务信息",
            name: 'ship_corp',

            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '订舱号',
            name: 'booking_no',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        }, {
            display: '船名',
            name: 'ship_name',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '航次',
            name: 'voyage',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '码头',
            name: 'dock',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '船代',
            name: 'agency',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '到港日期',
            name: 'arrival_date',

            newline: false,
            cssClass: "field",
            type: "date",
            options: {readonly: true}
        },
        {
            display: '预抵日期',
            name: 'cntr_work_time',

            newline: false,
            cssClass: "field",
            type: "date",
            options: {readonly: true},
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        },
        {
            display: '制单公司',
            name: 'bill_org',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {readonly: true}
        },

        /************************
         * 关务信息
         ************************/
        {
            display: '报关时间', group: "关务信息",
            name: 'bill_time',
            newline: false,
            cssClass: "field",
            type: "date",
            options: {readonly: true}
        },
        {
            display: '报关方式',
            name: 'declare_type',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '封关地',
            name: 'close_customs',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '报关行',
            name: 'customs_broker',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },

        {
            display: '联系人',
            name: 'broker_linkman',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '联系方式',
            name: 'broker_mobile',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '报关行地址',
            name: 'broker_address',
            width: defaultFieldWidth.w3,
            newline: true,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '提交人', group: "审计信息",
            name: 'audit_psn',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '提交时间',
            name: 'audit_time',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '创建人', name: 'create_psn',
            newline: true,
            type: 'text',
            options: {readonly: true}
        },
        // {
        //     display: '创建时间',
        //     name: 'create_time',
        //     width: 170,
        //     space: 30,
        //     newline: false,
        //     type: 'text',
        //     options: {readonly: true}
        // },
        // {
        //     display: '修改人', name: 'modify_psn',
        //     width: 170,
        //     space: 30,
        //     newline: false, type: 'text', options: {readonly: true}
        // },
        // {
        //     display: '修改时间',
        //     name: 'modify_time',
        //     width: 170,
        //     space: 30,
        //     newline: false,
        //     type: 'text',
        //     options: {readonly: true}
        // }

    ];

    //模板分组
    var MAIN_FORM_GROUP = {

        //分栏模板
        group_base: {
            client_name: '委托客户',
            bs_type_name: '业务类型',
            supplier_name: '揽货公司',
            oper_unit_name: '操作单位',
            state_name: '单据状态',
            bill_no: '作业单号',
            task_type: '任务类型',
            urgen_order_type: '急单类型',
            linkman: '客户联系人',
            linkman_mobile: '客户联系电话',
            client_bill_no: '客户委托号',
            manager: '负责人',
            settle_date: '结算日期',
            // main_bill_no: '拼单单号',
            order_bill_no: '运单号',

            take_goods: '带货',
            trans_require: '特殊运输要求',
            remark: '特殊备注'
        },

        // group_base: {
        //     state_name: '单据状态',
        //     bill_no: '运输单号',
        //     bs_type_name: '业务类型',
        //     main_bill_no: '拼单单号',
        //     client_name: '委托客户',
        //     client_bill_no: '客户委托号',
        //     settle_date: '结算日期',
        //     linkman: '客户联系人',
        //     linkman_mobile: '客户联系电话',
        //     supplier_name: '揽货公司',
        //     oper_unit_name: '操作单位',
        //     manager: '负责人',
        //     urgen_order_type: '急单类型',
        //     take_goods: '带货',
        //     trans_require: '特殊运输要求',
        //     remark: '特殊备注'
        // },

        group_dispatch: {
            carrier_id: '承运人主键',
            driver_id: '司机主键',
            car_no: '车牌号',
            driver_name: '司机',
            driver_mobile: '司机电话',
            follow_driver: '跟车司机',
            booking_car_type: '车型',
            carrier_name: '承运方',
            outer: '是否外协',

        },

        group_cargo: {
            cargo_info: '货物信息',
            cargo_type: '货物类型',
            cargo_qty: '货物数量',
            cargo_unit: '单位',
        },

        group_cntr: {
            cntr_type: '柜信息',
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
            gate_in_yard: '还柜详细地址',
        },

        group_ship: {
            ship_corp: '船公司',
            booking_no: '订舱号',
            ship_name: '船名',
            voyage: '航次',
            dock: '码头',
            agency: '船代',
            arrival_date: '到港日期',
            cntr_work_time: '预约装卸时间',
            bill_org: '制单公司'
        },

        group_custom: {
            bill_time: '报关时间',
            declare_type: '报关方式',
            close_customs: '封关地',
            customs_broker: '报关行',
            broker_linkman: '联系人',
            broker_mobile: '联系方式',
            broker_address: '报关行地址',
        },

        group_audit: {
            audit_psn: '审核人',
            audit_time: '审核时间'
        }

    };

    //单据模板
    var MAIN_FORM_TEMPLATE = {
        //疏港进口
        TYPE_TRANS_CNTR_IMPORT: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_dispatch,
            MAIN_FORM_GROUP.group_cntr,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom,
            // MAIN_FORM_GROUP.group_audit
        ],

        //集港出口
        TYPE_TRANS_CNTR_EXPORT: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_dispatch,
            MAIN_FORM_GROUP.group_cntr,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom,
            // MAIN_FORM_GROUP.group_audit
        ],

        //散货整车
        TYPE_TRANS_CARGO: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_dispatch,
            MAIN_FORM_GROUP.group_cargo,
            MAIN_FORM_GROUP.group_custom
            // MAIN_FORM_GROUP.group_audit
        ],

        //配送运输
        TYPE_TRANS_DISTR: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_dispatch,
            // MAIN_FORM_GROUP.group_cargo,
            // MAIN_FORM_GROUP.group_audit
        ],
         DEFAULT: [
             MAIN_FORM_GROUP.group_base,
             MAIN_FORM_GROUP.group_dispatch
         ]
    };

    var fields = [],
        fieldsMapping = {};

    $.each(mainFormFields, function (i, v) {
        fieldsMapping[v.name] = v;
    });

    //遍历模板
    var template = MAIN_FORM_TEMPLATE[busi_type] || MAIN_FORM_TEMPLATE['DEFAULT'];

    $.each(template, function (i, v) {

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

                fields.push(fieldOption);
            }
        });
    });
    return fields;

})(data_trans.bs_type_code);


var toptoolbar = LG.powerToolBar($('#toptoolbar'), {
    items: [
        { id: 'refresh', text: '刷新', icon: 'refresh', click: refresh },
        { id: 'update-card', text: '保存', icon: 'save', click: save },
        { id: 'submit-card', text: '提交', icon: 'audit', click: submit },
        { id: 'cancelSubmit-card', text: '撤销提交', icon: 'withdraw', click: cancelSubmit },
        { id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrackFun }
    ]
});

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
        {
            display: '装卸单位', group: "子表信息",
            name: 'org',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '所属区域',
            name: 'loadarea',
            width: defaultFieldWidth.w2,
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '详细地址',
            name: 'address',
            width: defaultFieldWidth.w3,
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '联系人',
            name: 'linkman',

            newline: true,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '联系电话',
            name: 'mobile',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '甩挂点',
            name: 'drop_trailer',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                disabled: true,
                readonly: true
            }
        },
        {
            display: '预约作业时间',
            name: 'work_time',

            newline: false,
            cssClass: "field",
            type: "date",
            options: {
                readonly: true
            },
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        },
        {
            display: '操作注意事项',
            name: 'oper_note',
            width: defaultFieldWidth.w2,
            newline: true,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '调度注意事项',
            name: 'dispatch_note',
            width: defaultFieldWidth.w2,
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '司机注意事项',
            name: 'driver_note',
            width: defaultFieldWidth.w2,
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
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
        selector = "ul:eq(3)";
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

        //初始化
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

        var formData = $.extend({}, manager.data, mainForm.getData());

        //校验子表
        for (var i = 0; i < formGroups.length; i++) {
            if (!formGroups[i].valid()) return;
        }

        LG.ajax({
            url: basePath + "update",
            data: JSON2.stringify(formData, DateUtil.datetimeReplacer),
            contentType: 'application/json',
            dataType: "json",
            success: function (data, msg) {
                manager.data = data;
                mainForm.setData(data);
                renderOrgs(data);
                LG.tip('保存成功!');
                //刷新列表页面grid
//                    var iframe = parent.window.frames['006001'];
//                    iframe.mainGrid.reload();
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    }
}
//提交
function submit() {

    if (mainForm.valid()) {

        var formData = $.extend({}, manager.data, mainForm.getData());

        $.ligerDialog.confirm('确定提交吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'submit',
                data: JSON.stringify([ formData ], DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                    manager.data = data;
                    mainForm.setData(data[0]);

                    LG.tip('提交成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });

    }

}

function cancelSubmit() {

    if (mainForm.valid()) {

        var formData = $.extend({}, manager.data, mainForm.getData());

        //校验子表
        // for (var i = 0; i < formGroups.length; i++) {
        //     if (!formGroups[i].valid()) return;
        // }

        $.ligerDialog.confirm('确定撤销提交吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'cancelSubmit',
                data: JSON.stringify([ formData ], DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {

                    manager.data = data;
                    mainForm.setData(data[0]);
                    renderOrgs(data);

                    LG.tip('撤销提交成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });

    }
}

//选择车
function selectCar(condition) {
    var carData,driverData;
    if(typeof condition == "object"){
        driverData = condition
    }else{
        carData = getDataByField(data_car, condition, "text");
        if(carData) {
            if (carData.driver_id) {
                driverData = getDataByField(data_driver, carData.driver_id, "id");
            }
            //设置车型
            carData.type && setFieldsValue(mainForm, {"booking_car_type_c": carData.type});
        }else{
            //清除车型
            setFieldsValue(mainForm, {"booking_car_type_c": ""});
        }
    }
    if(!driverData) return;
    driverData && setFieldsValue(mainForm, {
        "driver_name_c": driverData.text,
        "driver_id": driverData.id,
        "driver_mobile": driverData.mobile,
        "carrier_id": driverData.carrier_id,
        "carrier_name": driverData.carrier_name,
        "outer": driverData.outer
    });
}

//数据查找
function getDataByField(sourceData, fieldValue, fieldName) {
    if(!sourceData || !fieldValue || !fieldName) return null;

    for(var i = 0, len = sourceData.length; i < len; i++){
        if(sourceData[i][fieldName] == fieldValue){
            return $.extend(true, {}, sourceData[i]);
        }
    }
}

//设置表单字段的值 fields-> {fieldName: fieldValue,...}
function setFieldsValue(form, fields) {
    var ligerM, prefixID = form.options.prefixID || "";

    for(var fieldName in fields){
        ligerM = liger.get(prefixID + fieldName);
        if(ligerM && ligerM.setValue){
            ligerM.setValue(fields[fieldName]);
        }
        else{
            ligerM = $(form.element).find("#" + prefixID + fieldName);
            if(ligerM.length === 1 && ligerM.is("input[type=hidden]")){
                ligerM.val(fields[fieldName]);
            }
        }
    }
}

//刷新
function refresh() {
    LG.ajax({
        url: basePath + "loadBill/" + pk_id,
        // data: {pk_id: pk_id},
        success: function (data, msg) {
            manager.data = data;
            mainForm.setData(data);
            renderOrgs(data);
        },
        error: function (msg) {
        }
    })
}

//渲染数据
manager.init();