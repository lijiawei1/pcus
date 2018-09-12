<%--
  Created by IntelliJ IDEA.
  User: Eis
  Date: 2018/1/18
  Time: 10:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>child</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .l-toolbar{
            padding: 5px;
            background-color: #d6dae6;
            width: 100%;
        }
        .l-search {
            border-radius: 10px;
            padding: 10px;
            background-color: #fff;
        }
        .l-main{
            width: calc(100% - 4px);
            margin: 0 auto;
            height: 100%;
        }
        .charge {
            background-color: #2eb960;
        }
        .pay {
            color: #ffffff;
            background-color: #C00000;
        }
        .return-bill {
            background-color: #fcc;
        }
    </style>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div class="tabWrapper">
    <div class="tabWrapper-inner">
        <div id="mainTab">
            <div tabid="chargeTab" title="费用明细" lselected="true">
                <div id="chargeBox" class="l-main">
                    <form id="chargeSearch" class="l-search"></form>
                    <div id="chargeTool"></div>
                    <div id="chargeGrid"></div>
                </div>
            </div>
            <div tabid="receiptTab" title="已核对单据">
                <div id="receiptBox" class="l-main">
                    <form id="receiptSearch" class="l-search"></form>
                    <div id="receiptTool"></div>
                    <div id="receiptGrid"></div>
                </div>
            </div>
            <div tabid="checkTab" title="未核对单据">
                <div id="checkBox" class="l-main">
                    <form id="checkSearch" class="l-search"></form>
                    <div id="checkTool"></div>
                    <div id="checkGrid"></div>
                </div>
            </div>
            <div tabid="logTab" title="操作日志" data-url='${path}/tms/bas/log/loadLogCommonPage?bill_id=${mst_id}'>
                <iframe frameborder="0" name="logGrid"></iframe>
            </div>
        </div>
    </div>
</div>

<!-- excel导出 -->
<div class="dialog-container" style="display: none;">
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/fuelBillFee/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

