$(function () {

    //数据管理器
    var manager = {
        car: {},
        driver: {}
    };

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/busi/trans/';

    //页面元素
    var $filterForm = $("#filterForm"),
        $quickSearch = $('.quick-search'),
        $mainForm = $("#mainForm"), //编辑表单
        $mainGrid = $("#mainGrid"), //显示表格
        localStorageName = "grid" + user.id + param.no;  // 本地存储名字

    try {
        1 + nullx
    }
    catch (e) {
        if (localStorage[localStorageName]) {
            var data = JSON.parse(localStorage[localStorageName]);
            var newData = data.map(function (item) {
                return {
                    index: item.index,
                    name: item.name,
                    hide: item.hide
                };
            });
            localStorage.setItem(localStorageName, JSON.stringify(newData));
        }
    }

    var $copyForm = $("#copyForm");

    //页面控件
    var toptoolbar, //工具栏
        mapWin, //地址
        filterForm, //快速查询
        mainGridMenu, //右键菜单
        mainGrid, //列表
        mainForm, //复制表单
        copyForm; //编辑表单

    //全局查询过滤
    var defaultSearchFilter = {
        and: [],
        or: []
    };

    //管理器
    var manager = {
        lastRecord: ''
    };

    var toDay = new Date(),
        oldDay = new Date();
    oldDay.setMonth(toDay.getMonth() - 3);

    var where = {
        "op": "and",
        "rules": [
            {
                "op": "greaterorequal",
                "field": "create_time",
                "value": oldDay.format(),
                "type": "text",
                "datatype": "",
                "ignore": false
            }, {
                "op": "lessorequal",
                "field": "create_time",
                "value": toDay.format(),
                "type": "text",
                "datatype": "",
                "ignore": false
            }
        ],
        "groups": []
    };

    var operate = [],
        operateText = '';
    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '编辑', align: '', minWidth: 30, width: '2%', isSort: false, frozen: true, storageName: "edit",
                render: function (item, index) {
                    return '<a class="row-edit-btn" data-index="' + index + '" title="编辑"><i class="iconfont l-icon-edit"></i></a>';
                }
            },
            {
                //行内按钮
                display: '复制', align: '', minWidth: 30, width: '2%', isSort: false, frozen: true, storageName: "copy",
                render: function (item, index) {
                    var copyStyle = '<a class="row-copy-btn" data-index="' + index + '" title="复制"><i class="iconfont l-icon-copy"></i></a>';
                    //判断复制按钮出现
                    if (item.bs_type_code === TMS_BUSI_TYPE.TYPE_TRANS_DISTR
                        || item.bs_type_code === TMS_BUSI_TYPE.TYPE_TRANS_CNTR_IMPORT
                        || item.bs_type_code === TMS_BUSI_TYPE.TYPE_TRANS_CNTR_EXPORT
                    ) {
                        //配送任务必须是已拒绝或者已中止
                        if (item.state === TMS_STATE.STATE_69_REFUESED || item.state === TMS_STATE.STATE_91_STOPPED || item.state === TMS_STATE.STATE_92_CANCEL) {
                            return copyStyle;
                        }
                    } else if (item.bs_type_code === TMS_BUSI_TYPE.TYPE_TRANS_CARGO) {
                        return copyStyle;
                    }
                    return "";
                },
                hide: disabledButtons.indexOf('copy') >= 0
            },
            {
                display: '状态', name: 'state', align: 'left', minWidth: 60, width: '3%',
                frozen: true, quickSort: false, xlsName: 'state_name',
                render: LG.render.ref(data_state, 'state', null, null, function (text, item) {
                    var html;
                    if (item.state === TMS_STATE.STATE_40_NEW) {
                        html = '<div class="l-grid-row-cell-inner cyan-100">';
                    } else if (item.state === TMS_STATE.STATE_41_SUBMITTED || item.state === TMS_STATE.STATE_45_NOTICED) {
                        html = '<div class="l-grid-row-cell-inner blue-100">'
                    } else if (item.state === TMS_STATE.STATE_60_ACCEPTED || item.state === TMS_STATE.STATE_61_DEPART) {
                        html = '<div class="l-grid-row-cell-inner orange-100">'
                    } else if (item.state === TMS_STATE.STATE_71_PICKUP_CNTR || item.state === TMS_STATE.STATE_73_LOAD || item.state === TMS_STATE.STATE_75_UNLOAD || item.state === TMS_STATE.STATE_76_UNLOAD_CNTR || item.state === TMS_STATE.STATE_77_RETURN_CNTR || item.state === TMS_STATE.STATE_79_FINISH) {
                        html = '<div class="l-grid-row-cell-inner pink-100">'
                    } else if (item.state === TMS_STATE.STATE_90_RECEIPTED) {
                        html = '<div class="l-grid-row-cell-inner gray-100">'
                    } else if (item.state === TMS_STATE.STATE_69_REFUESED) {
                        html = '<div class="l-grid-row-cell-inner purple-100">'
                    } else if (item.state === TMS_STATE.STATE_91_STOPPED) {
                        html = '<div class="l-grid-row-cell-inner yellow-100">'
                    } else if (item.state === TMS_STATE.STATE_92_CANCEL) {
                        html = '<div class="l-grid-row-cell-inner void-100">'
                    }
                    else {
                        html = '<div class="l-grid-row-cell-inner ">';
                    }
                    html = html + text + '</div>';
                    return html;
                })
            },
            {
                display: '任务类型', name: 'task_type', align: 'left', minWidth: 60, width: '3%',
                frozen: true, quickSort: false, xlsName: 'task_type_name',
                render: LG.render.ref(BILL_CONST.DATA_TASK_TYPE, 'task_type')
            },
            {
                display: '自定义业务', name: 'client_busi', align: 'left', minWidth: 80, width: '5%', isSort: false, quickSort: false,
                render: LG.render.ref(data_dict['client_busi'], 'client_busi')
            },
            {display: '委托客户', name: 'client_name', align: 'left', minWidth: 100, width: '10%'},
            /********************************************
             * 船信息
             ********************************************/
            {display: '订舱号/提单号', name: 'booking_no', align: 'left', minWidth: 130, width: '5%'},
            {display: '船公司', name: 'ship_corp', align: 'left', minWidth: 80, width: '5%', quickSort: false},
            {
                display: '<span class="trans-highlight">预约提柜时间</span>',
                name: 'cntr_pick_time',
                align: 'left',
                minWidth: 130,
                width: '5%',
                xlsHead: '预约提柜时间',
                editor: {
                    type: 'date',
                    ext: {
                        showTime: true,
                        format: "yyyy-MM-dd hh:mm"
                    }
                },
                render: function (item, index, text) {
                    if (!text || text <= 0) {
                        return text;
                    }
                    if (typeof text === 'object') {
                        text = DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss', text);
                    }
                    return text;
                }
            },
            {
                display: '<span class="trans-highlight">预约装卸时间</span>',
                name: 'cntr_work_time',
                align: 'left',
                minWidth: 180,
                width: '5%',
                xlsHead: '预约装卸时间',
                type: 'date',
                editor: {
                    type: 'date',
                    ext: {
                        showTime: true,
                        format: "yyyy-MM-dd hh:mm"
                    }
                },
                render: function (item, index, text) {
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
            },
            {display: '提柜地', name: 'gate_out_dock', align: 'left', minWidth: 80, width: '5%'},
            {display: '装卸单位', name: 'lau_orgs', align: 'left', minWidth: 120, width: '5%', quickSort: false},
            {display: '装卸货详细地址', name: 'lau_address', align: 'left', minWidth: 100, width: '5%', quickSort: false},
            {
                display: '<span class="trans-highlight">车牌号</span>',
                name: 'car_no',
                xlsHead: '车牌号',
                align: 'left',
                minWidth: 80,
                width: '10%',
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
                            selectBoxHeight: 250,
                            renderItem: function (data, value, text, key) {
                                var g = this;
                                var item = data.data;
                                var key_text = '<span class="combobox-list-item car_no-item">' + item.key_text + '</span>';
                                key_text += '<span class="combobox-list-item car_no-item">' + item.driver_name + '</span>';
                                key_text += '<span class="combobox-list-item car_no-item">' + item.carrier_name + '</span>';
                                // key_text += '<span class="combobox-list-item car_no-item">' + '产值:' + ('' + (item.output || 0).toFixed(2)) + '</span>';
                                // key_text += '<span class="combobox-list-item car_no-item">' + '提成:' + ('' + (item.percentage || 0).toFixed(2)) + '</span>';
                                key_text += '<span class="combobox-list-item car_no-item">' + item.type_name + '</span>';
                                // key_text += '<span class="combobox-list-item car_no-item">' + (item.outsourcing == 'Y' ? '外协' : '自有') + '</span>';

                                return g._highLight(key_text, $.trim(data.key));
                            },
                            onSelected: function (newValue, newText, rowData) {
                                //暂存选中的司机
                                manager.car = {
                                    value: newValue,
                                    text: newText
                                }
                            }
                        }
                    }
                }
            },
            {
                display: '<span class="trans-highlight">司机</span>',
                name: 'driver_name',
                xlsHead: '司机',
                align: 'left',
                minWidth: 80,
                width: '10%',
                editor: {
                    type: 'select',
                    data: data_driver,
                    ext: function (record, rowindex, value, column) {
                        return {
                            cancelable: true,
                            autocomplete: true,
                            autocompleteKeyField: 'key_text',
                            keySupport: true,
                            highLight: true,
                            isTextBoxMode: true,
                            selectBoxWidth: 350,
                            selectBoxHeight: 250,
                            renderItem: function (data) {
                                var g = this,
                                    item = data.data,

                                    key_text_arr = item.key_text.split(/\s+/),
                                    key_text = "";
                                key_text += '<span class="combobox-list-item driver_name-item item1">' + key_text_arr[0] + '</span>';
                                key_text += '<span class="combobox-list-item driver_name-item item2">' + key_text_arr[1] + '</span>';
                                key_text += '<span class="combobox-list-item driver_name-item item3">' + key_text_arr[2] + '</span>';
                                key_text += '<span class="combobox-list-item driver_name-item item4">' + (item.outsourcing ? '外协' : '自有') + '</span>';
                                return key_text;
                            },
                            onSelected: function (newValue, newText, rowData) {
                                //暂存选中的司机
                                manager.driver = {
                                    value: newValue,
                                    text: newText
                                }
                            }
                        }
                    }
                },
                render: function (item) {
                    return "<div class=" + (item.driver_name && !item.driver_id ? "'haveicon'" : "''") + "><div class='icon-type icon-alert' title='未登记'></div>" + (item.driver_name || "") + "</div>";
                    // console.log('%o', item);
                    // return "<div " + (!item.driver_id ? "class='alert-icon' title='未登记'" : "") + ">" + (item.driver_name || "") + "</div>"
                }
            },
            {display: '手机号', name: 'driver_mobile', align: 'left', minWidth: 100, width: '5%', editor: {type: 'text'}},
            {
                display: '外协',
                name: 'outsourcing',
                align: 'left',
                minWidth: 30,
                width: '2%',
                render: LG.render.boolean('outsourcing'),
                editor: {
                    type: 'checkbox'
                }
            },
            {
                display: '车型', name: 'booking_car_type', align: 'left', minWidth: 50, width: '5%', xlsName: 'car_type_name',
                render: LG.render.ref(data_dict[DICT_CODE.car_type], 'booking_car_type')
            },
            {
                display: '承运方', name: 'carrier_name', align: 'left', minWidth: 100, width: '5%',
                valueField: 'text',
                editor: {
                    type: 'select',
                    ext: {
                        data: data_carriers,
                        valueField: 'text',
                        cancelable: true,
                        autocomplete: true,
                        keySupport: true,
                        highLight: true,
                        onSelected: function (newValue, newText, rowData) {
                            //暂存选中的司机
                            manager.carrier = {
                                value: newValue,
                                text: newText
                            }
                        }

                    }
                },
                // render: function (data, rowIndex, val, column) {
                //     var datas = data_carriers.filter(function (item) {
                //         return item.text === val;
                //     });
                //     if (datas.length > 0) {
                //         var data = $.extend(data, {outsourcing: datas[0].outsourcing === 'Y'});
                //         this.updateRow(rowIndex, data);
                //     }
                //     return val;
                // }
            },
            {display: '负责人', name: 'manager', align: 'left', minWidth: 80, width: '5%'},
            /********************************************
             * 柜信息
             ********************************************/
            {
                display: '<span class="trans-highlight">柜号</span>',
                name: 'cntr_no',
                align: 'left',
                minWidth: 100,
                width: '5%',
                xlsHead: '柜号',
                editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">封条号</span>',
                name: 'cntr_seal_no',
                align: 'left',
                minWidth: 100,
                width: '5%',
                xlsHead: '封条号',
                editor: {type: 'text'}
            },
            {display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '2%'},
            {
                display: '甩挂',
                name: 'cntr_drop_trailer',
                align: 'left',
                minWidth: 40,
                width: '2%',
                render: LG.render.boolean('cntr_drop_trailer')
            },
            {display: '孖拖', name: 'cntr_twin', align: 'left', minWidth: 40, width: '2%', render: LG.render.boolean('cntr_twin')},
            {display: '孖拖柜号', name: 'cntr_twin_no', align: 'left', minWidth: 100, width: '2%'},
            {display: '船名', name: 'ship_name', align: 'left', minWidth: 100, width: '5%'},
            {display: '航次', name: 'voyage', align: 'left', minWidth: 100, width: '5%'},
            {display: '还柜地', name: 'gate_in_dock', align: 'left', minWidth: 100, width: '5%'},
            /********************************************
             * 其它信息
             ********************************************/
            {
                display: '操作单位', name: 'oper_unit', align: 'left', minWidth: 100, width: '5%', xlsName: 'oper_unit_name',
                render: LG.render.ref(data_dict[DICT_CODE.oper_unit], 'oper_unit')
            },
            // {
            //     display: '操作人', name: 'manager', align: 'left', minWidth: 80, width: '5%',
            //     render: LG.render.ref([], 'manager')
            // },
            {display: '结算时间', name: 'settle_date', align: 'left', minWidth: 130, width: '5%'},
            {display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 100, width: '5%'},
            {display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 80, width: '5%'},
            {
                display: '装卸/提还柜报价区域', name: 'load_region', align: 'left', minWidth: 120, width: '5%',
                render: function (item) {
                    function join(a, b, c, d) {
                        var s = [];
                        if (a) s.push(a);
                        if (b) s.push(b);
                        if (c) s.push(c);
                        if (d) s.push(d);
                        return s.join('|');
                    }

                    return join(item.load_region,
                        item.unload_region,
                        item.gate_out_region,
                        item.gate_in_region);
                }
            },
            {display: '作业单号', name: 'bill_no', align: 'left', minWidth: 100, width: '8%'},
            {display: '运输单号', name: 'order_bill_no', align: 'left', minWidth: 100, width: '5%'},
            {display: '客户委托号', name: 'client_bill_no', align: 'left', minWidth: 120, width: '5%'},
            {
                display: '来源', name: 'bill_driver', align: 'left', minWidth: 80, width: '5%',
                render: LG.render.boolean('bill_driver')
            },
            {display: '提交人', name: 'audit_psn', align: 'left', minWidth: 100, width: '5%'},
            {display: '提交时间', name: 'audit_time', align: 'left', minWidth: 130, width: '5%'},
            {display: '创建人', name: 'create_psn', align: 'left', minWidth: 100, width: '5%'},
            {display: '创建时间', name: 'create_time', align: 'left', minWidth: 130, width: '5%'},
            {display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%'}
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true, //多选框
        width: '100%',
        height: '100%',
        dataAction: 'server',
        usePager: true,
        pageSizeOptions: [50, 100, 200, 500],
        enabledEdit: true, //可分页
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -40,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        localStorageName: localStorageName,
        sortName: 'STATE,CREATE_TIME', //状态顺序、创建时间倒序
        sortOrder: 'ASC,DESC',
        parms: {
            'where': JSON2.stringify(where)
        },
        colDraggable: true,
        onDblClickRow: function (rowdata, rowid, rowHtml, cellHtml) {
            var column = this.getColumn(cellHtml);
            if (!column || !column.editor) {
                jumpDetailEdit(rowdata);
            } else {
                if (cellHtml) {
                    this._applyEditor(cellHtml);
                    $(this.editor.input).focus();
                }
            }
        },
        onAfterEdit: function (e) {
            var record = $.extend({}, e.record);
            var columnname = e.column.columnname;

            var postData = {
                pk_id: e.record.pk_id,
                version: e.record.version,
                state: e.record.state,
                columnname: columnname
            };
            postData[e.column.columnname] = e.value;
            try {
                postData['columnvalue'] = manager.lastRecord[e.column.columnname];
            } catch (e) {
                console.error(e);
            }

            //待更新数据
            var UPDATE_DATA = {};
            UPDATE_DATA[columnname] = e.value;
            //车牌号带出车辆类型
            var CAR_FIELDS = {
                CARRIER_ID: 'carrier_id', //承运方主键
                CARRIER_NAME: 'carrier_name', //承运方名字
                BOOKING_CAR_TYPE: 'booking_car_type',
                outsourcing: 'outsourcing' //是否外协
            };
            //司机带出揽货人信息、司机电话、是否外协
            var DRIVER_FIELDS = {
                DRIVER_ID: 'driver_id', //司机主键
                DRIVER_MOBILE: 'driver_mobile', //司机手机号
            };

            if (columnname == 'carrier_name') {
                if (data_carriers && data_carriers.length > 0) {
                    var carriers = $.grep(data_carriers, function (n, i) {
                        //车牌号查找
                        return data_carriers[i].text == manager.carrier.text;
                    });

                    if (carriers && carriers.length > 0) {
                        //冗余承运商
                        UPDATE_DATA["carrier_id"] = carriers[0].id;
                    }

                    //判断值是否改变
                    if (manager.lastRecord && manager.lastRecord[e.column.columnname] === e.value) {
                        LG.tip("值未改变");
                        return;
                    }
                }

                //待更新的字段
                var keys = Object.keys(UPDATE_DATA);
                keys.push(postData.columnname);
                postData.columnname = keys.join(",");
                postData = $.extend({}, postData, UPDATE_DATA); //复制属性

            } else if (columnname == 'car_no') {
                if (data_car && data_car.length > 0) {
                    var cars = $.grep(data_car, function (n, i) {
                        //车牌号查找
                        return data_car[i].text == manager.car.text;
                    });

                    if (cars && cars.length > 0) {

                        //冗余车型字段
                        UPDATE_DATA[CAR_FIELDS.BOOKING_CAR_TYPE] = cars[0].type;
                        //带出承运商、默认司机
                        UPDATE_DATA[CAR_FIELDS.CARRIER_ID] = cars[0].carrier_id;
                        UPDATE_DATA[CAR_FIELDS.CARRIER_NAME] = cars[0].carrier_name;
                        UPDATE_DATA[DRIVER_FIELDS.DRIVER_ID] = cars[0].driver_id;
                        UPDATE_DATA["driver_name"] = cars[0].driver_name;
                        UPDATE_DATA[DRIVER_FIELDS.DRIVER_MOBILE] = cars[0].driver_mobile;
                        UPDATE_DATA[CAR_FIELDS.outsourcing] = (cars[0].outsourcing == 'Y');
                    }
                }
                //判断值是否改变
                if (manager.lastRecord && manager.lastRecord[e.column.columnname] === e.value) {
                    LG.tip("值未改变");
                    return;
                }

                //待更新的字段
                var keys = Object.keys(UPDATE_DATA);
                keys.push(postData.columnname);
                postData.columnname = keys.join(",");
                postData = $.extend({}, postData, UPDATE_DATA); //复制属性
            }
            else if (columnname == 'driver_name') {

                //设置默认控制
                for (var f in DRIVER_FIELDS) {
                    UPDATE_DATA[DRIVER_FIELDS[f]] = '';
                }

                if (data_driver && data_driver.length > 0) {

                    var drivers = $.grep(data_driver, function (n, i) {
                        return data_driver[i].id == manager.driver.value;
                    });

                    if (drivers && drivers.length > 0) {
                        //冗余关联字段
                        // UPDATE_DATA[DRIVER_FIELDS.CARRIER_ID] = drivers[0].carrier_id;
                        // UPDATE_DATA[DRIVER_FIELDS.CARRIER_NAME] = drivers[0].carrier_name;
                        UPDATE_DATA[DRIVER_FIELDS.DRIVER_ID] = drivers[0].id;
                        UPDATE_DATA[DRIVER_FIELDS.DRIVER_MOBILE] = drivers[0].mobile;
                        // UPDATE_DATA[DRIVER_FIELDS.outsourcing] = drivers[0].outsourcing;
                    }
                }

                //判断值是否改变
                var lastRecord = manager.lastRecord;
                if (lastRecord) {
                    var flag = true; //比较这5个关联字段值，判断选中的值是否被改变

                    //放宽条件：只比较名字
                    // for (var f in DRIVER_FIELDS) {
                    //     var key = DRIVER_FIELDS[f];
                    //     if (UPDATE_DATA[key] != lastRecord[key]) {
                    //         flag = false;
                    //         break;
                    //     }
                    // }

                    //如果显示值不等于空，且显示值没有修改
                    if (UPDATE_DATA[columnname] && UPDATE_DATA[columnname] == lastRecord[columnname]) {

                        //选择动作
                        if (UPDATE_DATA['driver_id'] && UPDATE_DATA['driver_id'] != lastRecord['driver_id']) {
                            //强制更新字段值
                            flag = false;
                        }

                    } else {
                        for (var f in DRIVER_FIELDS) {
                            var key = DRIVER_FIELDS[f];
                            if (UPDATE_DATA[key] != lastRecord[key]) {
                                flag = false;
                                break;
                            }
                        }
                    }

                    if (flag) {
                        LG.tip("值未改变");
                        return;
                    }
                }

                //待更新的字段
                var keys = Object.keys(DRIVER_FIELDS);
                keys.push(postData.columnname);
                postData.columnname = keys.join(",");
                //待更新的数据
                postData = $.extend({}, postData, UPDATE_DATA); //复制属性
            }
            else {
                //司机手机号
                if (columnname == 'driver_mobile') {

                }

                //柜号
                if (columnname == 'cntr_no' || columnname == 'cntr_twin_no') {

                    //校验柜号
                    if (e.value && !cntrUtil.verifyContainerCode(e.value)) {

                        //设置原值
                        UPDATE_DATA[columnname] = manager.lastRecord[columnname];
                        mainGrid.updateRow(record['__id'], UPDATE_DATA);

                        LG.tip("柜号不正确");
                        return;
                    }
                }

                //文本匹配
                if (manager.lastRecord && manager.lastRecord[e.column.columnname] == e.value) {
                    LG.tip("值未改变");
                    return;
                }
            }

            LG.ajax({
                url: basePath + 'updateInline',
                data: JSON.stringify(postData, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {

                    //更新版本号
                    var newdata = $.extend({}, record, {
                        version: data.version
                    }, UPDATE_DATA);

                    LG.tip("值更新成功");

                    //更新行数据的版本号
                    mainGrid.updateRow(record['__id'], newdata);
                    //去除保存提示
                    mainGrid.isDataChanged = false;
                },
                error: function (msg) {
                    LG.showError(msg);
                }
            });
        },
        //进入编辑前判断能否修改，并且缓存修改前的数据
        onBeforeEdit: function (editParm) {
            if (disabledButtons.indexOf('edit') >= 0) return false;
            var column = editParm.column,
                record = editParm.record;

            //检查字段是否可编辑
            if (record.state != TMS_STATE.STATE_40_NEW && record.state != TMS_STATE.STATE_69_REFUESED) {

                throttle(function () {
                    LG.tip("单据状态不是[新任务]，不能修改");
                }, 10)();

                return false;
            }

            if (column === 'cntr_twin_no' && !record['cntr_twin']) {
                //孖拖才能输入孖拖柜号

                LG.tip("运单不是孖拖，不能输入");
                return false;
            }


            //记录修改前的值
            manager.lastRecord = $.extend({}, record);

            return true;
        },
        //右键菜单
        onContextmenu: function (src, e) {

            var g = this, p = g.options;
            //管理员测试用
            if ("admin" === user.account) {

                //初始化右键菜单
                if (!g.grid.menu && $.ligerMenu) {

                    g.grid.menu = $.ligerMenu({
                        width: 100, items: [
                            {
                                text: '接受', id: 'acceptTask',
                                click: function () {

                                    if (g.grid.menudata) {

                                        //接受任务
                                        LG.ajax({
                                            url: basePath + 'acceptTask',
                                            data: JSON.stringify(g.grid.menudata, DateUtil.datetimeReplacer),
                                            contentType: "application/json",
                                            success: function (data, msg) {
                                                refresh();
                                                LG.tip('接受任务成功');
                                            },
                                            error: function (message) {
                                                LG.showError(message);
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text: '出车', id: 'depart',
                                click: function () {

                                    if (g.grid.menudata) {

                                        //接受任务
                                        LG.ajax({
                                            url: basePath + 'depart',
                                            data: JSON.stringify(g.grid.menudata, DateUtil.datetimeReplacer),
                                            contentType: "application/json",
                                            success: function (data, msg) {
                                                refresh();
                                                LG.tip('接受任务成功');
                                            },
                                            error: function (message) {
                                                LG.showError(message);
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text: '拒绝任务', id: 'refuseTask',
                                click: function () {
                                    if (g.grid.menudata) {
                                        //接受任务
                                        LG.ajax({
                                            url: basePath + 'refuseTask',
                                            data: JSON.stringify(g.grid.menudata, DateUtil.datetimeReplacer),
                                            contentType: "application/json",
                                            success: function (data, msg) {
                                                refresh();
                                                LG.tip('接受任务成功');
                                            },
                                            error: function (message) {
                                                LG.showError(message);
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                text: '中止任务', id: 'stopTask',
                                click: function () {
                                    if (g.grid.menudata) {
                                        //接受任务
                                        LG.ajax({
                                            url: basePath + 'stopTask',
                                            data: JSON.stringify(g.grid.menudata, DateUtil.datetimeReplacer),
                                            contentType: "application/json",
                                            success: function (data, msg) {
                                                refresh();
                                                LG.tip('任务成功');
                                            },
                                            error: function (message) {
                                                LG.showError(message);
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    });

                }

                g.grid.menudata = src.data;
                g.grid.menu.show({top: e.pageY, left: e.pageX});
            }

            return false;
        },
        onLoaded: function (data) {
            refreshQuick();
            this.toggleLoading.ligerDefer(this, 10, [false]);
        }
    };

    //调试用
    if (location.hostname == "localhost" || user.account === 'admin') {
        gridOption.columns.push(
            {display: '司机拉单', name: 'bill_driver', align: 'left', minWidth: 100, width: '8%', render: LG.render.boolean("bill_driver")},
            {display: '轻公里数', name: 'e_km', align: 'left', minWidth: 80, width: '5%'},
            {display: '重公里数', name: 'f_km', align: 'left', minWidth: 80, width: '5%'},
            {display: '公里数确认', name: 'mileage_confirm', align: 'left', minWidth: 80, width: '5%', render: LG.render.boolean("mile_confirm")},
            {display: '签收重量', name: 'total_weight', align: 'left', minWidth: 80, width: '5%'}
        );
    }

    var filterFormFieldWidth = {
        w1: 155,
        w2: 310,
        w3_2: 405
    };

    var fontSize = 12 / detectZoom(top);
    var filterFormOption = {

        //搜索框绑定信息
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
                $(".qs-item.visited").removeClass("visited");
            }
            // where: function (options, form) {
            //     return JSON2.parse(whereLoadUnload(form.getSearchFormData(this.searchBind.dr, this.searchBind.defaultFilter)));
            // }
        },
        historySearch: {
            formId: "history-search-form",
            storageId: "trans_ui" + user.id,
            searchBtnId: "history-search-btn",
            wordWidth: fontSize,
            fieldWidthDiff: fontSize,
            options: {
                labelWidth: 90,
                inputWidth: filterFormFieldWidth.w1,
                space: 5,
                prefixID: "hs_"
            },
            defaultFields: {
                "bill_no": true,
                "cntr_no": true
            },
            exFields: {
                "cntr_drop_trailer": {
                    options: {
                        absolute: true
                    }
                },
                "cntr_twin": {
                    options: {
                        absolute: true
                    }
                },
                "cntr_work_time_start": {
                    newline: false,
                    width: filterFormFieldWidth.w1
                },
                "cntr_work_time_end": {
                    display: "(装卸时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 120 / detectZoom(top)
                },
                "settle_date_start": {
                    newline: false,
                    width: filterFormFieldWidth.w1
                },
                "settle_date_end": {
                    display: "(结算时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 120 / detectZoom(top)
                },
                "cntr_pick_time_start": {
                    newline: false,
                    width: filterFormFieldWidth.w1
                },
                "cntr_pick_time_end": {
                    display: "(装卸时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 120 / detectZoom(top)
                },
                "oper_unit": {
                    width: filterFormFieldWidth.w1
                },
                "audit_time_start": {
                    newline: false,
                    width: filterFormFieldWidth.w1
                },
                "audit_time_end": {
                    display: "(提交时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 120 / detectZoom(top)
                },
                "create_time_start": {
                    width: filterFormFieldWidth.w1,
                    newline: false,
                },
                "create_time_end": {
                    display: "(创建时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 120 / detectZoom(top)
                }
            }
        },
        labelWidth: 90,
        inputWidth: filterFormFieldWidth.w1,
        space: 5,
        prefixID: "s_",
        fields: [
            {
                display: "单据状态", name: "state",
                newline: false,
                type: "select",
                cssClass: "field",
                comboboxName: "state_c",
                options: {
                    data: data_state,
                    absolute: true,
                    cancelable: true,
                    isMultiSelect: true, //多选
                    split: ',',
                    autocomplete: true,
                    keySupport: true
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: "业务类型", name: "bs_type_code", newline: false,
                type: "select", cssClass: "field", comboboxName: "bs_type_code_c",
                options: {
                    data: data_bs_type_name,
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true //多选 
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: "任务类型", name: "task_type", newline: false,
                type: "select", cssClass: "field", comboboxName: "task_type_c",
                options: {
                    data: BILL_CONST.DATA_TASK_TYPE,
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true //多选
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: "自定义业务", name: "client_busi", newline: false,
                type: "select", cssClass: "field", comboboxName: "client_busi_c",
                options: {
                    data: data_dict['client_busi'],
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true //多选
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: "客户(精确)", name: "client_id", newline: false,
                type: "select", cssClass: "field", comboboxName: "client_id_",
                options: {
                    data: data_clients,
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true, //多选
                    autocomplete: true,
                    highLight: true,
                    keySupport: true
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {display: "客户(模糊)", name: "client_name", newline: false, type: "text", cssClass: "field"},
            {display: "揽货公司", name: "supplier_name", newline: false, type: "text", cssClass: "field"},
            {display: "作业单号", name: "bill_no", newline: false, type: "text", cssClass: "field"},
            {display: "运输单号", name: "order_bill_no", newline: false, type: "text", cssClass: "field"},
            {display: '司机', name: 'driver_name', newline: false, type: "text", cssClass: "field"},
            {display: '车牌号', name: 'car_no', newline: false, type: "text", cssClass: "field"},
            {display: '手机号', name: 'driver_mobile', newline: false, type: "text", cssClass: "field"},
            {display: '承运方', name: 'carrier_name', newline: false, type: "text", cssClass: "field"},
            {
                display: '外协', name: 'outsourcing', newline: false, type: "select", cssClass: "field",
                editor: {
                    cancelable: true,
                    data: [
                        {text: '是', id: 'Y'},
                        {text: '否', id: 'N'}
                    ]
                },
                attr: {
                    op: "equal"
                }
            },
            {display: '负责人', name: 'manager', newline: false, type: "text", cssClass: "field"},
            {display: '柜号', name: 'cntr_no', newline: false, type: "text", cssClass: "field"},
            {display: '封条号', name: 'cntr_seal_no', newline: false, type: "text", cssClass: "field"},
            {
                display: "车型", name: "booking_car_type", newline: false,
                type: "select", cssClass: "field", comboboxName: "booking_car_type_c",
                options: {
                    data: data_dict[DICT_CODE.car_type],
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true //多选
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: '柜型', name: 'cntr_type', newline: false,
                type: "select", cssClass: "field", comboboxName: "cntr_type_c",
                options: {
                    data: data_dict[DICT_CODE.cntr_type],
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true, //多选
                    autocomplete: true,
                    keySupport: true
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: '甩挂', name: 'cntr_drop_trailer', newline: false,
                type: "select", cssClass: "field",
                editor: {
                    cancelable: true,
                    data: [
                        {text: '是', id: 'Y'},
                        {text: '否', id: 'N'},
                    ]
                },
                attr: {
                    op: "equal"
                }
            },
            {
                display: '孖拖', name: 'cntr_twin', newline: false,
                type: "select", cssClass: "field",
                editor: {
                    cancelable: true,
                    data: [
                        {text: '是', id: 'Y'},
                        {text: '否', id: 'N'},
                    ]
                },
                attr: {
                    op: "equal"
                }
            },
            {display: '孖拖柜号', name: 'cntr_twin_no', newline: false, type: "text", cssClass: "field"},
            {display: '客户委托号', name: 'client_bill_no', newline: false, type: "text", cssClass: "field"},
            /********************************************
             * 船信息
             ********************************************/
            {display: '订舱号/提单号', name: 'booking_no', newline: false, type: "text", cssClass: "field"},
            {display: '船公司', name: 'ship_corp', newline: false, type: "text", cssClass: "field"},
            {display: '船名', name: 'ship_name', newline: false, type: "text", cssClass: "field"},
            {display: '航次', name: 'voyage', newline: false},
            {display: '装卸单位', name: 'lau_orgs', newline: false},
            {display: '提柜地', name: 'gate_out_dock', newline: false},
            {display: '还柜地', name: 'gate_in_dock', newline: false},
            {
                display: "操作单位", name: "oper_unit", newline: false,
                type: "select", cssClass: "field", comboboxName: "oper_unit_c",
                options: {
                    data: data_dict[DICT_CODE.oper_unit],
                    absolute: true,
                    cancelable: true,
                    split: ',',
                    isMultiSelect: true, //多选
                    autocomplete: true,
                    highLight: true,
                    keySupport: true
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {display: '来源', name: 'bill_driver', newline: false, type: "text", cssClass: "field"},
            {display: '提交人', name: 'audit_psn', newline: false, type: "text", cssClass: "field"},
            {display: '创建人', name: 'create_psn', newline: false, type: "text", cssClass: "field"},
            {
                display: "预约装卸时间",
                name: "cntr_work_time_start",
                width: filterFormFieldWidth.w2,
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd"},
                attr: {
                    value: toDay.format(),
                    op: "greaterorequal", //操作符
                    "data-name": "cntr_work_time" //查询字段名称
                }
            },
            {
                display: "至",
                name: "cntr_work_time_end",
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd",
                    onChangeDate: function (value) {
                        this.usedDate.setHours(23, 59, 59);
                    }
                },
                attr: {
                    value: toDay.format(),
                    op: "lessorequal", //操作符
                    "data-name": "cntr_work_time" //查询字段名称
                }
            },
            {
                display: "预约提柜时间",
                name: "cntr_pick_time_start",
                width: filterFormFieldWidth.w2,
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd"
                },
                attr: {
                    value: toDay.format(),
                    op: "greaterorequal", //操作符
                    "data-name": "cntr_pick_time" //查询字段名称
                }
            },
            {
                display: "至",
                name: "cntr_pick_time_end",
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd",
                    onChangeDate: function (value) {
                        this.usedDate.setHours(23, 59, 59);
                    }
                },
                attr: {
                    value: toDay.format(),
                    op: "lessorequal", //操作符
                    "data-name": "cntr_pick_time" //查询字段名称
                }
            },
            {
                display: "结算时间",
                name: "settle_date_start",
                width: filterFormFieldWidth.w2,
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd"},
                attr: {
                    value: toDay.format(),
                    op: "greaterorequal", //操作符
                    "data-name": "settle_date" //查询字段名称
                }
            },
            {
                display: "至",
                name: "settle_date_end",
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd",
                    onChangeDate: function (value) {
                        this.usedDate.setHours(23, 59, 59);
                    }
                },
                attr: {
                    value: toDay.format(),
                    op: "lessorequal", //操作符
                    "data-name": "settle_date" //查询字段名称
                }
            },
            {
                display: "提交时间",
                name: "audit_time_start",
                width: filterFormFieldWidth.w2,
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd"},
                attr: {
                    op: "greaterorequal", //操作符
                    "data-name": "audit_time" //查询字段名称
                }
            },
            {
                display: "至",
                name: "audit_time_end",
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd",
                    onChangeDate: function (value) {
                        this.usedDate.setHours(23, 59, 59);
                    }
                },
                attr: {
                    value: toDay.format(),
                    op: "lessorequal", //操作符
                    "data-name": "audit_time" //查询字段名称
                }
            },
            {
                display: "创建时间",
                name: "create_time_start",
                width: filterFormFieldWidth.w2,
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd"},
                attr: {
                    value: oldDay.format(),
                    op: "greaterorequal", //操作符
                    "data-name": "create_time" //查询字段名称
                }
            },
            {
                display: "至",
                name: "create_time_end",
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd",
                    onChangeDate: function (value) {
                        this.usedDate.setHours(23, 59, 59);
                    }
                },
                attr: {
                    value: toDay.format(),
                    op: "lessorequal", //操作符
                    "data-name": "create_time" //查询字段名称
                }
            }
        ]
    };

    var mainFormOption = {
        fields: [
            {
                display: "业务类型",
                name: "bs_type_code",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                comboboxName: "bs_type_code_c",
                options: {
                    value: "CATALOG_TRANS_INNER",
                    data: [{id: "CATALOG_TRANS_INNER", text: "内部任务"}],
                    cancelable: true,
                    // textFieldID: 'text',
                    // valueFieldID: 'value'
                    readonly: true
                },
                cssClass: "field",
                validate: {required: true}
            },
            {
                display: "任务类型",
                name: "task_type",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                comboboxName: "bs_type_code_c",
                options: {
                    value: "INNERTASK",
                    data: BILL_CONST.DATA_TASK_TYPE_INNER,
                    cancelable: true,
                    // textFieldID: 'text',
                    // valueFieldID: 'value'
                },
                cssClass: "field",
                validate: {required: true}
            },
            // {
            //     display: "客户",
            //     name: "client_id",
            //     newline: false,
            //     labelWidth: 80,
            //     width: 170,
            //     space: 30,
            //     type: "select",
            //     comboboxName: "client_id_c",
            //     options: {
            //         data: data_clients,
            //         cancelable: true,
            //     },
            //     cssClass: "field",
            //     validate: {required: true},
            // },
            // {
            //     display: "客户联系人",
            //     name: "linkman",
            //     newline: false,
            //     labelWidth: 80,
            //     width: 170,
            //     space: 30,
            //     type: "text",
            //     cssClass: "field",
            //     validate: {required: true},
            // },
            {
                display: "联系电话",
                name: "linkman_mobile",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
            },
            // {
            //     display: "揽货公司",
            //     name: "supplier_id",
            //     newline: false,
            //     labelWidth: 80,
            //     width: 170,
            //     space: 10,
            //     type: "select",
            //     cssClass: "field",
            //     options: {
            //         data: data_suppliers,
            //         cancelable: true,
            //     },
            // },
            {
                display: "备注",
                name: "remark",
                newline: false,
                labelWidth: 80,
                width: 452,
                space: 10,
                rows: 4,
                type: "textarea"
            }
        ],
        validate: true,
        toJSON: JSON2.stringify
    }

    //复制框选项
    var copyFormOption = {
        fields: [{
            display: "复制数量",
            name: "qty",
            newline: false,
            labelWidth: 85,
            width: 170,
            space: 30,
            type: "text",
            cssClass: "field",
            validate: {
                required: true,
                range: [1, 100]
            }
        }
        ],
        validate: true,
        toJSON: JSON2.stringify
    };

    //新增弹出框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 300,
        buttons: [
            {
                text: '确认',
                onclick: function (item, dialog) {

                    //校验数据
                    if (!mainForm.valid()) {
                        mainForm.showInvalid();
                        return;
                    }

                    var selected = $mainForm.data(SELECTED);
                    //地址
                    var url = !!selected ? 'update' : 'add';

                    //组织数据，获取揽货公司和客户主键
                    var mainData = mainForm.getData();
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

                    var data = $.extend({}, mainForm.getData(), idset);

                    LG.singleAjax({
                        url: basePath + url,
                        data: JSON.stringify(data, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {

                            dialog.hide();
                            //刷新角色列表
                            refresh();

                            LG.tip('保存成功!');
                            jumpDetailEdit(data);
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

    //默认增删改查刷新
    var defaultAction = function (item) {
        switch (item.id) {
            case "refresh":
                refresh();
                break;
            case "add":
                //打开对话框
                mainForm.reset();
                openDialog({});
                $mainForm.data(SELECTED, null);
                break;
            case "delete":
                var selected = mainGrid.getCheckedRows();
                if ((selected == null) || (selected == '') || (selected == 'undefined')) {
                    LG.showError('请选择行');
                    return;
                }
                //检查单据状态
                for (var i = 0; i < selected.length; i++) {
                    if (selected[i].state !== TMS_STATE.STATE_40_NEW) {
                        LG.showError("所选单据状态不是[新记录]，不可删除");
                        return;
                    }
                }
                //适配不同的主表
                $.ligerDialog.confirm('确定删除吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'remove',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            //刷新角色列表
                            mainGrid.deleteSelectedRow();
                            refreshQuick();
                            LG.tip('删除成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;

            case "submit":
                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }
                //检查单据状态
                var msg = '确定提交吗?';
                for (var i = 0; i < selected.length; i++) {
                    if (selected[i].state !== "STATE_40_NEW") {
                        LG.showError("所选单据状态存在非[新单据]，不可提交");
                        return;
                    }

                    if (selected[i].bill_driver) {
                        msg = '存在【司机】创建的单据，确定提交吗?';
                    }
                }

                $.ligerDialog.confirm(msg, function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'submit',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            moified(selected);
                            refresh(selected, data);
                            LG.tip('提交成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;
            case "cancelSubmit":
                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }
                $.ligerDialog.confirm('确定撤销提交吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'cancelSubmit',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            moified(selected);
                            refresh(selected, data);
                            LG.tip('撤销提交成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;
            case "notice":

                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }

                $.ligerDialog.confirm('确定通知司机吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'notice',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            moified(selected);
                            refresh(selected, data);
                            LG.tip('通知成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });

                break;
            case "cancelNotice":

                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }

                $.ligerDialog.confirm('确定撤销通知吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'cancelNotice',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            moified(selected);
                            refresh(selected, data);
                            LG.tip('撤销通知成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;

            case "finish":

                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }

                $.ligerDialog.confirm('确定完成吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'finish',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            moified(selected);
                            refresh(selected, data);
                            LG.tip('完成成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });

                break;
            case "cancelFinish":

                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }

                $.ligerDialog.confirm('确定撤销完成吗?', function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'cancelFinish',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            moified(selected);
                            refresh(selected, data);
                            LG.tip('撤销完成成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });

                break;
            case "transAdjust":
                //transAdjust.js用到此tabid：transAdjust
                top.f_addTab("transAdjust", '司机排班', basePath + 'loadAdjust' +
                    '?module=' + param.module + '&function=' + param.fun);
                break;
            case "excelPrint01":
                excelPrint01();
                break;

            case "updateLineInfo":
                var selected = mainGrid.getCheckedRows();
                if (!selected || selected.length == 0) {
                    LG.showError("请选择行");
                    return;
                }
                //检查单据状态
                var msg = '确定更新吗?';

                $.ligerDialog.confirm(msg, function (confirm) {

                    if (!confirm) return;

                    LG.ajax({
                        url: basePath + 'updateLineInfo',
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            moified(selected);
                            refresh(selected, data);
                            LG.tip('更新成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;
            default:
                alert("未实现");
                break;
        }
    };

    //默认动作
    var defaultActionOption = {
        items: [
            // {id: 'copy', text: '复制', click: defaultAction, icon: 'copy', status: ['OP_INIT']},
            {
                'id': 'add',
                'text': '新增',
                'click': defaultAction,
                'icon': 'add',
                'status': ['OP_INIT']
            }, {
                'id': 'delete',
                'text': '删除',
                'click': defaultAction,
                'icon': 'delete',
                'status': ['OP_INIT']
            }, {
                'id': 'refresh',
                'text': '刷新',
                'click': defaultAction,
                'icon': 'refresh',
                'status': ['OP_INIT']
            }, {
                'id': 'submit',
                'text': '提交',
                'click': defaultAction,
                'icon': 'submit',
                'status': ['OP_INIT']
            }, {
                'id': 'notice',
                'text': '通知司机',
                'click': defaultAction,
                'icon': 'notice',
                'status': ['OP_INIT']
            }, {
                'id': 'finish',
                'text': '完成',
                'click': defaultAction,
                'icon': 'finish',
                'status': ['OP_INIT']
            }, {
                'id': 'cancelMenu',
                'text': '撤销',
                'icon': 'withdraw',
                'click': function () {
                },
                'menu': {
                    'items': [
                        {
                            'text': '撤销提交',
                            'click': defaultAction,
                            'id': 'cancelSubmit'
                        }, {
                            'text': '撤销通知',
                            'click': defaultAction,
                            'id': 'cancelNotice'
                        }, {
                            'text': '撤销完成',
                            'click': defaultAction,
                            'id': 'cancelFinish'
                        }
                    ]
                }
            }, {
                'id': 'transAdjust',
                'text': '司机排班',
                'click': defaultAction,
                'icon': 'modify',
                'status': ['OP_INIT']
            },
            {id: 'excelExport', text: '导出', click: excelExport, icon: 'download', status: ['OP_INIT']},
            {id: 'excelPrint01', text: '打印', click: excelPrint01, icon: 'download', status: ['OP_INIT']},
            {id: 'mapChoose', text: '地图选车', click: mapChoose, icon: 'download', status: ['OP_INIT']},
            // {id: 'updateLineInfo', text: '更新公里数', click: defaultAction, icon: 'update', status: ['OP_INIT']},
        ]
    };

    function excelExport() {

        //Excel模板下载
        $("#download").attr("action", "/tms/busi/trans/excelExport");
        var weee = filterForm.getSearchFormData(false, defaultSearchFilter);
        xlsUtil.exp($('#download'), mainGrid, "任务.xls", {where: weee});
    }

    //打印
    function excelPrint01() {

        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }
        if (selected.length > 5) {
            LG.showError("模板一次最多五张");
            return;
        }

        var joinStr = $.map(selected, function (item) {
            return item.pk_id;
        }).join(",");
        // console.log(joinStr)
        $("#download").attr("action", "/tms/busi/trans/excelPrint");
        xlsUtil.exp($('#download'), mainGrid, "承运单打印.xls", {pk_id: joinStr});


    }

    function openMapWin() {

        var selected = mainGrid.getCheckedRows();
        if ((selected == null) || (selected == '') || (selected == 'undefined')) {
            LG.showError('请选择行');
            return;
        }

        $.ligerDialog.open({
            title: '选择车辆',
            url: '/tms/busi/trans/loadMapChooser/' + selected[0].pk_id,
            height: 480,
            width: 640,
            buttons: [{
                text: '确定', onclick: function (item, dialog) {
                    LG.ajax({
                        url: basePath + 'updateCarNo',
                        data: JSON.stringify(selected[0], DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {
                            dialog.close();
                            moified(selected);
                            refresh(selected, [data]);

                            LG.tip('提交成功');
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                }
            }, {
                text: '取消', onclick: function (item, dialog) {
                    dialog.close();
                }
            }]
        });


    }

    function mapChoose() {
        openMapWin();
    }

    //初始化查询框
    filterForm = $filterForm.ligerSearchForm(filterFormOption);

    //初始化主表
    mainForm = $mainForm.ligerForm(mainFormOption);

    //初始化复制对话框
    copyForm = $copyForm.ligerForm(copyFormOption);

    //初始化工具栏
    toptoolbar = LG.powerToolBar($("#toptoolbar"), defaultActionOption);

    //初始化表格
    mainGrid = $mainGrid.ligerGrid(gridOption);

    //打开对话框
    function openDialog(data) {
        //消除校验格式
        LG.clearValid($mainForm);

        //设置时间格式有问题
        mainForm.setData(data);

        $.ligerDialog.open(dialogOption);
    }

    /**
     * 跳转到具体的页签
     * @param data
     */
    function jumpDetailEdit(rowdata) {
        top.f_addTab(rowdata.pk_id, '任务[' + rowdata.bill_no + ']', basePath + 'loadCard/' + rowdata.pk_id
            + '?module=' + param.module + '&function=' + param.fun);
    }

    //复制框
    var copyDialogOption = {
        target: $("#copyDialog"),
        title: '复制运单',
        width: 350,
        height: 150,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {

                    if (!copyForm.valid()) {
                        copyForm.showInvalid();
                        return;
                    }

                    var selected = $copyForm.data(SELECTED);

                    var copyData = copyForm.getData();

                    //复制单据
                    LG.singleAjax({
                        url: basePath + '/copyBatch/' + copyData.qty,
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {

                            dialog.hide();

                            refresh();
                            LG.tip("复制成功");
                        },
                        error: function (msg) {
                            LG.showError(msg);
                        }
                    }, item);

                    // });
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


    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var rowdata = mainGrid.getRow(index);
        jumpDetailEdit(rowdata);
    });

    //复制按钮
    $mainGrid.on('click', 'a.row-copy-btn', function (e) {
        var index = $(this).data("index");
        var rowdata = mainGrid.getRow(index);

        //散货业务类型
        if (rowdata.bs_type_code == TMS_BUSI_TYPE.TYPE_TRANS_CARGO) {

            //暂存数据
            $copyForm.data(SELECTED, rowdata);
            copyForm.setData({qty: 1});
            $.ligerDialog.open(copyDialogOption);
        } else {
            $.ligerDialog.confirm('确定复制吗?', function (confirm) {
                if (!confirm)
                    return;

                //复制单据
                LG.ajax({
                    url: basePath + '/copy',
                    data: JSON.stringify(rowdata, DateUtil.datetimeReplacer),
                    contentType: "application/json",
                    success: function (data, msg) {
                        refresh();
                        LG.tip("复制成功");
                    },
                    error: function (msg) {
                        LG.showError(msg);
                    }
                });
            });
        }
    });

    //单框搜索
    //本事件的e，输入的值，触发源，触发源的e
    $("body").on("single-search", function (e, value, target, target_e) {
        value = $.trim(value);

        if (typeof defaultSearchFilter === "undefined") {
            defaultSearchFilter = {
                and: [],
                or: []
            };
        }
        mainGrid.set('parms', [{name: 'where', value: mainGrid.getSearchGridData(true, value, defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
        refreshQuick();
    });

    //历史表单搜索
    $("body").on("keypress", function (e) {
        var $advancedSearchWrap = $("#advanced-search-wrap");
        //在高级搜索关闭时
        if (e.keyCode == 13 && (!$advancedSearchWrap.length || $advancedSearchWrap.is(":hidden"))) {
            e.stopPropagation();
            e.preventDefault();
            historySearch();
            return false;
        }
    });
    function historySearch() {
        filterForm.historySearch();
        //清除tag选择样式
        $(".quick-search>.qs-item.visited").removeClass("visited");
    }

    //路径返回此页
    $("body").on("afterBackTab", function () {
        refresh();
    });


    var refreshQuick = (function () {
        //绑定快捷查询
        $quickSearch.on('click', '.qs-item', function (e) {
            var g = $(this);

            $(".qs-item.visited").removeClass("visited");
            g.addClass("visited");

            //状态常量
            var state = g.data('state');

            if (state == 'MODIFIED') {
                moifiedTab()
                return;
            }
            //添加条件
            if (typeof defaultSearchFilter === "undefined") {
                defaultSearchFilter = {
                    and: [],
                    or: []
                };
            } else {
                defaultSearchFilter.and.length = 0;
                defaultSearchFilter.or.length = 0;
            }

            if (state && state != 'ALL') {
                defaultSearchFilter.and.push({field: 'state', value: state, op: 'in', type: 'string'});
            }

            //刷新表单
            mainGrid.set('parms', [{name: 'where', value: filterForm.getSearchFormData(true, defaultSearchFilter)}]);
            mainGrid.changePage('first');
            mainGrid.loadData();
        });

        function refreshQuickSearchBar(start, end) {
            var time = getEqTime();
            var ite = new Date(time.start) >= toDay;
            //刷新下方统计
            LG.ajax({
                url: basePath + 'loadQuickData',
                data: {
                    'start': time.start,
                    'end': time.end
                },
                success: function (data, msg) {
                    //设置快速搜索的值
                    $quickSearch.find('.qs-item > span').not(':last').html(0);
                    if (ite) return false;
                    $.each(data, function (i, v) {
                        $quickSearch.find('.qs-item[data-tab=' + v.state + '] > span').html(v.qty);
                    });
                },
                error: function (msg) {
                    LG.tip("系统内部错误");
                }
            });
        }

        function getEqTime() {
            var startTime = new Date(filterForm.getData().create_time_start),
                endTime = filterForm.getData().create_time_end ? filterForm.getData().create_time_end : toDay;
            var time = {};
            if (startTime > endTime) {
                time = {
                    start: endTime.format(),
                    end: startTime.format()
                }
            } else {
                time = {
                    start: startTime.format(),
                    end: endTime.format()
                }
            }
            return time;
        }

        return refreshQuickSearchBar;
    })();

    function moified(selected) {
        return;
        for (var i = selected.length - 1; i >= 0; i--) {
            var item = selected[i];
            if (operate.length == 0) {
                operate.push(item.pk_id);
            } else {
                var x = false;
                for (var j = operate.length - 1; j >= 0; j--) {
                    var jitem = operate[j];
                    if (item.pk_id === jitem) {
                        x = true
                        break
                    }
                }
                if (!x) {
                    operate.push(item.pk_id)
                }
            }
        }
        $('#quickSearch').children().last().children('span').text(operate.length);
    }

    function moifiedTab() {
        var parms = '';
        for (var i = operate.length - 1; i >= 0; i--) {
            var item = operate[i];
            parms += item + ',';
        }
        var value = parms.length > 1 ? parms.substr(0, parms.length - 1) : ' ';
        var parmValue = {
            'groups': [],
            'op': 'and',
            'rules': [
                {
                    'field': 'dr',
                    'op': 'equal',
                    'type': 'int',
                    'value': 0
                }, {
                    'datatype': '',
                    'field': 'PK_ID',
                    'ignore': false,
                    'op': 'in',
                    'type': 'text',
                    'value': value
                }
            ]
        };
        mainGrid.setParm('where', JSON2.stringify(parmValue));
        mainGrid.changePage('first');
        mainGrid.loadData();
    }

    /**
     * 操作后行刷新
     * @param selected 选中行
     * @param data 操作返回的数据
     */
    function refresh(selected, data) {
        $(".l-grid-row-cell-rownumbers").removeClass('operated');
        if (!selected && !data) {
            mainGrid.reload();
        } else {

            if (data && data.length > 0) {
                var mapping = {};
                $.map(data, function (item) {
                    mapping[item.pk_id] = item;
                    // if (item.children && item.children.length > 0) {
                    //     $.map(item.children, function (it) {
                    //         mapping[it.pk_id] = it;
                    //     });
                    // }
                });

                $.each(selected, function (idx, obj) {
                    //更新行数据的版本号
                    var newData = $.extend({}, obj, mapping[obj.pk_id]);
                    mainGrid.updateRow(obj['__id'], newData);
                    mainGrid.isDataChanged = false;
                    var dom = $(mainGrid.getRowObj(obj['__id'], true));
                    dom.children('.l-grid-row-cell-rownumbers').addClass('operated');
                });
            }
        }
    }

});