<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/14
  Time: 9:10
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>应收账单明细</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
</head>
<body>
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
<!-- 高级搜索 -->
<div class="advanced-search-wrap" id="advanced-search-wrap">
    <div class="rect border"></div>
    <div class="circle big border"></div>
    <div class="circle big inner"></div>
    <div class="circle small border"></div>
    <div class="circle small inner close limit-select" data-action="close-advanced-search">&times;</div>
    <div class="advanced-search" id="advanced-search">
        <div class="advanced-search-title">高级搜索</div>
        <div class="advanced-search-content">
            <form id="filterForm"></form>
        </div>
        <ul class="search-btn-con">
            <li class="search-btn s-btn limit-select" id="searchBtn"></li>
            <li class="search-btn r-btn limit-select" id="resetBtn"></li>
        </ul>
    </div>
</div>

<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/settle/recieve/download">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

<script>

    var SELECTED = 'selected';
    var client_id = '${client_id}';
    //上下文路径
    var basePath = rootPath + '/tms/settle/recievedetail/';

    //默认数据
    var emptyData = {
        rule_name: '',
        rule_code: '',
        consuming: 0,
        modify_time: '',
        modify_psn: '',
        remark: ''
    };

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
            mainDlg; //弹窗

    var where = JSON2.stringify({
        op: 'and',
        rules: [{field: 'DR', value: '0', op: 'equal'}, {field: 'order_id', value: client_id, op: 'equal'}]
    });
    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '结算日期', name: 'settle_date', align: 'left', minWidth: 50, width: '8%', frozen: true,
                render: function (item) {
                    return !!item.settle_date ? item.settle_date.substring(0, 10) : '';
                }
            },
            {display: '客户', name: 'client_name', align: 'left', minWidth: 50, width: '10%', frozen: true},
            {display: '业务类型', name: 'bs_type_name', align: 'left', minWidth: 50, width: '5%', frozen: true},
            {display: '费用名称', name: 'fee_name', align: 'left', minWidth: 50, width: '8%', frozen: true},
            {display: '应收', name: 'total', align: 'left', minWidth: 50, width: '6%', frozen: true},
            {display: '含税', name: 'tax', align: 'left', minWidth: 50, width: '6%', frozen: true},
            {display: '提柜码头', name: 'gate_out_dock', align: 'left', minWidth: 50, width: '10%'},
            {
                display: '装卸单位信息', name: 'load_org', align: 'left', minWidth: 50, width: '10%',
                render: function (item) {
                    return (item.load_org || '') + ' ' + (item.unload_org || '');
                }
            },
            {display: '还柜码头', name: 'gate_in_dock', align: 'left', minWidth: 50, width: '10%'},
            {display: '柜号', name: 'cntr_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '柜型', name: 'cntr_type', align: 'left', minWidth: 50, width: '10%'},
            {display: '订舱号', name: 'booking_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '船公司', name: 'ship_corp', align: 'left', minWidth: 50, width: '10%'},
            {display: '船名', name: 'ship_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '航次', name: 'voyage', align: 'left', minWidth: 50, width: '10%'},
            {
                display: '预抵时间', name: 'cntr_work_time', align: 'left', minWidth: 50, width: '10%',
                render: function (item) {
                    return !!item.cntr_work_time ? item.cntr_work_time.substring(0, 10) : '';
                }
            },
            {display: '封条号', name: 'cntr_seal_no', align: 'left', minWidth: 50, width: '10%'},
            {
                display: '计费方式',
                name: 'fee_type_name',
                align: 'left',
                minWidth: 50,
                width: '6%',
                isSort: false,
                quickSort: false
            },
            {
                display: '计费单位',
                name: 'fee_unit_name',
                align: 'left',
                minWidth: 50,
                width: '6%',
                isSort: false,
                quickSort: false
            },
            {display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '10%'},
            {display: '工作号', name: 'bill_no', align: 'left', minWidth: 50, width: '10%'},
            {display: '急单类型', name: 'urgen_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '提柜堆场', name: 'gate_out_yard', align: 'left', minWidth: 50, width: '10%'},
            {display: '还柜堆场', name: 'gate_in_yard', align: 'left', minWidth: 50, width: '10%'},
            {display: '散货数量', name: 'cargo_qty', align: 'left', minWidth: 50, width: '10%'},
            {display: '揽货公司', name: 'supplier_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '操作单位', name: 'oper_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '录单人', name: 'create_psn', align: 'left', minWidth: 50, width: '10%'},
            {display: '录单时间', name: 'create_time', align: 'left', minWidth: 50, width: '10%'},
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
        sortName: 'total',
        sortOrder: 'desc',
        parms: [{name: 'where', value: where}],
        pageSizeOptions: [30, 50, 100, 500, 1000],
        pageSize: 50
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
                }
            }
        ]
    };

    var mainFormOption = {
        fields: [],
        validate: true,
        toJSON: JSON2.stringify
    };


    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 300,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {

                    //校验数据
                    if (!mainForm.valid()) {
                        mainForm.showInvalid();
                        return;
                    }

                    var selected = $mainForm.data(SELECTED);
                    //地址
                    var url = !!selected ? 'update' : 'add';
                    //数据
                    var data = $.extend({}, selected, mainForm.getData(), {
                        create_time: $mainForm.find("input[name=create_time]").val(),
                        modify_time: $mainForm.find("input[name=modify_time]").val()
                    });

                    LG.singleAjax({
                        url: basePath + url,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (data, msg) {
                            LG.tip('保存成功!')
                            dialog.hide();
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
            case "download":
                xlsUtil.exp($("#download"), mainGrid, '应收账单明细' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls',
                        {pk_id: client_id});
                break;
            case "delete":
                //跳转到新页签 编辑
                $.ligerDialog.confirm('是否删除账单明细条目？', function (yes) {
                    if (yes) {

                        var selected = mainGrid.getCheckedRows();
                        if ((selected == null) || (selected == '') || (selected == 'undefined')) {
                            LG.showError('请选择行');
                            return;
                        }
                        ;
                        var order_id = [];
                        for (var i = 0; i < selected.length; i++) {
                            order_id.push(selected[i].pk_id)
                        }

                        LG.singleAjax({
                            url: basePath + 'remove',
                            data: {bill_id: client_id, ids: order_id.join(',')},
                            success: function (data, msg) {
                                LG.tip("删除成功");
                                mainGrid.reload();
                            },
                            error: function (message) {
                                LG.showError(message);
                            }
                        }, item);
                    }
                });
                break;
            default:
                break;
        }
    };

    //扩展按钮
    var toolbarOption = {
        items: [
            {id: 'add', ignore: true},
            {id: 'download', text: '导出', click: btnClick, icon: 'export', status: ['OP_INIT']},
            {id: 'delete', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };

    /**
     * 导出excel
     * @param grid
     * @param formsearch
     * @param filename
     */
    function excel(pk_id, filename) {
        var p = mainGrid.options;
        var columns = mainGrid.options.columns;

        //表头和字段名
        var headers = [], names = [];
        for (var i in columns) {
            var column = columns[i];

            var xlsHead = column.xlsHead || column.display;
            var xlsName = column.xlsName || column.name;

            if (xlsHead && xlsName) {
                headers.push(xlsHead);
                names.push(xlsName);
            }
        }
//            var formData = $.extend({}, formsearch.getData());
//            $('#download').find('input[name=where]').val(JSON2.stringify(formData, DateUtil.dateReplacer));
//            $('#download').find('input[name=from_company]').val(from_company);

        $('#download').find('input[name=pk_id]').val(pk_id);
        $('#download').find('input[name=file_name]').val(filename);
        $('#download').find('input[name=headers]').val(headers.join(","));
        $('#download').find('input[name=names]').val(names.join(","));
        $('#download').find('input[name=sortname]').val(p.sortName);
        $('#download').find('input[name=sortorder]').val(p.sortOrder);
        $('#download').submit();
    }
    ;


</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>
<script type="text/javascript">
    defaultSearchFilter["and"].push({field: 'order_id', value: client_id, op: 'equal', type: 'string'});
</script>
</body>
</html>