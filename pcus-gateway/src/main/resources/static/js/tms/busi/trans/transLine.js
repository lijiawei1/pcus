$(function () {
//上下文路径
    var basePath = rootPath + '/tms/busi/transLine/';

//管理器
    var manager = {
        lastRecord: ''
    }

//页面元素
    var $toptoolbar = $("#toptoolbar"),
        $mainGrid = $("#mainGrid"); //显示表格

//页面控件
    var toptoolbar, //工具栏
        mainGrid, //列表
        mainForm; //编辑表单

//初始化表格选项
    var gridOption = {
        columns: [
            {display: '顺序号', name: 'seq', align: 'left', minWidth: 50, width: '5%'},
            {display: '线路信息', name: 'line_info', align: 'left', minWidth: 150, width: '10%'},
            {display: '起始地', name: 'start_org', align: 'left', minWidth: 130, width: '10%',
                editor: {
                    type: 'select',
                    ext: function (record, rowindex, value, column) {
                        return {
                            data: data_loadOrg,
                            cancelable: true,
                            autocomplete: true,
                            autocompleteKeyField: 'key_text',
                            keySupport: true,
                            highLight: true,
                            isTextBoxMode: true,
                            selectBoxWidth: 350,
                            selectBoxHeight: 250,
                            renderItem: function (data) {
                                return '<div class="combox-td"><p class="name" title="">' + (data.data.region || data.data.text) + '</p><p class="address" title="' + data.data.address + '">' + (data.data.address || "")  + '</p></div>';
                            }
                        }
                    }
                }
            },
            {display: '目的地', name: 'end_org', align: 'left', minWidth: 130, width: '10%',
                editor: {
                    type: 'select',
                    ext: function (record, rowindex, value, column) {
                        return {
                            data: data_loadOrg,
                            cancelable: true,
                            autocomplete: true,
                            autocompleteKeyField: 'key_text',
                            keySupport: true,
                            highLight: true,
                            isTextBoxMode: true,
                            selectBoxWidth: 450,
                            selectBoxHeight: 250,
                            renderItem: function (data) {
                                return '<div class="combox-td"><p class="name" title="">' + (data.data.region || data.data.text) + '</p><p class="address" title="' + data.data.address + '">' + (data.data.address || "")  + '</p></div>';
                            }
                        }
                    }
                }
            },
            {
                display: '公里数(KM)', name: 'kilometers', align: 'left', minWidth: 100, width: '10%',
                editor: {
                    type: 'float',
                    ext: {
                        isNegative: false, //是否负数
                        decimalplace: 0,   //小数位 type=float时起作用
                        step: 1,         //每次增加的值
                        interval: 50,      //间隔，毫秒
                        onChangeValue: false,    //改变值事件
                        minValue: 0,        //最小值
                    }
                },
                totalSummary: {
                    type: 'sum',
                    render: function (suminf, column, cell) {
                        return '<div>合计：' + suminf.sum.toFixed(2) + '</div>';
                    },
                }
            },
            {display: '备注', name: 'remark', align: 'left', minWidth: 150, width: '10%', editor: {type: 'text'}}
        ],
        pageSize: 20,
        url: basePath + 'loadGrid/' + mst_id,
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        usePager: true,
        // enabledEdit: true,
        // clickToEdit: true,
        fixedCellHeight: true,
        heightDiff: -50,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'SEQ',
        sortOrder: 'ASC',
        onDblClickRow: function (data, id, rowTarget, target) {
            console.log(data, id, rowTarget, target);
            if (!target) return;
            var column = this.getColumn(target);
            if (column.editor) {
                this._applyEditor(target);
                $(this.editor.input).focus();
            }
        },
        onBeforeEdit: function (editParm) {
            if (disabledButtons.indexOf('edit') >= 0) return false;
            //记录修改前的值
            manager.lastRecord = $.extend({}, editParm.record);
            return true;
        },
        onAfterEdit: function (e) {
            //修改前的值
            var oldValue = manager.lastRecord[e.column.columnname];
            //比较修改后的值
            if (manager.lastRecord && manager.lastRecord[e.column.columnname] == e.value) {
                LG.tip("值未改变");
                return;
            }
            //立即更新字段值模式
            var record = $.extend({}, e.record, {line_info: e.record.start_org + '-' + e.record.end_org});
            var columnname = e.column.columnname;

            var postData = {
                pk_id: e.record.pk_id,
                mst_id: e.record.mst_id,
                remark: '修改前：' + oldValue + "，修改后：" + e.value,
                line_info: e.record.start_org + '-' + e.record.end_org,
                columnname: columnname + ',line_info'
            };

            postData[e.column.columnname] = e.value;

            if (e.column.columnname === 'start_org') {
                postData['start_region'] = e.record.start_org;
                postData['start_address'] = e.record.start_org;
            } else if (e.column.columnname === 'end_org') {
                postData['end_region'] = e.record.end_org;
                postData['end_address'] = e.record.end_org;
            }
            for (var i = data_loadOrg.length - 1; i >= 0 ;i--) {
                var item = data_loadOrg[i];
                if (e.column.columnname === 'start_org' && item.text === e.record.start_org) {
                    postData.start_region = item.region;
                    postData.start_address = item.address;
                } else if (e.column.columnname === 'end_org' && item.text === e.record.end_org) {
                    postData.end_region = item.region;
                    postData.end_address = item.address;
                }
             }
            LG.ajax({
                url: basePath + 'update',
                data: JSON.stringify(postData, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                    var newdata = $.extend({}, record);
                    //更新行数据的版本号
                    mainGrid.updateRow(record['__id'], newdata);

                    mainGrid.isDataChanged = false;

                    LG.tip("值更新成功");
                },
                error: function (msg) {
                    LG.tip(msg);
                }
            });
        }
    };

    mainGrid = $mainGrid.ligerGrid(gridOption);

    var defaultActionOption = {
        items: [
            {id: 'add', text: '增加', click: addAction, icon: 'add', status: ['OP_INIT']},
            {id: 'delete', text: '删除', click: deleteAction, icon: 'delete', status: ['OP_INIT']},
            {id: 'refresh', text: '刷新', click: refreshAction, icon: 'refresh', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };

    function refreshAction() {
        mainGrid.reload();
    }
    function addAction () {
        LG.ajax({
            url: basePath + 'add',
            data: JSON.stringify({mst_id: mst_id}, DateUtil.datetimeReplacer),
            contentType: "application/json",
            success: function (data, msg) {
                mainGrid.addRow(data);
                mainGrid.isDataChanged = false;
            },
            error: function (msg) {
                LG.showError(msg);
            }
        });
    };
    function deleteAction() {
        var selected = mainGrid.getCheckedRows();
        if (!selected || selected.length == 0) {
            LG.showError("请选择行");
            return;
        }

        var ids = $.map(selected, function (item, index) {
            return item["pk_id"];
        }).join(',');

        //适配不同的主表
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {

            if (!confirm) return;

            $.ajax({
                url: basePath + 'remove',
                data: {ids: ids, mst_id: mst_id},
                success: function (data, msg) {

                    LG.tip('删除成功');
                    //刷新角色列表
                    mainGrid.deleteSelectedRow();
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        });
    };

//扩展按钮
    toptoolbar = LG.powerToolBar($toptoolbar, defaultActionOption);

    //单框搜索
    //本事件的e，输入的值，触发源，触发源的e
    $("body").on("single-search",function(e, value,target, target_e){
        value = $.trim(value);

        if(typeof defaultSearchFilter === "undefined"){
            defaultSearchFilter = {
                and:[],
                or:[]
            };
        }

        mainGrid.set('parms', [{name: 'where', value: mainGrid.getSearchGridData(true, value,defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    });

});