var SELECTED = 'selected';

//上下文路径
var basePath = rootPath + '/tms/bas/log/';

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


var SELECTED = 'selected',
    ID_FIELD = "pk_id",
    GRID_HEIGHT_DIFF = 20,
    FILTER_HEIGHT = 65,
    TOOLBAR_HEIGHT = 20;

//默认增删改查刷新
var defaultAction = function (item) {
    switch (item.id) {
        case "refresh":
            mainGrid.reload();
            break;
    }
};
var where = JSON2.stringify({
    op: 'and',
    rules: [{field: 'bill_id', value: bill_id, op: 'equal'}]
});
//初始化表格选项
var gridOption = {
    columns: [
        {
            display: '操作时间', name: 'create_time', align: 'left', minWidth: 130, width: '10%'
        },
        {
            display: '公司', name: 'corpname', align: 'left', minWidth: 150, width: '10%'
        },
        {
            display: '用户', name: 'username', align: 'left', minWidth: 50, width: '10%'
        },
        // {
        //     display: '部门', name: 'deptname', align: 'left', minWidth: 50, width: '10%'
        // },
        {
            display: '操作描述', name: 'operation', align: 'left', minWidth: 150, width: '10%'
        },
        // {
        //     display: '模块', name: 'module', align: 'left', minWidth: 150, width: '10%'
        // },
        // {
        //     display: '菜单', name: 'module', align: 'left', minWidth: 150, width: '10%'
        // },
        // {
        //     display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '35%'
        // }

    ],
    pageSize: 50,
    url: basePath + 'loadGrid',
    delayLoad: false,		//初始化不加载数据
    width: '100%',
    height: '100%',
    autoStretch: true,
    dataAction: 'server',
    checkbox: false,
    usePager: true,
    enabledEdit: false,
    clickToEdit: false,
    fixedCellHeight: true,
    heightDiff: -10,
    rowHeight: 30,
    headerRowHeight: 28,
       // rowSelectable: true,
       // selectable: true,
       // frozen: true,
       // rownumbers: true,
       // selectRowButtonOnly: true,
    sortName: 'CREATE_TIME',
    sortOrder: 'DESC',
    parms: [{name: 'where', value: where}],
    pageSizeOptions:[30,50,100,500,1000],
    pageSize:50
};

var filterFormOption = {
    fields: [
        {
            display: "公司",
            name: "corpname",
            newline: false,
            labelWidth: 80,
            width: 170,
            space: 30,
            type: "text",
            cssClass: "field"
        },
        {
            display: "用户",
            name: "username",
            newline: false,
            labelWidth: 80,
            width: 170,
            space: 30,
            type: "text",
            cssClass: "field"
        }
    ]
};

var mainFormOption = {
    fields: []
};

//扩展按钮
var toolbarOption = {
    items: [
        {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        // {id: 'delete', ignore: true},
        // {id: 'add', ignore: true}
    ]
};
var btnClick = function (item) {
};

LG.powerToolBar($('#toolbar'), toolbarOption);
