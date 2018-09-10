//设置左侧树状态
var setLeftStatus = function (enable) {
    $('.l-layout-left').css('z-index', enable ? 0 : -1)
    $('.l-layout-left').css('opacity', enable ? 1 : 0.4)
};
var out = function (value) {
    alert(JSON2.stringify(value))
};
var selectedRoleId;
$(function () {
    var basePath = rootPath + '/auth/dictAccess/';
    var $layout = $("#layout"),
        $mainTree = $("#mainTree"),
        $toptoolbar = $("#toptoolbar");
         $mainGrid = $("#mainGrid");

    var layout,mainTree,mainGrid,toptoolbar,cardManagg,
        layoutOption,mainTreeOption,mainGridOption,cardManagOption;

    cardManagOption = {
        grant: {id: 'grant', text: '分配', click: btnClick, icon: 'distribution', status: ['OP_INIT']},
        // load: {id: 'load', text: '加载', click: btnClick, icon: 'loading', status: ['OP_INIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']}
    };

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
    };

    toptoolbar = $toptoolbar.ligerToolBar();
    cardManagg = new CardManager(toptoolbar, uiStatus, cardManagOption);
    cardManagg.setCardStatus('OP_INIT');

    layoutOption = {
        minLeftWidth:200,
        leftWidth: 200,
        height: '100%',
        heightDiff: 0,
        space: 1
    };

    layout = $layout.ligerLayout(layoutOption);

    mainGridOption = {
        columns: [
            {
                display: '访问权限',
                name: 'accessible',
                align: 'left',
                width: '4%',
                minWidth: 60,
                isAllowHide: false,
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
            },{
                display: '授权权限',
                name: 'authorizable',
                align: 'left',
                width: '4%',
                minWidth: 60,
                isAllowHide: false,
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
            },{
                display: '功能名称',
                name: 'dict_name',
                align: 'right',
                width: 160,
                validate: {required: true}
            },{
                display: '增加类型',
                name: 'add',
                align: 'right',
                width: '5%',
                minWidth: 40,
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
            },{
                display: '修改类型',
                name: 'edit',
                align: 'right',
                width: '5%',
                minWidth: 40,
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
            },{
                display: '删除类型',
                name: 'remove',
                align: 'right',
                width: '5%',
                minWidth: 40,
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
            },{
                display: '增加字典',
                name: 'addmx',
                align: 'right',
                width: '5%',
                minWidth: 40,
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
            },{
                display: '修改字典',
                name: 'editmx',
                align: 'right',
                width: '5%',
                minWidth: 40,
                // editor: {type: 'checkbox'},
                // render: function(row,index,value){
                //     return row.remove == true ? '已授权': '未授权';
                // }
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
            },{
                display: '删除字典',
                name: 'removemx',
                align: 'right',
                width: '5%',
                minWidth: 40,
                // editor: {type: 'checkbox'},
                // render: function(row,index,value){
                //     return row.remove == true ? '已授权': '未授权';
                // }
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
            }
        ],
        dataAction: 'server',
        sortName: 'no',
        width: '100%',
        autoStretch:true,
        heightDiff: -35,
        checkbox: false,
        usePager: false,
        fixedCellHeight: true,
        rowHeight: 30,
        title : '菜单按钮',
        enabledEdit : true,
        clickToEdit : true,
        editorTopDiff : -26,
        url: basePath + 'loadGrid'
    };

    mainGrid = $mainGrid.ligerGrid(mainGridOption);


    mainTreeOption = {
        idFieldName: 'id',
        textFieldName: 'rolename',
        parentIDFieldName: 'pid',
        slide: false,
        checkbox: false,
        isExpand: true,
        nodeWidth: 150,
        onSelect: function onSelect(node) {
            selectedRoleId = node.data.id;
            cardManagg.setData(node.data.id);
            // console.log('tree.onSelect',selectedRoleId,node);

            $.ajax({
                loading: '检查数据中...',
                url: basePath + "loadPrivileges",
                data: {roleid: selectedRoleId},
                success: function (data, message) {
                    //保存当前选中数据的ID
                    cardManagg.setData(node.data.id);
                    var title = selectedRoleId ? '当前选中角色[<font color="red">' + node.data.rolename + ']</font>' :  '权限列表';
                    mainGrid.setTitle(title);
                    //加载角色选中的权限
                    // console.log(data,message);
                    loadPrivilege(JSON2.parse(data).Rows);
                },
                error: function (message) {
                    LG.showError(message)
                }
            });
        },
        onSuccess: function (data) {
            var flag = false;
            if (data && data.length > 0 && cardManagg.getData()) {
                //加载角色树成功后选中上次的节点
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id && data[i].id == cardManagg.getData()) {
                        flag = true;
                        break
                    }
                }
                //选中节点
                if (flag) {
                    mainTree.selectNode(cardManagg.getData())
                }
            }
            if (!flag) {
                var rows = mainGrid.rows;
                for (var i = 0, l = rows.length; i < l; i++) {
                    rows[i].accessible = false
                }
                mainGrid.reRender()
            }
        }
    };

    mainTree = $mainTree.ligerTree(mainTreeOption);
    loadData();

    //表字段配置信息 是否类型的模拟复选框的点击事件
    $mainGrid.on('click',".chk-icon", function (e) {
        var $this = $(this);
        var grid = $.ligerui.get($this.attr("gridid")),
             rowdata = grid.getRow($this.attr("rowid")),
             columnname = $this.attr("columnname"),
             accessible = rowdata[columnname];

        if(columnname == 'removemx' || columnname == 'addmx' || columnname == 'editmx' || columnname == 'remove' || columnname == 'add' || columnname == 'edit'){
            rowdata[columnname] = !rowdata[columnname]
        }else if( columnname == 'accessible' ||  columnname == 'authorizable'){
            var accessible = rowdata[columnname];
            accessible = (accessible ? false : true);
            rowdata[columnname] = (rowdata[columnname] ? true : false);

            if (rowdata[columnname] == accessible) return;
            rowdata[columnname] = accessible;
        }

        mainGrid.reRender({rowdata: rowdata});
    });

    function loadData(){
        var selected = mainTree.getSelected();
        var id = selected && selected.data && selected.data.id ? selected.data.id : null
        if (id) {
            cardManagg.setData(id)
        }
        mainTree.clear();
        mainTree.loadData(null, basePath + 'loadRoles', {});
        // mainGrid.reload();
    }

    function loadPrivilege(data) {
        var rows = mainGrid.rows,
            hash = {};
        // if (!data || !data.length) return
        //缓存
        for (var i = 0; i < data.length; i++) {
            hash[data[i].object_id] = data[i]
        }
        rows.forEach(function(rowData,rowIndex){
            var privilege = hash[rowData.id] || {};
            if (rowData.id) {
                if (privilege) {
                    //可分配
                    rowData.accessible = privilege.accessible;
                    //可授权
                    rowData.authorizable = privilege.authorizable;
                } else {
                    //可分配
                    rowData.accessible = false;
                    //可授权
                    rowData.authorizable = false;
                }
                if(privilege.remark && privilege.remark.length){
                    var len = privilege.remark.split(',');
                    len.forEach(function(lenData,lenIndex){
                        var lenDatas = lenData.split(':');
                        rowData[lenDatas[0]] = lenDatas[1] == 'true' ? true : false;
                    });
                }else{
                    rowData.add = false;
                    rowData.edit = false;
                    rowData.remove = false;
                    rowData.addmx = false;
                    rowData.editmx = false;
                    rowData.removemx = false;
                }
            }
        });
        mainGrid.reRender();
    }

    function btnClick(item){
        var editingrow = mainGrid.getEditingRow();
        // console.log('btnClick',item,editingrow);
        switch (item.id) {
            case 'grant' :
                if(!selectedRoleId){
                    LG.tip('未选择角色!');
                    return;
                }
                var menuCheckedData = mainGrid.getData();
                var params = {
                    //角色ID
                    id: selectedRoleId,
                    privileges : []
                };

                menuCheckedData.forEach(function (row, index) {
                    var a = {
                        add: row.add || false,
                        addmx: row.addmx || false,
                        edit: row.edit || false,
                        editmx: row.editmx || false,
                        editmx: row.editmx || false,
                        remove: row.remove || false,
                        removemx: row.removemx || false,
                    };
                    var remark = $.map(Object.keys(a), function (key) {
                        return key + ':' + a[key]
                    }).join(',');

                    params.privileges.push({
                        subject_id: selectedRoleId,
                        object_id: row.id,
                        accessible: row.accessible || false,
                        authorizable: row.authorizable || false,
                        object_type: 'dict',
                        subject_type: 'role',
                        remark: remark
                    });
                });

                // console.log(params);
                LG.ajax({
                    loading: '正在授予角色权限中...',
                    url: basePath + 'grantPrivileges',
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function () {
                        // loadData();
                        LG.showSuccess('保存成功!');
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
                break;
            case "save":
                break;
            case "refresh":
                loadData();
                break;
            case "load" :
                loadData();
                break;
        }
    }
});