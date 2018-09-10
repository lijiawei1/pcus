//下拉框相对定位
$.ligerDefaults.ComboBox.absolute = false;

var basePath = rootPath + '/tms/busi/order/';
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
    isChanged: function() {
        var g = this;
        var changes = g.getChanges();
        return Object.keys(changes).length > 0;
    },
    getChanges: function () {
        var g = this,
            orignData = g.data,
            newData = getFormData(),
            changes = {};

        for(var o in orignData){
            var newo = newData[o],
                origno = orignData[o];

            if(newo instanceof Date){
                newo = DateUtil.dateToStr(null, newo);
                if(origno && origno.length <= 10) origno += " 00:00:00";
            }

            if(typeof newo === "number") newo += "";
            if(typeof origno === "number") origno += "";

            if(!(newo && origno && newo == origno) && (newo || origno)){
                changes[o] = newo;
            }
        }

        return changes;
    },
    //提示界面数据已被修改
    confirmChanged: function() {
        if (this.isChanged()) {
            return confirm("运单[" + data_order.bill_no + "]的" + this.getChangeName() + "数据已被修改，确认离开？");
        }
        return true;
    },
    getChangeName: function () {
        var keys = [];
        var ruslt = [];
        for (var i in this.getChanges()) {
            keys.push(i);
        }
        for (var i = fields.length - 1; i >= 0; i--) {
            var item = fields[i];
            if (keys.indexOf(item.name) > -1) {
                ruslt.push(item.display);
            }
        }
        return ruslt.join(' , ');
    },

    setData: function(data) {
        var g = this;
        g.data = data;
        g.mainForm.setData(data);

        setCityData($unload_citypicker, {
            province: data.unload_province,
            city: data.unload_city,
            district: data.unload_area
        });

        setCityData($load_citypicker, {
            province: data.load_province,
            city: data.load_city,
            district: data.load_area
        });
    }
};
//获取计量单位列表
var data_cargo_unit = priceBaseUtil.processCargoUnit(remap_price_base);

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
})(89,120,30);

