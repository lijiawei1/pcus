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
    var data_bs_type_name = ${busiType}, //业务类型
            data_state = ${state}; //单据状态
            <%--data_clients = ${clients}, //客户--%>
            <%--data_suppliers = ${suppliers}, //供应商--%>
            <%--data_clientLinkmans = ${clientLinkmans},--%>
            <%--data_dict = ${dict};--%>

    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/bas/template/';


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
                display: '编辑', align: '', minWidth: 50, width: '2%', sortable: false, quickSort: false, isSort: false, storageName: "edit",
                render: function (item, index) {
                    return '<a name="edit" class="row-edit-btn" data-index="' + index + '" title="编辑"><i class="iconfont l-icon-edit"></i></a>';
                },
                hide: disabledButtons.indexOf('updata') >= 0
            },
            {
                //行内按钮
                display: '详细', align: '', minWidth: 50, width: '2%', sortable: false,
                render: function (item, index) {
                    return '<a  name="edit_data"  class="row-edit-btn" data-index="' + index + '" title="详细"><i class="iconfont l-icon-clause"></i></a>';
                }
            },
           // {
           //     //行内按钮
           //     display: '复制', align: '', minWidth: 50, width: '2%', isSort: false, frozen: true, quickSort: false, storageName: 'copy',
           //     render: function (item, index) {
           //         return '<a class="row-copy-btn" data-index="' + index + '" title="复制"><i class="iconfont l-icon-copy"></i></a>';
           //     }
           // },
            {display: '状态', name: 'state', align: 'left', minWidth: 50, width: '2%', quickSort: false, isSort: false,
                render: LG.render.ref(data_state, 'state')},
            {display: '名称', name: 'name', align: 'left', minWidth: 50, width: '25%', quickSort: true, isSort: false},
            {display: '代码', name: 'code', align: 'left', minWidth: 50, width: '25%', quickSort: true, isSort: false},
            {display: '业务类型', name: 'type', align: 'left', minWidth: 50, width: '25%', quickSort: false, isSort: false,
                render: LG.render.ref(data_bs_type_name, 'type')},
           // {display: '客户主键', name: 'client_id', align: 'left', minWidth: 50, width: '5%', quickSort: false, isSort: false},
           // {display: '移动端可用', name: 'app', align: 'left', minWidth: 50, width: '5%', quickSort: false, isSort: false,
           //     render: LG.render.boolean('app')},
           // {display: '网页端可用', name: 'web', align: 'left', minWidth: 50, width: '5%', quickSort: false, isSort: false,
           //     render: LG.render.boolean('app')},
        ],
        pageSize: 20,
        url: basePath + 'loadGrid/' + client_id,
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%', height: '100%', autoStretch: true, dataAction: 'server',
        checkbox: true, usePager: true, enabledEdit: false, clickToEdit: false, fixedCellHeight: true,
        heightDiff: -40, rowHeight: 30, headerRowHeight: 28, rowSelectable: true, selectable: true,
        // frozen: true,
        rownumbers: true, selectRowButtonOnly: true, sortName: 'name', sortOrder: 'asc'
    };

    var filterFormOption = {
        fields: [
            {display: "名称", name: "name", newline: false, labelWidth: 80, width: 170, space: 30, type: "text", cssClass: "field"},
            {name: "client_id", type: "hidden", cssClass: "field", options: {value: client_id}}
        ]
    };

    var mainFormOption = {
        fields: [
            {display: "模板名称", name: "name", newline: false, labelWidth: 100, width: 170, space: 30, type: "text", cssClass: "field",
                validate: {required: true}, attr: {maxlength: 50}},
            {display: "模板代码", name: "code", newline: false, labelWidth: 100, width: 170, space: 30, type: "text", cssClass: "field",
                attr: {maxlength: 50}, validate: {required: true, messages: {required: '模板代码不能为空。'}}},
            {display: '业务类型', name: 'type', newline: false, type: "select", labelWidth: 100, width: 170, space: 30,
                comboboxName: "type_c",
                options: {
                    data: data_bs_type_name,
                    cancelable: true,
                    textFieldID: 'text',
                    valueFieldID: 'value'
                },
                cssClass: "field",
                validate: {required: true}
            },
//            {display: '网页端可用', name: 'web', newline: false, cssClass: "field", type: "checkbox"},
//            {display: '移动端可用', name: 'app', newline: false, cssClass: "field", type: "checkbox"},
            {display: "备注", name: "remark", newline: false, labelWidth: 100, width: 470, space: 10, type: "text",
                attr: {maxlength: 200}},
            {name: "pk_id", type: "hidden"}
        ],
        validate: true,
        toJSON: JSON2.stringify
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
                        client_id: client_id
                    });

                    LG.singleAjax({
                        url: basePath + url,
                        data: JSON.stringify(data, DateUtil.dateReplacer),
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
            // {id: 'delete', text: '删除', click: delete, icon: 'delete', status: ['OP_INIT']},
            // {id: 'update', text: '编辑', click: backtrackFun, icon: 'edit', status: ['OP_INIT']},
            // {id: 'save', text: '保存', click: backtrackFun, icon: 'save', status: ['OP_INIT']},
            {id: 'backtrack', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };

</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>

<script type="text/javascript">
    defaultSearchFilter["and"].push({field: 'client_id', value: client_id, op: 'equal', type: 'string'});
    $(function () {
        //初始化编辑按钮
        $mainGrid.on('click', 'a[name=edit_data]', function (e) {
            var selected = mainGrid.getRow($(this).data("index")),
                    url = rootPath + "/tms/bas/template/loadCard/" + selected.pk_id + '?module=客户模板&function=卡片&client_id=' + selected.client_id;
                    p$ = parent.$;
            /*采用新建iframe的方式加载页面*/
            var $iframe = p$("#templateGrid"), $iframeSub = $iframe.siblings("#templateGridSub");
            if ($iframeSub.length <= 0) {
                $iframeSub = p$('<iframe id="templateGridSub"></iframe>').insertAfter($iframe);
            }
            $iframeSub.attr("src", url);
            $iframe.hide();
        });

        $mainGrid.on('click', 'a[name=edit]', function (e) {
            this
            inlineClineDialogEdit(this);

        });

        //监听子页面返回事件（在子页面点击返回时触发）
        $("body").on("backFromSubPage", function () {
            mainGrid.loadData();
        });

    });

    function quickQuery(type, obj) {
        $("a.qs-item.visited").removeClass("visited");
        $(obj).addClass("visited");
        if (defaultSearchFilter["and"].length > 1) {defaultSearchFilter["and"].pop();}
        if (type == 0) {}
        if (type == 1) {defaultSearchFilter["and"].push({field: 'state', value: 'STATE_11_USE', op: 'equal', type: 'string'});}
        if (type == 2) {defaultSearchFilter["and"].push({field: 'state', value: 'STATE_15_INVALID', op: 'equal', type: 'string'});}
        mainGrid.set('parms', [{name: 'where', value: getSearchGridData(mainGrid, '', defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    }


</script>
</html>