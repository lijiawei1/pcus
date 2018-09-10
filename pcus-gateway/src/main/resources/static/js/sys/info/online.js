/**
 * Created by Shin on 2016/1/25.
 */
var basePath = rootPath + '/sys/online/'
$(function () {

    //主表
    var mainGrid = $("#mainGrid").ligerGrid({
        columns: [
            {display: 'SESSIONID', name: 'sessionid', isSort: false, width: '120'},
            {display: '最后访问时间', name: 'last_access_time', isSort: false, width: '150'},
            {display: '创建时间', name: 'creation_time', isSort: false, width: '150'},
            {display: '在线时间', name: 'online_time', isSort: false, width: '60'},
            {display: '非活动时间', name: 'inactive_time', isSort: false, width: '60'},
            {display: '有效时间', name: 'max_inactive_interval', isSort: false, width: '60'},
            {display: '登录账号', name: 'account', isSort: false, width: '5%', minWidth: 60},
            {display: '用户名', name: 'name', width: '5%', minWidth: 60},
            {display: '公司', name: 'corpname', width: '10%', minWidth: 60},
            {display: '登录IP', name: 'last_login_ip', width: '10%', minWidth: 60},
            {display: '登录时间', name: 'last_login_time', width: '150', minWidth: 60},
            {display: '启用时间', name: 'enabled_time', width: '150', minWidth: 60},
            {display: '过期时间', name: 'expired_time', width: '5%', minWidth: 60},
            {
                display: '是否管理员', name: 'admin', width: '5%', minWidth: 60,
                render: renderBool('admin')
            },
            {display: '手机号码', name: 'mobile', width: '120', minWidth: 60},
            {display: '邮箱地址', name: 'email', width: '150', minWidth: 60},
        ],
        dataAction: 'local',
        //pageSize: 50,
        sortName: 'account',
        width: '100%',
        height: '100%',
        heightDiff: -20,
        checkbox: true,
        //usePager: true,
        usePager: false,
        //enabledEdit: true,
        clickToEdit: false,
        fixedCellHeight: true,
        rownumbers: true,
        rowHeight: 30,
        url: basePath + 'loadActiveUsers'
    });

    //工具栏,
    var topitems = {
        // add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'], extstatus: [0, 1, 2, 3, 4, 5, 6]},
        // update: {id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'], extstatus: [0]},
        remove: {id: 'remove', text: '下线', click: btnClick, icon: 'delete', status: ['OP_INIT'], extstatus: [0]},
        // save: {id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT']},
        // cancel: {id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'],},
        // retrieve1: {id: 'retrieve1', text: '取值', click: btnClick, icon: 'value', status: ['OP_INIT', 'OP_EDIT'],}
    }

    //工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar();

    //添加按钮
    $.each(topitems, function (i, v) {
        toptoolbar.addItem(v);
    });

    function btnClick(item) {

        switch (item.id) {
            case "refresh":
                mainGrid.reload();
                break;
            case "remove":
                var rows = mainGrid.getCheckedRows();
                if (rows && rows.length > 0) {

                    var sessionids = $.map(rows, function(item) {
                        return item.sessionid;
                    });
                    LG.ajax({
                        loading: '删除用户SESSION中...',
                        url: basePath + 'invalidate',
                        data: JSON2.stringify(sessionids),
                        contentType: 'application/json',
                        success: function (data, msg) {
                            LG.showSuccess("删除成功")
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                } else {
                    LG.showError('请选择数据');
                }
                break;


            default:

        };
    }

    function renderBool(name) {
        return function (item) {
            return true == item[name] ? '是' : '否';
        }
    }

});
