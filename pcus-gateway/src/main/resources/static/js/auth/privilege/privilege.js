var basePath = rootPath + '/auth/privilege/';

//设置列表状态
var setGridStatus = function (grid, enable, filter) {

}

//设置左侧树状态
var setLeftStatus = function (enable) {
    $('.l-layout-left').css('z-index', enable ? 0 : -1)
    $('.l-layout-left').css('opacity', enable ? 1 : 0.4)
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
    return record
}

var out = function (value) {
    alert(JSON2.stringify(value))
}

var visibleData = [{visible: 'true', text: '显示'}, {visible: 'false', text: '隐藏'}];

var selectedRoleId

$(function () {

    //上下文信息
    var ctx = new PageContext()
    //初始化界面
    var layout=$("#layout").ligerLayout({
        minLeftWidth:200,
        leftWidth: 200,
        height: '100%',
        heightDiff: 0,
        space: 1
    });

    var navtab = $("#navtab").ligerTab({
        height: '100%',
        changeHeightOnResize: true,
        heightDiff: -130
    });

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

    //获取过滤条件，重新加载左侧用户数据
    function loadData() {
        var filterData = {
            corp_id: filterform.getEditor('filtercorp').getValue(),
            rolename: filterform.getEditor('filtername').getValue(),
        }

        var selected = mainTree.getSelected()
        var id = selected && selected.data && selected.data.id ? selected.data.id : null
        if (id) {
            cm.setData(id)
        }
        mainTree.clear()
        mainTree.loadData(null, basePath + 'loadRoles.do', filterData)
    }

    var menuGrid = $("#menuGrid").ligerGrid({
        columns: [
            {
                display: '可访问', name: 'accessible', align: 'left', width: '5%', minWidth: 60, isAllowHide: false,
                render: function (rowdata, rowindex, value, column) {
                    var iconHtml = '<div class="chk-icon';
                    if (value) iconHtml += " chk-icon-selected";
                    iconHtml += '"';
                    iconHtml += ' rowid = "' + rowdata['__id'] + '"';
                    iconHtml += ' gridid = "' + this.id + '"';
                    iconHtml += ' columnname = "' + column.name + '"';
                    iconHtml += '></div>';
                    return iconHtml;
                }
            },
            {
                display: '可授权', name: 'authorizable', align: 'left', width: '5%', minWidth: 60, isAllowHide: false,
                render: function (rowdata, rowindex, value, column) {
                    var iconHtml = '<div class="chk-icon';
                    if (value) iconHtml += " chk-icon-selected";
                    iconHtml += '"';
                    iconHtml += ' rowid = "' + rowdata['__id'] + '"';
                    iconHtml += ' gridid = "' + this.id + '"';
                    iconHtml += ' columnname = "' + column.name + '"';
                    iconHtml += '></div>';
                    return iconHtml;
                }
            },
            {
                display: '功能名称',
                name: 'name',
                align: 'center',
                width: '15%',
                minWidth: 200,
                validate: {required: true},
                editor: {type: 'text'},
                render: function (item) {
                    return '<div style="width:100%;height:100%;">'
                        + (!!item.icon ? '<img src="' + item.icon + '" />' : '') +
                        '<span style="position:absolute;">' + item.name + '</span></div>';
                }
            },
            {display: '功能编码', name: 'code', align: 'left', width: '15%', minWidth: 100},
            {display: '菜单序号', name: 'no', align: 'left', width: '10%', minWidth: 120},
            {
                display: '排序号',
                name: 'morder',
                align: 'center',
                width: '5%',
                minWidth: 60,
                validate: {required: true, digits: true},
                editor: {type: 'text'}
            },
            {
                display: '是否显示',
                name: 'visible',
                align: 'center',
                isSort: false,
                width: '5%',
                minWidth: 60,
                editor: {type: 'select', data: visibleData, valueColumnName: 'visible'},
                render: function (item) {
                    return item.visible ? "显示" : "隐藏"
                }
            },
            {
                display: '类型', name: 'mlevel', align: 'center', isSort: false, width: '5%', minWidth: 60,
                render: function (item) {
                    if (item.mlevel == 1) {
                        return '模块'
                    } else if (item.mlevel == 2) {
                        return '菜单'
                    } else if (item.mlevel == 3) {
                        return '按钮'
                    }
                }
            },
//		         { display: '请求地址', name: 'url', isSort: false, align: 'left', minWidth: 200, validate: { required: true }, editor: { type: 'text' }},
            {
                display: '权限地址',
                name: 'intercept_url',
                isSort: false,
                align: 'left',
                width: '35%',
                minWidth: 150,
                validate: {required: true},
                editor: {type: 'text'}
            },
        ],
        dataAction: 'server', pageSize: 10,
        //toolbar: {},
        sortName: 'no',
        width: '100%', height: '100%',autoStretch:true, heightDiff: -20,
        checkbox: false,
        usePager: false, enabledEdit: true, clickToEdit: false,
        fixedCellHeight: true, rowHeight: 30,
        tree: {columnName: 'name'},

        url: basePath + 'loadMenus',
        //delayLoad: true,		//初始化不加载数据

    })

    //获取所有选择项
    function getChecked() {
        var ids = "";
        var rows = menuGrid.rows;
        for (var i = 0, l = rows.length; i < l; i++) {
            if (rows[i].accessible) {
                ids += rows[i].id + ",";
            }
        }
        return ids;
    }

    function getCheckedItems() {
        var items = new Array();
        var rows = menuGrid.rows;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].accessible || rows[i].authorizable) {
                items.push({
                    subject_type: 'role',				//权限主体：角色
                    object_type: 'menu',			//权限客体：菜单
                    subject_id: selectedRoleId,
                    object_id: rows[i].id,
                    accessible: rows[i].accessible,
                    authorizable: rows[i].authorizable
                });
            }
        }
        return items;
    }


    //表字段配置信息 是否类型的模拟复选框的点击事件
    $("#menuGrid").on('click',".chk-icon", function () {
        var grid = $.ligerui.get($(this).attr("gridid"));
        var rowdata = grid.getRow($(this).attr("rowid"));
        var columnname = $(this).attr("columnname");
        var accessible = rowdata[columnname];
        permitChildren(rowdata, !accessible, columnname);
        permitParent(menuGrid.getParent(rowdata), !accessible, columnname)
    });

    //为当前选择记录 分配权限
    //给上级分配记录
    function permitParent(rowdata, selected, columnname) {
        if (!selected) return
        while (rowdata) {
            if (!rowdata[columnname]) {
                rowdata[columnname] = selected
                menuGrid.reRender(rowdata)
            }
            rowdata = menuGrid.getParent(rowdata)
        }
    }

    //同时给下级分配记录
    function permitChildren(rowdata, selected, columnname) {
        selected = (selected ? true : false)
        rowdata[columnname] = (rowdata[columnname] ? true : false)

        if (rowdata[columnname] == selected) return
        rowdata[columnname] = selected
        var children = menuGrid.getChildren(rowdata);
        if (children) {
            for (var i = 0, l = children.length; i < l; i++) {
                permitChildren(children[i], selected, columnname)
            }
        }
        menuGrid.reRender({rowdata: rowdata})
    }

    //判断是否选中
    // function checkPrivilege(rowdata, data){
    // 	if (!data || !data.length) return false
    // 	var hasPrivilege = rowdata.id != null && rowdata.id != 0
    // 	for (var i = 0, l = data.length; i < l; i++) {
    // 		if (hasPrivilege && data[i] == rowdata.id)
    // 			return true
    // 	}
    // 	return false
    // }
    //选择角色，为Grid加载checkbox选中信息
    function loadPrivilege(data) {
        var rows = menuGrid.rows;
        var hash = {};
        // if (!data || !data.length) return
        //缓存
        for (var i = 0; i < data.length; i++) {
            hash[data[i].object_id] = data[i]
        }
        // console.log('loadPrivilege',data,hash);
        for (var i = 0; i < rows.length; i++) {
            var privilege = hash[rows[i].id];
            if (rows[i].id) {
                if (privilege) {
                    //可分配
                    rows[i].accessible = privilege.accessible;
                    //可授权
                    rows[i].authorizable = privilege.authorizable;
                } else {
                    //可分配
                    rows[i].accessible = false;
                    //可授权
                    rows[i].authorizable = false;
                }

            }
        }
        menuGrid.reRender()
    }

    /**
     * 刷新缓存
     */
    function refresh() {
        LG.ajax({
            url: basePath + 'refresh',
            loading: '刷新缓存...',
            success: function () {
                LG.showSuccess("刷新缓存成功");
            },
            error: function (message) {
                LG.showError(message);
            }
        });

    }

    /**
     * 加载权限标记
     */
    function load() {
        menuGrid.setParm('pid', parentId);
        menuGrid.reload();
    }

    function remove(selected) {
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {
            if (!confirm) return

            if (!selected.no) {
                menuGrid.deleteRow(selected)
                return;
            }
            LG.ajax({
                url: basePath + 'remove',
                loading: '正在删除中...',
                data: {id: selected.id},
                success: function () {
                    LG.showSuccess('删除成功')

                    menuGrid.reload()
                },
                error: function (message) {
                    LG.showError(message)
                }
            });
        });
    }

    function btnClick(item) {
        var editingrow = menuGrid.getEditingRow()
        switch (item.id) {
            case "grant":
                //选中的项目
                // var selectedItems = getCheckedItems();
                var menuCheckedData = menuGrid.getData();
                //构造请求参数
                var params = {
                    //角色ID
                    id: selectedRoleId,
                }

                $.each(menuCheckedData, function (index, item) {
                    //角色ID
                    params['privileges[' + index + '].subject_id'] = selectedRoleId;
                    //功能模块ID
                    params['privileges[' + index + '].object_id'] = item.id;
                    params['privileges[' + index + '].accessible'] = item.accessible || false;
                    params['privileges[' + index + '].authorizable'] = item.authorizable || false;
                    params['privileges[' + index + '].object_type'] = 'menu';
                    params['privileges[' + index + '].subject_type'] = 'role';

                });

                LG.ajax({
                    loading: '正在授予角色权限中...',
                    url: basePath + 'grantPrivileges',
                    data: params,
                    success: function () {
                        LG.showSuccess('保存成功!');
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
                break;
            case "save":
                if (editingrow != null) {
                    menuGrid.endEdit(editingrow);
                }
                break;
            case "cancel":
                if (editingrow != null) {
                    menuGrid.cancelEdit(editingrow);
                    if (editingrow.__status == "add") {
                        menuGrid.remove(editingrow)
                    }
                }
                cm.setCardStatus('OP_INIT')
                break;
            case "refresh":
                refresh();
                break;
            case "load":
                loadData();
                break;
            case "retrieve":
                alert(parentId + '#' + parentNo + '#' + mlevel)
                break;
        }
    }

    //初始化角色树
    var mainTree = $("#mainTree").ligerTree({
        idFieldName: 'id',
        textFieldName: 'rolename',
        parentIDFieldName: 'pid',
        slide: false,
        checkbox: false,
        isExpand: true,
        nodeWidth: 150,
        onSelect: function onSelect(node) {
            selectedRoleId = node.data.id
            cm.setData(node.data.id)
            LG.ajax({
                loading: '检查数据中...',
                url: basePath + "loadPrivileges",
                data: {roleid: selectedRoleId},
                success: function (data, message) {
                    //保存当前选中数据的ID
                    cm.setData(node.data.id)

                    var title = '权限列表'
                    if (selectedRoleId) {
                        title = '当前选中角色[<font color="red">' + node.data.rolename + ']</font>'
                    }
                    $('#layout-center').parent().find('.l-layout-header').html(title)
                    //加载角色选中的权限
                    loadPrivilege(data)
                },
                error: function (message) {
                    LG.showError(message)
                }
            });
        },
        onSuccess: function (data) {
            var flag = false
            if (data && data.length > 0 && cm.getData()) {

                //加载角色树成功后选中上次的节点
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id && data[i].id == cm.getData()) {
                        flag = true
                        break
                    }
                }
                //选中节点
                if (flag) {
                    mainTree.selectNode(cm.getData())
                }
            }
            if (!flag) {
                var rows = menuGrid.rows
                for (var i = 0, l = rows.length; i < l; i++) {
                    rows[i].accessible = false
                }
                menuGrid.reRender()
            }
        }
    })

    //过滤框
    var filterform = $('#filterform').ligerForm({
        inputWidth: 150, labelWidth: 70, space: 10,
        fields: [
            {
                display: "公司", name: "filtercorp", textField: 'filtercorpname', newline: false, type: "select",
                editor: {
                    valueField: 'id',
                    textField: 'name',
                    treeLeafOnly: false,
                    width: 300,
                    selectBoxWidth: 300,
                    selectBoxHeight: 250,
                    cancelable: false,
                    tree: {
                        url: basePath + 'loadCorps',
                        idFieldName: 'id',
                        textFieldName: 'name',
                        parentIDFieldName: 'pid',
                        slide: false,
                        checkbox: false,
                        isExpand: true,
                        onSuccess: function (data) {
                            filterform.getEditor("filtercorp")._changeValue(ctx.corp_id, ctx.corpname, true)
                        }
                    },
                    onSelected: function (newvalue) {
                        loadData()
                    }
                }
            },
            {
                display: "角色", name: "filtername", newline: false, type: "text",
                editor: {
                    onBlur: function () {
                        loadData()
                    }
                }
            },
        ]
    })

    //工具栏,
    var topitems = {
        grant: {id: 'grant', text: '分配', click: btnClick, icon: 'distribution', status: ['OP_INIT']},
        load: {id: 'load', text: '加载', click: btnClick, icon: 'loading', status: ['OP_INIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']},
    }
    var toptoolbar = $("#toptoolbar").ligerToolBar();

    var cm = new CardManager(toptoolbar, uiStatus, topitems);
    cm.setCardStatus('OP_INIT');

    //高度自适应
    layout._onResize();
    menuGrid._onResize();
});