// 初始化单据模板
var fields = (function(busi_type) {
    //字段声明
    var mainFormFields = [
        {
            display: '委托客户',
            group: "基础信息",
            name: 'client_name',
            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "client_name_c",
            options: {
                data: data_clients,
                isTextBoxMode: true,
                onSelected: function(newvalue, newText, rowData) {
                    var dataLinkmans = $.grep(data_clientLinkmans, function(n, i) {
                        return data_clientLinkmans[i].pname === newText;
                    });
                    liger.get("linkman_c").setData(dataLinkmans, true);
                },
                readonly: true,
                render: function(value, text) {
                    !data_order.client_id && LG.specialField($(liger.get('client_name_c').element).parent(), 'alert');
                    return text;
                }
            }
        }, {
            display: '业务类型',
            name: 'bs_type_name',
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        }, {
            display: '揽货公司',
            name: 'supplier_name',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "supplier_name_c",
            options: {
                data: data_suppliers,
                isTextBoxMode: true,
                readonly: true
            }
        }, {
            display: '单据状态',
            name: 'state_name',
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        }, {
            display: '运输单号',
            name: 'bill_no',
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        }, {
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
        }, {
            display: '拼单单号',
            name: 'main_bill_no',
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        }, {
            display: '客户委托号',
            name: 'client_bill_no',
            newline: false,
            type: 'text'
        }, {
            display: '结算日期',
            name: 'settle_date',
            newline: false,
            type: 'date',
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        }, {
            display: '客户联系人',
            name: 'linkman',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "linkman_c",
            options: {
                data: [],
                cancelable: true,
                autocomplete: true,
                isTextBoxMode: true,
                onSelected: function(newvalue) {
                    var g = this;
                    var selectedData = $.grep(data_clientLinkmans, function(n, i) {
                        return data_clientLinkmans[i].id === newvalue;
                    })[0];
                    liger.get('linkman_mobile').setValue(!selectedData ? '' : selectedData.mobile);
                }
            }
        }, {
            display: '客户联系电话',
            name: 'linkman_mobile',
            newline: false,
            type: 'text'
        }, {
            display: '操作单位',
            name: 'oper_unit',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "oper_unit_c",
            options: {
                data: data_dict[DICT_CODE.oper_unit],
                cancelable: true
            },
            validate: {
                required: true
            }
        }, {
            display: '负责人',
            name: 'manager',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "manager_c",
            options: {
                data: [],
                cancelable: true,
                autocomplete: true,
                isTextBoxMode: true
            }
        }, {
            display: '自定义业务',
            name: 'client_busi',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "client_busi_c",
            options: {
                data: data_dict[DICT_CODE.client_busi],
                cancelable: true
            },
            validate: {}
        }, {
            display: '急单类型',
            name: 'urgen_order_type',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "urgen_order_type_c",
            options: {
                data: data_dict[DICT_CODE.urgent_order],
                cancelable: true,
            },
            validate: {}
        }, {
            display: '带货',
            name: 'take_goods',
            newline: false,
            cssClass: "field",
            type: "checkbox",
        }, {
            display: '特殊运输要求',
            name: 'trans_require',
            width: defaultFieldWidth.w2,
            newline: true,
            type: 'text'
        }, {
            display: '特殊备注',
            name: 'remark',
            width: defaultFieldWidth.w2,
            newline: false,
            type: 'text'
        },
        /**************************************************************************
         * 散货计划数量
         **************************************************************************/
        {
            display: '用车数量',
            group: "派车计划",
            name: 'booking_qty',
            newline: true,
            cssClass: "field",
            type: "int",
            validate: {
                required: true,
                range: [1, 99999]
            }
        }, {
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
            display: '预约装货时间',
            group: "装货单位信息",
            name: 'load_work_time',
            newline: false,
            cssClass: "field",
            type: "date",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        }, {
            display: '装货单位',
            name: 'load_org',
            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "load_org_c",
            options: {
                data: data_loadOrg,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function (value, text) {
                    var result = data_loadOrg.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                },
                onSelected: function(value) {
                    var s = data_loadOrg.filter(function(item) {
                        return item.id === value || item.text === value;
                    })[0];
                    //联动
                    liger.get('load_linkman').setValue(!s ? '' : (s.link_man || ''));
                    liger.get('load_mobile').setValue(!s ? '' : (s.mobile || ''));
                    liger.get('load_address').setValue(!s ? '' : (s.address || ''));
                    liger.get('load_region').setValue(!s ? '' : (s.region || ''));
                    setCityData($("input[name=load_pca]"), {
                        province: !s ? '' : s.province,
                        city: !s ? '' : s.city,
                        district: !s ? '' : s.area
                    });
                },
                onClear: function() {
                    liger.get('load_linkman').setValue('');
                    liger.get('load_mobile').setValue('');
                    liger.get('load_address').setValue('');
                    liger.get('load_region').setValue('');
                    setCityData($mainForm.find("input[name=load_pca]"), {
                        province: '',
                        city: '',
                        district: ''
                    })
                }
            }
        }, {
            display: '所属区域',
            name: 'load_pca',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {}
        }, {
            display: '装货报价区域',
            name: 'load_region',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "select",
            options: {
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        }, {
            display: '详细地址',
            name: 'load_address',
            width: defaultFieldWidth.w3,
            newline: true,
            cssClass: "field",
            type: "text",
            validate: {
                required: true
            }
        }, {
            display: '联系人',
            name: 'load_linkman',
            newline: true,
            cssClass: "field",
            type: "text"
        }, {
            display: '联系电话',
            name: 'load_mobile',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '甩挂点',
            name: 'load_drop_trailer',
            newline: false,
            cssClass: "field",
            type: "checkbox"
        }, {
            display: '操作注意事项',
            name: 'load_oper_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        }, {
            display: '调度注意事项',
            name: 'load_dispatch_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        }, {
            display: '司机注意事项',
            name: 'load_driver_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        },
        /**************************************************************************
         * 卸货单位
         **************************************************************************/
        {
            display: '预约卸货时间',
            group: "卸货单位信息",
            name: 'unload_work_time',
            newline: false,
            cssClass: "field",
            type: "date",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        }, {
            display: '卸货单位',
            name: 'unload_org',
            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "unload_org_c",
            options: {
                data: data_loadOrg,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function (value, text) {
                    var result = data_loadOrg.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    if (result.length >= 1) {
                        LG.clearspecial($(this.wrapper));
                    }
                    else {
                        LG.specialField($(this.wrapper), 'alert', '未录入');
                    }
                    return true;
                },
                onSelected: function(value) {
                    var s = data_loadOrg.filter(function(item) {
                        return item.id === value || item.text === value;
                    })[0];
                    //联动
                    liger.get('unload_linkman') && liger.get('unload_linkman').setValue(!s ? '' : (s.link_man || ''));
                    liger.get('unload_mobile') && liger.get('unload_mobile').setValue(!s ? '' : (s.mobile || ''));
                    liger.get('unload_address') && liger.get('unload_address').setValue(!s ? '' : (s.address || ''));
                    liger.get('unload_region') && liger.get('unload_region').setValue(!s ? '' : (s.region || ''));

                    setCityData($("input[name=unload_pca]"), {
                        province: !s ? '' : s.province,
                        city: !s ? '' : s.city,
                        district: !s ? '' : s.area
                    });
                },
                onClear: function() {
                    liger.get('unload_linkman').setValue('');
                    liger.get('unload_mobile').setValue('');
                    liger.get('unload_address').setValue('');
                    liger.get('unload_region').setValue('');
                }
            }
        }, {
            display: '所属区域',
            name: 'unload_pca',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "text",
            options: {}
        }, {
            display: '卸货报价区域',
            name: 'unload_region',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "select",
            options: {
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        }, {
            display: '详细地址',
            name: 'unload_address',
            width: defaultFieldWidth.w3,
            newline: true,
            cssClass: "field",
            type: "text",
            validate: {
                required: true
            }
        }, {
            display: '联系人',
            name: 'unload_linkman',
            newline: true,
            cssClass: "field",
            type: "text"
        }, {
            display: '联系电话',
            name: 'unload_mobile',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '甩挂点',
            name: 'unload_drop_trailer',
            newline: false,
            cssClass: "field",
            type: "checkbox"
        }, {
            display: '操作注意事项',
            name: 'unload_oper_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        }, {
            display: '调度注意事项',
            name: 'unload_dispatch_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        }, {
            display: '司机注意事项',
            name: 'unload_driver_note',
            width: defaultFieldWidth.w2,
            newline: true,
            cssClass: "field",
            type: "text"
        },
        /**************************************************************************
         * 散货信息
         **************************************************************************/
        {
            display: '货物信息',
            group: '货物概况',
            name: 'cargo_info',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
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
        }, {
            display: '货物数量',
            name: 'cargo_qty',
            newline: false,
            cssClass: "field",
            type: "text",
            validate: {
                range: [1, 999999]
            }
        }, {
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
            }
        },
        /**************************************************************************
         * 集装箱信息
         **************************************************************************/
        {
            display: '柜型',
            group: '柜信息',
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
            },
            validate: {}
        }, {
            display: '主柜号',
            name: 'cntr_no',
            newline: false,
            cssClass: "field",
            type: "text",
            validate: {
                containerCode: true
            }
        }, {
            display: '封条号',
            name: 'cntr_seal_no',
            newline: false,
            cssClass: "field",
            type: "text",
            validate: {}
        }, {
            display: '柜重',
            name: 'cntr_weight',
            newline: false,
            cssClass: "field",
            type: "text",
            validate: {
                range: [0, 999999]
            }
        }, {
            display: '甩挂',
            name: 'cntr_drop_trailer',
            newline: false,
            cssClass: "field",
            type: "checkbox"
        }, {
            display: '孖柜',
            name: 'cntr_twin',
            newline: false,
            cssClass: "field",
            type: "checkbox",
            options: {
                readonly: true,
                disabled: true
            }
        }, {
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
                data: data_loadOrg,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function (value, text) {
                    var result = data_loadOrg.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                },
                onSelected: function(value) {
                    var s = data_loadOrg.filter(function(item) {
                        return item.id === value || item.text === value;
                    })[0];
                    //联动
                    if (!s) {
                        liger.get('gate_out_yard').setValue('');
                        liger.get('gate_out_yard').setValue('');
                    } else {
                        liger.get('gate_out_yard').setValue(s.address || '');
                        liger.get('gate_out_region').setValue(s.region || '');
                    }
                },
                onClear: function() {
                    liger.get('gate_out_yard').setValue('');
                    liger.get('gate_out_region').setValue('');
                }
            },
            validate: {
                required: true
            }
        }, {
            display: '提柜详细地址',
            name: 'gate_out_yard',
            width: defaultFieldWidth.w2,
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '提柜报价区域',
            name: 'gate_out_region',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "select",
            options: {
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        }, {
            display: '还柜地',
            name: 'gate_in_dock',
            newline: true,
            cssClass: "field",
            type: "select",
            comboboxName: "gate_in_dock_c",
            options: {
                data: data_loadOrg,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function (value, text) {
                    var result = data_loadOrg.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                },
                onSelected: function(value) {
                    var s = data_loadOrg.filter(function(item) {
                        return item.id === value || item.text === value;
                    })[0];
                    //联动
                    liger.get('gate_in_yard').setValue(!s ? '' : (s.address || ''));
                    liger.get('gate_in_region').setValue(!s ? '' : (s.region || ''));
                },
                onClear: function() {
                    liger.get('gate_in_yard').setValue('');
                    liger.get('gate_in_region').setValue('');
                }
            },
            validate: {
                required: true
            }
        }, {
            display: '还柜详细地址',
            name: 'gate_in_yard',
            width: defaultFieldWidth.w2,
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '还柜报价区域',
            name: 'gate_in_region',
            width: defaultFieldWidth.w1,
            newline: false,
            cssClass: "field",
            type: "select",
            options: {
                data: data_region,
                cancelable: true,
                autocomplete: true,
                keySupport: true,
                isTextBoxMode: true,
                beforeChange: function(value, text) {
                    var result = data_region.filter(function (item, index, array) {
                        return item.text === text;
                    });
                    (result.length >= 1) ? LG.clearspecial($(this.wrapper)) : LG.specialField($(this.wrapper), 'alert', '未录入');
                    return true;
                }
            }
        },
        /**************************************************************************
         * 船业务
         **************************************************************************/
        {
            display: '船公司',
            group: "船信息",
            name: 'ship_corp',
            newline: false,
            cssClass: "field",
            type: "select",
            comboboxName: "ship_corp_c",
            options: {
                data: [],
                cancelable: true,
                isTextBoxMode: true
            }
        }, {
            display: '订舱号',
            name: 'booking_no',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '船名',
            name: 'ship_name',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '航次',
            name: 'voyage',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '码头',
            name: 'dock',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '船代',
            name: 'agency',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '到港日期',
            name: 'arrival_date',
            newline: false,
            cssClass: "field",
            type: "date"
        }, {
            display: '预约提柜时间',
            name: 'cntr_work_time',
            newline: false,
            cssClass: "field",
            type: "date",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        }, {
            display: '制单公司',
            name: 'bill_org',
            newline: false,
            cssClass: "field",
            type: "text"
        }, {
            display: '报关时间',
            group: "关务信息",
            name: 'bill_time',
            newline: false,
            cssClass: "field",
            type: "date",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd hh:mm:ss"
            }
        }, {
            display: '报关方式',
            name: 'declare_type',
            newline: false,
            type: 'text'
        }, {
            display: '封关地',
            name: 'close_customs',
            newline: false,
            type: 'text'
        }, {
            display: '报关行',
            name: 'customs_broker',
            newline: false,
            type: 'text'
        }, {
            display: '联系人',
            name: 'broker_linkman',
            newline: false,
            type: 'text'
        }, {
            display: '联系方式',
            name: 'broker_mobile',
            newline: false,
            type: 'text'
        }, {
            display: '报关行地址',
            name: 'broker_address',
            width: defaultFieldWidth.w3,
            newline: true,
            type: 'text'
        }, {
            display: '审核人',
            group: "审计信息",
            name: 'audit_psn',
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        }, {
            display: '审核时间',
            name: 'audit_time',
            newline: false,
            type: 'text',
            options: {
                readonly: true
            }
        }
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
            client_busi: '自定义业务',
            urgen_order_type: '急单类型',
            linkman: '客户联系人',
            linkman_mobile: '客户联系电话',
            client_bill_no: '客户委托号',
            manager: '负责人',
            settle_date: '结算日期',
            bill_main: '主副单/柜',
            main_bill_no: '拼单单号',
            take_goods: '带货',
            trans_require: '特殊运输要求',
            remark: '特殊备注'
        },
        gorup_base_cargo: {
            client_name: '委托客户',
            bs_type_name: '业务类型',
            supplier_name: '揽货公司',
            oper_unit: '操作单位',
            state_name: '单据状态',
            bill_no: '运输单号',
            client_busi: '自定义业务',
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
            load_work_time: '预约装货时间',
            load_org: '装货单位',
            load_pca: '所属区域',
            load_region: '装货报价区域',
            load_address: '详细地址',
            load_linkman: '联系人',
            load_mobile: '联系电话',
            // load_drop_trailer: '甩挂点',
            load_oper_note: '操作注意事项',
            load_dispatch_note: '调度注意事项',
            load_driver_note: '司机注意事项'
        },
        //去掉甩挂点
        group_load_cargo: {
            load_work_time: '预约装货时间',
            load_org: '装货单位',
            load_pca: '所属区域',
            load_region: '卸货报价区域',
            load_address: '详细地址',
            load_linkman: '联系人',
            load_mobile: '联系电话',
            load_oper_note: '操作注意事项',
            load_dispatch_note: '调度注意事项',
            load_driver_note: '司机注意事项'
        },
        group_plan: {
            booking_qty: '预定数量',
            booking_car_type: '预定车型'
        },
        group_unload: {
            unload_work_time: '预约卸货时间',
            unload_org: '卸货单位',
            unload_pca: '所属区域',
            unload_region: '卸货报价区域',
            unload_address: '详细地址',
            unload_linkman: '联系人',
            unload_mobile: '联系电话',
            // unload_drop_trailer: '甩挂点',
            unload_oper_note: '操作注意事项',
            unload_dispatch_note: '调度注意事项',
            unload_driver_note: '司机注意事项'
        },
        //去掉甩挂点
        group_unload_cargo: {
            unload_work_time: '预约卸货时间',
            unload_org: '卸货单位',
            unload_pca: '所属区域',
            unload_region: '卸货报价区域',
            unload_address: '详细地址',
            unload_linkman: '联系人',
            unload_mobile: '联系电话',
            unload_oper_note: '操作注意事项',
            unload_dispatch_note: '调度注意事项',
            unload_driver_note: '司机注意事项'
        },
        group_cargo_cntr: {
            cargo_info: '货物信息',
            cargo_type: '货物类型',
            cargo_qty: '货物数量',
            cargo_unit: '单位'
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
            cntr_work_time: '预约装卸时间',
            gate_out_region: '提柜报价区域',
            gate_out_yard: '提柜详细地址',
            gate_in_dock: '还柜地',
            gate_in_region: '还柜报价区域',
            gate_in_yard: '还柜详细地址'
        },
        //进出口业务
        group_ship: {
            ship_corp: '船公司',
            booking_no: '订舱号/提单号',
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
    var MAIN_FORM_TEMPLATE = {

        //疏港进口
        TYPE_ORDER_CNTR_IMPORT: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_unload,
            MAIN_FORM_GROUP.group_cargo_cntr,
            MAIN_FORM_GROUP.group_cntr,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom
        ],

        //集港出口
        TYPE_ORDER_CNTR_EXPORT: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_load,
            MAIN_FORM_GROUP.group_cargo_cntr,
            MAIN_FORM_GROUP.group_cntr,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom
        ],

        //散货整车
        TYPE_ORDER_CARGO: [
            MAIN_FORM_GROUP.gorup_base_cargo,
            MAIN_FORM_GROUP.group_plan,
            MAIN_FORM_GROUP.group_cargo,
            MAIN_FORM_GROUP.group_load_cargo,
            MAIN_FORM_GROUP.group_unload_cargo,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom
        ],

        //配送运输
        TYPE_ORDER_DISTR: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_load_cargo,
            MAIN_FORM_GROUP.group_unload_cargo
        ],
        //舱单票结
        TYPE_ORDER_EXPENSE_BILL: [
            MAIN_FORM_GROUP.group_base,
            MAIN_FORM_GROUP.group_ship,
            MAIN_FORM_GROUP.group_custom
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

var toptoolbar = LG.powerToolBar($('#toptoolbar') ,{
    items: [
        { id: 'update', text: '保存', icon: 'save', click: save },
        { id: 'audit', text: '审核', icon: 'audit', click: audit },
        { id: 'cancel', text: '撤销', icon: 'withdraw', click: unaudit },
        { id: 'refresh', text: '刷新', icon: 'refresh', click: refresh },
        { id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrackFun }
    ]
});

var mainForm = manager.mainForm = $mainForm.ligerForm({
    inputWidth: defaultFieldWidth.w1,
    labelWidth: defaultFieldWidth.lw,
    space: defaultFieldWidth.sw,
    labelAlign: "right",
    fields: fields, //加载不同的单据类型
    validate: true,
    toJSON: JSON2.stringify
});

//条件判断
$mainForm.find('input[name="cntr_drop_trailer"]').on('change', function (e) {
    //判断选中甩挂
    if ($(this).prev().hasClass("l-checkbox-checked")) {
        //甩挂，不需要填还柜地址
        mainForm.setFieldValidate('gate_in_dock_c', {required: false});
    } else {
        mainForm.setFieldValidate('gate_in_dock_c', {required: true});
    }
});

var $unload_citypicker = $mainForm.find("input[name=unload_pca]");
var $unload_citypicker_parent = $unload_citypicker.parent();
var $load_citypicker = $mainForm.find("input[name=load_pca]");
var $load_citypicker_parent = $load_citypicker.parent();
(function () {
    //初始化扩展的控件
    $mainForm.find('input[name="unload_address"]').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="unload_address"]').val())
                    + "&region=" + encodeURIComponent($unload_citypicker_parent.find('span[data-count=city]').text()),
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
            // 判断是否为空
            // if ($('span[data-count=province]').text().length == 0) {
            setCityData($unload_citypicker, {
                province: ui.item.province,
                city: ui.item.city,
                district: ui.item.area
            });
        }
    });

    //初始化扩展的控件
    $mainForm.find('input[name="load_address"]').autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="load_address"]').val())
                    + "&region=" + encodeURIComponent($load_citypicker_parent.find('span[data-count=city]').text()),
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
            // 判断是否为空
            // if ($('span[data-count=province]').text().length == 0) {
            setCityData($load_citypicker, {
                province: ui.item.province,
                city: ui.item.city,
                district: ui.item.area
            });
        }
    });

    //初始化城市选择
    $unload_citypicker.citypicker();
    $load_citypicker.citypicker();

})();

