var basePath = rootPath + '/auth/menu/';

//设置左侧树状态
var setLeftStatus = function (enable) {
    if (enable){;
        $(".customMask").hide();
    }
    else{
        $(".customMask").show();
    }
};

function addMask(target){
    var mask = $('<div class="customMask" style="display: none; height: 100%;background: #e1e1e1; font-size: 1px; left: 0; opacity: 0.5; overflow: hidden; position: absolute;top :0px; width: 100%; z-index: 9000;"></div>');
    target.append(mask);
}

var out = function (value) {
    alert(JSON2.stringify(value))
}

//当前选中的父菜单编码
var parentId, parentNo, mlevel;

var visibleData = [{visible: 'true', text: '显示'}, {visible: 'false', text: '隐藏'}];

//初始化数据
var initMenuData = {
    pid: "", name: "", no: "", morder: "", url: "", visible: true, mlevel: ""
}

$(function () {

    //初始化界面
    var layout = $("#layout").ligerLayout({
        minLeftWidth:200,
        leftWidth: 200,
        height: '100%',
        space: 1,
        heightDiff: 0,
        centerBottomHeight: 200,
        onHeightChanged: function (e) {
            //高度改变时间
            //alert(e.layoutHeight);
        },
        onEndResize: function (p, e) {
            //mainGrid.gridview.height(layout.center.content.height() - 30);
        }
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

    var moduleList = [
        {
            id: 'sys',
            text: '系统管理'
        },
        {
            id: 'auth',
            text: '权限管理'
        }
    ];

    var filterform = $('#filterform').ligerForm({
        inputWidth: 150, labelWidth: 70, space: 10,
        fields: [
            {
                display: "模块名称", name: "module", newline: false, type: "select",
                editor: {
                    data: moduleList
                }
            },
            { display: "是否重置", name: "reset", newline: false, type: "checkbox"},
            { display: "开始编号", name: "startno", newline: false, type: "text" },
        ]
    });


    var maingform = $("#mainform");
    $.metadata.setType("attr", "validate");
    LG.validate(maingform, {debug: true,ignore: '.l-hidden'});

    var mainGrid = $("#mainGrid").ligerGrid({
        columns: [
            {
                display: '菜单名称',
                name: 'name',
                align: 'center',
                width: '12%',
                minWidth: 120,
                validate: {required: true},
                editor: {type: 'text'}
            },
            {
                display: '菜单编码',
                name: 'code',
                align: 'center',
                width: '12%',
                minWidth: 120,
                validate: {required: true},
                editor: {type: 'text'}
            },
            {
                display: '排序号',
                name: 'morder',
                align: 'center',
                width: '6%',
                minWidth: 60,
                validate: {required: true, digits: true},
                editor: {type: 'text'}
            },
            {
                display: '顺序号',
                name: 'no',
                align: 'left',
                width: '12%',
                minWidth: 120
            },
            {
                display: '是否显示',
                name: 'visible',
                align: 'center',
                isSort: false,
                width: '6%',
                minWidth: 60,
                editor: {type: 'select', data: visibleData, valueColumnName: 'visible',
                    ext: {
                    }
                },
                render: function (item) {
                    return item.visible ? "显示" : "隐藏"
                }
            },
            {
                display: '类型',
                name: 'mlevel',
                align: 'center',
                isSort: false,
                width: '6%',
                minWidth: 60,
                type: "select",
                editor: {
                    type: 'select',
                    data: [
                        {text: '菜单', value: 2},
                        {text: '按钮', value: 3}
                    ],
                    valueColumnName: 'value'
                },
                render: function (item) {
                    switch (item.mlevel) {
                        case 1:
                            return '模块';
                        case 2:
                            return '菜单';
                        case 3:
                            return '按钮';
                        case 4:
                            return '未知(' + item.mlevel + ')'
                    }
                }
            },
            {
                display: '不拦截',
                name: 'unintercept',
                isSort: false,
                align: 'left',
                width: '6%',
                minWidth: 60,
                type: "select",
                editor: {
                    type: 'select',
                    data: [{text: '是', value: true}, {text: '否', value: false}],
                    valueColumnName: 'value'
                },
                render: function (item) {
                    return item.unintercept == true ? "是" : "否"
                }
            },
            {
                display: '拦截地址',
                name: 'intercept_url',
                isSort: false,
                align: 'left',
                width: '17%',
                minWidth: 200,
                validate: {required: true},
                editor: {
                    type: 'text',
                    // ext: {
                    //     onChangeValue: function (record) {
                    //         // var record = editParm.record;
                    //         var columns = mainGrid.columns;
                    //
                    //         console.log(mainGrid.editors[record["__id"]][columns[7]["__id"]]);
                    //     },
                    //     onBlur: function (value) {
                    //         alert(value);
                    //     },
                    //     onFocus: function () {
                    //         alert('');
                    //     }
                    // },
                    // onChangeValue: function (value) {
                    //     alert('change' + value);
                    // },
                    // onBlur: function (value) {
                    //     // alert(value);
                    // },
                    // onFocus: function () {
                    //     // alert('focus');
                    // },
                    // ext: function (record, rowindex, value, column) {
                    //     return {
                    //         onChangeValue: function (value) {
                    //
                    //             var urlEditor = mainGrid.editors[record["__id"]][mainGrid.columns[9]["__id"]];
                    //             urlEditor.input.val('fuck');
                    //             alert('change' + value);
                    //         }
                    //     }
                    // }
                }
            },
            {
                display: '链接地址',
                name: 'url',
                isSort: false,
                align: 'left',
                width: '17%',
                minWidth: 200,
                validate: {required: true},
                editor: {type: 'text'}
            },
            {
                display: '图标', name: 'icon', align: 'center', isSort: false, width: '6%', minWidth: 60,
                editor: {
                    type: 'popup',
                    ext: function (rowdata) {
                        return {
                            onButtonClick: function () {
                                currentComboBox = this
                                grid = mainGrid
                                f_openIconsWin()
                                return false;
                            },
                            render: function () {
                                return rowdata.icon;
                            }
                        }
                    }
                },
                render: function (item) {
                    return !!item.icon ? "<div style='width:100%;height:100%;'><img src='" + item.icon + "' /></div>" : "";
                }
            },
        ],
        dataAction: 'server',
        pageSize: 50,
        //toolbar: {},
        sortName: 'no',
        width: '100%',
        height: '100%',
        heightDiff: -20,
        checkbox: false,
        usePager: true,
        enabledEdit: true,
        clickToEdit: false,
        fixedCellHeight: false,
        rowHeight: 30,
        rownumbers: true,
        url: basePath + 'loadPageMenus.do',
        delayLoad: true,		//初始化不加载数据
        onBeginEdit: function (editParm) {
            //alert('beginEdit');
        },
        onAfterBeginEdit: function (editParm) {

            // console.log(editParm.record);
            // console.log(editParm.rowindex);

            var record = editParm.record;
            var columns = mainGrid.columns;

            //console.log(mainGrid.editors[record["__id"]][columns[7]["__id"]]);

        },
        onEndEdit: function (editParm) {
           // alert('editParm');
        },
        onAfterEdit: function (editParm) {
        },
        onBeforeEdit: function (editParm) {
        },
        //双击跳转到按钮管理界面
        onDblClickRow: function (data, rowindex, rowobj) {
            if (data && !data._editing) {
                if (data.mlevel != 2) return;
                else {
                    top.f_addTab(data.no + data.morder, '管理菜单 [' + data.name + '] 的按钮',
                        '/menu/manage?pid=' + data.id + '&no=' + data.no + '&mlevel=' + data.mlevel);
                }
            }
        },
        //单选显示所有按钮
        onSelectRow: function (data, rowid, rowobj) {
            //if (data.mlevel == 2) {
            //  btnGrid.setParm('pid', data.id)
            //  btnGrid.reload()
            //}
        },
        onBeforeSubmitEdit:function(){
            //编辑前事件，校验
            //如果编辑状态则不允许提交
            //		var editingrow=grid.getEditingRow();
            //		if(editingrow!=null){
            //		return false;
            //        }
            if (!LG.validator.form()) {
                LG.showInvalid();
                return false;
            }
            return true;
        }
    });


    mainGrid.bind('afterSubmitEdit', function(e){
        //编辑后事件
        var isAddNew = e.record['__status'] == "add";
        var data = {}
        if (isAddNew) {
            //新增
            data = $.extend({pid: parentId, no: parentNo, mlevel: mlevel == 0 ? 1 : 2}, e.newdata)
        } else {
            //编辑
            data = $.extend(e.record, e.newdata)
        }

        data.ischecked = true;

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
    var refresh = function () {
        // mainTree.reload()
        mainGrid.setParm('pid', parentId)
        mainGrid.reload()
        //btnGrid._clearGrid()
    }

    var remove = function (selected) {
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {
            if (!confirm) return

            if (!selected.no) {
                mainGrid.deleteRow(selected);
                return;
            }
            LG.ajax({
                url: basePath + 'remove',
                loading: '正在删除中...',
                data: {id: selected.id, version: selected.version},
                success: function () {
                    LG.showSuccess('删除成功')
                    mainTree.reload()
                    mainGrid.loadData()
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    }


    //工具栏,
    var topitems = {
        add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT']},
        edit: {id: 'edit', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT']},
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT']},
        save: {id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT']},
        cancel: {id: 'cancel', text: '取消', click: btnClick, icon: 'back', status: ['OP_ADD', 'OP_EDIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']}
        // managebtn: {id: 'managebtn', text: '按钮管理', click: btnClick, icon: 'manage', status: ['OP_INIT']},
        // initAuth: {id: 'initAuth', text: '权限', click: btnClick, icon: 'auth', status: ['OP_INIT']},
        // initOrg: {id: 'initOrg', text: '组织', click: btnClick, icon: 'org', status: ['OP_INIT']},
        // initTask: {id: 'initTask', text: '任务', click: btnClick, icon: 'task', status: ['OP_INIT']},
        // initMail: {id: 'initMail', text: '邮箱', click: btnClick, icon: 'mail', status: ['OP_INIT']},
        // initMsg: {id: 'initMsg', text: '消息', click: btnClick, icon: 'msg', status: ['OP_INIT']},
        // initCustom: {id: 'initCustom', text: '自定义', click: btnClick, icon: 'custom', status: ['OP_INIT']},
    }

    var toptoolbar = $("#toptoolbar").ligerToolBar();

    var cm = new CardManager(toptoolbar, uiStatus, topitems)
    cm.setCardStatus('OP_INIT')

    function btnClick(item) {

        var editingrow = mainGrid.getEditingRow();

        switch (item.id) {
            case "add":
                if (editingrow == null) {
                    if (!parentId) {
                        LG.showError("请选择父功能节点")
                        return
                    }
                    if (mlevel == 0) {
                        //增加模块
                        initMenuData.mlevel = 1
                    } else {
                        //增加菜单
                        initMenuData.mlevel = 2
                    }
                    mainGrid.addEditRow(initMenuData);
                    cm.setCardStatus('OP_ADD')
                }
                break;
            case "edit":
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
                    //查看是否有子节点
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
            case "cancel":
                if (editingrow != null) {
                    mainGrid.cancelEdit(editingrow);
                    if (editingrow.__status == "add") {
                        mainGrid.remove(editingrow)
                    }
                }
                cm.setCardStatus('OP_INIT')
                break;
            case "refresh":
                refresh()
                break;
            case "managebtn":

                var selected = mainGrid.getSelected()
                if (selected) {
                    if (selected.mlevel != 2)return;
                    else {
                        top.f_addTab(selected.no + selected.morder, '管理菜单 [' + selected.name + '] 的按钮',
                            '/menu/manage?pid=' + selected.id + '&no=' + selected.no + '&mlevel=' + selected.mlevel);
                    }
                } else {
                    LG.showError('请选择行!');
                }
                break;
            case "retrieve":
                if (editingrow != null) {
                    out(editingrow)
                    out(mainGrid.getData("add"))

//				mainGrid.cancelEdit(editingrow)
                }
                break;
            default:
                initModule(item);
                break;
        }

    }

    //初始化模块菜单树
    var mainTree = $("#mainTree").ligerTree({
        url: basePath + 'loadTreeMenus.do',
        idFieldName: 'id',
        textFieldName: 'name',
        parentIDFieldName: 'pid',
        slide: true,
        checkbox: false,
        parentIcon:null,
        childIcon: null,
        btnClickToToggleOnly:false,
        isExpand: 2,
        singleOpen:true,
        isLeaf:function(nodeData){
            //在这里，第三级就是叶子节点
            //因为数据本身没有指明这是叶子节点，所以才需要在这渲染
            return nodeData.mlevel==2;
        },
        onSelect: function onSelect(node) {

            if (!node.data || !node.data.id)
                return
            parentId = node.data.id;
            parentNo = node.data.no;
            mlevel = node.data.mlevel;

            var title = '模块功能'
            if (mlevel > 0) {
                title = '当前选中' + (mlevel == 1 ? '模块' : '节点') + '[<span style="color:#f00;">' + node.data.name + '</span>]'
            }
            $('#layout-center').parent().find('.l-layout-header').html(title)

            mainGrid.setParm('pid', parentId);
            mainGrid.loadData();
        }
    });

    /**
     * 初始化模块菜单
     * @param item
     */
    function initModule(item) {
        switch (item.id) {
            case 'initAuth':
                initModuleDetail('auth', '', true);
                break;
            case 'initOrg':
                initModuleDetail('org', '', true);
                break;
            case 'initTask':
                initModuleDetail('task', '', true);
                break;
            case 'initMail':
                initModuleDetail('mail', '', true);
                break;
            case 'initMsg':
                initModuleDetail('msg', '', true);
                break;
            case 'initCustom':
                var data = filterform.getData();
                //获取输入
                initModuleDetail(data.module, data.startno, data.reset);
                break;
        }
    }

    /**
     * 初始菜单
     * @param action
     * @param reset
     * @param module
     * @param startno
     */
    function initModuleDetail(module, startno, reset) {
        LG.ajax({
            // http://localhost:8080/auth/menu/initModule?reset=true&module=blp&startno=101
            // boolean reset, String module, String startno
            url: basePath + 'initModule',
            data: {
                reset: reset,
                module: module,
                startno: startno
            },
            success: function () {
                LG.showSuccess("成功")
            },
            error: function (msg) {
                LG.showError(msg)
            }
        });
    }
    
    //事件监听
    $("body").click(function(e){
        var $tg=$(e.target),action=$tg.attr("data-action");
        if(action==="toggle-left"){
            layout.setLeftCollapse(true);
        }
    });

    //窗体高度自适应
    (function autoSetGridHeight(){
        var $gridWrap=$("#mainGrid").parent(),
            $filterWrapper=$gridWrap.siblings(".filter-wrapper:eq(0)");
        var debounceResetHeight = debounce(function () {
            var gridHeight = $gridWrap.parent().height() - $filterWrapper.height()  -  84;/*74*/
            $gridWrap.height(gridHeight);
            mainGrid.setHeight(gridHeight);
        }, 200, true);
        debounceResetHeight();
        $(window).resize(function () {
            debounceResetHeight();
        });
    })();
});