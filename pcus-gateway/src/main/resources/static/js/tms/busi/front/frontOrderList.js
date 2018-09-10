$(function () {

    //下拉框相对定位
    $.ligerDefaults.ComboBox.absolute = false;

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/busi/front/';

    //管理器
    var manager = {
        lastRecord: ''
    };

    //默认数据
    var emptyData = {},
        thisPkid = {};

    //页面元素
    var $gridWrapper = $(".grid-wrapper"),
        $filterForm = $("#filterForm"),
        $quickSearch = $('#quickSearch'),
        $mainDlg = $("#mainDlg"), //编辑弹窗
        $mainForm = $("#mainForm"), //编辑表单
        $mainGrid = $("#mainGrid"),
        $copyForm = $("#copyForm"),
        $copyDialog = $("#copyDialog"), //复制框
        $uploadDlg = $("#uploadDlg"),
        $mergeDialog = $("#mergeDialog"), //显示表格
        localStorageName = "grid" + user.id + param.no;  // 本地存储名字


    //页面控件
    var toptoolbar, //工具栏
        filterForm, //快速查询
        mainGrid, //列表
        mainForm, //编辑表单
        copyForm, //复制表单
        mainDlg, //弹窗
        copyDialog, //复制框
        uploadDlg,
        mergeDialog,
        mergeListBox;

    //全局查询过滤
    var defaultSearchFilter = {
        and: [],
        or: []
    };


    var filterFormFieldWidth = {
        w1: 155,
        w2: 310,
        w3_2: 405
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

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '编辑', align: '', minWidth: 30, width: '2%', isSort: false, frozen: true, quickSort: false, storageName: 'edit',
                render: function (item, index) {
                    return '<a class="row-edit-btn" data-index="' + index + '" title="编辑"><i class="iconfont l-icon-edit"></i></a>';
                }
            },
            {
                //行内按钮
                display: '复制', align: '', minWidth: 30, width: '2%', isSort: false, frozen: true, quickSort: false, storageName: 'copy',
                render: function (item, index) {
                    return '<a class="row-copy-btn" data-index="' + index + '" title="复制"><i class="iconfont l-icon-copy"></i></a>';
                }
            },
            {
                display: '主副单/柜',
                name: 'bill_main',
                align: 'left',
                minWidth: 70,
                width: '3%',
                frozen: true,
                quickSort: false,
                render: function (item) {
                    switch (item.bill_main) {
                        case "0":
                            return "主";
                        case "1":
                            return "副";
                        default:
                            return "";
                    }
                }
            },
            {
                display: '状态', name: 'order_state', align: 'left', minWidth: 60, width: '3%', frozen: true, quickSort: false,
                render: function (item, index, value) {
                    //  trans_finish , trans_total
                    //  trans_receipted  , trans_total
                    var html;
                    if (value == "新记录") {
                        html = '<div class="l-grid-row-cell-inner cyan-100">';
                    } else if (value == "已审核") {
                        html = '<div class="l-grid-row-cell-inner blue-100">';
                    } else if (value == "已完成") {
                        if (item.trans_finish == item.trans_total) {
                            html = '<div class="l-grid-row-cell-inner orange-100">';
                        } else {
                            html = '<div class="l-grid-row-cell-inner orange-50">';
                        }
                    } else if (value == "已回单") {
                        if (item.trans_receipted == item.trans_total) {
                            html = '<div class="l-grid-row-cell-inner pink-100">';
                        } else {
                            html = '<div class="l-grid-row-cell-inner pink-50">';
                        }
                    } else if (value == "已核费用") {
                        html = '<div class="l-grid-row-cell-inner gray-100">';
                    }
                    else {
                        html = '<div class="l-grid-row-cell-inner ">';
                    }
                    html = html + value + '</div>';
                    return html;
                }
                // render: LG.render.ref(data_state, 'state', null, null, function (text, item) {
                //     if (item.state === TMS_STATE.STATE_10_NEW) {
                //         return '<div class="state-new bg-cell">' + text + '</div>';
                //     }
                //     return text;
                // })
            },
            {
                display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 80, width: '5%', frozen: true
            },
            {
                display: '运输单号', name: 'bill_no', align: 'left', minWidth: 100, width: '5%', frozen: true
            },
            {
                display: '客户', name: 'client_name', align: 'left', minWidth: 120, width: '8%', frozen: true
            },
            {
                display: '应付费用', name: 'pay', align: 'left', minWidth: 80, width: '2%', isSort: false, frozen: true, quickSort: false,
                render: function (item) {
                    return (item.total_pay || 0) + '(' + (item.audited_pay || 0) + ')'
                }
            },
            {
                display: '应收费用', name: 'charge', align: 'left', minWidth: 80, width: '2%', isSort: false, frozen: true, quickSort: false,
                render: function (item) {
                    return (item.total_charge || 0) + '(' + (item.audited_charge || 0) + ')'
                }
            },
            {
                display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 150, width: '8%'
            },
            {
                display: '车型', name: 'booking_car_type', align: 'left', minWidth: 50, width: '5%', quickSort: false,
                render: LG.render.ref(data_dict[DICT_CODE.car_type], 'booking_car_type')
            },
            {
                display: '<span class="trans-highlight">预抵时间</span>', name: 'cntr_work_time', align: 'left', minWidth: 130, width: '5%', xlsHead: '预抵时间',
                type: 'date', format: "yyyy-MM-dd hh:mm:ss",
                editor: {
                    type: 'date',
                    ext: {
                        showTime: true
                    }
                }
            },
            {
                display: '<span class="trans-highlight">柜号</span>', name: 'cntr_no', align: 'left', minWidth: 100, width: '5%', xlsHead: '柜号', editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">封条号</span>', name: 'cntr_seal_no', align: 'left', minWidth: 100, width: '5%', xlsHead: '封条号', editor: {type: 'text'}
            },
            {
                display: '甩挂', name: 'cntr_drop_trailer', align: 'left', minWidth: 40, width: '2%', quickSort: false,
                render: LG.render.boolean('cntr_drop_trailer')
            },
            {
                display: '孖拖', name: 'cntr_twin', align: 'left', minWidth: 40, width: '2%', quickSort: false,
                render: LG.render.boolean('cntr_twin')
            },
            // {
            //     display: '孖拖柜号', name: 'cntr_twin_no', align: 'left', minWidth: 100, width: '2%'
            // },
            {
                display: '关联柜号', name: 'trans_cntr_no', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '客户委托号', name: 'client_bill_no', align: 'left', minWidth: 120, width: '5%'
            },
            // {
            //     display: '装货单位信息', name: 'load_org', align: 'left', minWidth: 200, width: '10%',
            //     render: function (item) {
            //         return (item.load_org || '') + ' ' +
            //             (item.load_linkman || '') + ' ' +
            //             (item.mobile || '')
            //     }
            // },
            // {
            //     display: '卸货单位信息', name: 'unload_org', align: 'left', minWidth: 200, width: '10%',
            //     render: function (item) {
            //         return (item.unload_org || '') + ' ' +
            //             (item.unload_linkman || '') + ' ' +
            //             (item.unload_mobile || '')
            //     }
            // },
            {
                display: '订舱号', name: 'booking_no', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '船公司', name: 'ship_corp', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '船名', name: 'ship_name', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '航次', name: 'voyage', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '提柜地', name: 'gate_out_dock', align: 'left', minWidth: 150, width: '5%'
            },
            {
                display: '还柜地', name: 'gate_in_dock', align: 'left', minWidth: 150, width: '5%'
            },
            /********************************************
             * 其它信息
             ********************************************/
            {
                display: '操作单位', name: 'oper_unit', align: 'left', minWidth: 100, width: '5%',
                render: LG.render.ref(data_dict[DICT_CODE.oper_unit], 'oper_unit')
            },
            // {
            //     display: '装卸/提还柜报价区域', name: 'load_region', align: 'left', minWidth: 150, width: '5%',
            //     render: function (item) {
            //         function join(a, b, c, d) {
            //             var s = [];
            //             if (a) s.push(a);
            //             if (b) s.push(b);
            //             if (c) s.push(c);
            //             if (d) s.push(d);
            //             return s.join('|');
            //         }
            //         return join(item.load_region,
            //             item.unload_region,
            //             item.gate_out_region,
            //             item.gate_in_region);
            //     }
            // },
            {
                display: '负责人', name: 'manager', align: 'left', minWidth: 80, width: '5%',
            },
            {
                display: '主单单号', name: 'main_bill_no', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '急单类型', name: 'urgen_order_type', align: 'left', minWidth: 80, width: '5%', quickSort: false,
                render: LG.render.ref(data_dict[DICT_CODE.urgent_order], 'urgen_order_type')
            },
            {
                display: '带货', name: 'take_goods', align: 'left', minWidth: 40, width: '5%', quickSort: false,
                render: LG.render.boolean('take_goods')
            },
            {
                display: '审核人', name: 'audit_psn', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '审核时间', name: 'audit_time', align: 'left', minWidth: 130, width: '5%', quickSort: false,
            },
            {
                display: '创建人', name: 'create_psn', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '创建时间', name: 'create_time', align: 'left', minWidth: 130, width: '5%', quickSort: false,
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%'
            }
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        dataAction: 'server',
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -40,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        colDraggable: true,            // 移动表头
        localStorageName: localStorageName,// 本地存储名字
        selectRowButtonOnly: true,
        sortName: 'STATE,CREATE_TIME',
        sortOrder: 'ASC,DESC',
        parms: {
            'where': JSON2.stringify(where)
        },
        tree: {columnName: 'bill_main'},
        rowClsRender: function (item, rowid, data, i) {
            var className = "",
                nextItem = data[i + 1];
            if (item.bill_main === null) {
                className = " unShowColspace";
            }
            else {
                className = " showColspace";
                if (item.bill_main == 0) {
                    className += " main";
                }
                else if (item.bill_main == 1) {
                    className += " sub";
                    if (nextItem && (nextItem.bill_main != 1)) {
                        className += " lastShow";
                    }
                }
            }
            if (nextItem && (nextItem.bill_main == 0)) {
                className += " nextShow";
            }
            return className;
        },
        onAfterShowData: function () {
            /*未考虑初始化为收缩状态的情况 2016-11-30*/
            $(".showColspace.main").addClass("expanded").prev(".unShowColspace").addClass("expanded");
            changeAltRows($mainGrid.find(".l-grid-body1:eq(0)").find(".l-grid-row"));
            changeAltRows($mainGrid.find(".l-grid-body2:eq(0)").find(".l-grid-row"));
            //更改间隔行
            function changeAltRows($rows) {
                $rows = $rows.not(".sub.showColspace");
                $rows.filter(":odd").addClass("l-grid-row-alt");
                $rows.filter(":even").removeClass("l-grid-row-alt");
            }
        },
        onTreeExpanded: function (rowdata) {
            $(this.getRowObj(rowdata, true)).addClass("expanded").prev(".unShowColspace").addClass("expanded");
            $(this.getRowObj(rowdata)).addClass("expanded").prev(".unShowColspace").addClass("expanded");
        },
        onTreeCollapsed: function (rowdata) {
            $(this.getRowObj(rowdata, true)).removeClass("expanded").prev(".unShowColspace").removeClass("expanded");
            $(this.getRowObj(rowdata)).removeClass("expanded").prev(".unShowColspace").removeClass("expanded");
        },
        onDblClickRow: function (rowdata, rowid, rowHtml, cellHtml) {

            thisPkid = $.extend({}, rowdata);

            var column = this.getColumn(cellHtml);
            if (!column || !column.editor) {
                jumpDetailEdit(rowdata);
            } else {
                if (cellHtml) {
                    this._applyEditor(cellHtml);
                    $(this.editor.input).focus();
                }
            }

            // jumpDetailEdit(rowdata);
        },
        onAfterEdit: function (e) {
            //立即更新字段值模式
            var record = $.extend({}, e.record);
            var columnname = e.column.columnname;
            alert(columnname)

            var postData = {
                pk_id: e.record.pk_id,
                version: e.record.version,
                state: e.record.state,
                columnname: columnname
            }

            postData[e.column.columnname] = e.value;

            var UPDATE_DATA = {};
            UPDATE_DATA[columnname] = e.value;


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

            //待更新的字段
            var keys = Object.keys(UPDATE_DATA);
            keys.push(postData.columnname);
            postData.columnname = keys.join(",");
            postData = $.extend({}, postData, UPDATE_DATA); //复制属性

            LG.ajax({
                url: basePath + 'updateByCoulumnName',
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
            var column = editParm.column,
                record = editParm.record;

            //检查字段是否可编辑
            if (record.state != TMS_STATE.STATE_10_NEW) {

                throttle(function () {
                    LG.tip("单据状态不是[新任务]，不能修改");
                }, 10)();

                return false;
            }

            //记录修改前的值
            manager.lastRecord = $.extend({}, record);

            return true;
        },

        onLoaded: function (data){
            refreshQuick();
            this.toggleLoading.ligerDefer(this, 10, [false]);
        }
    };

    //调试用
    if (location.hostname === "localhost") {
        gridOption.columns.push(
            {display: '状态', name: 'state', align: 'left', minWidth: 100, width: '8%'},
            {display: '司机拉单', name: 'bill_driver', align: 'left', minWidth: 100, width: '8%', render: LG.render.boolean("bill_driver")},
            {display: '状态更新时间', name: 'state_modify_time', align: 'left', minWidth: 100, width: '8%'},
            {display: '任务总数', name: 'trans_total', align: 'left', minWidth: 80, width: '8%'},
            {display: '任务完成数', name: 'trans_finish', align: 'left', minWidth: 80, width: '8%'},
            {display: '任务回单数', name: 'trans_receipted', align: 'left', minWidth: 80, width: '8%'},
            // {display: '审核费用', name: 'audited_fee', align: 'left', minWidth: 80, width: '8%'},
            {display: '应收(总)', name: 'total_charge', align: 'left', minWidth: 80, width: '8%'},
            {display: '应收(已审)', name: 'audited_charge', align: 'left', minWidth: 80, width: '8%'},
            {display: '应付(总)', name: 'total_pay', align: 'left', minWidth: 80, width: '8%'},
            {display: '应付(已审)', name: 'audited_pay', align: 'left', minWidth: 80, width: '8%'}
        );
    }

    var fontSzie = 12 / detectZoom(top);
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
                $("a.qs-item.visited").removeClass("visited");
            }
        },

        historySearch: {
            formId: "history-search-form",
            storageId: "order_ui" + user.id,
            searchBtnId: "history-search-btn",
            wordWidth: fontSzie,
            fieldWidthDiff: fontSzie,
            options: {
                labelWidth: 85,
                inputWidth: 170,
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
                "bill_main": {
                    options: {
                        absolute: true
                    }
                },
                "client_id": {
                    options: {
                        absolute: true
                    }
                },
                "cntr_twin": {
                    options: {
                        absolute: true
                    }
                },
                "take_goods": {
                    options: {
                        absolute: true
                    }
                },
                "create_time_s": {
                    newline: false,
                    width: filterFormFieldWidth.w1
                },
                "create_time_e": {
                    display: "(创建时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 84
                },
                "audit_time_s": {
                    width: filterFormFieldWidth.w1,
                    newline: false
                },
                "audit_time_e": {
                    display: "(审核时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 84
                },
                "cntr_work_time_s": {
                    width: filterFormFieldWidth.w1,
                    newline: false
                },
                "cntr_work_time_e": {
                    display: "(预抵时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 108
                },
                "bill_time_s": {
                    width: filterFormFieldWidth.w1,
                    newline: false
                },
                "bill_time_e": {
                    display: "(报关时间)至",
                    width: filterFormFieldWidth.w1,
                    labelWidth: 108
                }
            }
        },

        labelWidth: 85,
        inputWidth: filterFormFieldWidth.w1,
        space: 5,
        prefixID: "s_",
        fields: [
            {
                display: "客户(精确)", name: "client_id", newline: false,
                type: "select", cssClass: "field", comboboxName: "client_id_c",
                options: {
                    data: data_clients,
                    absolute: true,
                    cancelable: true,
                    isMultiSelect: true, //多选
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    split: ',' //逗号隔开
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {display: "客户(模糊)", name: "client_name", newline: false, type: "text", cssClass: "field"},
            {
                display: "业务类型", name: "bs_type_code", newline: false,
                type: "select", cssClass: "field", comboboxName: "bs_type_code_c",
                options: {
                    data: data_bs_type_name,
                    absolute: true,
                    cancelable: true,
                    isMultiSelect: true, //多选
                    split: ',' //逗号隔开
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: "单据状态", name: "order_state", newline: false,
                type: "select", cssClass: "field", comboboxName: "state_c",
                options: {
                    data: [{id: '新记录', text: '新记录'}, {id: '已审核', text: '已审核'},
                        {id: '已完成', text: '已完成'}, {id: '已回单', text: '已回单'}, {id: '已核费用', text: '已核费用'}],
                    absolute: true,
                    cancelable: true,
                    isMultiSelect: true, //多选
                    split: ',' //逗号隔开
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: "运输单号", name: "bill_no", newline: false, type: "text", cssClass: "field"
            },
            {
                display: '主副单/柜', name: 'bill_main', newline: false,
                type: "select", cssClass: "field",
                editor: {
                    cancelable: false,
                    data: [
                        {text: '主', id: 0},
                        {text: '副', id: 1}
                    ]
                },
                attr: {
                    op: "equal"
                }
            },
            {
                display: "揽货公司", name: "supplier_name", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "主单号", name: "main_bill_no", newline: false, type: "text", cssClass: "field"
            },

            {
                display: "封条号", name: "cntr_seal_no", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "客户委托号", name: "client_bill_no", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "司机", name: "driver_name", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "车牌号", name: "car_no", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "柜号", name: "cntr_no", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "关联柜号", name: "trans_cntr_no", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "甩挂", name: "cntr_drop_trailer", newline: false,
                type: "select", cssClass: "field",
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
            {
                display: "孖拖", name: "cntr_twin", newline: false,
                type: "select", cssClass: "field",
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
            {
                display: "装货单位", name: "load_org", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "卸货单位", name: "unload_org", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "订舱号", name: "booking_no", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "船公司", name: "ship_corp", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "船名", name: "ship_name", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "航次", name: "voyage", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "提柜地", name: "gate_out_dock", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "还柜地", name: "gate_in_dock", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "操作单位", name: "oper_unit", newline: false,
                type: "select", cssClass: "field", comboboxName: "oper_unit_c",
                options: {
                    data: data_dict[DICT_CODE.oper_unit],
                    absolute: true,
                    cancelable: true,
                    isMultiSelect: true, //多选
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    split: ',' //逗号隔开
                },
                attr: {
                    op: "in" //操作符
                }
            },
            {
                display: "负责人", name: "manager", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "急单类型", name: "urgen_order_type", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "带货", name: "take_goods", newline: false,
                type: "select", cssClass: "field",
                editor: {
                    cancelable: false,
                    data: [
                        {text: '是', id: 'Y'},
                        {text: '否', id: 'N'}
                    ]
                },
                attr: {
                    op: "equal" //操作符
                }
            },
            {
                display: "审核人", name: "audit_psn", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "创建人", name: "create_psn", newline: false, type: "text", cssClass: "field"
            },
            {
                display: "预抵时间", name: "cntr_work_time_s", newline: true,
                type: "date",
                width: filterFormFieldWidth.w2,
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    "data-name": "cntr_work_time",
                    op: "greaterorequal" //操作符
                }
            },
            {
                display: "至", name: "cntr_work_time_e", newline: false,
                type: "date",
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    "data-name": "cntr_work_time",
                    op: "lessorequal" //操作符
                }
            },
            {
                display: "报关时间", name: "bill_time_s", newline: true,
                type: "date",
                width: filterFormFieldWidth.w2,
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    "data-name": "bill_time",
                    op: "greaterorequal" //操作符
                }
            },
            {
                display: "至", name: "bill_time_e", newline: false,
                type: "date",
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    "data-name": "bill_time",
                    op: "lessorequal" //操作符
                }
            },
            {
                display: "审核时间", name: "audit_time_s", newline: true,
                width: filterFormFieldWidth.w2,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    "data-name": "audit_time",
                    op: "greaterorequal" //操作符
                }
            },
            {
                display: "至", name: "audit_time_e", newline: false,
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    "data-name": "audit_time",
                    op: "lessorequal" //操作符
                }
            },
            {
                display: "创建时间", name: "create_time_s", newline: true,
                width: filterFormFieldWidth.w2,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    value: oldDay.format(),
                    "data-name": "create_time",
                    op: "greaterorequal" //操作符
                }
            },
            {
                display: "至", name: "create_time_e", newline: false,
                width: filterFormFieldWidth.w2,
                labelWidth: 24,
                type: "date",
                cssClass: "field",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm"},
                attr: {
                    value: toDay.format(),
                    "data-name": "create_time",
                    op: "lessorequal" //操作符
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
                    data: data_bs_type_name,
                    cancelable: true,
                    textFieldID: 'text',
                    valueFieldID: 'value'
                },
                cssClass: "field",
                validate: {required: true},
            },
            {
                display: '委托客户',
                name: 'client_name',
                labelWidth: 80,
                width: 170,
                space: 30,
                newline: false,
                cssClass: "field",
                type: "select",
                comboboxName: "client_name_c",
                options: {
                    data: data_clients,
                    cancelable: true,
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    isTextBoxMode: true,
                    onSelected: function (newValue, newText, rowData) {
                        var dataLinkmans = $.grep(data_clientLinkmans, function (n, i) {
                            return data_clientLinkmans[i].pname === newText;
                        });
                        liger.get("linkman_c").setData(dataLinkmans, true);
                    },
                    onClear: function () {
                        liger.get("linkman_c").clear();
                        liger.get("linkman_c").setData([], true);
                        liger.get('linkman_mobile').setValue("");
                    }
                },
                validate: {
                    required: true
                }
            },
            {
                display: '客户联系人',
                name: 'linkman',
                labelWidth: 80,
                width: 170,
                space: 30,
                newline: false,
                cssClass: "field",
                type: "select",
                comboboxName: "linkman_c",
                options: {
                    data: [],
                    cancelable: true,
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    isTextBoxMode: true,
                    onSelected: function (newvalue) {
                        var selecteData = $.grep(data_clientLinkmans, function (n, i) {
                            return data_clientLinkmans[i].id === newvalue;
                        })[0];
                        liger.get('linkman_mobile').setValue((!selecteData ? '' : selecteData.mobile), true);
                    }
                }
            },
            {
                display: "联系电话",
                name: "linkman_mobile",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                // validate: {required: true},
            },
            {
                display: '揽货公司',
                name: 'supplier_name',
                labelWidth: 80,
                width: 170,
                space: 30,
                newline: false,
                cssClass: "field",
                type: "select",
                comboboxName: "supplier_name_c",
                options: {
                    data: data_suppliers,
                    cancelable: true,
                    autocomplete: true,
                    keySupport: true,
                    isTextBoxMode: true
                },
                validate: {
                    required: true
                }
            },
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
    };

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

    //对话框
    var mergeDialogOption = {
        target: $("#mergeDialog"),
        title: '合并运单',
        width: 450,
        height: 300,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {

                    //校验数据
                    var items = mergeListBox.getSelectedItems();
                    if (!items || items.length == 0) {
                        LG.showError("请选择主单");
                        return;
                    }

                    //
                    var selected = [];
                    for (var i = 0; i < mergeListBox.data.length; i++) {

                        selected.push($.extend({}, mergeListBox.data[i]));
                        //设置选中的单据作为主单
                        if (selected[i].id === items[0].id) {
                            selected[i].bill_main = 0;
                        }
                    }

                    LG.singleAjax({
                        url: basePath + "merge",
                        data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                        contentType: "application/json",
                        success: function (data, msg) {

                            dialog.hide();
                            //刷新角色列表
                            refresh();

                            LG.tip('合并完成!');
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

    //导入失败对话框
    var dialogOption_importFail = {
        target: $("#importFailDialog"),
        title: '导入结果',
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

    var SELECTED = 'selected';

    //默认增删改查刷新
    var defaultAction = function (item) {
        switch (item.id) {
            case "add":
                //打开对话框
                add(emptyData);
                break;
            case "delete":
                //删除
                remove();
                break;
            case "refresh":
                //刷新
                refresh();
                break;
            case "copy":
                //复制
                copy();
                break;
            case "audit":
                //审核
                audit();
                break;
            case "cancel":
                //取消
                cancel();
                break;
            //合并
            case "merge":
                merge();
                break;
            case "cancelMerge":
                cancelMerge();
                break;
            case "importFee":
                importFee();
                break;
            case "auditFee":
                auditFee();
                break;
            case "excelTmpl":
                excelTmpl();
                break;
            case "excelImport":
                excelImport();
                break;
            default:
                //扩展按钮动作
                alert("动作无效");
                break;
        }
    };

    //默认动作
    var defaultActionOption = {
        items: [
            {id: 'add', text: '增加', click: defaultAction, icon: 'add', status: ['OP_INIT']},
            {id: 'delete', text: '删除', click: defaultAction, icon: 'delete', status: ['OP_INIT']},
            {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']},
            {id: 'merge', text: '拼单/孖拖', click: defaultAction, icon: 'join', status: ['OP_INIT']},
            {id: 'cancelMerge', text: '撤销合并', click: defaultAction, icon: 'withdraw', status: ['OP_INIT']},
            {id: 'audit', text: '审核', click: defaultAction, icon: 'audit', status: ['OP_INIT']},
            {id: 'cancel', text: '撤销', click: defaultAction, icon: 'withdraw', status: ['OP_INIT']},
            {id: 'importFee', text: '导入费用', click: defaultAction, icon: 'dataimport', status: ['OP_INIT']},
            {id: 'auditFee', text: '审收审付', click: defaultAction, icon: 'audit', status: ['OP_INIT']},
            {id: 'excelTmpl', text: '模板下载', click: defaultAction, icon: 'download', status: ['OP_INIT']},
            {id: 'excelImport', text: '订单导入', click: defaultAction, icon: 'submit', status: ['OP_INIT']},
        ]
    };

    //初始化查询框
    filterForm = $filterForm.ligerSearchForm(filterFormOption);

    //初始化主表
    mainForm = $mainForm.ligerForm(mainFormOption);

    //初始化复制对话框
    copyForm = $copyForm.ligerForm(copyFormOption);

    //初始化工具栏
    toptoolbar = $("#toptoolbar").ligerToolBar(defaultActionOption);

    //初始化表格
    mainGrid = $mainGrid.ligerGrid(gridOption);

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

    /**
     * 打开对话框
     */
    function add(data) {

        //打开对话框
        mainForm.reset();

        //消除校验格式
        LG.clearValid($mainForm);

        //设置时间格式有问题
        mainForm.setData(data);

        $.ligerDialog.open(dialogOption);

        $mainForm.data(SELECTED, null);
    }

    /**
     * 合并
     * @param data
     */
    function merge() {

        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length <= 1) {
            LG.showError("请选择至少2张运单");
            return;
        }

        //检查单据状态
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].state !== TMS_STATE.STATE_10_NEW) {
                LG.showError("所选单据状态不是[新记录]，不可拼单");
                return;
            }
        }

        for (var i = 0; i < selected.length; i++) {
            selected[i] = $.extend({}, selected[i], {
                id: selected[i].pk_id,
                text: selected[i].bill_no
            });
        }

        if (!mergeListBox) {
            //初始化
            mergeListBox = $mergeDialog.find("#mergeListBox").ligerListBox({
                data: selected
            });
        } else {
            mergeListBox.clear();
            mergeListBox.setData(selected);
        }

        $.ligerDialog.open(mergeDialogOption);
    }

    /**
     * 删除
     */
    function remove() {
        var selected = mainGrid.getCheckedRows();
        if ((selected == null) || (selected == '') || (selected == 'undefined')) {
            LG.showError('请选择行');
            return;
        }
        ;

        //检查单据状态
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].state !== TMS_STATE.STATE_10_NEW) {
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
                    // refresh();
                    mainGrid.deleteSelectedRow();
                    LG.tip('删除成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    /**
     * 复制
     */
    function copy() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        //过滤副单
        selected = $.grep(selected, function (n, i) {
            return selected[i].bill_main != 1;
        });

        $.ligerDialog.confirm('确定复制吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'copy',
                data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                    LG.tip('复制成功');
                    refresh();
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    /**
     * 审核
     */
    function audit() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        //检查单据状态
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].state !== TMS_STATE.STATE_10_NEW) {
                LG.showError("所选单据状态不是[新记录]，不可审核");
                return;
            }
        }

        //过滤副单
        var postData = $.grep(selected, function (n, i) {
            return selected[i].bill_main != 1;
        });

        $.ligerDialog.confirm('确定审核吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'auditBatch',
                data: JSON.stringify(postData, DateUtil.datetimeReplacer),
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
     * 取消合并
     */
    function cancelMerge() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length <= 0) {
            LG.showError("请选择运单");
            return;
        }

        $.ligerDialog.confirm('确定撤销合并吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'cancelMerge',
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

    /**
     * 取消
     */
    function cancel() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        //检查单据状态
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].state !== TMS_STATE.STATE_30_AUDIT) {
                LG.showError("所选单据状态不是[已审核]，不可撤销");
                return;
            }
        }

        var postData = $.grep(selected, function (n, i) {
            return selected[i].bill_main != 1;
        });

        $.ligerDialog.confirm('确定撤销吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'cancelBatch',
                data: JSON.stringify(postData, DateUtil.datetimeReplacer),
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
    }

    /**
     * 审收审付
     */
    function auditFee() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        //检查单据状态
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].state < TMS_STATE.STATE_89_RECEIPTED) {
                LG.showError("所选单据状态不是[已回单]之后，不可审核");
                return;
            }
        }

        $.ligerDialog.confirm('确定审核费用吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'auditFeeBatch',
                data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, message, code) {
                    if (code == '201') {
                        LG.showError(parseMsg(data));
                    } else {
                        refresh(selected, data);
                        LG.tip('费用审核成功');
                    }
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    /**
     * 导入费用
     */
    function importFee() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        //检查单据状态
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].state < TMS_STATE.STATE_89_RECEIPTED) {
                LG.showError("所选单据状态不是[已回单]之后，不可导入费用");
                return;
            }
        }

        $.ligerDialog.confirm('确定导入费用吗?', function (confirm) {
            LG.showLoading('导入中');
            if (!confirm) return;
            LG.ajax({
                url: basePath + 'importFeeBatch',
                data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, message, code) {
                    if (code == '201') {
                        LG.showError(parseMsg(data));
                    } else {
                        refresh(selected, data.orderList);
                        // LG.tip('费用导入成功');

                        //格式化输出
                        var text = "";
                        var msgList = data.msgList;
                        for (var i = msgList.length - 1; i >= 0; i--) {
                            var item = msgList[i];
                            text += "<p>订单号：" + item.bill_no + " , " + item.message + "</p>";
                        }
                        var dom = '<div style="overflow: auto; max-height:100px;" >' + text + '</div>';
                        $.ligerDialog.success(dom, message);
                    }
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    /**
     * 模板下载
     */
    function excelTmpl() {
        //Excel模板下载
        $("#download").submit();
    }

    /**
     * 模板导入
     */
    function excelImport() {
        //Excel模板导入
        if (!uploadDlg) {
            uploadDlg = $.ligerDialog.open({
                target: $uploadDlg,
                title: '导入运单',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {
                        text: '导入', onclick: function () {
                        upload();
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
            formData.append('excel',
                JSON2.stringify({
                    name: 'fileupload', //上传控件名称
                    cover: cover || false, //是否覆盖
                    only_contain: true,
                    ignore_error: true,
                    meta: {
                        "委托客户": "client_name",
                        "业务类型": "bs_type_name",
                        "揽货公司": "supplier_name",
                        "操作单位": "oper_unit",
                        "备注": "remark",
                        "预约装卸时间": "load_work_time",
                        "装卸单位": "load_org",
                        "详细地址": "load_address",
                        "报价区域": "load_region",
                        "联系人": "load_linkman",
                        "联系电话": "load_mobile",
                        "预定数量": "booking_qty",
                        "预定车型": "booking_car_type",
                        "货物信息": "cargo_info",
                        "货物类型": "cargo_type",
                        "货物数量": "cargo_qty",
                        "单位": "cargo_unit",
                        "柜型": "cntr_type",
                        "柜号": "cntr_no",
                        "孖拖柜号": "cntr_no",
                        "封条号": "cntr_seal_no",
                        "甩挂": "cntr_drop_trailer",
                        "柜重": "cntr_weight",
                        "预约提柜时间": "cntr_work_time",
                        "提柜地": "gate_out_dock",
                        "还柜地": "gate_in_dock",
                        "提柜详细地址": "gate_out_yard",
                        "还柜详细地址": "gate_in_yard",
                        "提柜区域": "gate_out_region",
                        "还柜区域": "gate_in_region",

                        "船名": "ship_name",
                        "船公司": "ship_corp",
                        "航次": "voyage",
                        "订舱号/提单号": "booking_no",
                        "码头": "dock",
                        "船代": "agency",
                        "到港日期": "arrival_date",
                        "制单公司": "bill_org",
                        "报关时间": "bill_time",
                        "报关方式": "declare_type",
                        "封关地": "close_customs",
                        "报关行": "customs_broker",
                        "报关行联系人": "broker_linkman",
                        "报关行联系电话": "broker_mobile",
                        "报关行地址": "broker_address",
                        "急单类型": "urgen_order_type",
                        "客户委托号": "client_bill_no",
                        "客户联系人": "linkman",
                        "客户联系电话": "linkman_mobile",
                        "负责人": "manager",
                        "带货": "take_goods",
                        "操作注意": "load_oper_note",
                        "调度注意": "load_dispatch_note",
                        "司机注意": "load_driver_note",
                        "特殊运输要求": "trans_require"
                    },
                    header_row: 1,
                    data_start_row: 2
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

                            mainGrid.reload();

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

    /**
     * 跳转到具体的页签
     * @param data
     */
    function jumpDetailEdit(rowdata) {
        top.f_addTab(rowdata.pk_id, '运单[' + rowdata.bill_no + ']', basePath + 'loadCard/' + rowdata.pk_id
            + '?module=' + param.module + '&function=' + param.fun);
    }

    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var rowdata = mainGrid.getRow(index);

        thisPkid = $.extend({}, rowdata);
        jumpDetailEdit(rowdata);
    });

    $mainGrid.on('click', 'a.row-copy-btn', function (e) {

        var index = $(this).data("index");
        var rowdata = mainGrid.getRow(index);
        //暂存数据
        $copyForm.data(SELECTED, rowdata);
        copyForm.setData({qty: 1});

        $.ligerDialog.open(copyDialogOption);
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
        if (!thisPkid && !thisPkid.pk_id) {
            refresh();
            return;
        }
        var eq = thisPkid.bill_main == 1 ? true : false,
            url = eq ? 'refreshShowDetail' : 'refreshShow',
            data = eq ? {"order_id": thisPkid.pk_id} : JSON2.stringify([thisPkid.pk_id]),
            type = eq ? 'application/x-www-form-urlencoded' : 'application/json';

        $.ajax({
            dataType: 'json',
            type: 'post',
            contentType: type,
            url: basePath + url,
            data: data,
            success: function (result) {
                if (eq) {
                    refresh([thisPkid], [result]);
                } else {
                    refresh([thisPkid], result[0]);
                }
                thisPkid = {};
            }
        });
        // refresh();

    });

    /**
     * 刷新快速搜索
     */
    var refreshQuick = (function () {

        //绑定快捷查询
        $quickSearch.on('click', 'a', function (e) {

            var g = $(this);

            $("a.qs-item.visited").removeClass("visited");
            g.addClass("visited");

            //状态常量
            var state = g.data('state');

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
                defaultSearchFilter.and.push({field: 'order_state', value: state, op: 'equal', type: 'string'});
            }

            //刷新表单
            mainGrid.set('parms', [{name: 'where', value: filterForm.getSearchFormData(true, defaultSearchFilter)}]);
            mainGrid.changePage('first');
            mainGrid.loadData();

            refreshQuickSearchBar();
        });

        /**
         * 刷新下方数据统计
         */
        function refreshQuickSearchBar() {
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
                    // 设置快速搜索的值
                    $quickSearch.find('a.qs-item > span').html(0);
                    if(ite) return false;
                    $.each(data, function (i, v) {
                        $quickSearch.find('a[data-state=' + v.state + '] > span').html(v.qty);
                    });
                },
                error: function (msg) {
                    LG.tip("系统内部错误");
                }
            });
        }
        function getEqTime(){
            var startTime = new Date(filterForm.getData().create_time_s),
                endTime = filterForm.getData().create_time_e ? filterForm.getData().create_time_e : toDay;
            var time = {};
            if (startTime > endTime ) {
                time = {
                    start : endTime.format(),
                    end : startTime.format()
                }
            } else {
                time = {
                    start : startTime.format(),
                    end : endTime.format()
                }
            }
            return time;
        }

        return refreshQuickSearchBar;
    })();

    refreshQuick();

    /**
     * 刷新
     * @param selected
     * @param data
     */
    function refresh(selected, data) {
        $(".l-grid-row-cell-rownumbers").removeClass('operated');
        if (!selected && !data) {
            mainGrid.reload();
            refreshQuick();
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
});