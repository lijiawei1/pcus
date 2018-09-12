<%--
  Created by IntelliJ IDEA.
  User: Eis
  Date: 2018/1/18
  Time: 9:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>List</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .state-new {
            background-color: #cfc;
        }
        .state-audit {
            background-color: #cff;
        }
        .trans-highlight {
            color: red;
        }
        .dialog-cen{
            color: #000;
        }
        .dialog-cen:hover {
            color: #000;
        }
    </style>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div id="layout">
    <div class="content-wrapper single-search history-search-wrapper">
        <div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span class="text">高级<br>搜索</span></div>
        <form class="history-search-form" id="history-search-form">
        </form>
        <div class="history-search-btn limit-select" id="history-search-btn" title="搜索">&gt;</div>
    </div>
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
<!-- 高级搜索 -->
<div class="advanced-search-wrap" id="advanced-search-wrap">
    <div class="rect border"></div>
    <div class="circle big border"></div>
    <div class="circle big inner"></div>
    <div class="circle small border"></div>
    <div class="circle small inner close limit-select" data-action="close-advanced-search">&times;</div>
    <div class="advanced-search" id="advanced-search">
        <div class="advanced-search-title">高级搜索</div>
        <div class="advanced-search-content">
            <form id="filterForm"></form>
        </div>
        <ul class="search-btn-con">
            <li class="search-btn s-btn limit-select" id="searchBtn"></li>
            <li class="search-btn r-btn limit-select" id="resetBtn"></li>
        </ul>
    </div>
</div>

<!-- excel导出 -->
<div class="dialog-container">
    <form id="download" method="POST" target="_blank" action="${path}/tms/settle/driver/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="where"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

<!-- 新增 -->
<div id="addMain">
    <form id="addSearch"></form>
    <div id="addGrid"></div>
    <form id="addDate" style="display: none;"></form>
</div>

