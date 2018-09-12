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
    <title>运单明细</title>
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

<!--Excel导入-->
<div id="uploadDlg" style="display: none;">
    <form id="uploadForm" enctype="multipart/form-data">
        <table style="height: 100%; width: 100%">
            <tr style="height: 40px">
                <td><input type="file" style="width: 200px" id="fileupload" name="fileupload"/></td>
            </tr>
        </table>
    </form>
</div>

<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/busi/orderDetail/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="where"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
        <input type="text" name="contract_id"/>
    </form>
</div>

<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
</body>
<script>

    //下拉框相对定位
    $.ligerDefaults.ComboBox.absolute = false;

    var mst_id = '${mst_id}';

    var SELECTED = 'selected';

    //缓存数据
    var manager = {};
    var setValue = {};
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


    //上下文路径
    var basePath = rootPath + '/tms/busi/orderDetail/';

    //页面元素
    var $filterForm = $("#filterForm"),
            $toptoolbar = $("#toptoolbar"),
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"), //显示表格
            $uploadDlg = $("#uploadDlg");

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            mainGrid, //列表
            uploadDlg,
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
                    type: 'select',
                    ext: {
                        url: basePath + 'getItemDetail',
                        dataGetter: function (result) {
                            return result.data;
                        },
                        onSelected: function (val, text, data) {
                            if (!val || !data) {return;}
                            setValue.name = data.fname;
                            setValue.type = data.type_code;
                            setValue.standard = data.spec;
                            setValue.qty = 0;
                            setValue.price = 0;
                            setValue.amount = 0;
                            setValue.unit = 0;
                            setValue.volume = 0;
                            setValue.weight = data.weight || 0;
                        },
                        textField: 'code',
                        valueField: 'code',
                        autocomplete: true,
                        highLight: true,
                        cancelable: true,
                        keySupport: true
                    }
                }
            },
            {
                display: '货物类型', name: 'type', align: 'left', minWidth: 50, width: '10%',
                editor: {
                    type: 'select',
                    data: data_cargo_type,
                    ext: {
                        autocomplete: true,
                        highLight: true,
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
                        minValue: 0,
                        defaultValue: 0
                    }
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum.toFixed(2);
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
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum.toFixed(2);
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
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum.toFixed(2);
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
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'avg', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.avg.toFixed(2);
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
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return e.sum.toFixed(2);
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
        clickToEdit: false,
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
        sortOrder: 'ASC',
        colDraggable: true,
        localStorageName: 'orderDetailMian' + user.id,
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
            //立即编辑立即更新模式
            var data = {
                pk_id: e.record.pk_id,
                columnname: e.column.columnname
            };
            data[e.column.columnname] = e.value;

            //判断值是否改变
            if (manager.lastRecord && manager.lastRecord[data.columnname] === e.value) {
                LG.tip("值未改变");
                return;
            }
            if ( Object.keys(setValue).length > 0) {
                $.extend(data, setValue);
                data.columnname += ',' + Object.keys(setValue).join(',');
            }
            LG.ajax({
                url: basePath + 'update',
                data: JSON.stringify(data, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function () {
                    mainGrid.updateRow(e.rowindex, $.extend(e.record, data));
                    mainGrid.isDataChanged = false;
                },
                error: function (msg) {
                }
            });
        },
        onBeforeEdit: function (editParm) {
            if (disabledButtons.indexOf('update') >= 0) return false;
            var g = this, p = this.options;
            var column = editParm.column,
                    record = editParm.record;
            setValue = {};
            //记录修改前的值
            manager.lastRecord = $.extend({}, record);
            return true;
        }
    };

    //导入失败对话框
    var dialogOption_importFail = {
        target: $("#importFailDialog"),
        title: '导入结果',
        width: 500, height: 120,
        buttons: [
            {
                text: '查看详细',
                onclick: function (item, dialog) {
                    failForm.submit();
                }
            },
            {
                text: '取消',
                onclick: function (item, dialog) {
                    dialog.hidden();
                }
            }
        ]
    };

    var filterFormOption = {
        //搜索框绑定信息
        searchBind: {
            //搜索按钮ID
            searchBtnId: "searchBtn",
            //重置按钮ID
            resetBtnId: "resetBtn",
            //绑定表格ID
            bindGridId: "mainGrid"
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
            {id: 'add', text: '增加', click: defaultAction, icon: 'add', status: ['OP_INIT']},
            {id: 'delete', text: '删除', click: defaultAction, icon: 'delete', status: ['OP_INIT']},
            {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']},
            {
                text: '导入导出',
                icon: 'dataimport',
                menu: {
                    items: [
                        {id: 'excelTmpl', text: '模板下载', click: excelTmpl, status: ['OP_INIT']},
                        {id: 'excelImport', text: '货物导入', click: excelImport, status: ['OP_INIT']},
                        {id: 'excelExport', text: '货物导出', click: excelExport, status: ['OP_INIT']}
                    ]
                }
            }
        ]
    };

    /**
     * 模板下载
     */
    function excelTmpl() {
        //Excel模板下载
        $("#download").submit();
    }

    /**
     * 模板导入
     */
    function excelImport() {
        //Excel模板导入
        if (!uploadDlg) {
            uploadDlg = $.ligerDialog.open({
                target: $uploadDlg,
                title: '导入货物',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {
                        text: '导入', onclick: function () {
                        upload();
                    }
                    },
                    {
                        text: '取消', onclick: function () {
                        uploadDlg.hide();
                    }
                    }
                ]
            });
        } else {
            uploadDlg.show();
        }

        /**
         *
         * @param cover 是否覆盖旧记录
         * @returns {boolean}
         */
        function upload(cover) {
            // 上传文件
            var filepath = $("#fileupload").val();
            // debugger;
            if (filepath == "") {
                LG.showError("请选择上传文件");
                return false;
                return false;
            } else {
                var stuff = filepath.match(/^(.*)(\.)(.{1,8})$/)[3];
                var type = "xls,xlsx";
                if (type.indexOf(stuff) < 0) {
                    LG.showError('文件类型不正确,只能上传xls或xlsx');
                    return;
                }
            }
            var url = basePath + 'excelImport/' + mst_id;

            uploadDlg.hide();
            LG.showLoading('正在上传中...');

            var formData = new FormData();
            var uform = $("#uploadForm");
            formData.append(
                    'excel',
                    JSON2.stringify({
                        name: 'fileupload', //上传控件名称
                        cover: cover || false, //是否覆盖
                        only_contain: true,
                        ignore_error: true,
                        meta: {
                            "物料名称": "name",
                            "物料代码": "code",
                            "货物类型": "type",
                            "规格型号": "standard",
                            "数量": "qty",
                            "重量": "weight",
                            "体积": "volume",
                            "价格": "price",
                            "金额": "amount",
                            "单位": "unit",
                            "批次号": "batch_no",
                            "备注": "remark"
                        },
                        header_row: 1,
                        data_start_row: 2
                    })
            );

            //选中的文件
            uform.find('input[type=file]').each(function (i, item) {
                var field_name = $(this).attr('name');
                var files = item.files;
                if (files && files.length > 0) {
                    for (var f = 0; f < files.length; f++) {
                        formData.append(field_name, files[f]);
                    }
                }
            });

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (result) {
                    if (result.error) {
                        var op = $.extend({}, dialogOption_importFail, {content: result.message});
                        LG.hideLoading();
                        //显示查看详细的按钮
                        if (result.data) {
                            $("#failForm").attr("action", result.data);
                            $.ligerDialog.open(op);

                            mainGrid.reload();

                        } else {
                            LG.showError(result.message);
                        }
                    } else {
                        LG.hideLoading();
                        LG.tip(result.message);
                        mainGrid.reload();
                    }
                },
                error: function (message) {
                }
            });
        }
    }

    /**
     * 模板导出
     */
    function excelExport() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/busi/orderDetail/excelExport");
        var weee = JSON2.stringify({"op":"and","rules":[{"op":"like","field":"mst_id","value":mst_id,"type":"text","datatype":"","ignore":false}],"groups":[]});
        xlsUtil.exp($('#download'), mainGrid, "货物信息.xls", {where: weee});
    }

    function defaultAction(item) {
        switch (item.id) {
            case "add":

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
                break;
            case "delete":
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

                            LG.showSuccess('删除成功');
                            //刷新角色列表
                            mainGrid.deleteSelectedRow();
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;
            case "refresh":
                mainGrid.reload();
                break;
        }
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
