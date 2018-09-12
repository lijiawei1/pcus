<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/18
  Time: 10:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>关联任务</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .trans-highlight {
            color: red;
        }
    </style>
    <link rel="stylesheet" href="${path}/css/tms/listicon.css">
</head>
<body>
<div id="layout">
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
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>

<!-- 新增 -->
<div id="addMain">
    <form id="addForm"></form>
    <div id="addGrid"></div>
    <%--<form id="addDate" style="display: none;"></form>--%>
</div>

</body>
<script>

    var mst_id = '${mst_id}';

    //管理器
    var manager = {
        lastRecord: ''
    };

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/busi/orderRelatedTrans/';


    //默认数据
    var emptyData = {};

    //页面元素
    var $filterForm = $("#filterForm"),
            $toptoolbar = $("#toptoolbar"),
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            addForm, //
            addGrid,
            mainGrid, //列表
            mainForm; //编辑表单

    function toFloat(num, scale) {
        return parseFloat((num || 0).toFixed(scale));
    }

    var disableState = [
        TMS_STATE.STATE_90_RECEIPTED, //已回单
        TMS_STATE.STATE_91_STOPPED, //已中止
        TMS_STATE.STATE_92_CANCEL, //已中止
        TMS_STATE.STATE_69_REFUESED //已拒绝
    ];

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '详细', align: '', minWidth: 50, width: '3%', sortable: false,
                render: function (item, index) {
                    //判断单据状态，不让点进去
                    return [TMS_STATE.STATE_91_STOPPED, TMS_STATE.STATE_92_CANCEL, //已中止
                        TMS_STATE.STATE_69_REFUESED].indexOf(item.state) == -1 ?
                    '<a  name="edit_data"  class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-edit"></i></a>'
                            : '';
                }
            },
            {
                display: '状态', name: 'state_name', sortname: 'state', align: 'left', minWidth: 50, width: '4%',
                render: function (item) {
                    return disableState.indexOf(item.state) == -1 ? '待回单' : item.state_name;
                }
            },
            {display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 50, width: '4%'},
            {
                display: '任务类型', name: 'task_type', align: 'left', minWidth: 50, width: '4%',
                render: LG.render.ref(BILL_CONST.DATA_TASK_TYPE, 'task_type')
            },
            {
                display: '<span class="trans-highlight">预约装卸时间</span>',
                name: 'cntr_work_time',
                align: 'left',
                minWidth: 50,
                width: '5%',
                type: 'date',
                format: "yyyy-MM-dd hh:mm:ss",
                editor: {type: 'date', ext: {showTime: true}},
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
            },
            {
                display: '<span class="trans-highlight">报关时间</span>',
                name: 'bill_time',
                align: 'left',
                minWidth: 50,
                width: '5%',
                type: 'date',
                format: "yyyy-MM-dd hh:mm:ss",
                editor: {type: 'date', ext: {showTime: true}}
            },
            {
                display: '<span class="trans-highlight">结算时间</span>',
                name: 'settle_date',
                align: 'left',
                minWidth: 50,
                width: '5%',
                type: 'date',
                format: "yyyy-MM-dd hh:mm:ss",
                editor: {type: 'date', ext: {showTime: true}}
            },
            {display: '装卸货地', name: 'lau_orgs', align: 'left', minWidth: 50, width: '5%'},
            {display: '提柜地', name: 'gate_out_dock', align: 'left', minWidth: 50, width: '5%'},
            {display: '车牌号', name: 'car_no', align: 'left', minWidth: 50, width: '3%'},
            {display: '司机', name: 'driver_name', align: 'left', minWidth: 50, width: '3%'},
            {
                display: '<span class="trans-highlight">柜号</span>',
                name: 'cntr_no',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">封条号</span>',
                name: 'cntr_seal_no',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">孖拖柜号</span>',
                name: 'cntr_twin_no',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">孖拖封条号</span>',
                name: 'cntr_twin_seal_no',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">柜重</span>',
                name: 'cntr_weight',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'float'}
            },

            {
                display: '<span class="trans-highlight">货物名称</span>',
                name: 'cargo_info',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'},
                quickSort: false,
                isSort: false,
            },
            {
                display: '<span class="trans-highlight">货物编码</span>',
                name: 'cargo_code',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'},
                quickSort: false,
                isSort: false,
            },
            {
                display: '<span class="trans-highlight">客户委托号</span>',
                name: 'client_bill_no',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'}
            },
            {
                display: '<span class="trans-highlight">订舱号/提单号</span>',
                name: 'booking_no',
                align: 'left',
                minWidth: 50,
                width: '4%',
                editor: {type: 'text'}
            },
            /*********************************
             * 客户化字段暂时没做客户化显示
             ********************************/
            {
                display: '<span class="trans-highlight">进港日期</span>',
                name: 'inport_date',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                isSort: false,
                type: 'date',
                format: "yyyy-MM-dd",
                editor: {type: 'date', ext: {showTime: false}}
            },
            {
                display: '<span class="trans-highlight">到达时间</span>',
                name: 'arrival_time',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                isSort: false,
                type: 'date',
                format: "yyyy-MM-dd hh:mm:ss",
                editor: {type: 'date', ext: {showTime: true}}
            },
            {
                display: '<span class="trans-highlight">离开时间</span>',
                name: 'leave_time',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                isSort: false,
                type: 'date',
                format: "yyyy-MM-dd hh:mm:ss",
                editor: {type: 'date', ext: {showTime: true}}
            },
            {
                display: '<span class="trans-highlight">还柜时间</span>',
                name: 'cntr_ret_time',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                isSort: false,
                type: 'date',
                format: "yyyy-MM-dd hh:mm:ss",
                editor: {type: 'date', ext: {showTime: true}}
            },

            {
                display: '甩挂',
                name: 'cntr_drop_trailer',
                align: 'left',
                minWidth: 50,
                width: '2%',
                render: LG.render.boolean('cntr_drop_trailer')
            },
            {
                display: '孖拖',
                name: 'cntr_twin',
                align: 'left',
                minWidth: 50,
                width: '2%',
                render: LG.render.boolean('cntr_twin')
            },
            {
                display: '带货',
                name: 'take_goods',
                align: 'left',
                minWidth: 50,
                width: '2%',
                render: LG.render.boolean('take_goods')
            },
            {display: '客户', name: 'client_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '承运商', name: 'carrier_name', align: 'left', minWidth: 50, width: '10%'},
            {
                display: '货物重量',
                name: 'total_weight',
                align: 'left',
                minWidth: 50,
                width: '5%',
                isSort: false,
                quickSort: false,
                render: function (item, index) {
                    if (!item.transDetailList || item.transDetailList.length <= 0) {
                        return 0;
                    }
//                    console.log(item.transDetailList);
//                    var total_weight = item.transDetailList.reduce(function (pre, cur, index, arr) {
//                        return (pre.weight || 0) + (cur.weight || 0);
//                    }, 0);

                    var total_weight = 0;
                    for (var i = 0; i < item.transDetailList.length; i++) {
                        total_weight += (item.transDetailList[i].weight || 0);
                    }

                    return '<span class="trans-info" data-index="' + index + '">' + parseFloat(total_weight.toFixed(4)) + '</span>';
                },

                totalSummary: {
                    align: 'center', type: 'sum',
                    calValue: function (item) {
                        if (!item.transDetailList || item.transDetailList.length <= 0) {
                            return 0;
                        }

                        var total_qty = 0;
                        for (var i = 0; i < item.transDetailList.length; i++) {
                            total_qty += (item.transDetailList[i].weight || 0);
                        }

                        return toFloat(total_qty, 4);
                    },
                    render: function (e) {
                        return toFloat(e.sum, 4);
                    }
                }
            },
            {
                display: '货物数量',
                name: 'total_qty',
                align: 'left',
                minWidth: 50,
                width: '5%',
                isSort: false,
                quickSort: false,
                render: function (item, index) {
                    if (!item.transDetailList || item.transDetailList.length <= 0) {
                        return 0;
                    }

                    var total_qty = 0;
                    for (var i = 0; i < item.transDetailList.length; i++) {
                        total_qty += (item.transDetailList[i].qty || 0);
                    }

                    return '<span class="trans-info" data-index="' + index + '">' + toFloat(total_qty, 4) + '</span>';
                },
                totalSummary: {
                    align: 'center', type: 'sum',
                    calValue: function (item) {
                        if (!item.transDetailList || item.transDetailList.length <= 0) {
                            return 0;
                        }

                        var total_qty = 0;
                        for (var i = 0; i < item.transDetailList.length; i++) {
                            total_qty += (item.transDetailList[i].qty || 0);
                        }

                        return toFloat(total_qty, 4);
                    },
                    render: function (e) {
                        return toFloat(e.sum, 4);
                    }
                }
            },
            {display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '任务单号', name: 'bill_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '10%', editor: {type: 'text'}}
        ],
        url: basePath + 'loadGrid/' + mst_id,
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        usePager: false,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        inWindowComplete: true,
        heightDiff: -50,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'modify_time',
        sortOrder: 'desc',
        colDraggable: true,
        localStorageName: 'orderRelatedTrans' + user.id,
        onDblClickRow: function (data, id, rowHtml, cellHtml) {
            var column = this.getColumn(cellHtml);
            if (!column || !column.editor) {

                //双击跳转
//                jumpDetailEdit(rowdata);
                if ([TMS_STATE.STATE_91_STOPPED, TMS_STATE.STATE_92_CANCEL, TMS_STATE.STATE_69_REFUESED].indexOf(data.state) >= 0) {
                    return;
                }
                var url = rootPath + "/tms/busi/orderAudit/loadPage?trans_id=" + data.pk_id + "&order_id=" + mst_id,
                        p$ = parent.$;

                /*采用新建iframe的方式加载页面*/
                var $iframe = p$("#transGridTab"), $iframeSub = $iframe.siblings("#transGridTabSub");
                if ($iframeSub.length <= 0) {
                    $iframeSub = p$('<iframe id="transGridTabSub"></iframe>').insertAfter($iframe);
                }
                $iframeSub.attr("src", url);

                $iframe.hide();

            } else {
                if (cellHtml) {
                    this._applyEditor(cellHtml);
                    $(this.editor.input).focus();
                }
            }
        },
        onAfterEdit: function (e) {
            //立即更新字段值模式
            var record = $.extend({}, e.record);
            var columnname = e.column.columnname;

            var postData = {
                pk_id: e.record.pk_id,
                version: e.record.version,
                client_id: e.record.client_id,
                state: e.record.state,
                remark: manager.lastRecord.cntr_no, //原记录
                columnname: columnname
            };
            postData[e.column.columnname] = e.value;

            //待更新数据
            var UPDATE_DATA = {};
            UPDATE_DATA[columnname] = e.value;

            //判断值是否改变
            var lastRecord = manager.lastRecord;
            if (lastRecord) {
                //如果显示值不等于空，且显示值没有修改
                if (UPDATE_DATA[columnname] && UPDATE_DATA[columnname] == lastRecord[columnname]) {
                    LG.tip("值未改变");
                    return;
                }
            }
            ;

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
            if (disabledButtons.indexOf('updateInline') >= 0) return false;
            var column = editParm.column,
                    record = editParm.record;

            //检查字段是否可编辑
            // if (record.state != TMS_STATE.STATE_40_NEW && record.state != TMS_STATE.STATE_69_REFUESED) {
            //    throttle(function () {
            //        LG.tip("单据状态不是[新任务]，不能修改");
            //    }, 10)();
            //    return false;
            // }
            if (column === 'cntr_twin_no' && !record['cntr_twin']) {
                //孖拖才能输入孖拖柜号

                LG.tip("运单不是孖拖，不能输入");
                return false;
            }

            //记录修改前的值
            manager.lastRecord = $.extend({}, record);

            return true;
        }
    };

    var filterFormOption = {

        //搜索框绑定信息
        searchBind: {
            //搜索按钮ID
            searchBtnId: "searchBtn",
            //重置按钮ID
            resetBtnId: "resetBtn",
            //绑定表格ID
            bindGridId: "mainGrid",
        },

        prefixID: "s_",
        fields: [
            {
                display: "物料名称",
                name: "name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                cssClass: "field",
                type: "select",
                comboboxName: "name_c",
                options: {
                    data: [],
                    cancelable: true,
                    autocomplete: true,
                    isTextBoxMode: true
                }
            }
        ]
    };

    filterForm = $filterForm.ligerSearchForm(filterFormOption);

    mainGrid = $mainGrid.ligerGrid(gridOption);

    var defaultActionOption = {
        items: [
            {id: 'auditInline', text: '回单', click: auditInline, icon: 'submit', status: ['OP_INIT']},
            {id: 'cancelTask', text: '作废', click: cancel, icon: 'cancel', status: ['OP_INIT']},
            {id: 'takeGoods', text: '套柜-带货', click: takeGoods, icon: 'cancel', status: ['OP_INIT']},
            {id: 'refresh', text: '刷新', click: refresh, icon: 'refresh', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };

    function takeGoods() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        if (selected.length > 1) {
            LG.showError("只能单选操作");
        }

        LG.ajax({
            url: basePath + 'loadLastTrans4TakeGoods',
            contentType: "application/json",
            data: JSON.stringify(selected[0]),
            success: function (data) {
                addForm.setData(data);
//                addGrid.options.data = {Rows: data.transLineList};
//                addGrid._setData({Rows: data.transLineList});
//                LG.tip('加载成功');

                console.log(data);
                console.log(data.transLineList);

                addGrid = $('#addGrid').ligerGrid({
                    columns: [
                        {display: '顺序号', name: 'seq', align: 'left', minWidth: 50, width: '5%'},
                        {display: '线路信息', name: 'line_info', align: 'left', minWidth: 150, width: '10%'},
                        {display: '公里数(KM)', name: 'kilometers', align: 'left', minWidth: 100, width: '10%'},
                        {display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%'},
                    ],
                    pageSize: 20,
                    data: {'Rows': data.transLineList},
                    usePager: false,
                    dataAction: 'local',
                    delayLoad: true,
                    width: '100%',
                    height: '100%',
                    inWindow: false,
                    rowHeight: 30,
                    headerRowHeight: 28,
                    rowSelectable: false,
                    selectable: false,
                    // frozen: true,
                    rownumbers: true,
                    selectRowButtonOnly: true,
                })


                addData();
            },
            error: LG.showError
        });
    }

    /**
     * 作废
     */
    function cancel() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        //检查单据状态
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].state !== "STATE_40_NEW") {
                LG.showError("所选单据状态存在非[新单据]状态，不可作废");
                return;
            }
        }

        $.ligerDialog.confirm('确定作废吗?', function (confirm) {

            if (!confirm) return;

            LG.ajax({
                url: basePath + 'cancelTask',
                data: JSON.stringify(selected, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                    mainGrid.reload();
                    LG.tip('作废成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    function refresh() {
        mainGrid.reload();
    }

    /**
     * 审核
     */
    function auditInline() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        $.ligerDialog.confirm('确定回单吗?', function (confirm) {
            if (!confirm) return;
            LG.ajax({
                url: basePath + 'auditInline',
                data: JSON.stringify({
                    baseOrder: {pk_id: mst_id},
                    baseTranses: selected
                }, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, message, code) {
//                    refresh(selected, data);
                    mainGrid.reload();
                    LG.tip('回单成功');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }

    /**
     *
     */
    function addData() {
        $.ligerDialog.open({
            title: '请修改上一单公里数',
            target: $('#addMain'),
            width: 640,
            height: 400,
            buttons: [{
                text: '确认',
                onclick: function (e, dialog) {
                    var datas = addGrid.getSelecteds();
                    if (datas.length < 1) {
                        LG.showError('请选择数据');
                        return false;
                    }

                    LG.ajax({
                        url: basePath + 'add',
                        contentType: "application/json",
                        data: JSON.stringify(result),
                        success: function (ajaxData) {
                            LG.tip('添加成功');
//                            dialog1.hidden();
                            dialog.hidden();
                        },
                        error: LG.showError
                    });
                }
            }, {
                text: '取消',
                onclick: function (e, dialog) {
                    dialog.hidden();
                }
            }]
        });
    }

    //
    addForm = $('#addForm').ligerForm({
        fields: [
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
                display: "轻公里数",
                name: "name",
                newline: false,
                cssClass: "field",
            },
            {
                display: "重公里数",
                name: "name",
                newline: false,
                cssClass: "field",
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
            }
        ]
    });

    //扩展按钮
    toptoolbar = LG.powerToolBar($toptoolbar, defaultActionOption);

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
    });

</script>
<script type="text/javascript">
    $(function () {
        //初始化编辑按钮
        $mainGrid.on('click', 'a[name=edit_data]', function (e) {
            var selected = mainGrid.getRow($(this).data("index")),
                    url = rootPath + "/tms/busi/orderAudit/loadPage?trans_id=" + selected.pk_id + "&order_id=" + mst_id,
                    p$ = parent.$;

            /*采用新建iframe的方式加载页面*/
            var $iframe = p$("#transGridTab"), $iframeSub = $iframe.siblings("#transGridTabSub");
            if ($iframeSub.length <= 0) {
                $iframeSub = p$('<iframe id="transGridTabSub"></iframe>').insertAfter($iframe);
            }
            $iframeSub.attr("src", url);

            $iframe.hide();
        });

        //监听子页面返回事件（在子页面点击返回时触发）
        $("body").on("backFromSubPage", function () {
            mainGrid.loadData();
        });
    });
</script>
</html>