function setCityData($dom, data) {
    $dom.citypicker('reset');
    $dom.citypicker('destroy');
    $dom.citypicker(data);
}

//刷新
function refresh() {
    LG.ajax({
        url: basePath + "loadOrder/" + pk_id,
        // data: {pk_id: pk_id},
        success: function (data, msg) {
            manager.setData(data);
        },
        error: function (msg) {
        }
    });
}

//保存数据
function save() {
    //提交数据
    if (mainForm.valid()) {
        LG.ajax({
            url: basePath + "update",
            contentType: 'application/json',
            data: JSON2.stringify(getFormData(), DateUtil.datetimeReplacer),
            dataType: "json",
            success: function (data, msg) {
                manager.setData(data);
                LG.tip('保存成功!');
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    }

    function text(fields) {
        var data = {};
        for (var i = 0; i < fields.length; i++) {
            $mainForm.find("span[data-count=" + fields[i] + "]").text();
        }
    }
}

function getFormData(){
    //省市区数据
    var pcaData = {
        unload_province: $unload_citypicker_parent.find("span[data-count=province]").text(),
        unload_city: $unload_citypicker_parent.find("span[data-count=city]").text(),
        unload_area: $unload_citypicker_parent.find("span[data-count=district]").text(),
        load_province: $load_citypicker_parent.find("span[data-count=province]").text(),
        load_city: $load_citypicker_parent.find("span[data-count=city]").text(),
        load_area: $load_citypicker_parent.find("span[data-count=district]").text()
    };

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
    // debugger;
    var formData = $.extend({}, manager.data, mainData, pcaData, idset);

    return formData;
}

function audit() {
    if (mainForm.valid()) {
        //省市区数据
        var pcaData = {
            unload_province: $unload_citypicker_parent.find("span[data-count=province]").text(),
            unload_city: $unload_citypicker_parent.find("span[data-count=city]").text(),
            unload_area: $unload_citypicker_parent.find("span[data-count=district]").text(),
            load_province: $load_citypicker_parent.find("span[data-count=province]").text(),
            load_city: $load_citypicker_parent.find("span[data-count=city]").text(),
            load_area: $load_citypicker_parent.find("span[data-count=district]").text()
        };

        var formData = $.extend({}, manager.data, mainForm.getData(), pcaData);

        if (formData.state !== "STATE_10_NEW") {
            LG.showError("单据状态不是[新记录]，不可审核");
            return;
        }

        var selected = formData;

        $.ligerDialog.confirm('确定审核吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'audit',
                data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                    if (data.error) {
                        //详细
                        var details = data.detailList;

                        var detailMsg = data.tag + $.map(details, function(item) {
                            return item.message;
                        }).join(",");

                        LG.showError(detailMsg);
                    } else {
                        refresh();
                        LG.tip('审核成功');
                    }
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }
}

function unaudit() {

    var formData = $.extend({}, manager.data, mainForm.getData());

    if (formData.state !== "STATE_30_AUDIT") {
        LG.showError("单据状态不是[已审核]，不可撤销");
        return;
    }

    var selected = formData;

    $.ligerDialog.confirm('确定撤销吗?', function (confirm) {

        if (!confirm) return;

        LG.ajax({
            url: basePath + 'cancel',
            data: JSON.stringify(selected, DateUtil.datetimeReplacer),
            contentType: "application/json",
            success: function (data, msg) {
                refresh();
                LG.tip('撤销成功');
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    });
}

//刷新
$('#btnRefresh').click(function() {
    //确认数据
    manager.confirmChanged();
    refresh();
});
//返回
$("#btnBacktrack").click(function(e) {
    //确认数据
   if(!manager.confirmChanged()){
       e.stopPropagation();
       return false
   }
    else{
       manager.backConfirm = true;
   }
});
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