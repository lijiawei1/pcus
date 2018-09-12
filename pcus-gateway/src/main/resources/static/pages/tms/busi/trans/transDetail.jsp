<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/18
  Time: 10:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>任务明细</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
</head>
<body>
<div id="layout">
    <div class="toolbar-wrapper search-toolbar-wrapper">
        <div class="hidden-search">
            <i class="l-icon l-icon-search" data-action="single-search"></i>
            <input class="hs-input" placeholder="在此输入关键字" data-action="single-search-input">
            <span class="clear">&times;</span>
            <span class="status2 hs-btn limit-select" data-action="single-search">&gt;</span>
            <span class="status1 text">搜索</span>
            <span class="status2 text cancel">取消</span>
        </div>
        <div id="toptoolbar"></div>
    </div>
    <!-- 卡片界面 -->
    <div class="content-wrapper grid-wrapper">
        <!-- 列表界面 -->
        <div id="mainGrid"></div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
</body>
<script>

    var mst_id = '${mst_id}';

    var SELECTED = 'selected';

    //缓存数据
    var manager = {};

    //上下文路径
    var basePath = rootPath + '/tms/busi/transDetail/';

    //数据字典
    var data_dict = ${dict};
    //计价基准
    var price_base = priceBaseUtil.processPriceBase(data_dict);
    var remap_price_base = price_base.remap; //映射
    var data_price_base = price_base.base;
    //货物单位
    var data_unit = priceBaseUtil.processCargoUnit(remap_price_base);
    //货物类型
    var data_cargo_type = data_dict.cargo_type;

    //页面元素
    var $filterForm = $("#filterForm"),
            $toptoolbar = $("#toptoolbar"),
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            mainGrid, //列表
            mainForm; //编辑表单

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '物料名称', name: 'name', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'text'
                }
            },
            {
                display: '物料代码', name: 'code', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'text'
                }
            },
            {
                display: '货物类型', name: 'type', align: 'left', minWidth: 50, width: '10%',
                editor: {
                    type: 'select',
                    data: data_cargo_type,
                    ext: {
                        cancelable: true,
                        keySupport: true
                    }
                },
                render: LG.render.ref(data_cargo_type, 'type')
            },
            {
                display: '规格型号', name: 'standard', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'text'
                }
            },
            {
                display: '数量', name: 'qty', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'newnumberbox',
                    ext: {
                        type: "int",
                        minValue: 0,
                        defaultValue: 0
                    }
                },
                totalSummary: {
                    render: function (result, colum, data) {
                        return "<div>" + result.sum.toFixed(2) + "</div>";
                    }
                }
            },
            {
                display: '重量', name: 'weight', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'newnumberbox',
                    ext: {
                        minValue: 0,
                        defaultValue: 0
                    }
                },
                totalSummary: {
                    render: function (result, colum, data) {
                        return "<div>" + result.sum.toFixed(2) + "</div>";
                    }
                }
            },
            {
                display: '体积', name: 'volume', align: 'left', minWidth: 50, width: '3%',
                editor: {
                    type: 'newnumberbox',
                    ext: {
                        minValue: 0,
                        defaultValue: 0
                    }
                },
                totalSummary: {
                    render: function (result, colum, data) {
                        return "<div>" + result.sum.toFixed(2) + "</div>";
                    }
                }
            },
            {
                display: '价格', name: 'price', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'newnumberbox',
                    ext: {
                        minValue: 0,
                        defaultValue: 0
                    }
                },
                totalSummary: {
                    render: function (result, colum, data) {
                        return "<div>" + result.sum.toFixed(2) + "</div>";
                    }
                }
            },
            {
                display: '金额', name: 'amount', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'newnumberbox',
                    ext: {
                        minValue: 0,
                        defaultValue: 0
                    }
                },
                totalSummary: {
                    render: function (result, colum, data) {
                        return "<div>" + result.sum.toFixed(2) + "</div>";
                    }
                }
            },
            {
                display: '单位', name: 'unit', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'select',
                    data: data_unit
                },
                render: LG.render.ref(data_unit, 'unit')
            },
            {
                display: '批次号', name: 'batch_no', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'text'
                }
            },
            {
                display: '发货单号', name: 'delivery_no', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'text'
                }
            },
            {
                display: '运单号', name: 'bill_no', align: 'left', minWidth: 50, width: '5%'
            },
            {
                display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '5%',
                editor: {
                    type: 'text'
                }
            }
        ],
        pageSize: 20,
        url: basePath + 'loadGrid/' + mst_id,
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        dataAction: 'server',
        usePager: true,
        enabledEdit: true,
        clickToEdit: true,
        fixedCellHeight: true,
        inWindowComplete: true,
        heightDiff: -50,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'V.NAME',
        sortOrder: 'asc',
        colDraggable: true,
        localStorageName: 'transDetailMian' + user.id,
        onDblClickRow: function (rowdata, rowid, rowHtml, cellHtml) {
            var column = this.getColumn(cellHtml);
            if (!column || !column.editor) {
            } else {
                if (cellHtml) {
                    this._applyEditor(cellHtml);
                }
            }
        },
        onAfterEdit: function (e) {

        //    立即编辑立即更新模式
            var data = {
                pk_id: e.record.pk_id,
                columnname: e.column.columnname,
            }
            data[e.column.columnname] = e.value;

            //判断值是否改变
            if (manager.lastRecord && manager.lastRecord[e.column.columnname] === e.value) {
                LG.tip("值未改变");
                return;
            }

            LG.ajax({
                url: basePath + 'update',
                data: JSON.stringify(data, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                },
                error: function (msg) {
                }
            });
        },
        onBeforeEdit: function (editParm) {
            if (disabledButtons.indexOf('updata') >= 0) return false;
            var g = this, p = this.options;
            var column = editParm.column,
                    record = editParm.record;

            //记录修改前的值
            manager.lastRecord = $.extend({}, record);
            return true;
        }
    };

    var filterFormOption = {

        //搜索框绑定信息
        searchBind: {
            //搜索按钮ID
            searchBtnId: "searchBtn",
            //重置按钮ID
            resetBtnId: "resetBtn",
            //绑定表格ID
            bindGridId: "mainGrid",
        },

        prefixID: "s_",
        fields: [
            {
                display: "物料名称",
                name: "name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                cssClass: "field",
                type: "select",
                comboboxName: "name_c",
                options: {
                    data: [],
                    cancelable: true,
                    autocomplete: true,
                    isTextBoxMode: true
                }
            }
        ]
    };

//    filterForm = $filterForm.ligerSearchForm(filterFormOption);

    mainGrid = $mainGrid.ligerGrid(gridOption);

    var defaultActionOption = {
        items: [
            {id: 'add', text: '增加', click: toolAdd, icon: 'add', status: ['OP_INIT']},
            {id: 'delete', text: '删除', click: toolDelete, icon: 'delete', status: ['OP_INIT']},
            {id: 'refresh', text: '刷新', click: toolRefresh, icon: 'refresh', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };
    function  toolAdd() {
        LG.ajax({
            url: basePath + 'add',
            data: JSON.stringify({mst_id: mst_id}, DateUtil.datetimeReplacer),
            contentType: "application/json",
            success: function (data, msg) {
                mainGrid.addRow(data);
            },
            error: function (msg) {
                LG.showError(msg);
            }
        });
    };
    function toolDelete () {
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
                data: {ids: ids},
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
    }
    function toolRefresh () {
        mainGrid.reload();
    }
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

</script>
</html>
