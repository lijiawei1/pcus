/**
 * 上下文路径
 */
var basePath = rootPath + '/task/taskLog/';

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
    //主表
    var mainGrid = $("#mainGrid").ligerGrid({
        columns: [
            {display: '任务名称', name: 'task_name', isSort: false, width: '10%', minWidth: 60},
            {display: '开始时间', name: 'start_time', width: '15%', minWidth: 60},
            {display: '完成时间', name: 'end_time', width: '15%', minWidth: 60},
            {display: '结果', name: 'status', width: '5%', minWidth: 60},
            {display: '说明', name: 'remark', width: '20%', minWidth: 60},
            {display: '部署公司', name: 'corpname', width: '5%', minWidth: 60},
            {display: '部署人', name: 'creator_name', width: '5%', minWidth: 60}
        ],
        dataAction: 'server', pageSize: 50,
        sortName: 'start_time',
        width: '100%', height: '100%', autoStretch: true, heightDiff: -20,
        checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
        fixedCellHeight: true, rowHeight: 3025,
        url: basePath + 'loadPageLogs.do'
    });

    /**************************************************************按钮工具栏**************************************************/
    //工具栏,
    var topitems = {
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']}
    };

    //工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar();

    function btnClick(item) {

        switch (item.id) {
            case "remove":
                var selected = mainGrid.getSelected();
                if (selected) {
                    remove(selected);
                }
                else {
                    LG.showError('请选择行!');
                }
                break;
            case "refresh":
                refresh();
                break;
        }
    }

    //刷新
    var refresh = function () {
        mainGrid.setParm('corp_id', $('#filterform').find('input[name="filtercorp"]').val());
        mainGrid.setParm('task_name', $('#filterform').find('input[name="filtername"]').val());
        mainGrid.setParm('status', $('#filterform').find('input[name="filterstatus"]').val());
        mainGrid.reload()
    };

    //删除
    var remove = function (selected) {
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {
            if (!confirm) return;
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
            }
        ]
    });


    //按钮状态控制
    var cm = new CardManager(toptoolbar, {}, topitems);
    cm.setCardStatus('OP_INIT');

    //重设高度
    mainGrid._onResize();

});