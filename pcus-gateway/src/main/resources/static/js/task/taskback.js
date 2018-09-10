/**
 * 上下文路径
 */
var basePath = rootPath + '/task/taskBack/';

var filterRecord = function (record) {
    delete record.__id
    delete record.__previd
    delete record.__index
    delete record.__status
    delete record._editing
    delete record.creator_name
    delete record.modifier_name
    return record
}

$(function () {

    //上下文信息
    var ctx = new PageContext();

    //初始化界面
    $("#layout").ligerLayout({
        leftWidth: 200,
        height: '100%',
        space: 0
    });

    /**************************************************************主表**************************************************/
    //是否选择框
    var tfdata = [{value: true, text: '是'}, {value: false, text: '否'}];

    //主表
    var mainGrid = $("#mainGrid").ligerGrid({
        columns: [
            {display: '服务名称', name: 'name', isSort: false, width: '10%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            {
                display: '类型', name: 'type_id', width: '10%', minWidth: 60, validate: {required: true},
                editor: {
                    type: 'popup',
                    valueField: 'id', textField: 'job_name',
                    grid: {
                        url: '/taskType/loadPageTypes.do',
//						 parms: {fuckyou: 'dfudf'},
                        columns: [
                            {display: '插件名称', name: 'job_name', width: '30%', minWidth: 100},
                            {display: '插件类名', name: 'job_class_name', width: '60%', minWidth: 150},
                        ],
                        usePager: true, isScroll: false, checkbox: false,
                    }

                }
            },
            {display: '开始时间', name: 'start_time', width: '10%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            {display: '完成时间', name: 'end_time', width: '10%', minWidth: 60, validate: {required: true}, editor: {type: 'text'}},
            {display: '状态', name: 'status', width: '5%', minWidth: 60 },
            {display: '参数', name: 'param', width: '20%', minWidth: 60, editor: {type: 'text'}},
            {display: '说明', name: 'remark', width: '20%', minWidth: 60, validate: {required: true}, editor: {type: 'text'} },
            {display: '部署公司', name: 'corpname', width: '5%', minWidth: 60},
            {display: '部署人', name: 'creator_name', width: '5%', minWidth: 60}
        ],
        dataAction: 'server', pageSize: 50,
        sortName: 'start_time',
        width: '100%', height: '100%', autoStretch: true, heightDiff: -20,
        checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
        fixedCellHeight: true, rowHeight: 30,
        url: basePath + 'loadPageBack.do'
    });

    /**************************************************************按钮工具栏**************************************************/
    //工具栏,
    var topitems = {
        add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'], extstatus: [0, 1, 2, 3, 4, 5, 6]},
        update: {id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'], extstatus: [0]},
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'], extstatus: [0]},
        save: {id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT']},
        cancel: {id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'],},
        retrieve1: {id: 'retrieve1', text: '取值', click: btnClick, icon: 'value', status: ['OP_INIT', 'OP_EDIT']},
        start: {id: 'start', text: '启动', click: btnClick, icon: 'start', status: ['OP_INIT'], extstatus: [0]},
        stop: {id: 'stop', text: '停止', click: btnClick, icon: 'stop', status: ['OP_INIT'], extstatus: [1, 2, 3]}
    }

    //工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar();

    function btnClick(item) {

        var editingrow = mainGrid.getEditingRow();

        switch (item.id) {

            case "stop":
                var row = mainGrid.getSelectedRow();
                if (!row) {
                    LG.showError('请选择行');
                    return;
                }
                var data = $.extend(filterRecord(row), {})
                LG.ajax({
                    url: basePath + 'stop',
                    loading: '正在停止中...',
                    data: data,
                    success: function () {
                        LG.showSuccess('停止成功')
                        mainGrid.loadData()
                    },
                    error: function (message) {
                        LG.showError("停止失败:" + message);
                        mainGrid.loadData()
                    }
                });
                break;

            case "start":

                var row = mainGrid.getSelectedRow();
                if (!row) {
                    LG.showError('请选择行');
                    return;
                }
                var data = $.extend(filterRecord(row), {})
                LG.ajax({
                    url: basePath + 'start',
                    loading: '正在启动中...',
                    data: data,
                    success: function () {
                        LG.showSuccess('启动成功')
                        mainGrid.loadData()
                    },
                    error: function (message) {
                        LG.showError("启动失败:" + message);
                        mainGrid.loadData()
                    }
                });

                break;
            case "add":
                if (editingrow == null) {
                    mainGrid.addEditRow({});
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
            case "retrieve1":
                alert(JSON2.stringify(mainform.getData()))
                break;
            default:
                break;
        }
    }

    //刷新
    var refresh = function () {
        mainGrid.setParm('corp_id', $('#filterform').find('input[name="filtercorp"]').val());
        mainGrid.setParm('name', $('#filterform').find('input[name="filtername"]').val());
        mainGrid.setParm('status', $('#filterform').find('input[name="filterstatus"]').val());
        mainGrid.reload()
    };

    //删除
    var remove = function (selected) {
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {
            if (!confirm) return
            LG.ajax({
                url: basePath + 'remove',
                loading: '正在删除中...',
                data: {id: selected.id},
                success: function () {
                    LG.showSuccess('删除成功');
                    mainGrid.loadData()
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    };

    //编辑后事件,保存
    mainGrid.bind('afterSubmitEdit', function (e) {

        var isAddNew = e.record['__status'] == "add";

        var newdata = e.newdata

        var data = {}
        if (isAddNew) {
            //新增
            data = $.extend({creator_id: ctx.user_id}, newdata)
        } else {
            //编辑
            data = $.extend(filterRecord(e.record), newdata)
        }

        // console.log(JSON.stringify(data));

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
//			        会调用_initData，触发选择事件
//					initValue: ctx.corp_id,
//					initText: ctx.corpname,
                    tree: {
                        url: basePath + 'loadCorps',
                        idFieldName: 'id',
                        textFieldName: 'name',
                        parentIDFieldName: 'pid',
                        slide: false,
                        checkbox: false,
                        isExpand: true,
                        onSuccess: function (data) {
//							会触发5次onSelected事件
//							filterform.setData({
//			        			'filtercorp' : ctx.corp_id,
//			        			'filtercorpname' : ctx.corpname
//			        		})
                            //加载完毕设置公司为当前登录用户所在公司
                            //只触发1次onSelected事件，简直无情
                            filterform.getEditor("filtercorp")._changeValue(ctx.corp_id, ctx.corpname)
                        }
                    },
                    onSelected: function (newvalue) {
                        refresh()
                    }
                }
            },
            {
                display: "任务名称", name: "filtername", newline: false, type: "text", editor: {
                onBlur: function () {
                    refresh()
                }
            }
            },
            {
                display: "任务状态", name: "filterstatus", newline: false, type: "select",
                editor: {
                    cancelable: false,
                    initValue: '',
                    data: [],
                    onSelected: function (newValue) {

                    }
                }
            },
        ]
    })


    //按钮状态控制
    var cm = new CardManager(toptoolbar, {}, topitems)
    cm.setCardStatus('OP_INIT');

    //重设高度
    mainGrid._onResize();

})