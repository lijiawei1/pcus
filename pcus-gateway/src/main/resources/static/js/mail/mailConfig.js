/**
 * Created by Shin on 2016/1/12.
 */
/**
 * 上下文路径
 */
var basePath = rootPath + '/mail/mailConfig/'

//空数据
var emptydata = {
    'id': '',
    'version': '0',
    'dept_id': '',
    corp_id: '',
    'creator_name': '',
    'modifier_name': '',
    'creator_id': '',
    'modifier_id': '',
    'create_time': '',
    'modify_time': '',
    'remark': '',
    'code': '',
    'server_type': '',
    'server_address': '',
    'server_port': '',
    'account': '',
    'password': '',
    'reply_address': true,
    'mail_code': 0,
    'mail_address': 0,
    'html': false,
    'ssl' : false

}

function out(value) {
}

$(function () {

    //上下文信息
    var ctx = new PageContext();

    //初始化界面
    $("#layout").ligerLayout({
        leftWidth: 200,
        height: '100%',
        space: 0,
    });

    /**************************************************************主表**************************************************/
    //是否选择框
    var tfdata = [{value: 0, text: '是'}, {value: 1, text: '否'}];

    //主表
    var mainGrid = $("#mainGrid").ligerGrid({
        columns: [
            {display: '描述说明', name: 'remark', width: '10%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            {display: '配置编码', name: 'code', width: '10%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            {display: '邮件地址', name: 'mail_address', width: '12%', minWidth: 100, validate: {required: true}, editor: {type: 'text'}},
            {display: '服务地址', name: 'server_address', width: '12%', minWidth: 100, validate: {required: true}, editor: {type: 'text'}},
            {display: '服务端口', name: 'server_port', width: '5%', minWidth: 100, validate: {required: true}, editor: {type: 'text'}},
            {display: '发送账号', name: 'account', width: '8%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            {
                display: '发送密码', name: 'password', width: '8%', minWidth: 80, validate: {required: true}, editor: {type: 'password'},
                render: function (item) {
                    return "******";
                }

            },
            {display: '服务类型', name: 'server_type', width: '5%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            //{display: '邮件编码', name: 'mail_code', width: '5%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            {display: '邮件回复地址', name: 'reply_address', width: '10%', minWidth: 80, validate: {required: true}, editor: {type: 'text'}},
            {
                display: 'HTML格式', name: 'html', align: 'center', isSort: false, width: '5%', minWidth: 40,
                editor: {
                    type: 'select',
                    data: [{value: 'true', text: '是'}, {value: 'false', text: '否'}],
                    valueColumnName: 'value',
                    displayColumnName: 'text'
                },
                render: function (item) {
                    return true === item.enable ? '是' : '否';
                }
            },
            {
                display: 'SSL加密', name: 'ssl', align: 'center', isSort: false, width: '5%', minWidth: 40,
                editor: {
                    type: 'select',
                    data: [{value: 'true', text: '是'}, {value: 'false', text: '否'}],
                    valueColumnName: 'value',
                    displayColumnName: 'text'
                },
                render: function (item) {
                    return true === item.remote ? '是' : '否';
                }
            }
        ],
        toJSON: JSON2.stringify,
        dataAction: 'server', pageSize: 10,
        //toolbar: {},
        // sortName: 'job_name',
        width: '100%', height: '100%', heightDiff: -15,
        autoStretch: true,
        checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
        fixedCellHeight: true, rowHeight: 25, headerRowHeight: 28,

        url: basePath + 'loadPageDetails.do',

        //单选显示所有按钮
        onSelectRow: function (data, rowid, rowobj) {
            // cm.updateExtStatus(data.status)
        }
    })

    /**************************************************************按钮工具栏**************************************************/
    //工具栏,
    var topitems = {
        add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'], extstatus: [0, 1, 2, 3, 4, 5, 6]},
        update: {id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'], extstatus: [0]},
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'], extstatus: [0]},
        save: {id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT']},
        cancel: {id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']}
    }

    //工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar()

    function btnClick(item) {

        var editingrow = mainGrid.getEditingRow();

        switch (item.id) {
            case "add":
                if (editingrow == null) {
                    mainGrid.addEditRow($.extend(emptydata, {
                        creator_name: ctx.name,
                        creator_id: ctx.user_id,
                    }));
                    cm.setCardStatus('OP_ADD')
                }
                break;
            case "update":
                if (editingrow == null) {
                    var row = mainGrid.getSelectedRow();
                    if (!row) {
                        LG.showError('请选择行');
                        return;
                    }
                    mainGrid.beginEdit(row);
                    cm.setCardStatus('OP_EDIT')
                }
                break;
            case "remove":
                var selected = mainGrid.getSelected();
                if (selected) {
                    remove(selected)
                }
                else {
                    LG.showError('请选择行!');
                }
                break;
            case "save":
                if (editingrow != null) {
                    mainGrid.endEdit(editingrow);
                }
                break;
            case "refresh":
                refresh()
                break;
            case "cancel":
                if (editingrow != null) {
                    mainGrid.cancelEdit(editingrow);
                    if (editingrow.__status == "add") {
                        mainGrid.remove(editingrow)
                    }
                }
                cm.setCardStatus('OP_INIT')
                break;
            default:
                break;
        }
    }


    //编辑前事件，校验
    mainGrid.bind('beforeSubmitEdit', function (e) {
        // if (!LG.validator.form()) {
        //     LG.showInvalid();
        //     return false;
        // }
        return true;
    });

    //编辑后事件,保存
    mainGrid.bind('afterSubmitEdit', function (e) {

        var isAddNew = e.record['__status'] == "add";

        var newdata = e.newdata

        var data = {}
        if (isAddNew) {
            //新增
            data = newdata;
        } else {
            //编辑
            data = $.extend(e.record, newdata)
        }

        LG.ajax({
            loading: '正在保存数据中...',
            url: basePath + (isAddNew ? "add" : "update") + ".do",
            data: data,
            success: function () {
//				LG.tip('保存成功!');
                LG.showSuccess("保存成功")
                cm.setCardStatus("OP_INIT")
                refresh()
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    });

    //刷新
    var refresh = function () {
        mainGrid.reload()
    }

    //删除
    var remove = function (selected) {
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {
            if (!confirm) return
            LG.ajax({
                url: basePath + 'remove',
                loading: '正在删除中...',
                data: {id: selected.id, version: selected.version},
                success: function () {
                    LG.showSuccess('删除成功')
                    mainGrid.loadData()
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    };

    //按钮状态控制
    var cm = new CardManager(toptoolbar, {}, topitems);
    cm.setCardStatus('OP_INIT');

})