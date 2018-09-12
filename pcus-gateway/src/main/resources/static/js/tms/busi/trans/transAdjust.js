/**
 * Created by wujian on 2017/2/6.
 */
$(function () {

    //管理器
    var manager = {
        lastRecord: ''
    };

    var basePath = rootPath + '/tms/busi/trans/';
    var $this = $(this);
    var layout,
        mainTree,
        mainTab,
        mainForm,
        adjustGrid,
        assignGrid,
        finishGrid;

    var $mainTree = $("#mainTree"),
        $mainForm = $("#mainForm");

    var lastSelectNode,//最后选择的节点，用于刷新树后重新选择相应的节点
        backConfirm = false,//用于返回的时候标记已确认了
        toptabid = "transAdjust";//本页签的tabid

    var gridBaseOption = {
        columns: [
            {
                display: '状态', name: 'state', align: 'left', minWidth: 60, width: '3%', frozen: false, quickSort: false,
                render: LG.render.ref(data_state, 'state', null, null, function (text, item) {
                    var html;
                    if (isAbleMove(item)){
                        html = '<div class="l-grid-row-cell-inner ">';
                    }
                    else{
                        html =  '<div class="l-grid-row-cell-inner orange-100">';
                    }
                    html = html +  text + '</div>';
                    return html;
                })
            },
            {
                display: '任务类型', name: 'task_type', align: 'left', minWidth: 60, width: '3%', frozen: false, quickSort: false,
                render: LG.render.ref(BILL_CONST.DATA_TASK_TYPE, 'task_type')
            },
            {
                display: '委托客户', name: 'client_name', align: 'left', minWidth: 120, width: '10%', frozen: false
            },
            /********************************************
             * 船信息
             ********************************************/
            {
                display: '订舱号/提单号', name: 'booking_no', align: 'left', minWidth: 120, width: '5%'
            },
            {
                display: '船公司', name: 'ship_corp', align: 'left', minWidth: 100, width: '5%', quickSort: false,
            },
            {
                display: '<span class="trans-highlight">预约提柜时间</span>',
                name: 'cntr_pick_time',
                minWidth: 120, width: '5%',
                xlsHead: '预约提柜时间',
                format: "yyyy-MM-dd hh:mm",
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
                minWidth: 180, width: '5%',
                xlsHead: '预约装卸时间',
                type: 'date',
                format: "yyyy-MM-dd hh:mm",
                editor: {
                    type: 'date',
                    ext: {
                        showTime: true,
                        format: "yyyy-MM-dd hh:mm"
                    }
                },
                render: function (item, index, text) {
                    // console.log(item);
                    if ( !text || text <= 0) {
                        return text;
                    }
                    if (typeof text === 'object') {
                        text = DateUtil.dateToStr('yyyy-MM-dd HH:mm:ss' ,text);
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
            {
                display: '提柜地', name: 'gate_out_dock', align: 'left', minWidth: 150, width: '5%'
            },
            {
                display: '装卸单位', name: 'lau_orgs', align: 'left', minWidth: 150, width: '5%', quickSort: false
            },
            {
                display: '车牌号',
                name: 'car_no',
                align: 'left',
                minWidth: 80,
                width: '5%'
            },
            {
                display: '司机',
                name: 'driver_name',
                align: 'left',
                minWidth: 80,
                width: '5%',
                render: function(item) {
                    return "<div "+ (!item.driver_id ? "class='alert-icon' title='未登记'" : "") +">" +  (item.driver_name || "") +"</div>"
                }
            },
            {
                display: '手机号', name: 'driver_mobile', align: 'left', minWidth: 100, width: '5%',
                editor: { type: 'text'}
            },
            {
                display: '外协', name: 'outsourcing', align: 'left', minWidth: 30, width: '2%',
                render: LG.render.boolean('outsourcing')
            },
            {
                display: '车型', name: 'booking_car_type', align: 'left', minWidth: 60, width: '5%',
                render: LG.render.ref(data_dict[DICT_CODE.car_type], 'booking_car_type')
            },
            {
                display: '承运方', name: 'carrier_name', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '负责人', name: 'manager', align: 'left', minWidth: 80, width: '5%'
            },
            /********************************************
             * 柜信息
             ********************************************/
            {
                display: '<span class="trans-highlight">柜号</span>', name: 'cntr_no', align: 'left', minWidth: 100, width: '5%',
                editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">封条号</span>', name: 'cntr_seal_no', align: 'left', minWidth: 100, width: '5%',
                editor: {type: 'text'}
            },
            {
                display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '2%'
            },
            {
                display: '甩挂', name: 'cntr_drop_trailer', align: 'left', minWidth: 40, width: '2%',
                render: LG.render.boolean('cntr_drop_trailer')
            },
            {
                display: '孖拖', name: 'cntr_twin', align: 'left', minWidth: 40, width: '2%',
                render: LG.render.boolean('cntr_twin')
            },
            {
                display: '孖拖柜号', name: 'cntr_twin_no', align: 'left', minWidth: 100, width: '2%',
            },
            {
                display: '船名', name: 'ship_name', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '航次', name: 'voyage', align: 'left', minWidth: 100, width: '5%'
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
            //     display: '操作人', name: 'manager', align: 'left', minWidth: 80, width: '5%',
            //     render: LG.render.ref([], 'manager')
            // },
            {
                display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 150, width: '10%'
            },
            {
                display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 80, width: '5%',
            },
            {
                display: '作业单号', name: 'bill_no', align: 'left', minWidth: 100, width: '8%',
            },
            {
                display: '运输单号', name: 'order_bill_no', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '客户委托号', name: 'client_bill_no', align: 'left', minWidth: 120, width: '5%'
            },
            {
                display: '提交人', name: 'audit_psn', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '提交时间', name: 'audit_time', align: 'left', minWidth: 130, width: '5%'
            },
            {
                display: '创建人', name: 'create_psn', align: 'left', minWidth: 100, width: '5%'
            },
            {
                display: '创建时间', name: 'create_time', align: 'left', minWidth: 130, width: '5%'
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%'
            }
        ],
        pageSize: 50,
        delayLoad: true,		//初始化不加载数据
        checkbox: true, //多选框
        width: '100%',
        height: '100%',
        dataAction: 'server',
        usePager: true,
        fixedCellHeight: true,
        heightDiff: -15,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'STATE,CREATE_TIME', //状态顺序、创建时间倒序
        sortOrder: 'ASC,DESC'
    };

    //初始化界面
    layout = $("#layout").ligerLayout({
        leftWidth: 160,
        height: '100%',
        space: 1,
        heightDiff: 0,
        centerBottomHeight: 200,
        onEndResize: function () {
            $(window).trigger("resize");
            //ligerLayout有bug，没法解绑mouseup，临时解决方案：在此处全都解绑了
            $(document).unbind('mouseup');
        },
        onLeftToggle: function () {
            $(window).trigger("resize");
        }
    });

    //生成页签
    mainTab = $("#mainTab").ligerTab({
        width: '100%',
        height: '100%',
        heightDiff: 0,
        changeHeightOnResize: true,
        onBeforeSelectTabItem: beforeSelectTabItem,
        onAfterSelectTabItem: afterSelectTabItem
    });

    //生成树
    mainTree = $mainTree.ligerTree({
        url: basePath + 'loadAdjustDrivers',
        nodeWidth: 200,
        idFieldName: 'id',
        textFieldName: 'text',
        parentIDFieldName: 'pid',
        slide: true,
        checkbox: false,
        isExpand: 2,
        needCancel: false,
        btnClickToToggleOnly: false,
        onSelect: selectTreeNode,
        selectable: function (o) {
            //根节点不能选择
            return !!o.pid;
        },
        onBeforeSelect: function () {
            return continueConfirm();
        },
        onSuccess: function () {
            var select;
            if(lastSelectNode){
                select = $("#" + lastSelectNode.data.pid).find("#" + lastSelectNode.data.id)[0];
            }
            if(!select){
                select = $mainTree.children(":eq(0)").children("ul:eq(0)").children("li:eq(0)")[0] ||
                    $mainTree.children(":eq(1)").children("ul:eq(0)").children("li:eq(0)")[0];
            }
            
            this.selectNode(select, true);
        }
    });

    //生成新增表单
    mainForm = $mainForm.ligerForm({
        labelWidth: 70,
        inputWidth: 200,
        space: 30,
        prefixID: "m_",
        fields: [
            {
                display: "车牌",
                name: "car",
                newline: false,
                type: "select",
                cssClass: "field",
                comboboxName: "car_c",
                options: {
                    data: data_car,
                    absolute: true,
                    cancelable: false,
                    autocomplete: true,
                    autocompleteKeyField: 'key_text',
                    isTextBoxMode: true,
                    keySupport: true,
                    highLight: true,
                    selectBoxWidth: 350,
                    selectBoxHeight: 250,
                    renderItem: function (data, value, text, key) {

                        var g = this;
                        var item = data.data;

                        //TODO 样式待调整 ? 什么样式
                        var key_text = '<span class="combobox-list-item car_no-item">' + item.key_text + '</span>';
                        key_text += '<span class="combobox-list-item car_no-item">' + item.driver_name + '</span>';
                        key_text += '<span class="combobox-list-item car_no-item">' + item.carrier_name + '</span>';
                        // key_text += '<span class="combobox-list-item car_no-item">' + '产值:' + ('' + (item.output || 0).toFixed(2)) + '</span>';
                        // key_text += '<span class="combobox-list-item car_no-item">' + '提成:' + ('' + (item.percentage || 0).toFixed(2)) + '</span>';
                        key_text += '<span class="combobox-list-item car_no-item">' + item.type_name + '</span>';

                        return g._highLight(key_text, $.trim(data.key));
                    },
                    onBlur: function (text) {
                        selectCar(text);
                    },
                    onSelected: function (newValue, newText, rowData) {
                        selectCar(newText);
                    }
                },
                validate: {required: true}
            },
            {
                display: "司机",
                name: "driver",
                newline: false,
                type: "select",
                cssClass: "field",
                comboboxName: "driver_c",
                options: {
                    data: data_driver,
                    absolute: true,
                    cancelable: false,
                    autocomplete: true,
                    autocompleteKeyField: 'key_text',
                    isTextBoxMode: true,
                    keySupport: true,
                    highLight: true,
                    selectBoxWidth: 350,
                    selectBoxHeight: 250,
                    renderItem: function (data, value, text, key) {
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
                    onBlur: function (text) {
                        //找到所有的匹配项
                        var driver = getDatasByField(data_driver, text, "text"),
                            currentId = $(mainForm.element).find("#" + (mainForm.options.prefixID || "") + "driver_id").eq(0).val();
                        if(driver.length > 0){
                            //查找当前id是否已在数组中
                            if(!currentId || !valueInArray(driver, "id", currentId)){
                                //id不存在，或者id不在匹配的数组中，须设置新的值
                                var driverData = driver[0];
                                setFieldsValue(mainForm, {
                                    "driver_id":driverData.id,
                                    "driver_mobile": driverData.mobile,
                                    "outsourcing_c": driverData.outsourcing ? "Y" : "N",
                                    "carrier_name_c": driverData.carrier_id
                                });
                            }
                        }
                        else{
                            //清空数据
                            setFieldsValue(mainForm, {
                                "driver_id": "",
                                "driver_mobile": "",
                                "outsourcing_c": "",
                                "carrier_name_c": ""
                            });
                        }

                        function valueInArray(array, filed, value) {
                            for(var i = 0, len = array.length; i< len; i++){
                                if(array[i][filed] == value) return true;
                            }
                            return false;
                        }
                    },
                    onSelected: function (newValue, newText, rowData) {
                        if(newValue !== newText){//手动选择值
                            var driverData = getDataByField(data_driver, newValue, "id");
                            driverData && setFieldsValue(mainForm, {
                                "driver_c":driverData.text,
                                "driver_id":driverData.id,
                                "driver_mobile": driverData.mobile,
                                "outsourcing_c": driverData.outsourcing ? "Y" : "N",
                                "carrier_name_c": driverData.carrier_id
                            });
                        }
                    }
                },
                validate: {required: true}
            },
            {
                display: '',
                name: 'driver_id',
                newline: false,
                cssClass: "field",
                type: "hidden"
            },
            {
                display: '司机电话',
                name: 'driver_mobile',
                newline: false,
                cssClass: "field",
                type: "text",
                validate: {required: true}
            },
            {
                display: '是否外协',
                name: 'outsourcing',
                comboboxName: "outsourcing_c",
                newline: false,
                cssClass: "field",
                type: "select",
                options: {
                    data: [{text:"外协",id:"Y"},{text:"自有",id: "N"}],
                    readonly: true,
                    cancelable: false
                }
            },
            {
                display: '承运方',
                name: 'carrier_name',
                comboboxName: "carrier_name_c",
                newline: false,
                cssClass: "field",
                type: "select",
                options: {
                    data: data_carriers,
                    readonly: true,
                    cancelable: false
                }
            },
            {
                display: '车型',
                name: 'booking_car_type',
                comboboxName: "booking_car_type_c",
                newline: false,
                cssClass: "field",
                type: "select",
                options: {
                    data: data_dict[DICT_CODE.car_type],
                    readonly: true,
                    cancelable: false
                }
            }
        ],
        validate: true,
        toJSON: JSON2.stringify
    });

    //生成调整表格
    adjustGrid = (function () {
        var options = $.extend(true, {}, gridBaseOption, {
            title: "任务调整",
            rowDraggable: true,
            colDraggable: true,
            localStorageName: 'transAdjustGrid' + user.id,// 本地存储名字
            enabledSort: false,
            usePager: true,
            checkbox: true,
            sortName: "",
            sortOrder: "",
            url: basePath + 'loadAdjustGrid',
            onBeforeMoveRow: function (fromRow, toRow) {
                if(isAbleMove(fromRow) && isAbleMove(toRow) ){
                    //添加修改标记
                    $(".l-panel-header-text", this.header).attr("data-editSign","*");
                    setGridTitle.call(adjustGrid, mainTree, mainTree.getSelected());
                    return true;
                }
                else{
                    LG.tip("所选行不能移动到该位置或系统出错");
                    return false;
                }
            },
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
            //进入编辑前判断能否修改，并且缓存修改前的数据
            onBeforeEdit: function (editParm) {
                var column = editParm.column,
                    record = editParm.record;

                //记录修改前的值
                manager.lastRecord = $.extend({}, record);
                return true;
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

                //待更新数据
                var UPDATE_DATA = {};
                UPDATE_DATA[columnname] = e.value;

                //柜号
                if (columnname == 'cntr_no' || columnname == 'cntr_twin_no') {

                    //校验柜号
                    if (e.value && !cntrUtil.verifyContainerCode(e.value)) {

                        //设置原值
                        UPDATE_DATA[columnname] = manager.lastRecord[columnname];
                        grid.updateRow(record['__id'], UPDATE_DATA);

                        LG.tip("柜号不正确");
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
                        grid.updateRow(record['__id'], newdata);
                        //去除保存提示
                        grid.isDataChanged = false;
                    },
                    error: function (msg) {
                        LG.showError(msg);
                    }
                });
            }
        });
        //加入上移、下移按钮
        var buttons = [
            {
                display: '上移', name: 'up', id: 'up', align: 'center', width: 30,isSort: false,  frozen: true,
                render: function (item, index) {
                    if(index != 0 && isAbleMove(item) && isAbleMove(this.getRow(index-1))){
                        return '<a class="row-btn" data-index="' + index + '" data-action="row-up" title="上移"><i class="iconfont l-icon-up"></i></a>';
                    }
                    else{
                        return '';
                    }
                }
            },
            {
                display: '下移', name: 'down', id: 'down',  align: 'center', width: 30,isSort: false,  frozen: true,
                render: function (item, index) {
                    if(index != (this.rows.length - 1) && isAbleMove(item) && isAbleMove(this.getRow(index + 1))){
                        return '<a class="row-btn" data-index="' + index + '" data-action="row-down" title="下移"><i class="iconfont l-icon-down"></i></a>';
                    }
                    else{
                        return '';
                    }
                }
            }
        ];
        /**
         * localhost调试显示序号
         * todo:调试完毕需要删除？
         * */
        if(location.hostname === "localhost"){
            buttons.push(            {
                display: '内部任务号', name: 'inner_seq', align: 'left', minWidth: 80, width: '10%', frozen: true
            });
        }
        if (disabledButtons.indexOf('saveListOrder') < 0) {
            options.columns = buttons.concat(options.columns);
        }

        var grid = $("#adjustGrid").ligerGrid(options);
        return grid;
    })();

    //调整表格点击事件
    $("#adjustGrid").on("click", "[data-action]", function () {
        var $this = $(this),
            index = $this.attr("data-index"),
            action = $this.attr("data-action");

        switch (action){
            case "row-up":
                moveRows.call(adjustGrid, "up", index);
                break;
            case "row-down":
                moveRows.call(adjustGrid, "down", index);
                break;
        }

        function moveRows(dir, index) {
            var g = this, p = this.options;
            if(g.enabledCheckbox() && !p.isSingleCheck){//多选
                g.getSelectedRows().forEach(function (val) {
                    g.unselect(val);
                });
            }
            g.select(index);
            if(dir === "up"){
                g.up(index);
            }
            else{
                g.down(index);
            }
        }
    });
    
    // 工具栏点击事件处理
    // $("body").on("click", "[data-action]", function () {
    //     var $this = $(this),
    //         action = $this.attr("data-action");
    //      switch (action){
    //          case "assignedTasks":
    //              assignedTasks.call($this);
    //              break;
    //          case "unAssignedTasks":
    //              if (continueConfirm()) {
    //                  unAssignedTasks.call($this);
    //              }
    //              break;
    //          case "noticeTasks":
    //              if (continueConfirm()) {
    //                  noticeTasks.call($this);
    //              }
    //              break;
    //          case "cancelNoticeTasks":
    //              if (continueConfirm()) {
    //                 cancelNoticeTasks.call($this);
    //              }
    //              break;
    //          case "saveListOrder":
    //              saveListOrder.call($this);
    //              break;
    //          case "refresh":
    //              refreshGrid.call($this, $this.attr("data-target"));
    //      }
    // });

    LG.powerToolBar($('#adjustbar'), {
        items: [
            {
                id: 'saveListOrder', text: '保存顺序号', icon: 'save', click: saveListOrder
            }, {
                id: 'unAssignedTasks', text: '撤销指派', icon: 'withdraw', click: unAssignedTasks
            }, {
                id: 'noticeTasks', text: '通知司机', icon: 'notice', click: noticeTasks
            }, {
                id: 'cancelNoticeTasks', text: '撤销通知', icon: 'withdraw', click: cancelNoticeTasks
            }, {
                id: 'refresh', text: '刷新', icon: 'refresh', click: function () {
                    refreshGrid('adjustGrid');
                }
            }, {
                id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrack
            }
        ]
    });

    LG.powerToolBar($('#assignbar'), {
        items: [
            {
                id: 'assignedTasks', text: '任务指派', icon: 'distribution', click: assignedTasks
            }, {
                id: 'refresh', text: '刷新', icon: 'refresh', click: function () {
                    refreshGrid('assignGrid');
                }
            }, {
                id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrack
            }
        ]
    });

    LG.powerToolBar($('#finisbar'), {
        items: [
            {
                id: 'refresh', text: '刷新', icon: 'refresh', click: function () {
                    refreshGrid('finishGrid');
                }
            }, {
                id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrack
            }
        ]
    });

    //单框搜索
    //本事件的e，输入的值，触发源，触发源的e
    $("body").on("single-search", function (e, value, target, target_e) {
        value = $.trim(value);

        var $tab = $(target).parents("[tabid]"),
            tabid,
            defaultSearch = {
                or: [],
                and: []
            };

        if($tab.length > 0){
            tabid = $tab.attr("tabid");
        }
        if(tabid){
            tabid = tabid.toLowerCase();
        }
        else{
            return;
        }

        if(tabid === "assigntab"){
            defaultSearch = {
                or: [],
                and: []
            };
            
            assignGrid.set('parms', [{name: 'where', value: assignGrid.getSearchGridData(true, value, defaultSearch)}]);
            assignGrid.changePage('first');
            assignGrid.loadData();
        }
        else if(tabid === "finishtab"){
            defaultSearch = {
                or: [],
                and: []
            };
            
            var selectNode = mainTree.getSelected();
            if(selectNode && selectNode.data && selectNode.data.text){
                defaultSearch.and.push({
                    op: "equal",
                    field: 'driver_name',
                    value: selectNode.data.text,
                    type: "string"
                });
            }
            
            finishGrid.set('parms', [{name: 'where', value: finishGrid.getSearchGridData(true, value, defaultSearch)}]);
            finishGrid.changePage('first');
            finishGrid.loadData();
        }
    });

    //选择树节点
    function selectTreeNode(e) {

        lastSelectNode = e;

        setGridTitle.call(adjustGrid, mainTree, e);

        adjustGrid.set('parms', [{
            name: 'driver_name',
            value: e.data.text
        }]);
        if(!$(adjustGrid.element).is(":hidden")){
            adjustGrid.loadData();
        }

        if(finishGrid && !$(finishGrid.element).is(":hidden")){
            finishGrid.set('parms', [{name: 'where', value: JSON.stringify({op: "and", rules: [{ field: 'driver_name', value: e.data.text, op: "equal", type: "string"}], groups: []})}]);
            finishGrid.changePage('first');
            finishGrid.loadData();

            setGridTitle.call(finishGrid, mainTree, e);
        }
    }

    //选择车
    function selectCar(text) {
        var carData, driverData;
        //直接输入文本，newValue === newText，并且rowData为空
        carData = getDataByField(data_car, text, "text");
        if(carData){
            //设置司机资料
            if(carData.driver_id){
                driverData = getDataByField(data_driver, carData.driver_id, "id");
                driverData && setFieldsValue(mainForm, {
                    "driver_c":driverData.text,
                    "driver_id":driverData.id,
                    "driver_mobile": driverData.mobile,
                    "outsourcing_c": driverData.outsourcing ? "Y" : "N",
                    "carrier_name_c": driverData.carrier_id

                });
            }
            //设置车型
            carData.type && setFieldsValue(mainForm, {"booking_car_type_c": carData.type});
        }
        else{
            //清除车型
            setFieldsValue(mainForm, {"booking_car_type_c": ""});
        }
    }

    //通知司机
    function noticeTasks() {

        var selected = adjustGrid.getSelectedRows();
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
                    adjustGrid.reload();
                    LG.tip('通知成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    //撤销通知
    function cancelNoticeTasks() {

        var selected = adjustGrid.getSelectedRows();
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
                    adjustGrid.reload();
                    LG.tip('撤销通知成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    //任务指派
    function assignedTasks() {
        var selected = assignGrid.getSelectedRows();
        if (!selected || selected.length <= 0) {
            LG.showError('请选择行!');
            return;
        }
        
        LG.clearValid($mainForm);

        $.ligerDialog.open({
            target: $("#mainDialog"),
            title: '任务指派',
            width: 650,
            height: 220,
            buttons: [
                {
                    text: '确定',
                    onclick: function (item, dialog) {

                        //校验数据
                        if (!mainForm.valid()) { 
                            mainForm.showInvalid();
                            return;
                        }

                        //数据
                        var data = mainForm.getData(),
                            submitData = {
                                booking_car_type: data.booking_car_type,
                                car_no: data.car,
                                carrier_id: data.carrier_name,
                                carrier_name: getFieldText(mainForm, "carrier_name_c"),
                                driver_id: data.driver_id,
                                driver_mobile: data.driver_mobile,
                                driver_name: data.driver,
                                outsourcing: data.outsourcing === "Y"
                            };

                       //console.log(submitData);

                        //补充业务字段
                        for (var i = 0; i < selected.length; i++) {
                            selected[i] = $.extend({}, selected[i], submitData);
                        }

                        LG.singleAjax({
                            url: basePath + "assignTrans",
                            data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                            contentType: "application/json",
                            success: function (data, msg) {
                                dialog.hide();
                                //刷新指派表格
                                assignGrid.changePage("first");
                                assignGrid.loadData();
                                //刷新树
                                mainTree.reload();
                                LG.tip(msg);
                            },
                            error: function (message) {
                                LG.showError(message);
                            }
                        }, $mainTree);

                        function getFieldText(form, fieldName) {
                            var ligerM, prefixID = form.options.prefixID || "";
                            ligerM = liger.get(prefixID + fieldName);
                            if(ligerM && ligerM.getText){
                                return ligerM.getText() || "";
                            }
                        }
                    }
                },
                {
                    text: '取消',
                    onclick: function (item, dialog) {
                        dialog.hidden();
                    }
                }
            ]
        });
    }
    
    //撤销指派
    function unAssignedTasks() {

        var selected = adjustGrid.getSelectedRows();
        if (!selected || selected.length <= 0) {
            LG.showError('请选择行!');
            return;
        }
        
        LG.showConfirm("确认撤销指派？", function (r) {
           if(r){
               LG.singleAjax({
                   url: basePath + "cancelAssignTrans",
                   data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                   contentType: "application/json",
                   success: function (data, msg) {
                       //刷新调整表格
                       adjustGrid.changePage("first");
                       adjustGrid.loadData();
                       //刷新树
                       mainTree.reload();
                       LG.tip(msg);
                   },
                   error: function (message) {
                       LG.showError(message);
                   }
               }, $mainTree);
           } 
        });
    }
    
    //保存任务顺序
    function saveListOrder() {
        var data = getData();

        if(data && data.length > 0){
            LG.singleAjax({
                url: basePath + "adjustSeq",
                data: JSON2.stringify(data),
                contentType: "application/json",
                success: function (data, msg) {
                    LG.tip('保存成功!');
                    adjustGrid.reload();
                    //修改标记
                    $(".l-panel-header-text", adjustGrid.header).attr("data-editSign","");
                    setGridTitle.call(adjustGrid, mainTree, mainTree.getSelected());
                },
                error: function (message) {
                    LG.showError(message);
                }
            }, $mainTree);
        }

        function getData() {
            var data = adjustGrid.getData();
            return data.map(function (val) {
                return {
                    pk_id: val.pk_id ,
                    inner_seq: val.inner_seq,
                    car_no: val.car_no,
                    driver_name: val.driver_name,
                    state: val.state,
                    version: val.version
                };
            });
        }
    }
    
    //根据选择的树节点设置表格标题，this->grid
    function setGridTitle(tree, selectNode) {
        var g = this,
            text;

        if(!selectNode) return;

        var parentNode = tree.getParent(selectNode.target),
            pTitle = (parentNode && parentNode.text) || "",
            cTitle = (selectNode.data && selectNode.data.text) || "";

        if(pTitle){
            text = pTitle + "-" + cTitle;
        }
        else{
            text = cTitle;
        }

        var $title = $(".l-panel-header-text", g.header);
        $title.html(text + ($title.attr("data-editSign") || ""));
    }

    //判断表格行是否允许移动
    function isAbleMove(rowObj) {
        //目前已出车、已接受外的都可移动，考虑undefined
        return (!!rowObj) && rowObj["state"] < TMS_STATE.STATE_60_ACCEPTED;
    }

    //刷新表格
    function refreshGrid(grid) {
        var gridM = liger.get(grid) || "";
        if(typeof gridM === "object" && typeof gridM.loadData === "function"){
            if(grid === "adjustGrid"){
                if(continueConfirm()){
                    //继续，丢失修改
                    setGridTitle.call(adjustGrid, mainTree, mainTree.getSelected());
                }
                else {
                    //不继续
                    return false;
                }
            }
            gridM.loadData();
        }

        mainTree.reload();
    }
    
    //切换页签前，提示修改
    function beforeSelectTabItem(tabid) {
        //表格隐藏的时候，不在修改状态
        //调用continueConfirm后重置修改标记，接下来的afterSelectTabItem刷新表格使得修改真正丢失
        return $(adjustGrid.element).is(":hidden")  || continueConfirm();
    }

    //切换页签后，创建表格，刷新表格
    function afterSelectTabItem(tabid) {
        switch (tabid){
            case "adjustTab":
                refreshGrid("adjustGrid");
                break;
            case "assignTab":
                showAssignGrid();
                break;
            case "finishTab":
                showFinishGrid();
                break;
        }
        
        function showAssignGrid() {
            if(!assignGrid){
                assignGrid = $("#assignGrid").ligerGrid($.extend(true, {}, gridBaseOption,{
                    title: "任务指派",
                    colDraggable: true,            // 移动表头
                    localStorageName: 'transAssignGrid' + user.id,// 本地存储名字
                    url: basePath + 'loadAssignGrid',
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
                    //进入编辑前判断能否修改，并且缓存修改前的数据
                    onBeforeEdit: function (editParm) {
                        var column = editParm.column,
                            record = editParm.record;

                        //记录修改前的值
                        manager.lastRecord = $.extend({}, record);
                        return true;
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

                        //待更新数据
                        var UPDATE_DATA = {};
                        UPDATE_DATA[columnname] = e.value;

                        //柜号
                        if (columnname == 'cntr_no' || columnname == 'cntr_twin_no') {

                            //校验柜号
                            if (e.value && !cntrUtil.verifyContainerCode(e.value)) {

                                //设置原值
                                UPDATE_DATA[columnname] = manager.lastRecord[columnname];
                                assignGrid.updateRow(record['__id'], UPDATE_DATA);

                                LG.tip("柜号不正确");
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
                                assignGrid.updateRow(record['__id'], newdata);
                                //去除保存提示
                                assignGrid.isDataChanged = false;
                            },
                            error: function (msg) {
                                LG.showError(msg);
                            }
                        });
                    }
                }));
            }
            refreshGrid("assignGrid");
        }
        
        function showFinishGrid() {
            if(!finishGrid){
                finishGrid = $("#finishGrid").ligerGrid($.extend(true, {}, gridBaseOption, {
                    title: "已结束任务",
                    checkbox: false, //多选框
                    url: basePath + 'loadFinishGrid',
                    sortName: 'STATE,CNTR_WORK_TIME', //状态顺序、创建时间倒序
                    sortOrder: 'ASC,DESC',
                    colDraggable: true,            // 移动表头
                    localStorageName: 'transFinishGrid' + user.id,// 本地存储名字
                    onSuccess: function (data) {
                        if(data && data.Rows && data.Rows.length == 0){
                            LG.tip("选择的司机没有已结束的任务");
                        }
                    }
                }));
            }
            var selectNode = mainTree.getSelected();
            if(selectNode && selectNode.data && selectNode.data.text){
                finishGrid.set('parms', [{name: 'where', value: JSON.stringify({op: "and", rules: [{ field: 'driver_name', value: selectNode.data.text, op: "equal", type: "string"}], groups: []})}]);
            }
            else{
                finishGrid.set('parms', []);
            }
            setGridTitle.call(finishGrid, mainTree, selectNode);
            refreshGrid("finishGrid");
        }
    }

    //显示编辑提示，继续返回true并去掉修改标记，终止返回false
    function continueConfirm() {
        var $title = $(".l-panel-header-text", adjustGrid.header);
        if($title.attr("data-editSign") && !confirm("尚未保存已调整的任务顺序，继续将丢失修改")){
            return false;
        }
        else{
            $title.attr("data-editSign","");
            return true;
        }
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

    //数据查找，多个
    function getDatasByField(sourceData, fieldValue, fieldName) {
        var arr =[];
        if(!sourceData || !fieldValue || !fieldName) return [];
        for(var i = 0, len = sourceData.length; i < len; i++){
            if(sourceData[i][fieldName] == fieldValue){
                arr.push($.extend(true, {}, sourceData[i]));
            }
        }

        return arr;
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

    /*
    * 离开确认
    * */

    //返回
    // $(".l-toolbar-item[data-action='select-menu']").click(function(e) {
    //     debugger;
    //     //确认数据
    //     if(!continueConfirm()){
    //         e.stopPropagation();
    //         return false
    //     }
    //     else{
    //         backConfirm = true;
    //     }
    // });
    function backtrack () {
        continueConfirm() && backtrackFun();
    }
    //关闭主页页签
    $('body').on({
        "beforeRemoveTab": function () {
            return continueConfirm();
        },
        "reload" : function () {
            return continueConfirm();
        }
    });

    
});