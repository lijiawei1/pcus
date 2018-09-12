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
    <title>关联订单</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
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
</body>
<script>

    var mst_id = '${mst_id}';

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/busi/transRelatedOrder/';


    //默认数据
    var emptyData = {};

    //页面元素
    var $toptoolbar = $("#toptoolbar"),
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            mainGrid, //列表
            mainForm; //编辑表单

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '状态',
                name: 'state_name',
                align: 'left',
                minWidth: 50,
                width: '3%',
                frozen: true,
                quickSort: false,
            },
            {
                display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 50, width: '5%', frozen: true
            },
            {
                display: '运输单号', name: 'bill_no', align: 'left', minWidth: 50, width: '5%', frozen: true
            },
            {
                display: '客户', name: 'client_name', align: 'left', minWidth: 50, width: '8%', frozen: true
            },
            {
                display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 50, width: '8%'
            },
            {
                display: '车型', name: 'booking_car_type_name', align: 'left', minWidth: 50, width: '5%',
//                render: LG.render.ref(data_dict[DICT_CODE.car_type], 'booking_car_type')
            },
            {
                display: '主副单/柜', name: 'bill_main', align: 'left', minWidth: 50, width: '3%',
                render: function (item) {
                    switch (item.bill_main) {
                        case "MAIN":
                            return "主";
                        case "SUB":
                            return "副";
                        default:
                            return "";
                    }
                }
            },
            {
                display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '封条号', name: 'cntr_seal_no', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '甩挂', name: 'cntr_drop_trailer', align: 'left', minWidth: 50, width: '2%',
                render: LG.render.boolean('cntr_drop_trailer')
            },
            {
                display: '孖拖', name: 'cntr_twin', align: 'left', minWidth: 50, width: '2%',
                render: LG.render.boolean('cntr_twin')
            },
            {
                display: '孖拖柜号', name: 'cntr_twin_no', align: 'left', minWidth: 50, width: '2%'
            },
            {
                display: '客户委托号', name: 'client_bill_no', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '装货单位信息', name: 'load_org', align: 'left', minWidth: 50, width: '10%',
                render: function (item) {
                    return (item.load_org || '') + ' ' +
                            (item.load_linkman || '') + ' ' +
                            (item.mobile || '')
                }
            },
            {
                display: '卸货单位信息', name: 'unload_org', align: 'left', minWidth: 50, width: '10%',
                render: function (item) {
                    return (item.unload_org || '') + ' ' +
                            (item.unload_linkman || '') + ' ' +
                            (item.unload_mobile || '')
                }
            },
            {
                display: '订舱号', name: 'booking_no', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '船公司', name: 'ship_corp', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '船名', name: 'ship_name', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '航次', name: 'voyage', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '提柜地', name: 'gate_out_dock', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '还柜地', name: 'gate_in_dock', align: 'left', minWidth: 50, width: '5%'
            },
            /********************************************
             * 其它信息
             ********************************************/
            {
                display: '操作单位', name: 'oper_unit_name', align: 'left', minWidth: 50, width: '5%',
//                render: LG.render.ref(data_dict[DICT_CODE.oper_unit], 'oper_unit')
            },
            {
                display: '操作人', name: 'manager', align: 'left', minWidth: 50, width: '5%',
            },
            {
                display: '主单单号', name: 'main_bill_no', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '急单类型', name: 'urgen_order_type_name', align: 'left', minWidth: 50, width: '5%',
//                render: LG.render.ref(data_dict[DICT_CODE.urgent_order], 'urgen_order_type')
            },
            {
                display: '带货', name: 'take_goods', align: 'left', minWidth: 50, width: '5%',
                render: LG.render.boolean('take_goods')
            },
            {
                display: '审核人', name: 'audit_psn', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '审核时间', name: 'audit_time', align: 'left', minWidth: 50, width: '5%'
            },
//            {
//                display: '创建人', name: 'create_psn', align: 'left', minWidth: 50, width: '5%'
//            },
//            {
//                display: '创建时间', name: 'create_time', align: 'left', minWidth: 50, width: '5%'
//            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '10%'
            }
        ],
        pageSize: 20,
        url: basePath + 'loadGrid/' + mst_id,
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        dataAction: 'server',
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        inWindowComplete: true,
        heightDiff: -45,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'modify_time',
        sortOrder: 'desc'
    };

    mainGrid = $mainGrid.ligerGrid(gridOption);

    var defaultActionOption = {
        items: [
            {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };

    function defaultAction(item) {

        switch (item.id) {
            case "refresh":
                payGrid.reload();
                chargeGrid.reload();
                break;
        }
    }

    //扩展按钮
    toptoolbar = LG.powerToolBar($toptoolbar, defaultActionOption);

    //单框搜索
    //本事件的e，输入的值，触发源，触发源的e
    $("body").on("single-search",function(e, value,target, target_e){
        value = $.trim(value);

        if(typeof defaultSearchFilter === "undefined"){
            defaultSearchFilter = {
                and:[],
                or:[]
            };
        }

        mainGrid.set('parms', [{name: 'where', value: mainGrid.getSearchGridData(true, value,defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    });

</script>
</html>
