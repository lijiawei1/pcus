<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/2
  Time: 15:51
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>客户合同</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>

    <style type="text/css">
        .yujing {
            color: #fff;
            background-color: #ff0000;
        }
    </style>
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
        <!-- 快速搜索 -->
        <div class="quick-search">
            <a class="qs-item visited" href="javascript:;" onclick="quickQuery(0,this)">全部(${all})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(1,this)">使用中(${shiyongzhong})</a>
            <a class="qs-item" href="javascript:;" onclick="quickQuery(2,this)">已失效(${yixiaoshi})</a>
        </div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
</body>
<script>

    var client_id = '${client_id}';

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/bas/contract/';


    //默认数据
    var emptyData = {
        pk_id: '',
        contract_no: '',
        contract_name: '',
        contract_own: '',
        second_id: '',
        service_type: null,
        currency: '',
        begin_date: '',
        end_date: '',
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
        rules: [{field: 'DR', value: '0', op: 'equal'}, {field: 'first_id', value: client_id, op: 'equal'}]
    });

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '', align: '', minWidth: 50, width: '5%', sortable: false,
                render: function (item, index) {
                    return '<a class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-edit"></i></a>';
                }
            },
            {
                display: '状态',
                name: 'state_name',
                align: 'left',
                minWidth: 50,
                width: '5%',
                quickSort: false,
                isSort: false,
            },
            {
                display: '预警',
                align: 'left',
                minWidth: 50,
                width: '5%',
                isSort: false,
                quickSort: false,
                render: function (item) {
                if (item.end_date) {
                    var totalDate = DateUtil.dateDiff('d', new Date(), DateUtil.strToDate(item.end_date));
                    if (totalDate < 30 && totalDate >= 0)
                        return '<div class="yujing">' + totalDate + '</div>';
                    else if (totalDate < 0) {
                        return '<div class="yujing">已失效</div>';
                    }
                }
                return '';
            }
            },
            {
                display: '合同编号', name: 'contract_no', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '合同名称', name: 'contract_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '合同自定义编号', name: 'contract_own', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '乙方', name: 'second_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '甲方', name: 'first_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '合同币种', name: 'currency_name', align: 'left', minWidth: 50, width: '10%'
            },
            {
                display: '生效日期', name: 'begin_date', align: 'left', minWidth: 50, width: '10%', type: 'date'
            },
            {
                display: '失效日期', name: 'end_date', align: 'left', minWidth: 50, width: '10%', type: 'date'
            },
            {
                display: '报价记录', name: 'count', align: 'left', minWidth: 50, width: '5%'
            }
        ],
        pageSize: 20,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        checkbox: true,
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -40,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'contract_no',
        sortOrder: 'asc',
        parms: [{name: 'where', value: where}],
        onDblClickRow:function(rowData,id,rowDom,fn){
            //进入客户资料信息页签
            top.f_addTab(rowData.pk_id, '客户合同[' + rowData.contract_no + ']', basePath + 'loadCard'
                    + '?module=' + '基础资料' + '&detailFunction=' + '客户合同' + '&function=' + '客户管理' + '&pk_id=' + rowData.pk_id);
        }
    };

    var filterFormOption = {
        fields: [
            {
                display: "合同编号",
                name: "contract_no",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {

                name: "first_id",
                type: "hidden",
                cssClass: "field",
                options: {
                    value: client_id
                }
            }
        ]
    };

    var mainFormOption = {
        fields: [
            {
                display: "合同编号(自动)",
                name: "contract_no",
                newline: false,
                labelWidth: 100,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                options: {
                    readonly: true,
                    disabled: true
                }
            },
            {
                display: "合同名称",
                name: "contract_name",
                newline: false,
                labelWidth: 100,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true},
                attr: {
                    maxlength: 50
                }
            },
            {
                display: "自定义编号",
                name: "contract_own",
                newline: false,
                labelWidth: 100,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    maxlength: 50
                }
            },
            {
                display: '乙方', name: 'second_id', labelWidth: 100,
                width: 170,
                space: 30, newline: false, type: 'select',
                options: {
                    url: basePath + "getSupplier"
                },
                validate: {required: true, messages: {required: '乙方不能为空。'}}
            },
            {
                display: '业务范畴', name: 'service_type', labelWidth: 100,
                width: 170,
                space: 30, newline: false, type: 'select',
                options: {
                    url: basePath + "getServiceType",
                    split: ',',
                    isMultiSelect: true
                },
                validate: {required: true, messages: {required: '业务范畴不能为空。'}}
            },
            {
                display: '合同币种', name: 'currency', labelWidth: 100,
                width: 170,
                space: 30, newline: false, type: 'select',
                options: {
                    url: basePath + '/tms/bas/dict/getData?query=currency'
                },
                validate: {required: true, messages: {required: '合同币种不能为空。'}}
            },
            {
                display: '生效日期',
                name: 'begin_date',
                labelWidth: 100,
                width: 170,
                space: 30,
                newline: false,
                type: 'date',
                validate: {required: true, messages: {required: '生效日期不能为空。'}}
            },
            {
                display: '失效日期',
                name: 'end_date',
                labelWidth: 100,
                width: 170,
                space: 30,
                newline: false,
                type: 'date',
                validate: {required: true, messages: {required: '失效日期不能为空。'}}
            },
            {
                display: "备注",
                name: "remark",
                newline: false,
                labelWidth: 100,
                width: 470,
                space: 10,
                type: "text",
                attr: {
                    maxlength: 200
                }
            },
            {

                name: "pk_id",
                type: "hidden"
            }
        ],
        validate: true,
        toJSON: JSON2.stringify,
        readonly: disabledButtons.indexOf('edit') >= 0
    };

    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 350,
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
                        modify_time: $mainForm.find("input[name=modify_time]").val(),
                        begin_date: DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", mainForm.getData().begin_date),
                        end_date: DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", mainForm.getData().end_date),
                        first_id: client_id
                    });

                    LG.singleAjax({
                        url: basePath + url,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (data, msg) {
                            LG.tip('保存成功!');
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

    //扩展按钮
    var toolbarOption = {
        items: [
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };
    var btnClick = function (item) {
    };

</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>

<script type="text/javascript">
    defaultSearchFilter["and"].push({field: 'first_id', value: client_id, op: 'equal', type: 'string'});
    $(function () {
        //初始化编辑按钮
        $mainGrid.on('click', 'a.row-edit-btn', function (e) {
            var index = $(this).data("index");
            var selected = mainGrid.getRow(index);

            //进入客户资料信息页签
            top.f_addTab(selected.pk_id, '客户合同[' + selected.contract_no + ']', basePath + 'loadCard'
                    + '?module=' + '基础资料' + '&detailFunction=' + '客户合同' + '&function=' + '客户管理' + '&pk_id=' + selected.pk_id);

        });
    });


    function quickQuery(type, obj) {
        $("a.qs-item.visited").removeClass("visited");
        $(obj).addClass("visited");
        if (defaultSearchFilter["and"].length > 1) {
            defaultSearchFilter["and"].pop();
        }
        if (type == 0) {
        }
        if (type == 1) {
            defaultSearchFilter["and"].push({field: 'state', value: 'STATE_11_USE', op: 'equal', type: 'string'});
        }
        if (type == 2) {
            defaultSearchFilter["and"].push({field: 'state', value: 'STATE_15_INVALID', op: 'equal', type: 'string'});
        }
        mainGrid.set('parms', [{name: 'where', value: getSearchGridData(mainGrid, '', defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    }


</script>
</html>