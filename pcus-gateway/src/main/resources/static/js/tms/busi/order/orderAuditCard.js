var basePath = rootPath + '/tms/busi/orderAudit/';
var $mainForm = $("#mainForm");
var manager = {

    mainForm: null,
    //缓存数据
    data: data_order,
    //界面修改标记
    changed: false,

    backConfirm: false,//用于返回，返回和关闭页签只触发一次事件

    tabid: top.tab.getSelectedTabItemID(),

    init: function () {
        var g = this;
        g.setData(g.data);
    },
    isChanged: function () {
        var g = this;
        var changes = g.getChanges();
        return !$.isEmptyObject(changes);
    },
    getChanges: function () {
        var g = this,
            orignData = g.data,
            newData = getFormData(),
            changes = {};

        for (var o in orignData) {
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
    //提示界面数据已被修改
    confirmChanged: function () {
        var g = this;
        if (g.isChanged()) {
            return confirm("您有尚未保存的表单，确认离开？");
        }
        return true;
    },

    setData: function (data) {

        var g = this;
        g.data = data;
        g.mainForm.setData(data);

        // setCityData($unload_citypicker, {
        //     province: data.unload_province,
        //     city: data.unload_city,
        //     district: data.unload_area
        // });
        //
        // setCityData($load_citypicker, {
        //     province: data.load_province,
        //     city: data.load_city,
        //     district: data.load_area
        // });
    }
};

//获取计量单位列表
var data_cargo_unit = priceBaseUtil.processCargoUnit(remap_price_base);

/**
 * 初始化单据模板
 */
var defaultFieldWidth = (function getInputWidth(lw, sw) {
    var w, n;
    var clientWidth = document.documentElement.clientWidth,
        diff = 104;
    if(clientWidth > 1366){
        clientWidth = clientWidth * 0.8;
    }
    else{
        clientWidth = clientWidth * 0.75;
    }
    if(clientWidth > 1366){
        n = 4;
    }
    else if(clientWidth > 1000){
        n = 3;
    }
    else{
        n = 2;
    }
    w =  Math.floor((clientWidth - ((lw + sw)  * n + diff)) * (Math.floor(100/n ))/100);//截取小数点后两位（向下取整）

    var o = {
        lw: lw,
        sw: sw,
        w1: w,
        w2: (w << 1) + lw + sw, //2倍
        w3: (w + lw + sw) * 2 + w,//3倍
        wA: (w + lw + sw) * (n - 1) + w//整行diff)//整行
    };

    if(o.w3 > o.wA) o.w3 = o.wA;

    return o;
})(120,30);
var fields = (function (busi_type) {
    //字段声明
    var mainFormFields = [
        {
            display: '委托客户', group: "基础信息-运单",
            name: 'client_name',

            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "client_name_c",
            options: {
                data: data_clients,
                // cancelable: true,
                // autocomplete: true,
                // keySupport: true,
                isTextBoxMode: true,
                // onSelected: function (newvalue, newText, rowData) {
                //     var dataLinkmans = $.grep(data_clientLinkmans, function (n, i) {
                //         return data_clientLinkmans[i].pname === newText;
                //     });
                //     liger.get("linkman_c").setData(dataLinkmans, true);
                // },
                // onClear: function () {
                //     liger.get("linkman_c").clear();
                //     liger.get("linkman_c").setData([], true);
                //     liger.get('linkman_mobile').setValue("");
                // }
                readonly: true
            }
            // validate: {
            //     required: true
            // }
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
            display: '揽货公司',
            name: 'supplier_name',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "supplier_name_c",
            options: {
                data: data_suppliers,
                // cancelable: true,
                // autocomplete: true,
                // keySupport: true,
                isTextBoxMode: true,
                readonly: true
            },
            // validate: {
            //     required: true
            // }
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
            display: '运输单号',
            name: 'bill_no',

            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        },
        {
            display: '主副单/柜',
            name: 'bill_main',

            newline: false,
            type: 'select',
            editor: {
                data: BILL_CONST.DATA_BILL_MAIN
            },
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
            display: '客户委托号',
            name: 'client_bill_no',

            newline: false,
            type: 'text',
        },
        {
            display: '结算日期',
            name: 'settle_date',

            newline: false,
            type: 'date',
        },
        {
            display: '客户联系人',
            name: 'linkman',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "linkman_c",
            options: {
                data: [],
                // cancelable: true,
                // autocomplete: true,
                isTextBoxMode: true,
                // onSelected: function (newvalue) {
                //     var g = this;
                //     var selectedData = $.grep(data_clientLinkmans, function (n, i) {
                //         return data_clientLinkmans[i].id === newvalue;
                //     })[0];
                //
                //     liger.get('linkman_mobile').setValue(!selectedData ? '' : selectedData.mobile);
                // }
            }
        },
        {
            display: '客户联系电话',
            name: 'linkman_mobile',

            newline: false,
            type: 'text'
        },
        {
            display: '操作单位',
            name: 'oper_unit',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "oper_unit_c",
            options: {
                data: data_dict[DICT_CODE.oper_unit],
                cancelable: true,
                readonly: true
            },
            validate: {
                // required: true
                // readonly: true
            }
        },
        {
            display: '负责人',
            name: 'manager',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "manager_c",
            options: {
                data: [],
                // cancelable: true,
                // autocomplete: true,
                isTextBoxMode: true
            }
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
                // cancelable: true,
            },
            validate: {}
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
            width: defaultFieldWidth.w2, newline: true, type: 'text'
        },
        {
            display: '特殊备注', name: 'remark',
            width: defaultFieldWidth.w1, newline: false, type: 'text'
        },
        /**************************************************************************
         * 散货计划数量
         **************************************************************************/
        {
            display: '预定数量', group: "计划",
            name: 'booking_qty',

            newline: true,
            cssClass: "field",
            type: "int",
            validate: {
                required: true,
                range: [1, 999]
            }
        },
        {
            display: '预定车型',
            name: 'booking_car_type',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "booking_car_type_c",
            options: {
                data: data_dict[DICT_CODE.car_type],
                cancelable: true,
            },
            validate: {
                required: true
            }
        },
        /**************************************************************************
         * 装货单位
         **************************************************************************/
        {
            display: '装货单位', group: "装货单位信息",
            name: 'load_org',

            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "load_org_c",
            options: {
                readonly: true,
                data: data_loadOrg,
                // cancelable: true,
                // autocomplete: true,
                // keySupport: true,
                isTextBoxMode: true,
                // onSelected: function (newvalue) {
                //     var s = $.grep(data_loadOrg, function (n, i) {
                //         return data_loadOrg[i].id === newvalue;
                //     })[0];
                //
                //     //联动
                //     liger.get('load_linkman').setValue(!s ? '' : s.link_man);
                //     liger.get('load_mobile').setValue(!s ? '' : s.mobile);
                //     liger.get('load_address').setValue(!s ? '' : s.address);
                //
                //     setCityData($("input[name=load_pca]"), {
                //         province: !s ? '' : s.province,
                //         city: !s ? '' : s.city,
                //         district: !s ? '' : s.area
                //     });
                //
                // },
                // onClear: function () {
                //     liger.get('load_linkman').setValue('');
                //     liger.get('load_mobile').setValue('');
                //     liger.get('load_address').setValue('');
                //     setCityData($mainForm.find("input[name=load_pca]"), {
                //         province: '',
                //         city: '',
                //         district: ''
                //     })
                // }
            }
        },
        // {
        //     display: '所属区域',
        //     name: 'load_pca',
        //     width: defaultFieldWidth.w1,
        //     newline: false,
        //     cssClass: "field",
        //     type: "text",
        //     options: {
        //         readonly: true,
        //     }
        // },
        {
            display: '所属区域',
            name: 'load_province',
            // labelWidth: 10,
            space: 0,
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
        },
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
        {
            display: '',
            name: 'load_city',
            labelWidth: 10,
            space: 0,
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
        },
        {
            display: '',
            name: 'load_area',
            labelWidth: 10,
            space: 0,
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
        },
        {
            display: '详细地址',
            name: 'load_address',
            width: defaultFieldWidth.w1,
            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
            // validate: {
            //     required: true
            // }
        },
        {
            display: '联系人',
            name: 'load_linkman',

            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '联系电话',
            name: 'load_mobile',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
        {
            display: '预约装货时间',
            name: 'load_work_time',

            newline: false,
            cssClass: "field",
            type: "date",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        },
        {
            display: '甩挂点',
            name: 'load_drop_trailer',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                readonly: true,
                disabled: true
            }

        },
        {
            display: '操作注意事项',
            name: 'load_oper_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        },
        {
            display: '调度注意事项',
            name: 'load_dispatch_note',
            width: defaultFieldWidth.w2,
            newline: false,
            cssClass: "field",
            type: "text"
        },
        {
            display: '司机注意事项',
            name: 'load_driver_note',
            width: defaultFieldWidth.w2,
            newline: false,
            cssClass: "field",
            type: "text"
        },
        /**************************************************************************
         * 卸货单位
         **************************************************************************/
        {
            display: '卸货单位', group: "卸货单位信息",
            name: 'unload_org',

            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "unload_org_c",
            options: {
                readonly: true,
                data: data_loadOrg,
                // cancelable: true,
                // autocomplete: true,
                // keySupport: true,
                isTextBoxMode: true,
                // onSelected: function (newvalue) {
                //     var s = $.grep(data_loadOrg, function (n, i) {
                //         return data_loadOrg[i].id === newvalue;
                //     })[0];
                //
                //     //联动
                //     liger.get('unload_linkman').setValue(!s ? '' : s.link_man);
                //     liger.get('unload_mobile').setValue(!s ? '' : s.mobile);
                //     liger.get('unload_address').setValue(!s ? '' : s.address);
                //
                //     setCityData($("input[name=unload_pca]"), {
                //         province: !s ? '' : s.province,
                //         city: !s ? '' : s.city,
                //         district: !s ? '' : s.area
                //     });
                //
                // },
                // onClear: function () {
                //     liger.get('unload_linkman').setValue('');
                //     liger.get('unload_mobile').setValue('');
                //     liger.get('unload_address').setValue('');
                // }
            }
        },
        // {
        //     display: '所属区域',
        //     name: 'unload_pca',
        //     width: defaultFieldWidth.w1,
        //     newline: false,
        //     cssClass: "field",
        //     type: "text",
        //     options: {
        //         readonly: true,
        //     }
        // },
        {
            display: '所属区域',
            name: 'unload_province',
            // labelWidth: 10,
            space: 0,
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
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
        {
            display: '',
            name: 'unload_city',
            labelWidth: 10,
            space: 0,
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
        },
        {
            display: '',
            name: 'unload_area',
            labelWidth: 10,
            space: 0,
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
        },
        {
            display: '详细地址',
            name: 'unload_address',
            width: defaultFieldWidth.w1,
            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
            // validate: {
            //     required: true
            // }
        },
        {
            display: '联系人',
            name: 'unload_linkman',

            newline: true,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
        },
        {
            display: '联系电话',
            name: 'unload_mobile',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true,
            }
        },
        {
            display: '预约卸货时间',
            name: 'unload_work_time',

            newline: false,
            cssClass: "field",
            type: "date",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            },
            options: {
                readonly: true,
            }
        },
        {
            display: '甩挂点',
            name: 'unload_drop_trailer',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                readonly: true,
            }
        },
        {
            display: '操作注意事项',
            name: 'unload_oper_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        },
        {
            display: '调度注意事项',
            name: 'unload_dispatch_note',
            width: defaultFieldWidth.w2,
            newline: false,
            cssClass: "field",
            type: "text"
        },
        {
            display: '司机注意事项',
            name: 'unload_driver_note',
            width: defaultFieldWidth.w2,
            newline: false,
            cssClass: "field",
            type: "text"
        },
        /**************************************************************************
         * 散货信息
         **************************************************************************/
        {
            display: '货物信息', group: '货物概况',
            name: 'cargo_info',

            newline: false,
            cssClass: "field",
            type: "text"
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
                cancelable: true
            }
        },
        {
            display: '货物数量',
            name: 'cargo_qty',

            newline: false,
            cssClass: "field",
            type: "text",
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
                data: data_cargo_unit,
                cancelable: true,
                isTextBoxMode: true
            },
        },
        /**************************************************************************
         * 集装箱信息
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
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true
                // cancelable: true,
            },
            validate: {
                required: true
            }
        },
        {
            display: '主柜号',
            name: 'cntr_no',

            newline: false,
            cssClass: "field",
            type: "text",
            validate: {
                containerCode: true,
                required: true
            }
        },
        {
            display: '封条号',
            name: 'cntr_seal_no',

            newline: false,
            cssClass: "field",
            type: "text",
            validate: {}
        },
        {
            display: '柜重',
            name: 'cntr_weight',

            newline: false,
            cssClass: "field",
            type: "text",
            validate: {
                range: [0, 999999],
                required: true
            }
        },
        {
            display: '甩挂',
            name: 'cntr_drop_trailer',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                readonly: true,
                disabled: true
            }
        },
        {
            display: '孖柜',
            name: 'cntr_twin',

            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                readonly: true,
                disabled: true
            }
        },
        {
            display: '孖拖柜号',
            name: 'cntr_twin_no',

            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
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
            type: "select",
            comboboxName: "gate_out_dock_c",
            options: {
                readonly: true,
                data: data_loadOrg,
                // cancelable: true,
                // autocomplete: true,
                // keySupport: true,
                isTextBoxMode: true,
                // onSelected: function (newvalue) {
                //     var s = $.grep(data_loadOrg, function (n, i) {
                //         return data_loadOrg[i].id === newvalue;
                //     })[0];
                //
                //     //联动
                //     liger.get('gate_out_yard').setValue(!s ? '' : s.address);
                // },
                // onClear: function () {
                //     liger.get('gate_out_yard').setValue('');
                // }
            },
            validate: {
                required: true
            }
        },
        {
            display: '提柜详细地址',
            name: 'gate_out_yard',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
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
        {
            display: '还柜地',
            name: 'gate_in_dock',

            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "gate_in_dock_c",
            options: {
                readonly: true,
                data: data_loadOrg,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true
                // cancelable: true,
                // autocomplete: true,
                // keySupport: true,
                // onSelected: function (newvalue) {
                //     var s = $.grep(data_loadOrg, function (n, i) {
                //         return data_loadOrg[i].id === newvalue;
                //     })[0];
                //
                //     //联动
                //     liger.get('gate_in_yard').setValue(!s ? '' : s.address);
                // },
                // onClear: function () {
                //     liger.get('gate_in_yard').setValue('');
                // }
            },
            validate: {
                required: true,
            }
        },
        {
            display: '还柜详细地址',
            name: 'gate_in_yard',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {
                readonly: true
            }
        },
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
        {
            display: '船公司', group: "船信息",
            name: 'ship_corp',

            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "ship_corp_c",
            options: {
                data: [],
                cancelable: true,
                isTextBoxMode: true
            },
            validate: {
                // required: true
            }
        },
        {
            display: '订舱号',
            name: 'booking_no',

            newline: false,
            cssClass: "field",
            type: "text",
        },
        {
            display: '船名',
            name: 'ship_name',

            newline: false,
            cssClass: "field",
            type: "text",
        },
        {
            display: '航次',
            name: 'voyage',

            newline: false,
            cssClass: "field",
            type: "text",
        },
        {
            display: '码头',
            name: 'dock',

            newline: false,
            cssClass: "field",
            type: "text",
        },
        {
            display: '船代',
            name: 'agency',

            newline: false,
            cssClass: "field",
            type: "text",
        },
        {
            display: '到港日期',
            name: 'arrival_date',

            newline: false,
            cssClass: "field",
            type: "date",
        },
        {
            display: '预约装卸时间',
            name: 'cntr_work_time',

            newline: false,
            cssClass: "field",
            type: "date",
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
        },
        {
            display: '要求制单日期',
            name: 'bill_time',

            newline: false,
            cssClass: "field",
            type: "date"
        },
        {
            display: '报关方式', group: "关务信息",
            name: 'declare_type',

            newline: false,
            type: 'text'
        },
        {
            display: '封关地',
            name: 'close_customs',

            newline: false,
            type: 'text'
        },
        {
            display: '报关行',
            name: 'customs_broker',

            newline: false,
            type: 'text',
        },

        {
            display: '联系人',
            name: 'broker_linkman',

            newline: false,
            type: 'text',
        },
        {
            display: '联系方式',
            name: 'broker_mobile',

            newline: false,
            type: 'text',
        },
        {
            display: '报关行地址',
            name: 'broker_address',
            width: defaultFieldWidth.w3,
            newline: true,
            type: 'text'
        },
        {
            display: '审核人', group: "审计信息",
            name: 'audit_psn',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        {
            display: '审核时间',
            name: 'audit_time',

            newline: false,
            type: 'text',
            options: {readonly: true}
        },
        // {
        //     display: '创建人', name: 'create_psn',
        //     width: 170,
        //     space: 30, newline: true, type: 'text', options: {readonly: true}
        // },
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
        //     newline: false,
        //     type: 'text', options: {readonly: true}
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
            oper_unit: '操作单位',
            state_name: '单据状态',
            bill_no: '运输单号',
            urgen_order_type: '急单类型',
            linkman: '客户联系人',
            linkman_mobile: '客户联系电话',
            client_bill_no: '客户委托号',
            manager: '负责人',
            settle_date: '结算日期',
            bill_main: '主副单/柜',
            main_bill_no: '拼单单号',
            take_goods: '带货',
            // trans_require: '特殊运输要求',
            remark: '特殊备注'
        },

        gorup_base_cargo: {
            client_name: '委托客户',
            bs_type_name: '业务类型',
            supplier_name: '揽货公司',
            oper_unit: '操作单位',
            state_name: '单据状态',
            bill_no: '运输单号',
            urgen_order_type: '急单类型',
            linkman: '客户联系人',
            linkman_mobile: '客户联系电话',
            client_bill_no: '客户委托号',
            manager: '负责人',
            settle_date: '结算日期',
            take_goods: '带货',
            trans_require: '特殊运输要求',
            remark: '特殊备注'
        },

        group_load: {
            load_org: '装货单位',
            // load_pca: '所属区域',
            load_province: '所属区域',
            load_city: '所属区域',
            load_area: '所属区域',
            load_address: '详细地址',
            load_region: '装报价区域',
            load_linkman: '联系人',
            load_mobile: '联系电话',
            load_work_time: '预约装货时间',
            load_drop_trailer: '甩挂点'
        },

        //去掉甩挂点
        group_load_cargo: {
            load_org: '装货单位',
            // load_pca: '所属区域',
            load_province: '所属区域',
            load_city: '所属区域',
            load_area: '所属区域',
            load_address: '详细地址',
            load_region: '装货报价区域',
            load_linkman: '联系人',
            load_mobile: '联系电话',
            load_work_time: '预约装货时间'
        },

        group_plan: {
            booking_qty: '预定数量',
            booking_car_type: '预定车型'
        },

        group_unload: {
            unload_org: '卸货单位',
            // unload_pca: '所属区域',
            unload_province: '所属区域',
            unload_city: '所属区域',
            unload_area: '所属区域',
            unload_address: '详细地址',
            unload_region: '卸货报价区域',
            unload_linkman: '联系人',
            unload_mobile: '联系电话',
            unload_work_time: '预约卸货时间',
            unload_drop_trailer: '甩挂点'
        },

        //去掉甩挂点
        group_unload_cargo: {
            unload_org: '卸货单位',
            unload_pca: '所属区域',
            unload_province: '所属区域',
            unload_city: '所属区域',
            unload_area: '所属区域',
            unload_address: '详细地址',
            unload_region: '卸货报价区域',
            unload_linkman: '联系人',
            unload_mobile: '联系电话',
            unload_work_time: '预约卸货时间'
        },

        group_cargo: {
            cargo_info: '货物信息',
            cargo_type: '货物类型',
            cargo_qty: '货物数量',
            cargo_unit: '单位'
        },

        group_cntr: {
            cntr_type: '柜信息',
            cntr_no: '主柜号',
            cntr_seal_no: '封条号',
            cntr_weight: '封条号',
            cntr_drop_trailer: '甩挂',
            cntr_twin: '孖柜',
            cntr_twin_no: '孖拖柜号',
            gate_out_dock: '提柜地',
            gate_out_yard: '提柜详细地址',
            gate_out_region: '提柜报价区域',
            gate_in_dock: '还柜地',
            gate_in_yard: '还柜详细地址',
            gate_in_region: '还柜报价区域'
        },

        group_ship: {
            ship_corp: '柜信息',
            booking_no: '订舱号',
            ship_name: '船名',
            voyage: '航次',
            dock: '码头',
            agency: '船代',
            arrival_date: '到港日期',
            cntr_work_time: '预约装卸时间',
            bill_org: '制单公司',
            bill_time: '要求制单日期'
        },

        group_custom: {
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

    //单据模板
    var MAIN_FORM_TEMPLATE = {

        //疏港进口
        TYPE_ORDER_CNTR_IMPORT: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_unload,
            MAIN_FORM_GROUP.group_cntr,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom
        ],

        //集港出口
        TYPE_ORDER_CNTR_EXPORT: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_load,
            MAIN_FORM_GROUP.group_cntr,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom
        ],

        //散货整车
        TYPE_ORDER_CARGO: [
            MAIN_FORM_GROUP.gorup_base_cargo,
            MAIN_FORM_GROUP.group_cargo,
            MAIN_FORM_GROUP.group_load_cargo,
            MAIN_FORM_GROUP.group_unload_cargo,
            MAIN_FORM_GROUP.group_custom
        ],

        //配送运输
        TYPE_ORDER_DISTR: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_load_cargo,
            MAIN_FORM_GROUP.group_unload_cargo
        ]
    };

    var fields = [],
        fieldsMapping = {};
    //缓存
    $.each(mainFormFields, function (i, v) {
        fieldsMapping[v.name] = v;
    });

    //遍历模板
    $.each(MAIN_FORM_TEMPLATE[busi_type], function (i, v) {

        //遍历group，添加字段
        $.each(v, function (name, value) {
            //name: value
            //broker_address: '报关行地址',
            var fieldOption = fieldsMapping[name];
            if (fieldOption) {

                if ('booking_no' === name) {
                    if (busi_type === TMS_BUSI_TYPE.TYPE_ORDER_CNTR_IMPORT) {
                        //进口业务
                        fieldOption.display = '提单号';
                    } else if (busi_type === TMS_BUSI_TYPE.TYPE_ORDER_CNTR_EXPORT) {
                        //出口业务
                        fieldOption.display = '订舱号';
                    }
                }

                fields.push(fieldOption);
            }
        });
    });
    return fields;

})(data_order.bs_type_code);

var mainForm = manager.mainForm = $mainForm.ligerForm({
    inputWidth: defaultFieldWidth.w1,
    labelWidth: defaultFieldWidth.lw,
    space: defaultFieldWidth.sw,
    labelAlign: "right",
    fields: fields, //加载不同的单据类型
    validate: true,
    toJSON: JSON2.stringify
});

// var $unload_citypicker = $mainForm.find("input[name=unload_pca]");
// var $unload_citypicker_parent = $unload_citypicker.parent();
// var $load_citypicker = $mainForm.find("input[name=load_pca]");
// var $load_citypicker_parent = $load_citypicker.parent();
// (function () {
//     //初始化扩展的控件
//     $mainForm.find('input[name="unload_address"]').autocomplete({
//         source: function (request, response) {
//             $.ajax({
//                 url: "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="unload_address"]').val())
//                 + "&region=" + encodeURIComponent($unload_citypicker_parent.find('span[data-count=city]').text()),
//                 dataType: "json",
//                 type: "POST",
//                 contentType: "application/json; charset=utf-8",
//                 dataFilter: function (data) {
//                     return data;
//                 },
//                 success: function (data) {
//                     response($.map(data.data, function (item) {
//
//                         return {
//                             label: item.address,
//                             value: item.address,
//                             province: item.province,
//                             city: item.city,
//                             area: item.district
//                         }
//                     }))
//                 },
//                 error: function (XMLHttpRequest, textStatus, errorThrown) {
//                     alert(errorThrown);
//                 },
//
//             });
//         },
//         select: function (event, ui) {
//             // 判断是否为空
//             // if ($('span[data-count=province]').text().length == 0) {
//             setCityData($unload_citypicker, {
//                 province: ui.item.province,
//                 city: ui.item.city,
//                 district: ui.item.area
//             });
//         }
//     });
//
//
//     //初始化扩展的控件
//     $mainForm.find('input[name="load_address"]').autocomplete({
//         source: function (request, response) {
//             $.ajax({
//                 url: "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="load_address"]').val())
//                 + "&region=" + encodeURIComponent($load_citypicker_parent.find('span[data-count=city]').text()),
//                 dataType: "json",
//                 type: "POST",
//                 contentType: "application/json; charset=utf-8",
//                 dataFilter: function (data) {
//                     return data;
//                 },
//                 success: function (data) {
//                     response($.map(data.data, function (item) {
//
//                         return {
//                             label: item.address,
//                             value: item.address,
//                             province: item.province,
//                             city: item.city,
//                             area: item.district
//                         }
//                     }))
//                 },
//                 error: function (XMLHttpRequest, textStatus, errorThrown) {
//                     alert(errorThrown);
//                 },
//
//             });
//         },
//         select: function (event, ui) {
//             // 判断是否为空
//             // if ($('span[data-count=province]').text().length == 0) {
//             setCityData($load_citypicker, {
//                 province: ui.item.province,
//                 city: ui.item.city,
//                 district: ui.item.area
//             });
//         }
//     });
//
//
//     //初始化城市选择
//     $unload_citypicker.citypicker();
//     $load_citypicker.citypicker();
//
// })()

// function setCityData($dom, data) {
//     $dom.citypicker('reset');
//     $dom.citypicker('destroy');
//     $dom.citypicker(data);
//
// }

//刷新
function refresh() {
    manager.confirmChanged();
    LG.ajax({
        url: basePath + "loadOrder/" + pk_id,
        success: function (data, msg) {
            manager.setData(data);
            LG.tip("刷新成功");
        },
        error: function (msg) {
            LG.showError("刷新失败:" + msg);
        }
    });
}

//保存数据
function save() {
    //提交数据
    if (mainForm.valid()) {

        var columnname = Object.keys(manager.getChanges()).join(',');

        var postData = {
            baseOrder: $.extend({}, data_order, getFormData(), {columnname: columnname}),
            baseTrans: data_trans,
        };

        LG.ajax({
            url: basePath + "updateAuditDist?trans_id=" + trans_id,
            data: JSON2.stringify(postData, DateUtil.datetimeReplacer),
            contentType: 'application/json',
            dataType: "json",
            success: function (data, msg) {
                manager.setData(data);
                LG.tip('回单成功!');
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    } else {
        LG.tip("字段值非法");
    }
}

function getFormData() {
    //省市区数据
    var pcaData = {};
    //     unload_province: $unload_citypicker_parent.find("span[data-count=province]").text(),
    //     unload_city: $unload_citypicker_parent.find("span[data-count=city]").text(),
    //     unload_area: $unload_citypicker_parent.find("span[data-count=district]").text(),
    //     load_province: $load_citypicker_parent.find("span[data-count=province]").text(),
    //     load_city: $load_citypicker_parent.find("span[data-count=city]").text(),
    //     load_area: $load_citypicker_parent.find("span[data-count=district]").text()
    // };

    var mainData = mainForm.getData();

    //获取客户和揽货公司主键
    var clients = $.grep(data_clients, function (n, i) {
        return data_clients[i].text == mainData.client_name;
    });
    var suppliers = $.grep(data_suppliers, function (n, i) {
        return data_suppliers[i].text == mainData.supplier_name;
    });
    var idset = {
        client_id: clients.length > 0 ? clients[0].id : '',
        supplier_id: suppliers.length > 0 ? suppliers[0].id : ''
    };

    var formData = $.extend({}, manager.data, mainData, pcaData, idset);

    return formData;
}
//关闭主页页签
$(window).on("beforeunload",function () {
    if (manager.isChanged()) {
        return "运单[" + data_order.bill_no + "]的" + this.getChangeName() + "数据已被修改，确认离开？";
    }
});
$('body').on("beforeRemoveTab",function () {
    return manager.confirmChanged();
});

//渲染数据
manager.init();
