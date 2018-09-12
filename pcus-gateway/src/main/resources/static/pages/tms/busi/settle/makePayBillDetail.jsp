<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/11
  Time: 9:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>应付账单制作</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .l-dialog-content-noimage{
            overflow: hidden;
        }
    </style>
</head>
<div id="layout">
    <div class="content-wrapper filter-wrapper">
        <form id="filterForm"></form>
        <ul class="search-btn-con">
            <li class="search-btn s-btn limit-select" id="searchBtn"></li>
            <li class="search-btn r-btn limit-select" id="resetBtn"></li>
        </ul>
        <div class="l-clear"></div>
    </div>
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
<!-- 增加弹出框 -->
<div id="createDialog" style="display: none;">
    <form id="createForm"></form>
</div>
<script>

    var SELECTED = 'selected';
    var client_id = '${client_id}';
    var supplier_id = '${supplier_id}';
    var client_data = ${client};
    var data_dict = ${dict};
    //上下文路径
    var basePath = rootPath + '/tms/settle/makebillpaydetail/';

    var busiType =${busiType};
    //默认数据
    var emptyData = {
        rule_name: '',
        rule_code: '',
        consuming: 0,
        modify_time: '',
        modify_psn: '',
        remark: ''
    };

    //增加非合同客户的搜索条件
    var clauseClient = (function () {
        if (client_id) {
            return {field: 'client_id', value: client_id, op: 'equal'};
        } else {
            return {field: 'CLIENT_ID IS NULL', value: '', op: 'clause'}
        }
    })();

    //页面元素
    var $gridWrapper = $(".grid-wrapper"),
            $filterWrapper = $(".filter-wrapper"),
            $filterForm = $("#filterForm"),
            $mainDlg = $("#mainDlg"), //编辑弹窗
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            mainGrid, //列表
            mainForm, //编辑表单
            createForm, //编辑表单
            mainDlg; //弹窗

    var where = JSON2.stringify({
        op: 'and',
        rules: [{field: 'DR', value: '0', op: 'equal'}, clauseClient, {field: 'supplier_id', value: supplier_id, op: 'equal'}]
    });
    //初始化表格选项
    var gridOption = {
        columns: [
            {display: '结算日期', name: 'settle_date', align: 'left', minWidth: 50, width: '8%', frozen: true,
                render: function (item) {return !!item.settle_date ? item.settle_date.substring(0, 10) : '';}},
            {display: '司机', name: 'driver_name', align: 'left', minWidth: 50, width: '8%', frozen: true},
            {display: '车牌号', name: 'car_no', align: 'left', minWidth: 50, width: '8%', frozen: true},
            {display: '费用名称', name: 'fee_name', align: 'left', minWidth: 50, width: '8%', frozen: true},
            {display: '应付', name: 'total', align: 'left', minWidth: 50, width: '6%', frozen: true},
            {display: '含税', name: 'tax', align: 'left', minWidth: 50, width: '6%', frozen: true},
            {display: '提柜码头', name: 'gate_out_dock', align: 'left', minWidth: 50, width: '10%'},
            {display: '装卸单位信息', name: 'load_org', align: 'left', minWidth: 50, width: '10%',
                render: function (item) {
                    var load_org = item.load_org || '';
                    var unload_org = item.unload_org || '';
                    return load_org + ' ' + unload_org;
                }
            },
            {display: '还柜码头', name: 'gate_in_dock', align: 'left', minWidth: 50, width: '10%'},
            {display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '10%'},
            {display: '预抵时间', name: 'cntr_work_time', align: 'left', minWidth: 50, width: '10%',
                render: function (item) {return !!item.cntr_work_time ? item.cntr_work_time.substring(0, 10) : '';}},
            {display: '客户', name: 'client_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '订舱号', name: 'booking_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '封条号', name: 'cntr_seal_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 50, width: '5%'},
            {display: '计费方式', name: 'fee_type_name', align: 'left', minWidth: 50, width: '6%', isSort: false, quickSort: false},
            {display: '计费单位', name: 'fee_unit_name', align: 'left', minWidth: 50, width: '6%', isSort: false, quickSort: false},
            {display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '10%'},
            {display: '工作号', name: 'bill_no', align: 'left', minWidth: 50, width: '8%'},
            {display: '急单类型', name: 'urgen_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '提柜堆场', name: 'gate_out_yard', align: 'left', minWidth: 50, width: '10%'},
            {display: '还柜堆场', name: 'gate_in_yard', align: 'left', minWidth: 50, width: '10%'},
            {display: '散货数量', name: 'cargo_qty', align: 'left', minWidth: 50, width: '10%'},
            {display: '船公司', name: 'ship_corp', align: 'left', minWidth: 50, width: '10%'},
            {display: '船名', name: 'ship_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '航次', name: 'voyage', align: 'left', minWidth: 50, width: '10%'},
            {display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '操作单位', name: 'oper_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '录单人', name: 'create_psn', align: 'left', minWidth: 50, width: '10%'},
            {display: '录单时间', name: 'create_time', align: 'left', minWidth: 50, width: '10%'}
        ],
        pageSize: 50,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -15,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'settle_date',
        sortOrder: 'asc',
        parms: [{name: 'where', value: where}],
        pageSizeOptions:[30,50,100,500,1000],
        pageSize:50,
        colDraggable: true,
        localStorageName: 'makePayBillDetail' + user.id,
    };

    var filterFormOption = {
        fields: [
            {
                display: "结算日期",
                name: "settle_date_start",
                width: 170,
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd"
                },
                attr: {
                    op: "greaterorequal", //操作符
                    "data-name": "settle_date", //查询字段名称
                    datetimerange: true
                }
            }, {
                display: "至",
                name: "settle_date_end",
                width: 170,
                labelWidth: 24,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd"
                },
                attr: {
                    op: "lessorequal", //操作符
                    "data-name": "settle_date", //查询字段名称
                    datetimerange: true
                }
            }
            , {
                display: "操作单位",
                name: "oper_name",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "业务类型",
                name: "bs_type_name",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "车号",
                name: "car_no",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "客户",
                name: "client_name",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "装卸单位",
                name: "load_unit_info",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "揽货公司",
                name: "supplier_name",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "订舱号",
                name: "booking_no",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "柜号",
                name: "cntr_no",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }
            , {
                display: "工作号",
                name: "bill_no",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }, {
                display: "提还柜地",
                name: "dock_info",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
            }, {
                display: "费用",
                name: "fee_name",
                width: 170,
                newline: false,
                type: "text",
                cssClass: "field",
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
        ]
    };

    var createFormOption = {
        fields: [
            {
                display: "车队",
                name: "client_name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                //非自定义客户必选
                options: {readonly: !!client_id},
                validate: {required: true},
                cssClass: "field"
            },
            {
                display: "年份",
                name: "year",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                options: {
                    data: QUERY_CONST.SELECT_YEAR
                },
                cssClass: "field"
            },
            {
                display: "月份",
                name: "month",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                options: {
                    data: QUERY_CONST.SELECT_MONTH
                },
                cssClass: "field"
            },
            {
                display: "备注",
                name: "remark",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            }
        ],
        validate: true,
        prefixID: "c_",
        toJSON: JSON2.stringify
    };

    var mainFormOption = {
        fields: [{
            display: "账单号",
            name: "bill_no",
            newline: false,
            labelWidth: 80,
            width: 170,
            space: 30,
            type: "text",
            cssClass: "field",
            validate: {required: true}
        }],
        validate: true,
        prefixID: "s_",
        toJSON: JSON2.stringify
    };


    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '追加账单',
        width: 350,
        height: 120,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {

                    //校验数据
                    if (!mainForm.valid()) {
                        mainForm.showInvalid();
                        return;
                    }

                    var selected = mainGrid.getCheckedRows();
                    if ((selected == null) || (selected == '') || (selected == 'undefined')) {
                        LG.showError('请选择行');
                        return;
                    }
                    ;
                    var order_id = [];
                    var bill_no = '';
                    for (var i = 0; i < selected.length; i++) {
                        order_id.push(selected[i].pk_id)
                    }

                    LG.singleAjax({
                        url: basePath + 'appendBill',
                        data: {
                            client_id: client_id,
                            order_id: order_id.join(','),
                            supplier_id: supplier_id,
                            bill_no: mainForm.getData().bill_no
                        },
                        success: function (data, msg) {
                            LG.tip("操作成功");
                            //刷新角色列表
                            dialog.hide();
                            mainGrid.reload();
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });

//                    $.ajax({
//                        url: basePath + 'appendBill',
//                        data: {
//                            client_id: client_id,
//                            order_id: order_id.join(','),
//                            supplier_id: supplier_id,
//                            bill_no: mainForm.getData().bill_no
//                        },
//                        success: function (data, msg) {
//                            if (JSON2.parse(data).error) {
//                                LG.showError(JSON2.parse(data).message);
//                            } else {
//                                LG.tip("操作成功。");
//                            }
//                            //刷新角色列表
//                            dialog.hide();
//                            mainGrid.reload();
//                        },
//                        error: function (message) {
//                            LG.showError(message);
//                        }
//                    });

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

    //对话框
    var createOption = {
        target: $("#createDialog"),
        title: '请选择账单年月',
        width: 350,
        height: 200,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {

                    //校验数据
                    if (!createForm.valid()) {
                        createForm.showInvalid();
                        return;
                    }

                    var selected = mainGrid.getCheckedRows();
                    var order_id = [];
                    for (var i = 0; i < selected.length; i++) {
                        order_id.push(selected[i].pk_id)
                    }

                    var postData = $.extend({}, createForm.getData(), {
                        client_id: client_id,
                        order_id: order_id.join(','),
                        supplier_id: supplier_id
                    });
                    LG.singleAjax({
                        url: basePath + 'generateBill',
                        data: postData,
                        success: function (data, message) {
                            dialog.hide();
                            LG.showSuccess("生成账单成功，账单号为【" + message + "】");
                            //刷新角色列表
                            mainGrid.reload();
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

    var btnClick = function (item) {
        switch (item.id) {
            case "generateBill":
                var selected = mainGrid.getCheckedRows();
                if ((selected == null) || (selected == '') || (selected == 'undefined')) {
                    LG.showError('请选择行');
                    return;
                }

                $.ligerDialog.open(createOption);
                break;
            case "appendBill":

                //消除校验格式
                LG.clearValid($mainForm);
                liger.get("s_bill_no").setValue('');
                $.ligerDialog.open(dialogOption);


                break;
            default:
                break;
        }
    };

    //扩展按钮
    var toolbarOption = {
        items: [
            {id: 'add', ignore: true},
            {id: 'delete', ignore: true},
            {id: 'generateBill', text: '生成账单', click: btnClick, icon: 'generatebill', status: ['OP_INIT']},
            {id: 'appendBill', text: '追加账单', click: btnClick, icon: 'Additionalbill', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };


</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>
<script type="text/javascript">
    defaultSearchFilter["and"].push({field: 'client_id', value: client_id, op: 'equal', type: 'string'});
    defaultSearchFilter["and"].push({field: 'supplier_id', value: supplier_id, op: 'equal', type: 'string'});

    createForm = $("#createForm").ligerForm(createFormOption);
//    console.log(client_data);
    createForm.setData({
        client_name: (client_data || {}).name
    });
</script>
</body>
</html>