</body>
<script>
    $('#mainTab').ligerTab({
        height: '100%',
        width: '100%',
        heightDiff: -6,
        changeHeightOnResize: true,
        onAfterSelectTabItem: afterSelectTabItem
    });

    // 标签切换事件
    // tabid  对应的标签id
    function afterSelectTabItem(tabid) {
        var $tg = $(".l-tab-content [tabid='" + tabid + "']");
        if ($tg.attr("data-init") !== "init") {
            $tg.children(".l-tab-loading").show();
            var gridName = tabid.replace('Tab', '');
            var gridDom = liger.get(gridName + 'Grid');
            var formDom = liger.get(gridName + 'Search');
            if (gridDom && formDom) {
                gridDom.resetColumnsWidth();
                search(formDom, gridDom);
            }else {
                $tg.children("iframe").attr("src", $tg.attr("data-url")).end().attr("data-init", "init");
            }
        }
    }

    var chargePath = rootPath + '/tms/bm/fuelBillFee/';
    var checktPath = rootPath + '/tms/bm/fuelCheck/';

    var mstId = `${mst_id}`;
    var data_bs_type_name = ${busiType}, //业务类型
        data_state = ${state}, //单据状态
        data_clients = ${clients}, //客户
        data_suppliers = ${suppliers}, //供应商
        data_dict = ${dict}; //数据字典

    $(function () {
        var chargeSearch, chargeToolbar, chargeGrid;
        var receiptSearch, receiptToolbar, receiptGrid;
        var checkSearch, checkTool, checkGrid;
        var mainGrid;

        var filterFormFieldWidth = {
            w1: 155,
            w2: 310,
            w3_2: 405
        };

        var where = {
            op: 'and',
            rules: [],
            groups: []
        };

        mainGrid = $('#mainGrid').ligerGrid({
            columns: [
            ],
            options: [],
            parms: [{
                name: 'where',
                value: JSON.stringify(where)
            }],
            sortName: 'STATE',
            sortOrder: 'ASC'
        });

        var gridColumnOption = [
            {
                display: '是否确认',
                name: 'mile_confirm',
                align: 'left',
                minWidth: 60,
                frozen: false,
                quickSort: false,
                render: LG.render.boolean('mile_confirm')
            }, {
                display: '任务类型',
                name: 'task_type',
                align: 'left',
                minWidth: 60,
                frozen: false,
                quickSort: false,
                render: LG.render.ref(BILL_CONST.DATA_TASK_TYPE, 'task_type')
            }, {
                display: '委托客户',
                name: 'client_name',
                align: 'left',
                minWidth: 80,
                frozen: false
            },
            {display: '作业时间', name: 'work_time', minWidth: 80, width: '5%'},
            {
                display: '标准耗油',
                name: 'theo_fuel_cost',
                align: 'left',
                minWidth: 60,
                quickSort: false
            }, {
                display: '<span class="trans-highlight">轻公里数</span>',
                name: 'e_km',
                align: 'left',
                minWidth: 80,
                quickSort: false,
                editor: {
                    type: 'spinner',
                    ext: {
                        decimalplace: 2, //小数位 type=float时起作用
                        step: 1, //每次增加的值
                        interval: 50, //间隔，毫秒
                        minValue: 0 //最小值
                    }
                },
                render: function(row, index, val) {
                    return row.mile_confirm ? '<div class="row-green">' + val + '</div>' : val;
                }
            }, {
                display: '<span class="trans-highlight">重公里数</span>',
                name: 'f_km',
                align: 'left',
                minWidth: 60,
                quickSort: false,
                editor: {
                    type: 'spinner',
                    ext: {
                        decimalplace: 2, //小数位 type=float时起作用
                        step: 1, //每次增加的值
                        interval: 50, //间隔，毫秒
                        minValue: 0 //最小值
                    }
                },
                render: function(row, index, val) {
                    return row.mile_confirm ? '<div class="row-green">' + val + '</div>' : val;
                }
            }, {
                display: '签收重量',
                name: 'total_weight',
                align: 'left',
                minWidth: 60
            },
            /********************************************
             * 船信息
             ********************************************/
            {
                display: '订舱号/提单号',
                name: 'booking_no',
                align: 'left',
                minWidth: 120,
                width: '5%'
            }, {
                display: '船公司',
                name: 'ship_corp',
                align: 'left',
                minWidth: 100,
                quickSort: false
            }, {
                display: '预约提柜时间',
                name: 'cntr_pick_time',
                minWidth: 120,
                width: '5%',
                xlsHead: '预约提柜时间'
            }, {
                display: '预约装卸时间',
                name: 'cntr_work_time',
                minWidth: 180,
                xlsHead: '预约装卸时间',
                render: function(item, index, text) {
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
            }, {
                display: '提柜地',
                name: 'gate_out_dock',
                align: 'left',
                minWidth: 150
            }, {
                display: '装卸单位',
                name: 'lau_orgs',
                align: 'left',
                minWidth: 150,
                quickSort: false
            }, {
                display: '车牌号',
                name: 'car_no',
                align: 'left',
                minWidth: 80
            }, {
                display: '司机',
                name: 'driver_name',
                align: 'left',
                minWidth: 80,
                render: function(item) {
                    return "<div " + (!item.driver_id ? "class='alert-icon' title='未登记'" : "") + ">" + (item.driver_name || "") + "</div>"
                }
            }, {
                display: '手机号',
                name: 'driver_mobile',
                align: 'left',
                minWidth: 100
            }, {
                display: '外协',
                name: 'outsourcing',
                align: 'left',
                minWidth: 30,
                render: LG.render.boolean('outsourcing')
            }, {
                display: '车型',
                name: 'booking_car_type',
                align: 'left',
                minWidth: 60,
                render: LG.render.ref(data_dict[DICT_CODE.car_type], 'booking_car_type')
            }, {
                display: '承运方',
                name: 'carrier_name',
                align: 'left',
                minWidth: 100
            }, {
                display: '负责人',
                name: 'manager',
                align: 'left',
                minWidth: 80
            },
            /********************************************
             * 柜信息
             ********************************************/
            {
                display: '柜号',
                name: 'cntr_no',
                align: 'left',
                minWidth: 100
            }, {
                display: '封条号',
                name: 'cntr_seal_no',
                align: 'left',
                minWidth: 100
            }, {
                display: '柜型',
                name: 'cntr_type',
                align: 'left',
                minWidth: 50
            }, {
                display: '甩挂',
                name: 'cntr_drop_trailer',
                align: 'left',
                minWidth: 40,
                render: LG.render.boolean('cntr_drop_trailer')
            }, {
                display: '孖拖',
                name: 'cntr_twin',
                align: 'left',
                minWidth: 40,
                render: LG.render.boolean('cntr_twin')
            }, {
                display: '孖拖柜号',
                name: 'cntr_twin_no',
                align: 'left',
                minWidth: 100
            }, {
                display: '船名',
                name: 'ship_name',
                align: 'left',
                minWidth: 100
            }, {
                display: '航次',
                name: 'voyage',
                align: 'left',
                minWidth: 100
            }, {
                display: '还柜地',
                name: 'gate_in_dock',
                align: 'left',
                minWidth: 150
            },
            /********************************************
             * 其它信息
             ********************************************/
            {
                display: '操作单位',
                name: 'oper_unit',
                align: 'left',
                minWidth: 100,
                width: '5%',
                render: LG.render.ref(data_dict[DICT_CODE.oper_unit], 'oper_unit')
            }, {
                display: '揽货公司',
                name: 'supplier_name',
                align: 'left',
                minWidth: 150,
                width: '10%'
            }, {
                display: '业务类型',
                name: 'bs_type_name',
                align: 'left',
                minWidth: 80,
                width: '5%'
            }, {
                display: '作业单号',
                name: 'bill_no',
                align: 'left',
                minWidth: 100,
                width: '8%',
            }, {
                display: '运输单号',
                name: 'order_bill_no',
                align: 'left',
                minWidth: 100,
                width: '5%'
            }, {
                display: '客户委托号',
                name: 'client_bill_no',
                align: 'left',
                minWidth: 120,
                width: '5%'
            }, {
                display: '提交人',
                name: 'audit_psn',
                align: 'left',
                minWidth: 100,
                width: '5%'
            }, {
                display: '提交时间',
                name: 'audit_time',
                align: 'left',
                minWidth: 130,
                width: '5%'
            }, {
                display: '创建人',
                name: 'create_psn',
                align: 'left',
                minWidth: 100,
                width: '5%'
            }, {
                display: '创建时间',
                name: 'create_time',
                align: 'left',
                minWidth: 130,
                width: '5%'
            }, {
                display: '备注',
                name: 'remark',
                align: 'left',
                minWidth: 150,
                width: '10%'
            }
        ];

        var searchFieldOptions = [{
            display: "委托客户",
            name: "client_name",
            newline: false,
            type: "select",
            options: {
                autocomplete: true,
                autocompleteAllowEmpty: true,
                highLight: true,
                data: data_clients
            }
        }, {
            display: "柜号",
            name: "cntr_no",
            newline: false,
            type: "text",
            cssClass: "field"
        }, {
            display: "业务类型",
            name: "bs_type_name",
            newline: false,
            type: "select",
            options: {
                data: data_bs_type_name
            }
        }, {
            display: "作业单号",
            name: "bill_no",
            newline: false,
            type: "text"
        }, {
            display: "运输单号",
            name: "order_bill_no",
            newline: false,
            type: "text"
        }, {
            display: "预约提柜时间",
            name: "cntr_pick_time",
            newline: false,
            type: "date",
            attr: {
                op: "greaterorequal" //操作符
            }
        }, {
            display: "至",
            name: "cntr_pick_time_e",
            newline: false,
            labelWidth: 24,
            type: "date",
            cssClass: "field",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd",
                onChangeDate: function(value) {
                    this.usedDate.setHours(23, 59, 59);
                }
            },
            attr: {
                "data-name": "cntr_pick_time",
                op: "lessorequal" //操作符
            }
        }, {
            display: "预约装卸时间",
            name: "cntr_work_time",
            newline: false,
            type: "date",
            attr: {
                op: "greaterorequal" //操作符
            }
        }, {
            display: "至",
            name: "cntr_work_time_e",
            newline: false,
            labelWidth: 24,
            type: "date",
            cssClass: "field",
            editor: {
                showTime: true,
                format: "yyyy-MM-dd",
                onChangeDate: function(value) {
                    this.usedDate.setHours(23, 59, 59);
                }
            },
            attr: {
                "data-name": "cntr_work_time",
                op: "lessorequal" //操作符
            }
        }];

        chargeGrid = $('#chargeGrid').ligerGrid({
            columns: [
                {
                    display: '收/付款',
                    name: 'charge_or_pay',
                    width: 60,
                    render: function (item) {
                        if (item.charge_or_pay == '收') {
                            return '<div class="charge">' + item.charge_or_pay + '</div>';
                        }
                        else if (item.charge_or_pay == '付') {
                            return '<div class="pay">' + item.charge_or_pay + '</div>';
                        }
                        return item.state;
                    }
                }, {
                    display: '费用名称',
                    name: 'fee_name'
                }, {
                    display: '单价',
                    name: 'price'
                }, {
                    display: '数量',
                    name: 'qty',
                    render: function (value) {
                        return Math.abs(value.qty);
                    }
                }, {
                    display: '含税',
                    name: 'contain_tax'
                }, {
                    display: '税率(%)',
                    name: 'tax_rate',
                    render: function () {
                        return "0.0000";
                    }
                }, {
                    display: '税金',
                    name: '',
                    render: function () {
                        return "0.0000";
                    }
                }, {
                    display: '金额',
                    name: 'total_amount',
                    render: function (value) {
                        return Math.abs(value.total_amount);
                    }
                }, {
                    display: '汇率',
                    name: 'excharge_rate'
                }, {
                    display: '结算金额',
                    name: 'tax_amount',
                    render: function (value) {
                        return Math.abs(value.tax_amount);
                    }
                }, {
                    display: '已收付金额',
                    name: 'finish_amount'
                }, {
                    display: '记账公司',
                    name: 'supplier_id',
                    render: LG.render.ref(data_suppliers, 'supplier_id')
                }, {
                    display: '备注',
                    name: 'remark'
                }],
            url: chargePath + 'loadGrid/' + mstId,  // 请求链接
            checkbox: true,
            width: '100%',
            height: '100%',
            heightDiff: -15,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            localStorageName: "FuleBillChargeGrid" + user.id + param.no,  // 本地存储名字
            selectRowButtonOnly: true  // 是否只能点击复选框才能选中
        });

        receiptGrid = $('#receiptGrid').ligerGrid({
            columns: gridColumnOption,
            url: checktPath + 'loadGrid/' + mstId,  // 请求链接
            checkbox: true,
            width: '100%',
            height: '100%',
            heightDiff: -15,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            delayLoad: true,
            localStorageName: "FuleBillReceiptGrid" + user.id + param.no,  // 本地存储名字
            selectRowButtonOnly: true,  // 是否只能点击复选框才能选中
            sortName: 'WORK_TIME',
            sortOrder: 'ASC'
        });

        checkGrid = $('#checkGrid').ligerGrid({
            columns: gridColumnOption,
            url: checktPath + 'loadNotCheckGrid/' + mstId,  // 请求链接
            checkbox: true,
            width: '100%',
            height: '100%',
            heightDiff: -15,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            delayLoad: true,
            localStorageName: "FuelBillFeeCheckGrid" + user.id + param.no,  // 本地存储名字
            selectRowButtonOnly: true,  // 是否只能点击复选框才能选中
            parms: [{
                name: 'where',
                value: JSON.stringify(where)
            }],
            sortName: 'WORK_TIME',
            sortOrder: 'ASC'
        });

        chargeSearch = $('#chargeSearch').ligerForm({
            fields: [{
                display: '记账公司',
                name: 'supplier_id'
            },{
                display: '收付款',
                name: 'charge_or_pay',
                newline: false,
                options: {
                    data: [{
                        text: '收费',
                        id: '收'
                    }, {
                        text: '付费',
                        id: '付'
                    }]
                }
            }],
            buttons: [{
                text: '搜索',
                click: function () {
                    search(chargeSearch, chargeGrid)
                }
            }, {
                text: '重置',
                click: function () {
                    chargeSearch.reset();
                }
            }],
            prefixID: 'charge_'
        });

        receiptSearch = $('#receiptSearch').ligerForm({
            fields: searchFieldOptions,
            buttons: [{
                text: '搜索',
                click: function () {
                    search(receiptSearch, receiptGrid)
                }
            }, {
                text: '重置',
                click: function () {
                    receiptSearch.reset();
                }
            }],
            prefixID: 'receipt_'
        });

        checkSearch = $('#checkSearch').ligerForm({
            fields: searchFieldOptions,
            buttons: [{
                text: '搜索',
                click: function () {
                    search(checkSearch, checkGrid)
                }
            }, {
                text: '重置',
                click: function () {
                    checkSearch.reset();
                }
            }],
            prefixID: 'check_'
        });

        chargeToolbar = $('#chargeTool').ligerToolBar({
            items: [{
                text: '刷新',
                icon: 'refresh',
                click: function () {
                    search(chargeSearch, chargeGrid)
                }
            },
//                {
//                text: '导出',
//                icon: 'export',
//                click: function () {
//                    LG.showError("暂未开放")
//                }
//            },
                {
                text: '返回',
                icon: 'withdraw',
                click: backPage
            }]
        });

        receiptToolbar = $('#receiptTool').ligerToolBar({
            items: [{
                text: '刷新',
                icon: 'refresh',
                click: function () {
                    search(receiptSearch, receiptGrid);
                }
            }, {
                text: '删除',
                icon: 'delete',
                click: function () {
                    removeCheack()
                }
            }, {
                text: '导出',
                icon: 'export',
                click: function () {
                    //Excel数据下载
                    $("#download").attr("action", checktPath + "excelExport/" + mstId);
                    xlsUtil.exp($("#download"), checkGrid, '装卸资料' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls');
                }
            },
//                {
//                text: '打印',
//                icon: 'print',
//                click: function () {
//                    LG.showError('暂未开放');
//                }
//            },
                {
                text: '返回',
                icon: 'withdraw',
                click: backPage
            }]
        });

        checkTool = $('#checkTool').ligerToolBar({
            items: [{
                text: '刷新',
                icon: 'refresh',
                click: function () {
                    search(checkSearch, checkGrid);
                }
            }, {
                text: '追加单据',
                icon: 'add',
                click: function () {
                    addCheack()
                }
            },  {
                text: '返回',
                icon: 'withdraw',
                click: backPage
            }]
        });

        function addCheack () {
            var datas = checkGrid.getSelecteds();
            if (datas.length < 1) {
                LG.showError('请选择数据');
                return false;
            }
            var results = [];
            for (var i = datas.length - 1; i >= 0; i--) {
                var item = datas[i];
                item.pk_id && results.push(item.pk_id)
            }

            $.ligerDialog.confirm('是否追加单据', '追加单据', function (result) {
                if (!result) {return false;}
                LG.ajax({
                    url: checktPath + 'add',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        trans_ids: results,
                        bill_id: mstId
                    }),
                    success: function (Data) {
                        checkGrid.loadData();
                    },
                    error: LG.showError
                });
            });
        }

        function removeCheack () {
            var datas = receiptGrid.getSelecteds();
            if (datas.length < 1) {
                LG.showError('请选择数据');
                return false;
            }
            var results = [];
            for (var i = datas.length - 1; i >= 0; i--) {
                var item = datas[i];
                item.pk_id && results.push(item.pk_id);
            }

            $.ligerDialog.confirm('是否删除', '删除单据', function (result) {
                if (!result) {return false;}
                LG.ajax({
                    url: checktPath + 'remove',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        trans_ids: results,
                        bill_id: mstId
                    }),
                    success: function (result) {
                        receiptGrid.loadData();
                    },
                    error: LG.showError
                });
            });
        }
    });
    /*
    *  搜索
    * @param form : 你搜索的form
    * @param grid : 你需要进行更新的表格
    * */
    function search (form, grid) {
        if (!form || !grid) { return; }
        if (!form.valid()) {
            form.showInvalid();
            return;
        }
        var where = form.getSearchFormData(false);
        grid.set('parms', [{
            name: 'where',
            value: where
        }]);
        grid.changePage('first');
        grid.loadData();
    }

    //根据url选择左侧菜单
    //需要获得fromtab(url中获得)
    function backPage() {
        var testEq = /urlid=([^&]*)/.exec(window.location.search);
        if (testEq) {
            try {
                top.tab.removeTabItem(top.tab.getSelectedTabItemID()).selectTabItem(testEq[1]);
            }
            catch (e) {
                LG.tip('功能出小差了,请手动返回.');
                console.error(e);
            }
        }
        else {
            top.topBackTrack.back();
        }
    }
</script>
</html>