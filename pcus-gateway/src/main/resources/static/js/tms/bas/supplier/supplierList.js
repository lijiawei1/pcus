/**
 * Created by wujian on 2017/3/10.
 */


var SELECTED = 'selected',
    ID_FIELD = "pk_id";

//默认增删改查刷新
var defaultAction = function (item) {
    var l_create_psn,l_create_time,l_modify_psn,l_modify_time;
    switch (item.id) {
        case "add":
            //打开对话框
            openDialog(emptyData);
            $mainForm.data(SELECTED, null);
            var username = parent.username;
            if (!username) {
                username = parent.parent.username;
            }

            l_create_psn = liger.get("create_psn");
            l_create_psn && l_create_psn.setValue(username);

            l_create_time = liger.get("create_time");
            l_create_time && l_create_time.setValue(DateUtil.dateToStr());

            if(typeof defaultAction_add === "function" ) defaultAction_add();
            break;
        case "edit":
            var selected = mainGrid.getSelected();
            if (!selected) {
                LG.showError('请选择行');
                return;
            }
            //打开对话框
            openDialog(emptyData);
            mainForm.setData(selected);
            $mainForm.data(SELECTED, selected);
            var username = parent.username;
            if (!username) {
                parent.parent.username;
            }

            l_modify_psn = liger.get("modify_psn");
            l_modify_psn && l_modify_psn.setValue(username);

            l_modify_time = liger.get("modify_time");
            l_modify_time && l_modify_time.setValue(DateUtil.dateToStr());
            break;
        case "delete":
            var selected = mainGrid.getCheckedRows();
            if( (selected == null) || (selected == '') || (selected == 'undefined') )
            {
                LG.showError('请选择行');
                return;
            };

            //适配不同的主表
            $.ligerDialog.confirm('确定删除吗?', function (confirm) {

                if (!confirm) return;

                //待删除主键列表
                var ids = $.map(selected, function (item, index) {
                    return item[ID_FIELD];
                }).join(',');
                var data = {ids: ids};

                if (typeof mainId != "undefined") {
                    data = $.extend(data, {
                        mainId: mainId
                    })
                }
                $.ajax({
                    url: basePath + 'remove',
                    data: data,
                    success: function (data, msg) {
                        if(JSON2.parse(data).error){
                            LG.showError(JSON2.parse(data).message);
                        }else{
                            LG.showSuccess('删除成功');
                        }
                        //刷新角色列表
                        mainGrid.reload();
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
            });
            break;
        case "refresh":
            mainGrid.reload();
            break;
        default:
            //扩展按钮动作
            if (btnClick) {
                btnClick(item);
            }

            break;
    }
};

//默认动作
var defaultActionOption = {
    items: [
        {id: 'add', text: '增加', click: defaultAction, icon: 'add', status: ['OP_INIT']},
        //{id: 'edit', text: '修改', click: defaultAction, icon: 'edit', status: ['OP_INIT']},
        {id: 'delete', text: '删除', click: defaultAction, icon: 'delete', status: ['OP_INIT']},
        {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']},
        {id: 'excelTmpl', text: '下载模板', click: excelTmpl, icon: 'download', status: ['OP_INIT']},
        {id: 'driverImport', text: '导入司机', click: driverImport, icon: 'download', status: ['OP_INIT']},
        {id: 'carImport', text: '导入车辆', click: carImport, icon: 'download', status: ['OP_INIT']}
    ]
};

//初始化工具栏
toptoolbar = LG.powerToolBar($("#toptoolbar"), defaultActionOption);

//初始化查询框
filterForm = $filterForm.ligerSearchForm(filterFormOption);

//初始化主表
mainForm = $mainForm.ligerForm(mainFormOption);

//初始化表格
mainGrid = $mainGrid.ligerGrid(gridOption);

var defaultSearchFilter = {
    and:[],
    or:[]
};

//打开对话框
function openDialog(data) {
    //消除校验格式
    LG.clearValid($mainForm);

    //设置时间格式有问题
    mainForm.setData(data);

    $.ligerDialog.open(dialogOption);
}


function inlineClineDialogEdit(obj) {
    var index = $(obj).data("index");
    var selected = mainGrid.getRow(index);
    var l_modify_psn,l_modify_time;

    openDialog(emptyData);
    mainForm.setData(selected);
    $mainForm.data(SELECTED, selected);

    l_modify_time = liger.get("modify_time");

    if (l_modify_time != null && l_modify_time.getValue() != null) {
        var username = parent.username;
        if (!username) {
            username = parent.parent.username;
        }
        l_modify_psn = liger.get("modify_psn");
        l_modify_psn && l_modify_psn.setValue(username);
        l_modify_time.setValue(DateUtil.dateToStr());
    }
}

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

    mainGrid.set('parms', [{name: 'where', value: mainGrid.getSearchGridData(true,value,defaultSearchFilter)}]);
    mainGrid.changePage('first');
    mainGrid.loadData();
});

//历史表单搜索
$("body").on("keypress",function (e) {
    var $advancedSearchWrap = $("#advanced-search-wrap");
    //在高级搜索关闭时
    if(e.keyCode == 13 && (!$advancedSearchWrap.length || $advancedSearchWrap.is(":hidden"))){
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

function getSearchGridData(grid, value, defaultSearch) {
    return  grid.getSearchGridData(true,value,defaultSearch);
}