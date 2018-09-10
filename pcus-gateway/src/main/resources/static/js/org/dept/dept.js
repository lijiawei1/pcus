var basePath = rootPath + '/org/dept/';

//设置列表状态
var setGridStatus = function (grid, enable, filter) {

}

var ctx = new PageContext();

function addMask(target){
    var mask = $('<div class="customMask" style="display: none; height: 100%;background: #e1e1e1; font-size: 1px; left: 0; opacity: 0.5; overflow: hidden; position: absolute;top :0px; width: 100%; z-index: 9000;"></div>');
    target.append(mask);
}

//设置左侧树状态
var setLeftStatus = function (enable) {
    if (enable){;
        $(".customMask").hide();
    }
    else{
        $(".customMask").show();
    }
}

var setTopStatus = function (grid, enable) {

}

var getGdata = function (grid) {

}

var filterRecord = function (record) {
    delete record.__id
    delete record.__previd
    delete record.__index
    delete record.__status
    delete record._editing
    delete record.children
    delete record.creator_name
    delete record.modifier_name
    delete record.ischecked
    return record
}

//当前选中的父菜单编码
var corp_id;

var visibleData = [{visible: 'true', text: '显示'}, {visible: 'false', text: '隐藏'}];

//初始化数据
var initMenuData = {
    pid: "", dictmx_name: "", dictmx_code: "", morder: "", mst_id: ""
}

var newdata = {version: 0, creator_id: ctx.user_id};

$(function () {

    //初始化界面
    var layout=$("#layout").ligerLayout({
        minLeftWidth:200,
        leftWidth: 200,
        height: '100%',
        space: 1
        /* centerBottomHeight: 200,
         bottomHeight : 180,
         allowLeftCollapse : false,
         allowRightCollapse : false,
         allowTopResize : false,
         allowBottomResize : false*/
    });

    addMask($(".l-layout-left"));

    //界面状态改变触发
    var uiStatus = {
        'OP_INIT': function () {
            setLeftStatus(true)
        },
        'OP_EDIT': function () {
            setLeftStatus(false)
        },
        'OP_ADD': function () {
            setLeftStatus(false)
        }
    }

    //工具栏,
    var topitems = {
        add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT']},
        edit: {id: 'edit', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT']},
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT']},
        save: {id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT']},
        cancel: {id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT']},
    }

    function btnClick(item) {

        var editingrow = grid.getEditingRow();

        switch (item.id) {

            case "add":
                var selectedNode = tree.getSelected();
                if (!selectedNode) {
                    LG.showError("请选择公司!")
                    return;
                }
                //initMenuData.mst_id = selectedNode.data.id;
                grid.addEditRow();
                cm.setCardStatus('OP_ADD');
                break;
            case "edit":
                if (editingrow == null) {
                    var row = grid.getSelectedRow();
                    if (!row) {
                        LG.showError('请选择行');
                        return;
                    }

                    grid.columns[2].editor.grid.parms = {corp_id: corp_id, id: row.id};
                    grid.beginEdit(row);
                    cm.setCardStatus('OP_EDIT')
                }
                break;
            case "remove":
                var selected = grid.getSelected();
                if (selected) {
                    //查看是否有子节点
                    LG.ajax({
                        loading: '检查数据中...',
                        url: basePath + "beforeRemove",
                        data: {
                            pid: selected.id
                        },
                        success: function (data, message) {
                            $.ligerDialog.confirm('确定删除吗?', function (confirm) {
                                if (!confirm) return

                                LG.ajax({
                                    url: basePath + 'remove',
                                    loading: '正在删除中...',
                                    data: {id: selected.id},
                                    success: function () {
                                        LG.showSuccess('删除成功')
                                        grid.reload();
                                    },
                                    error: function (message) {
                                        LG.showError(message);
                                    }
                                });
                            });
                        },
                        error: function (message) {
                            LG.showError('存在子菜单，请清空后删除');
                        }
                    })
                }
                else {
                    LG.showError('请选择行!');
                }
                break;
            case "save":
                if (editingrow != null) {
                    grid.endEdit(editingrow);
                }
                break;
            case "cancel":
                if (editingrow != null) {
                    grid.cancelEdit(editingrow);
                    if (editingrow.__status == "add") {
                        grid.remove(editingrow)
                    }
                }
                cm.setCardStatus('OP_INIT')
                break;
        }
    };

    var toptoolbar = $("#toptoolbar").ligerToolBar();

    var cm = new CardManager(toptoolbar, uiStatus, topitems)
    cm.setCardStatus('OP_INIT')

    //左侧树结构
    var tree = $("#maintree").ligerTree({
        url: '/org/corp/loadCorps.do',
        idFieldName: 'id',
        textFieldName: 'name',
        parentIDFieldName: 'pid',
        slide: false,
        checkbox: false,
        isExpand: true,
        onSelect: function (node) {
            //点击左侧树事件..
            if (!node.data || !node.data.id)
                return;
            corp_id = node.data.id;
            grid.setParm('corp_id', corp_id);
            grid.columns[2].editor.grid.parms = {corp_id: corp_id};
            grid.reload()
        },
        onSuccess: function (data) {
            if (corp_id)
                mainTree.selectNode(corp_id)
        }
    });


    var grid = $("#maingrid").ligerGrid({
        columns: [
            {display: '编码', name: 'code', id: 'code', width: '15%', minWidth: 100, align: 'left', type: 'text', editor: {type: 'text'}},
            {display: '名称', name: 'name', id: 'name', width: '35%', minWidth: 200, type: 'text', editor: {type: 'text'}},
            {
                display: '上级部门', name: 'pid', align: 'center', width: '35%', minWidth: 200, textField: 'pname',
                editor: {
                    type: 'popup',
                    valueField: 'id', textField: 'name',
                    grid: {
                        columns: [
                            {display: '编码', name: 'code', width: 250},
                            {display: '名称', name: 'name', width: 150}
                        ],
                        usePager: false, headerRowHeight: 28, rowHeight: 22, checkbox: false,
                        url: basePath + 'loadDeptGrid'
                    }
                }
            },

            {display: '排序号', name: 'morder', align: 'center', width: '15%', minWidth: 100, editor: {type: 'number'}}
        ],
        headerRowHeight: 28,
        width: '100%',
        height: '100%',
        autoStretch: true,
        heightDiff: -15,
        rowHeight: 30,
        editorTopDiff: 3,
        pageSize: 50,
        usePager: false,
        sortName: 'morder',
        checkbox: false,
        enabledSort: false,
        dataAction: 'server',
        url: basePath + 'loadDeptGrid',
        delayLoad: true,
        enabledEdit: true,
        clickToEdit: false,
        tree: {
            columnId: 'code',
            //columnName: 'name',
            idField: 'id',
            parentIDField: 'pid'
        }
    });

    grid.bind('afterSubmitEdit', function (e) {
        var isAddNew = e.record['__status'] == "add";
        var data = {}
        if (isAddNew) {

            //新增
            data = $.extend({corp_id: corp_id}, e.newdata, newdata);
        } else {
            //新增
            data = $.extend(filterRecord(e.record), e.newdata);
        }
        LG.ajax({
            loading: '正在保存数据中...',
            url: basePath + (isAddNew ? "add" : "update"),
            data: data,
            success: function () {
                LG.showSuccess("保存成功");
                cm.setCardStatus("OP_INIT");
                refresh();
            },
            error: function (message) {
                LG.showError(message);
            }
        });

    });

    var refresh = function () {
        grid.setParm('corp_id', corp_id);
        grid.reload();
    };
    //高度自适应
    grid._onResize();
});