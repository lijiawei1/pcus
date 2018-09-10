/**
 * Created by Shin on 2016/4/13.
 */
var basePath = rootPath + '/auth/user/';

var emptydata = {};

$(function () {

    var COMMON = {
        renderBool: function (name) {
            return function (item) {
                return true == item[name] ? '是' : '否';
            }
        }
    };

    var searchForm = $("#searchForm").ligerForm({
        fields: [
            {
                display: "公司名称", name: "OC1.NAME", newline: false, labelWidth: 100, width: 150, space: 30, type: "text",
                cssClass: "field"
            },
            {
                display: "用户账号", name: "ACCOUNT", newline: false, labelWidth: 100, width: 150, space: 30, type: "text",
                cssClass: "field"
            },
            {
                display: "用户名称", name: "NAME", newline: false, labelWidth: 100, width: 150, space: 30, type: "text",
                cssClass: "field"
            },
            {
                display: "启用", name: "ENABLED", newline: false, labelWidth: 100, width: 150, space: 30, type: "checkbox",
                cssClass: "field"
            }
            // {display: "公司名称", name: "CORPNAME", newline: false, labelWidth: 100, width: 150, space: 30, type: "text"},
            // {display: "航次", name: "VOYAGE_NO", newline: false, labelWidth: 100, width: 150, space: 30, type: "text"},
            // {
            //     display: "船公司",
            //     name: "CNTR_OPER_SCODE",
            //     newline: true,
            //     labelWidth: 100,
            //     width: 150,
            //     space: 30,
            //     type: "select",
            //     comboboxName: "CNTR_OPER_SCODE_C",
            //     options: {
            //         cancelable: false
            //     }
            // },
            // {display: "车牌号", name: "TRUCK_NO", newline: false, labelWidth: 100, width: 150, space: 30, type: "text"},
            // {display: "运单号", name: "BILL_NO", newline: false, labelWidth: 100, width: 150, space: 30, type: "text"}

        ],
        validate: true,
        toJSON: JSON2.stringify
    });


    //主表
    var mainGrid = $("#mainGrid").ligerGrid({
        columns: [
            {display: '账号', name: 'account', width: '10%', minWidth: 60, type: 'text'},
            {display: '邮箱', name: 'email', width: '200', minWidth: 60, type: 'text'},
            {display: '手机', name: 'mobile', width: '120', minWidth: 60, type: 'text'},
            {display: '名称', name: 'name', width: '100', minWidth: 60, type: 'text'},
            {display: '公司', name: 'corpname', width: '10%', minWidth: 60, type: 'text'},
            {display: '部门', name: 'deptname', width: '10%', minWidth: 60, type: 'text'},
            {display: '角色列表', name: 'roleText', width: '10%', minWidth: 200, type: 'text'},
            {display: '启用', name: 'enable', width: '60', minWidth: 60, type: 'text',
                render: COMMON.renderBool('enabled')},
            {display: '最后登录IP', name: 'last_login_ip', width: '110', minWidth: 60, type: 'text'},
            {display: '最后登录时间', name: 'last_login_time', width: '150', minWidth: 60, type: 'text'},
            {display: '生效时间', name: 'enabled_time', width: '120', minWidth: 60, type: 'text'},
            {display: '失效时间', name: 'expired_time', width: '120', minWidth: 60, type: 'text'},
            {
                display: '管理员', name: 'admin', width: '60', minWidth: 60, type: 'text',
                render: COMMON.renderBool('is_account_non_expired')
            },
            {
                display: '手机登录', name: 'mobile_enabled', width: '60', minWidth: 60, type: 'text',
                render: COMMON.renderBool('is_account_non_expired')
            },
            {
                display: '邮箱登录', name: 'email_enabled', width: '60', minWidth: 60, type: 'text',
                render: COMMON.renderBool('is_account_non_expired')
            },
            {
                display: '用户类型', name: 'ext_type', width: '100', minWidth: 60, type: 'text'},
            {
                display: '账号未过期', name: 'is_account_non_expired', width: '80', minWidth: 60, type: 'text',
                render: COMMON.renderBool('is_account_non_expired')
            },
            {
                display: '账号未锁定', name: 'is_account_non_locked', width: '80', minWidth: 60, type: 'text',
                render: COMMON.renderBool('is_account_non_locked')
            },
            {
                display: '证书未过期', name: 'is_credentials_non_expired', width: '80', minWidth: 60, type: 'text',
                render: COMMON.renderBool('is_credentials_non_expired')
            }
        ],
        dataAction: 'server',
        pageSize: 50,
        width: '100%',
        height: '100%', //heightDiff: -5,
        checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
        fixedCellHeight: true, rowHeight: 25, headerRowHeight: 28,
        url: basePath + 'loadPageUsers',
        toJSON: JSON2.stringify
    });


    LG.appendSearchAndRestBtn("#searchForm", mainGrid);

    /**************************************************************按钮工具栏**************************************************/
    //工具栏,
    var topitems = {
        add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'], extstatus: [0, 1, 2, 3, 4, 5, 6]},
        update: {id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'], extstatus: [0]},
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'], extstatus: [0]},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']}
    }

    //工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar();

    function btnClick(item) {
        var editingrow = mainGrid.getEditingRow();

        switch (item.id) {
            case "add":
                break;
            case "":
                break;
            case "":
                break;
            default:
                break;
        }
    }

    var cm = new CardManager(toptoolbar, {}, topitems);
    cm.setCardStatus('OP_INIT');


});