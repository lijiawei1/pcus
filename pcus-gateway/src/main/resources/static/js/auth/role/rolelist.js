/**
 * Created by Shin on 2016/4/13.
 */
var basePath = rootPath + '/role/';

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
                display: "角色编码", name: "ROLECODE", newline: false, labelWidth: 100, width: 150, space: 30, type: "text",
                cssClass: "field"
            },
            {
                display: "角色名称", name: "ROLENAME", newline: false, labelWidth: 100, width: 150, space: 30, type: "text",
                cssClass: "field"
            }
        ],
        validate: true,
        toJSON: JSON2.stringify
    });

    //主表
    var mainGrid = $("#mainGrid").ligerGrid({
        columns: [
            {display: '公司名称', name: 'corpname', width: '150', minWidth: 60, type: 'text'},
            {display: '角色名称', name: 'rolename', width: '150', minWidth: 60, type: 'text'},
            {display: '角色编码', name: 'rolecode', width: '150', minWidth: 60, type: 'text'}
        ],
        dataAction: 'server',
        pageSize: 50,
        width: '100%',
        height: '100%', //heightDiff: -5,
        checkbox: true, rownumbers: true,
        usePager: true, enabledEdit: false, clickToEdit: false,
        fixedCellHeight: true, rowHeight: 25, headerRowHeight: 28,
        url: basePath + 'loadGrid',
        toJSON: JSON2.stringify
    });

    LG.appendSearchAndRestBtn("#searchForm", mainGrid);


    //弹窗配置
    var fields = [
        {
            display: "模块", name: "parentMenuNo", type: "text", width: 150, newline: false,
            validate: {required: true}, type: 'select',
            editor: {
                cancelable: true,
                data: modules,
                autocomplete: true, keySupport: true, highLight: true
            }
        },
    ];
    var validate = {
        messages: {
        }
    };
    var options = {
        width: 600,
        title: '分配模块'
    };


    /**************************************************************按钮工具栏**************************************************/
    //工具栏,
    var topitems = {
        add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'], extstatus: [0, 1, 2, 3, 4, 5, 6]},
        update: {id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'], extstatus: [0]},
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'], extstatus: [0]},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']},
        grantModule: {id: 'grantModule', text: '分配模块', click: btnClick, icon: 'refresh', status: ['OP_INIT']}
    }

    //工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar();

    function btnClick(item) {
        var editingrow = mainGrid.getEditingRow();

        switch (item.id) {
            case "add":
                break;
            case "grantModule":
                //批量修改
                var rows = mainGrid.getCheckedRows();
                if (rows && rows.length > 0) {
                    //处理行列数据,弹窗
                    LG.openFormDialog("body", fields, validate, options, {},
                        $.proxy(grantModule, {rows: rows}), true);
                } else {
                    LG.showError('请选择数据');
                }
                break;
            case "":
                break;
            default:
                break;
        }
    }

    //弹窗，选择模块
    function grantModule(panel, form, isAdd) {
        //选中的数据
        var rows = this.rows;
        //批量更新的数据
        var data = form.getData();

        if (data) {
            //校验
            if (!form.valid()) {
                form.showInvalid();
                return;
            }

            //传输到后台的数据
            var transferData = {};
            transferData.parentMenuNo = data.parentMenuNo;
            transferData.roleList = [];

            $.each(rows, function (i, v) {
                transferData.roleList.push({
                    id: v.id
                });
            });

            //提交数据
            LG.ajax({
                loading: '分配模块中...',
                url: '/privilege/grantModule',
                contentType: 'application/json',
                data: JSON2.stringify(transferData),
                success: function (data, message) {
                    this.rows = null;
                    mainGrid.loadData();
                    panel.close();
                    LG.showSuccess(message);
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        }
    }

    var cm = new CardManager(toptoolbar, {}, topitems);
    cm.setCardStatus('OP_INIT');



});