</body>
<script>
    var pageError = false;
    try {
        var state = ${state};
        var drivers = ${drivers};
    } catch (e) {
        pageError = true;
    }

    var years = [{"text":2017},{"text":2018},{"text":2019},{"text":2020},{"text":2021},{"text":2022},{"text":2023},{"text":2024},{"text":2025},{"text":2026},{"text":2027},{"text":2028},{"text":2029},{"text":2030},{"text":2031},{"text":2032},{"text":2033},{"text":2034},{"text":2035},{"text":2036},{"text":2037}];
    var months = [{"text":01},{"text":02},{"text":03},{"text":04},{"text":05},{"text":06},{"text":07},{"text":08},{"text":09},{"text":10},{"text":11},{"text":12}];

    $(function () {
        if (pageError) {
            LG.Tip('基础数据发生错误');
            return false;
        } else {
            drivers = drivers.map(function (item) {
                return {
                    id: item.id,
                    text: item.text
                }
            });
        }

        var filterFormFieldWidth = {
            w1: 155,
            w2: 310,
            w3_2: 405
        };

        var fontSize = 12 / detectZoom(top);

        //上下文路径
        var basePath = rootPath + '/tms/settle/driver/';

        var where = {
            "op": "and",
            "rules": [],
            "groups": []
        };

        var mainGrid, searchForm, addSearchForm, addGrid, addDate;

        //全局查询过滤
        var defaultSearchFilter = {
            and: [],
            or: []
        };

        mainGrid = $('#mainGrid').ligerGrid({
            columns: [
                {
                    'display': "操作",
                    "isSort": false,
                    'storageName': "edit",
                    width: 60,
                    'render': function (item, index) {
                        return '<a class="row-edit-btn" data-index="' + index + '" title="编辑"><i class="iconfont l-icon-edit"></i></a>';
                    }
                }, {
                    'display': "状态",
                    'name': "state",
                    width: 60,
                    render: function (item) {
                        if (item.state == '新记录') {
                            return '<div class="state-new">' + item.state + '</div>';
                        }
                        else if (item.state == '已审核') {
                            return '<div class="state-audit">' + item.state + '</div>';
                        }
                        return item.state;
                    }
                }, {
                    'display': "结算人",
                    'name': "driver_name"
                }, {
                    'display': "年",
                    'name': "year"
                }, {
                    'display': "月",
                    'name': "month"
                }, {
                    'display': "应出勤",
                    'name': "theo_work"
                }, {
                    'display': "实际出勤",
                    'name': "fact_work"
                }, {
                    'display': "产值",
                    'name': "output_value",
                    render: function (data, index , val) {
                        var result = new Number(val); return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                }, {
                    'display': "提成",
                    'name': "tc",
                    render: function (data, index , val) {
                        var result = new Number(val); return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                }, {
                    'display': "基本工资",
                    'name': "wage",
                    render: function (data, index , val) {
                        var result = new Number(val); return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                }, {
                    'display': "合计金额",
                    'name': "amount",
                    render: function (data, index , val) {
                        var result = new Number(val); return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                }, {
                    'display': "核对单",
                    'name': "bill_of_check"
                }, {
                    'display': "计提单",
                    'name': "bill_of_extract"
                }, {
                    'display': "无公里数单量",
                    'name': "mile_zero"
                }, {
                    'display': "未核对公里数单量",
                    'name': "mile_no_comfirm"
                }, {
                    'display': "合同开始时间",
                    'name': "contract_begin_date"
                }, {
                    'display': "合同结束时间",
                    'name': "contract_end_date"
                }, {
                    'display': '备注',
                    'name': 'remark',
                    'editor': {
                        type: 'text'
                    }
                }],
            url: basePath + 'loadGrid',
            checkbox: true,
            height: '100%',
            dataAction: 'server',
            pageSize: 50,
            pageSizeOptions: [50, 100, 200, 500],
            enabledEdit: false,
            clickToEdit: false,
            heightDiff: -15,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            localStorageName: "FuleBillgrid" + user.id + param.no,
            selectRowButtonOnly: true,
            sortName: 'YEAR,MONTH,DRIVER_NAME',
            sortOrder: 'DESC,DESC,ASC',
            parms: {
                'where': JSON2.stringify(where)
            },
            onDblClickRow: function (rowData, rowId, row, cellHTML) {
                if(rowData.state !== '新记录') return;
                var column = this.getColumn(cellHTML);
                if (column.editor) {
                    this._applyEditor(cellHTML);
                    $(this.editor.input).focus();
                } else {
                    jumpDetailEdit(rowData);
                }
            },
            onBeforeEdit: function (editParm) {
                this.editBeforeData = $.extend({}, editParm.record);
            },
            onAfterEdit: function (editParm) {
                var record = $.extend({}, editParm.record);
                var columnname = editParm.column.columnname;
                var postData = {
                    pk_id: record.pk_id,
                    state: record.state
                };
                postData[columnname] = editParm.value;
                var url = columnname === 'other_qty' ? 'updateFuel' : 'updateRemark';
//                console.log(JSON.stringify(postData, DateUtil.datetimeReplacer));
                LG.ajax({
                    url: basePath + url,
                    contentType: "application/json",
                    data: JSON.stringify(postData, DateUtil.datetimeReplacer),
                    success: function (result) {
                        LG.tip('更新成功');
                        mainGrid.isDataChanged = false;
                        mainGridLoad();
//                        if (columnname === 'other_qty') {
//                        }
                    },
                    error: function (msg) {
                        LG.showError(msg);
                        mainGridLoad();
                    }
                });
            }
        });

        searchForm = $('#filterForm').ligerSearchForm({
            fields: [
                {
                    display: '状态',
                    name: 'state',
                    type: 'select',
                    newline: false,
                    options: {
                        valueField: 'text',
                        data: [
                            {
                                text: '新纪录'
                            }, {
                                text: '已审核'
                            }
                        ]
                    }
                },{
                    display: '结算人',
                    name: 'driver_id',
                    type: 'select',
                    newline: false,
                    options: {
                        data: drivers
                    }
                },{
                    display: '年',
                    name: 'year',
                    type: 'select',
                    newline: false,
                    options: {
                        data: years
                    }
                },{
                    display: '月',
                    name: 'driver_id',
                    type: 'select',
                    newline: false,
                    options: {
                        valueField: 'text',
                        data: months
                    }
                },{
                    display: "合同有效期",
                    name: "contract_begin_date",
                    newline: false,
                    type: "date",
                    attr: {
                        op: "greaterorequal" //操作符
                    }
                }, {
                    display: "至",
                    name: "contract_end_date",
                    newline: false,
                    labelWidth: 24,
                    type: "date",
                    cssClass: "field",
                    editor: {
                        showTime: true,
                        format: "yyyy-MM-dd",
                        onChangeDate: function (value) {
                            this.usedDate.setHours(23, 59, 59);
                        }
                    },
                    attr: {
                        op: "lessorequal" //操作符
                    }
                }],
            searchBind: {
                //搜索按钮ID
                searchBtnId: "searchBtn",
                //重置按钮ID
                resetBtnId: "resetBtn",
                //绑定表格ID
                bindGridId: "mainGrid",
                //搜索后事件
                onAfterSearch: function () {
                    //如果是在高级搜索里，则需关闭高级搜索
                    var $advanced = $(this).parents(".advanced-search-wrap");
                    if ($advanced.length > 0) {
                        $advanced.children('[data-action="close-advanced-search"]').trigger("click");
                    }
                    //清除tag选择样式
                    $(".qs-item.visited").removeClass("visited");
                },
                where: function (options, form) {
                    var where = JSON2.parse(form.getSearchFormData(this.searchBind.dr, this.searchBind.defaultFilter));
                    return JSON2.stringify(where);
                }
            },
            historySearch: {
                formId: "history-search-form",
                storageId: "fuelBillList" + user.id,
                searchBtnId: "history-search-btn",
                wordWidth: fontSize,
                fieldWidthDiff: fontSize,
                defaultFields: {
                    fuel_type: true,
                    year: true,
                    month: true
                },
                options: {
                    labelWidth: 85,
                    inputWidth: 170,
                    space: 5,
                    prefixID: "hs_"
                }
            },
            labelWidth: 85,
            inputWidth: filterFormFieldWidth.w1,
            space: 5,
            prefixID: "s_"
        });

        addSearchForm = $('#addSearch').ligerForm({
            fields: [{
                display: '结算人',
                name: 'driver_name',
                newLine: false,
            },{
                display: '合同名称',
                name: 'contract_name',
                newLine: false,
            },{
                display: "合同有效期",
                name: "contract_begin_date",
                width: 170,
                newline: true,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd"
                },
                attr: {
                    op: "greaterorequal", //操作符
                    "data-name": "contract_begin_date", //查询字段名称
                }
            },{
                display: "至",
                name: "contract_end_date",
                width: 170,
                labelWidth: 24,
                newline: false,
                type: "date",
                cssClass: "field",
                editor: {
                    showTime: true,
                    format: "yyyy-MM-dd"
                },
                attr: {
                    op: "lessorequal", //操作符
                    "data-name": "contract_end_date", //查询字段名称
                }
            }],
            inputWidth: filterFormFieldWidth.w1,
            buttons: [{
                text: '搜索',
                click: function () {
                    search(addSearchForm, addGrid);
                }
            }, {
                text: '重置',
                click: function () {
                    addSearchForm.reset();
                }
            }],
            prefixID: "add_"
        });

        addGrid = $('#addGrid').ligerGrid({
            columns: [{
                display: '编号',
                name: 'no',
                width: '10%'
            }, {
                display: '状态',
                name: 'state',
                width: '15%',
                sortable: false,
                render: LG.render.ref(state, 'state')
            }, {
                display: '结算人',
                name: 'driver_name',
                width: '15%',
            }, {
                display: '合同名称',
                name: 'contract_name',
                width: '15%',
            }, {
                display: '合同开始时间',
                name: 'contract_begin_date',
                width: '15%'
            }, {
                display: '合同结束时间',
                name: 'contract_end_date',
                width: '15%',
            }, {
                display: '结算方案',
                name: 'settle_plan',
                width: '15%'
            }],
            url: basePath + 'loadDriverGrid',
            checkbox: true,
            width: 740,
            height: 420,
            dataAction: 'server',
            heightDiff: -40,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            delayLoad: true,
            localStorageName: "driverBillGrid" + user.id + param.no,
            selectRowButtonOnly: true,
            sortName: 'NO',
            sortOrder: 'ASC',
            parms: {
                'where': JSON2.stringify({
                    "op": "and",
                    "rules": [],
                    "groups": []
                })
            }
        });

        addDate = $('#addDate').ligerForm({
            fields: [{
                display: '结算年份',
                name: 'year',
                type: 'select',
                options: {
                    autocomplete: true,
                    autocompleteAllowEmpty: true,
                    highLight: true,
                    valueField: 'text',
                    data: years
                }
            }, {
                display: '结算月份',
                name: 'month',
                type: 'select',
                options: {
                    autocomplete: true,
                    autocompleteAllowEmpty: true,
                    highLight: true,
                    valueField: 'text',
                    data: months
                }
            }],
            validate: {
                YEAR: {required: true},
                MONTH: {required: true}
            }
        });

        $('#toptoolbar').ligerToolBar({
            items: [
                {
                    text: '刷新',
                    icon: 'refresh',
                    click: function () {
                        search()
                    }
                }, {
                    text: '新增数据',
                    icon: 'add',
                    click: addData
                }, {
                    text: '更新数据',
                    icon: 'download',
                    click: getNewData
                }, {
                    text: '清除数据',
                    icon: 'return',
                    click: clearData
                }, {
                    text: '删除数据',
                    icon: 'delete',
                    click: deleteData
                }, {
                    text: '审核数据',
                    icon: 'audit',
                    click: submit
                }, {
                    text: '撤销审核',
                    icon: 'withdraw',
                    click: undoSubmit
                }, {
                    text: '导出数据',
                    icon: 'export',
                    click: function () {
                        //Excel数据下载
                        $("#download").attr("action", basePath + "excelExport");
                        var weee = searchForm.getSearchFormData(false, defaultSearchFilter);
                        xlsUtil.exp($("#download"), mainGrid, '司机计提' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls',{where: weee});
                    }
                }
            ]
        });

        //初始化编辑按钮
        mainGrid.grid.on('click', 'a.row-edit-btn', function (e) {
            var index = $(this).data("index");
            var rowdata = mainGrid.getRow(index);
            jumpDetailEdit(rowdata);
        });

        //历史表单搜索
        $('body').on({
            "keypress": function (e) {
                var $advancedSearchWrap = $("#advanced-search-wrap");
                //在高级搜索关闭时
                if (e.keyCode == 13 && (!$advancedSearchWrap.length || $advancedSearchWrap.is(":hidden"))) {
                    e.stopPropagation();
                    e.preventDefault();
                    historySearch();
                    return false;
                }
            },
            "single-search": function (e, value, target, target_e) {
                value = $.trim(value);
                mainGrid.set('parms', [{name: 'where', value: mainGrid.getSearchGridData(true, value, {
                    and: [],
                    or: []
                })}]);
                mainGrid.changePage('first');
                mainGrid.loadData();
            }
        });
        function historySearch() {
            searchForm.historySearch();
            //清除tag选择样式
            $(".quick-search>.qs-item.visited").removeClass("visited");
        }


        // 搜索
        // param form : 默认searchForm
        // param grid : 默认mainGrid
        function search (form, grid) {
            form = form ? form : searchForm;
            grid = grid ? grid : mainGrid;

            if (!form.valid()) {
                form.showInvalid();
                return;
            }
            var where = form.getSearchFormData();
            grid.set('parms', [{name: 'where', value: where}]);
            grid.changePage('first');
            grid.loadData();
        }

        function mainGridLoad () {
            mainGrid.loadData();
        }

        function addData() {
            search(addSearchForm, addGrid);
            $.ligerDialog.open({
                target: $('#addMain'),
                width: 780,
                height: 640,
                buttons: [{
                    text: '添加',
                    onclick: function (e, dialog) {
                        var datas = addGrid.getSelecteds();
                        if (datas.length < 1) {
                            LG.showError('请选择数据');
                            return false;
                        }
                        addDate.reset();
                        $.ligerDialog.open({
                            target: $('#addDate'),
                            width: 400,
                            height: 200,
                            buttons: [{
                                text: '保存',
                                onclick: function (e1, dialog1) {
                                    if (!addDate.valid()) {
                                        addDate.showInvalid();
                                        return false;
                                    }
                                    var fData = addDate.getData();
                                    var result = datas.map(function (item) {
                                        var itemData = $.extend(item, fData);
//                                        item.driver_name = item.default_driver;
                                        return itemData;
                                    });

                                    LG.ajax({
                                        url: basePath + 'add',
                                        contentType: "application/json",
                                        data: JSON.stringify(result),
                                        success: function (ajaxData) {
                                            mainGridLoad();
                                            LG.tip('添加成功');
                                            dialog1.hidden();
                                            dialog.hidden();
                                        },
                                        error: LG.showError
                                    });
                                }
                            }, {
                                text: '取消',
                                onclick: function (e1, dialog1) {
                                    dialog1.hidden();
                                }
                            }]
                        });
                    }
                }, {
                    text: '取消',
                    onclick: function (e, dialog) {
                        dialog.hidden();
                    }
                }]
            });
        }

        function getNewData () {
            var datas = getDatas();
            if (!datas) { return false; }
           /* $.ligerDialog.confirm('更新数据', '更新确认', function (result) {
                if (!result) {return;}
                pageRequest({
                    url: basePath + 'update',
                    data: JSON.stringify(datas),
                    success: function (result) {
                        LG.tip('更新成功');
                    }
                });
            });*/

            $.ligerDialog.open({
                title: '更新数据',
                content: '更新数据',
                width: 400,
                buttons: [
                    {
                        text: '确认',
                        onclick: function (e, uploadDlg) {
                            refreshfun(datas);
                            uploadDlg.hide();
                        }
                    },
                    {
                        text: '更新并追加当月单据',
                        width: 120,
                        onclick: function (e, uploadDlg) {
                            refreshWith(datas);
                            uploadDlg.hide();
                        }
                    },
                    {
                        text: '取消',
                        cls: 'dialog-cen',
                        onclick: function (e, uploadDlg) {
                            uploadDlg.hide();
                        }
                    }
                ]
            });
        }
        function refreshfun (datas) {

            pageRequest({
                url: basePath + 'update',
                data: JSON.stringify(datas),
                success: function (result) {
                    LG.tip('更新成功');
                }
            });
        }

        function refreshWith(datas) {

            pageRequest({
                url: basePath + 'updatewith',
                data: JSON.stringify(datas),
                success: function (result) {
                    LG.tip('更新成功');
                }
            });
        }


        function clearData () {
            var datas = getDatas();
            if (!datas) { return false; }
            $.ligerDialog.confirm('清除数据', '清除确认', function (result) {
                if (!result) {return;}
                pageRequest({
                    url: basePath + 'cancel',
                    data: JSON.stringify(datas),
                    success: function (result) {
                        LG.tip('清除成功');
                    }
                });
            });
        }

        function submit () {
            var datas = getDatas();
            if (!datas) { return false; }
            pageRequest({
                url: basePath + 'submit',
                data: JSON.stringify(datas),
                success: function () {
                    LG.tip('审核成功');
                }
            });
        }

        function undoSubmit () {
            var datas = getDatas('submit');
            if (!datas) { return false; }
            $.ligerDialog.confirm('取消审核', '撤销审核确认', function (result) {
                if (!result) {return;}
                pageRequest({
                    url: basePath + 'cancelSubmit',
                    data: JSON.stringify(datas),
                    success: function () {
                        LG.tip('取消审核成功');
                    }
                });
            });
        }

        function deleteData() {
            var datas = getDatas();
            if (!datas) { return false; }
            $.ligerDialog.confirm('删除数据', '删除确认', function (result) {
                if (!result) {return;}
                pageRequest({
                    url: basePath + 'remove',
                    data: JSON.stringify(datas),
                    success: function () {
                        LG.tip('删除成功');
                    }
                });
            })
        }

        function getDatas (isAudit) {
            var datas = mainGrid.getSelecteds();
            if (datas.length < 1) {
                LG.showError('请选择数据');
                return false;
            }
            var result = false;
            for (var i = datas.length - 1; i >= 0; i--) {
                var item = datas[i];
                if (isAudit) {
                    if (item.state !== '已审核') {
                        result = '请选择已审核数据';
                    }
                } else if (item.state !== '新记录') {
                    result = '请选择新记录数据';
                }
            }
            if (!result) {
                return datas;
            } else {
                LG.showError(result);
                return false;
            }
        }

        function pageRequest (options) {
            if (!options.url || !options.data) { console.error('填入参数错误'); return false;}
            LG.ajax({
                url: options.url,
                data: options.data,
                contentType: options.contentType || "application/json",
                success: function (result) {
                    mainGridLoad();
                    options.success && options.success(result);
                },
                error: function (msg) {
                    options.error && options.error(msg);
                    LG.showError(msg);
                }
            });
        }
    });

    /**
     * 跳转到具体的页签
     * @param data
     */
    function jumpDetailEdit(rowdata) {
        var title = '司机' + rowdata.driver_name + '(' + rowdata.year +'/' + rowdata.month + ')';
        top.f_addTab(rowdata.pk_id, title, rootPath + '/tms/settle/driverBillFee/loadPage/' + rowdata.pk_id + '?module=' + param.module + '&function=' + param.fun);
    }
</script>
</html>
