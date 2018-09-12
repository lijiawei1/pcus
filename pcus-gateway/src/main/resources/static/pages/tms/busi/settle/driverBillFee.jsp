<%--
  Created by IntelliJ IDEA.
  User: Eis
  Date: 2018/3/14
  Time: 10:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>child</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .l-toolbar {
            padding: 5px;
            background-color: #d6dae6;
            width: 100%;
        }

        .l-search {
            border-radius: 10px;
            padding: 10px;
            background-color: #fff;
        }

        .l-main {
            width: calc(100% - 4px);
            margin: 0 auto;
            height: 100%;
        }

        .charge {
            background-color: #2eb960;
        }

        .pay {
            color: #ffffff;
            background-color: #C00000;
        }

        .return-bill {
            background-color: #fcc;
        }

        .grid-check {
            margin: 8px;
        }
    </style>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div class="tabWrapper">
    <div class="tabWrapper-inner">
        <div id="mainTab">
            <div tabid="chargeTab" title="费用明细" lselected="true">
                <div id="chargeBox" class="l-main">
                    <form id="chargeSearch" class="l-search"></form>
                    <div id="chargeTool"></div>
                    <div id="chargeGrid"></div>
                </div>
            </div>
            <div tabid="receiptTab" title="关联单据">
                <div id="receiptBox" class="l-main">
                    <form id="receiptSearch" class="l-search"></form>
                    <div id="receiptTool"></div>
                    <div id="receiptGrid"></div>
                </div>
            </div>
            <div tabid="checkTab" title="核对单据">
                <div id="checkBox" class="l-main">
                    <form id="checkSearch" class="l-search"></form>
                    <div id="checkTool"></div>
                    <div id="checkGrid"></div>
                </div>
            </div>
            <div tabid="logTab" title="操作日志" data-url='${path}/tms/bas/log/loadLogCommonPage?bill_id=${mst_id}'>
                <iframe frameborder="0" name="logGrid"></iframe>
            </div>
        </div>
    </div>
</div>

<!-- excel导出 -->
<div class="dialog-container" style="display: none;">
    <form id="download" method="POST" target="_blank" action="${path}/tms/settle/driver/excelExport">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="where"/>
        <input type="text" name="footers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

</body>
<script>
    $('#mainTab').ligerTab({
        height: '100%',
        width: '100%',
        heightDiff: -6,
        changeHeightOnResize: true,
        onAfterSelectTabItem: afterSelectTabItem
    });

    // 标签切换事件
    // tabid  对应的标签id
    function afterSelectTabItem(tabid) {
        var $tg = $(".l-tab-content [tabid='" + tabid + "']");
        if ($tg.attr("data-init") !== "init") {
            $tg.children(".l-tab-loading").show();
            var gridName = tabid.replace('Tab', '');
            var gridDom = liger.get(gridName + 'Grid');
            var formDom = liger.get(gridName + 'Search');
            if (gridDom && formDom) {
                gridDom.resetColumnsWidth();
                search(formDom, gridDom);
            } else {
                $tg.children("iframe").attr("src", $tg.attr("data-url")).end().attr("data-init", "init");
            }
        }
    }

    var chargePath = rootPath + '/tms/settle/driverBillFee/';

    var mstId = `${mst_id}`;
    var contract_tc = ${contract_tc};
    var data_bs_type_name = ${busiType}, //业务类型
            data_state = ${state}, //单据状态
            data_clients = ${clients}, //客户
            data_drivers = ${drivers},  //司机
            data_suppliers = ${suppliers}, //供应商
            data_luas = ${luas},    //装卸地
            data_car = ${car},  //车牌号
            data_dict = ${dict}; //数据字典

    var months = [{"text": '01'}, {"text": '02'}, {"text": '03'}, {"text": '04'}, {"text": '05'}, {"text": '06'}, {"text": '07'}, {"text": '08'}, {"text": '09'}, {"text": '10'}, {"text": '11'}, {"text": '12'}];

    $(function () {
        var chargeSearch, chargeToolbar, chargeGrid;
        var receiptSearch, receiptToolbar, receiptGrid;
        var checkSearch, checkTool, checkGrid;
        var mainGrid;

        var filterFormFieldWidth = {
            w1: 155,
            w2: 310,
            w3_2: 405
        };

        var where = {
            op: 'and',
            rules: [],
            groups: []
        };

        var defaultSearchFilter = {
            and: [],
            or: []
        };

        mainGrid = $('#mainGrid').ligerGrid({
            columns: [],
            options: [],
            parms: [{
                name: 'where',
                value: JSON.stringify(where)
            }],
            sortName: 'STATE',
            sortOrder: 'ASC'
        });

        var gridColumnOption = [
            {
                display: '发生日期',
                name: 'settle_date', minWidth: 150, width: 150
            }, {
                display: '柜号',
                name: 'cntr_no', minWidth: 100, width: 100
            }, {
                display: '车牌',
                name: 'car_no', minWidth: 70, width: 70
            },
            {display: '司机', name: 'driver_name', minWidth: 60, width: 80},
            {
                display: '产值',
                name: 'driver_output', minWidth: 100, width: 100,
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '公里数',
                name: 'gls', minWidth: 100, width: 100,
                render: function (data, index, val) {
                    var result = new Number(data.gls);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '合计',
                name: 'hj', minWidth: 100, width: 100,
                render: function (data, index, val) {
                    var result = new Number(data.hj);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '油补',
                name: 'yb', minWidth: 100, width: 100,
                render: function (data) {
                    var result = new Number(data.yb);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '基本工资RMB',
                name: 'jbgz', minWidth: 100, width: 100,
                render: function (data) {
                    var result = new Number(data.jbgz);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '产值提成',
                name: 'output_tc', minWidth: 100, width: 100,
                render: function (data) {
                    var result = new Number(data.output_tc);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '运费',
                name: 'yf', minWidth: 100, width: 100,
                render: function (data) {
                    var result = new Number(data.yf);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '税金',
                name: 'tax_amount', minWidth: 100, width: 100,
                render: function (data, index, val) {
                    var result = new Number(data.tax_amount);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '客户',
                name: 'client_name', minWidth: 150, width: 150
            }, {
                display: '操作人',
                name: 'create_psn', minWidth: 100, width: 100
            }, {
                display: '单号',
                name: 'trans_no', minWidth: 120, width: 120
            }, {
                display: '业务类型',
                name: 'bs_type_name', minWidth: 120, width: 120
            }, {
                display: '订舱号',
                name: 'booking_no', minWidth: 120, width: 120
            }, {
                display: '客户委托号',
                name: 'client_bill_no', minWidth: 120, width: 120
            }, {
                display: '车型',
                name: 'cntr_type', minWidth: 80, width: 80
            }, {
                display: '封条号',
                name: 'cntr_seal_no', minWidth: 120, width: 120
            }, {
                display: '运输线路',
                name: 'trans_line', minWidth: 150, width: 200
            }, {
                display: '装卸单位',
                name: 'load_unload_org', minWidth: 150, width: 200
            }, {
                display: '提柜码头',
                name: 'gate_out_dock', minWidth: 150, width: 200
            }, {
                display: '还柜码头',
                name: 'gate_in_dock', minWidth: 150, width: 200
            }, {
                display: '体积',
                name: 'cargo_volume', minWidth: 80, width: 80,
                render: function (data, index, val) {
                    var result = new Number(data.cargo_volume);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                }
            }, {
                display: '重量',
                name: 'cargo_weight', minWidth: 80, width: 80,
                render: function (data, index, val) {
                    var result = new Number(data.cargo_weight);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                }
            }, {
                display: '数量',
                name: 'cargo_qty', minWidth: 80, width: 80,
                render: function (data, index, val) {
                    var result = new Number(data.cargo_qty);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                }
            }, {
                display: '揽货公司',
                name: 'supplier_name', minWidth: 150, width: 200
            }, {
                display: '操作单位',
                name: 'oper_unit_name', minWidth: 150, width: 200
            }, {
                display: '创建人',
                name: 'cjr', minWidth: 100, width: 100,
                render: function (data) {
                    return data.create_psn
                }
            }, {
                display: '创建时间',
                name: 'create_time', minWidth: 150, width: 150
            }
        ];

        var checkGridColumnOption = [
            {
                display: '发生日期',
                name: 'settle_date', minWidth: 150, width: 150
            }, {
                display: '柜号',
                name: 'cntr_no', minWidth: 100, width: 100
            }, {
                display: '车牌',
                name: 'car_no', minWidth: 80, width: 80
            },
            {display: '司机', name: 'driver_name', minWidth: 80, width: 80},
            {
                display: '产值',
                name: 'total_amount', minWidth: 100, width: 100,
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return "合计：" + e.sum;
                    }
                }
            }, {
                display: '合计',
                name: 'hj', minWidth: 100, width: 100,
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '基本工资RMB',
                name: 'jbgz', minWidth: 100, width: 100,
                render: function (data) {
                    var result = new Number(data.jbgz);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                        return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '产值提成',
                name: 'output_tc', minWidth: 100, width: 100,
                render: function (data) {
                    var result = new Number(data.output_tc);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                         return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '税金',
                name: 'tax_amount', minWidth: 100, width: 100,
                render: function (data, index, val) {
                    var result = new Number(data.tax_amount);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                },
                totalSummary: {
                    align: 'center', //汇总单元格内容对齐方式:left/center/right
                    type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                    render: function (e) {
                        //汇总渲染器，返回html加载到单元格
                        //e 汇总Object(包括sum,max,min,avg,count)
                         return parseFloat(e.sum.toFixed(2));
                    }
                }
            }, {
                display: '客户',
                name: 'client_name', minWidth: 80, width: 80
            }, {
                display: '操作人',
                name: 'create_psn', minWidth: 80, width: 80
            }, {
                display: '单号',
                name: 'trans_no', minWidth: 100, width: 100
            }, {
                display: '业务类型',
                name: 'bs_type_name', minWidth: 100, width: 100
            }, {
                display: '订舱号',
                name: 'booking_no', minWidth: 100, width: 100
            }, {
                display: '客户委托号',
                name: 'client_bill_no', minWidth: 120, width: 120
            }, {
                display: '车型',
                name: 'cntr_type', minWidth: 80, width: 80
            }, {
                display: '封条号',
                name: 'cntr_seal_no', minWidth: 120, width: 120
            }, {
                display: '运输线路',
                name: 'trans_line', minWidth: 150, width: 200
            }, {
                display: '装卸单位',
                name: 'load_unload_org', minWidth: 150, width: 200
            }, {
                display: '提柜码头',
                name: 'gate_out_dock', minWidth: 100, width: 100
            }, {
                display: '还柜码头',
                name: 'gate_in_dock', minWidth: 100, width: 100
            }, {
                display: '体积',
                name: 'cargo_volume', minWidth: 100, width: 100,
                render: function (data, index, val) {
                    var result = new Number(data.cargo_volume);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                }
            }, {
                display: '重量',
                name: 'cargo_weight', minWidth: 100, width: 100,
                render: function (data, index, val) {
                    var result = new Number(data.cargo_weight);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                }
            }, {
                display: '数量',
                name: 'cargo_qty', minWidth: 100, width: 100,
                render: function (data, index, val) {
                    var result = new Number(data.cargo_qty);
                    return isNaN(result) ? '数据出错' : result.toFixed(2);
                }
            }, {
                display: '船公司',
                name: 'ship_corp', minWidth: 100, width: 100
            }, {
                display: '船名',
                name: 'ship_name', minWidth: 100, width: 100
            }, {
                display: '航次',
                name: 'voyage', minWidth: 100, width: 100
            }, {
                display: '揽货公司',
                name: 'supplier_name', minWidth: 150, width: 150
            }, {
                display: '操作单位',
                name: 'oper_unit_name', minWidth: 150, width: 150
            }, {
                display: '创建人',
                name: 'cjr', minWidth: 80, width: 80,
                render: function (data) {
                    return data.create_psn
                }
            }, {
                display: '创建时间',
                name: 'create_time', minWidth: 150, width: 150
            }
        ];

        var searchFieldOptions = [{
            display: '揽货公司',
            name: 'supplier_id',
            type: 'select',
            newline: false,
            options: {
                autocomplete: true,
                highLight: true,
                keySupport: true,
                data: data_suppliers
            }
        }, {
            display: "发生日期",
            name: "settle_date_s",
            newline: false,
            type: "date",
            attr: {
                "data-name": "settle_date",
                op: "greaterorequal" //操作符
            }
        }, {
            display: "至",
            name: "settle_date_e",
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
                "data-name": "settle_date",
                op: "lessorequal" //操作符
            }
        }, {
            display: '业务类型',
            name: 'bs_type_code',
            type: 'select',
            newline: false,
            options: {
                data: data_bs_type_name
            }
        }, {
            display: '提柜码头',
            name: 'gate_out_dock',
            type: 'select',
            newline: false,
            options: {
                autocomplete: true,
                highLight: true,
                keySupport: true,
                data: data_luas
            }
        }, {
            display: '还柜码头',
            name: 'gate_in_dock',
            type: 'select',
            newline: false,
            options: {
                autocomplete: true,
                highLight: true,
                keySupport: true,
                data: data_luas
            }
        }, {
            display: '客户名称',
            name: 'client_id',
            type: 'select',
            newline: false,
            options: {
                autocomplete: true,
                highLight: true,
                keySupport: true,
                data: data_clients
            }
        }, {
            display: '司机',
            name: 'driver_id',
            type: 'select',
            newline: false,
            options: {
                autocomplete: true,
                highLight: true,
                keySupport: true,
                data: data_drivers
            }
        }, {
            display: '车牌号',
            name: 'car_no',
            type: 'select',
            newline: false,
            options: {
                autocomplete: true,
                highLight: true,
                keySupport: true,
                valueField: 'text',
                data: data_car
            }
        }, {
            display: '封条号',
            name: 'cntr_seal_no',
            newline: false
        }, {
            display: '任务单号',
            name: 'trans_no',
            newline: false
        }];

        chargeGrid = $('#chargeGrid').ligerGrid({
            columns: [
                {
                    display: '收/付款',
                    name: 'charge_or_pay', minWidth: 60,
                    render: function (item) {
                        if (item.charge_or_pay == '收') {
                            return '<div class="charge">' + item.charge_or_pay + '</div>';
                        }
                        else if (item.charge_or_pay == '付') {
                            return '<div class="pay">' + item.charge_or_pay + '</div>';
                        }
                        return item.charge_or_pay;
                    }
                }, {
                    display: '费用名称',
                    name: 'fee_name', minWidth: 100, width: 150
                }, {
                    display: '单价',
                    name: 'price', minWidth: 80, width: 80
                }, {
                    display: '数量',
                    name: 'qty', minWidth: 60, width: 60,
                    render: function (value) {
                        return Math.abs(value.qty);
                    },
                    totalSummary: {
                        align: 'center', //汇总单元格内容对齐方式:left/center/right
                        type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                        render: function (e) {
                            //汇总渲染器，返回html加载到单元格
                            //e 汇总Object(包括sum,max,min,avg,count)
                             return parseFloat(e.sum.toFixed(2));
                        }
                    }
                }, {
                    display: '含税',
                    name: 'contain_tax', minWidth: 60, width: 60,
                    render: function (item) {
                        return '<input class="grid-check" type="checkbox" ' + (item.contain_tax == 1 ? 'checked' : '') + ' onclick="return false"/>'
                    }
                }, {
                    display: '税率(%)',
                    name: 'tax_rate', minWidth: 60, width: 60,
                    render: function (data, index, val) {
                        var result = new Number(val);
                        return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                }, {
                    display: '税金',
                    name: 'tax_amount', minWidth: 80, width: 80,
                    render: function (data, index, val) {
                        var result = new Number(val);
                        return isNaN(result) ? '数据出错' : result.toFixed(2);
                    },
                    totalSummary: {
                        align: 'center', //汇总单元格内容对齐方式:left/center/right
                        type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                        render: function (e) {
                            //汇总渲染器，返回html加载到单元格
                            //e 汇总Object(包括sum,max,min,avg,count)
                             return parseFloat(e.sum.toFixed(2));
                        }
                    }
                }, {
                    display: '金额',
                    name: 'total_amount', minWidth: 80, width: 80,
                    render: function (data, index, val) {
                        var result = new Number(val);
                        return isNaN(result) ? '数据出错' : result.toFixed(2);
                    },
                    totalSummary: {
                        align: 'center', //汇总单元格内容对齐方式:left/center/right
                        type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                        render: function (e) {
                            //汇总渲染器，返回html加载到单元格
                            //e 汇总Object(包括sum,max,min,avg,count)
                             return parseFloat(e.sum.toFixed(2));
                        }
                    }
                }, {
                    display: '汇率',
                    name: 'exchange_rate', minWidth: 60, width: 60,
                    render: function (data, index, val) {
                        var result = new Number(val);
                        return isNaN(result) ? '数据出错' : result.toFixed(2);
                    }
                }, {
                    display: '结算金额',
                    name: 'exchange_amount', minWidth: 80, width: 80,
                    render: function (data, index, val) {
                        var result = new Number(val);
                        return isNaN(result) ? '数据出错' : result.toFixed(2);
                    },
                    totalSummary: {
                        align: 'center', //汇总单元格内容对齐方式:left/center/right
                        type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                        render: function (e) {
                            //汇总渲染器，返回html加载到单元格
                            //e 汇总Object(包括sum,max,min,avg,count)
                             return parseFloat(e.sum.toFixed(2));
                        }
                    }
                }, {
                    display: '已收付金额',
                    name: 'finish_amount', minWidth: 80, width: 80,
                    render: function (data, index, val) {
                        var result = new Number(val);
                        return isNaN(result) ? '数据出错' : result.toFixed(2);
                    },
                    totalSummary: {
                        align: 'center', //汇总单元格内容对齐方式:left/center/right
                        type: 'sum', //汇总类型sum,max,min,avg ,count。可以同时多种类型
                        render: function (e) {
                            //汇总渲染器，返回html加载到单元格
                            //e 汇总Object(包括sum,max,min,avg,count)
                             return parseFloat(e.sum.toFixed(2));
                        }
                    }
                }, {
                    display: '备注',
                    name: 'remark', minWidth: 100, width: 300
                }, {
                    display: '记账公司',
                    name: 'supplier_name', minWidth: 200, width: 200
                }, {
                    display: '记账日期',
                    name: 'settle_date', minWidth: 150, width: 150
                }, {
                    display: '预付款日期',
                    name: 'plan_pay_date', minWidth: 150, width: 150
                }, {
                    display: '记账月份',
                    name: 'settle_month', minWidth: 50, width: 50
                }, {
                    display: '业务类型',
                    name: 'bs_type_name', minWidth: 50, width: 50
                }, {
                    display: '作业时间',
                    name: 'work_time', minWidth: 150, width: 150
                }, {
                    display: '计费方式',
                    name: 'fee_type_name', minWidth: 50, width: 50
                }, {
                    display: '单位',
                    name: 'fee_unit_name', minWidth: 50, width: 50
                }, {
                    display: '币种',
                    name: 'currency_name', minWidth: 50, width: 50
                }, {
                    display: '提柜码头',
                    name: 'gate_out_dock', minWidth: 100, width: 100
                }, {
                    display: '还柜码头',
                    name: 'gate_in_dock', minWidth: 100, width: 100
                }, {
                    display: '运输路线',
                    name: 'trans_line', minWidth: 100, width: 300
                }, {
                    display: '装卸单位',
                    name: 'load_unload_org', minWidth: 100, width: 200
                }, {
                    display: '业务公司', minWidth: 100, width: 150,
                    render: function (data) {
                        return data.supplier_name
                    }
                }, {
                    display: '操作单位',
                    name: 'oper_unit_name', minWidth: 150, width: 150
                }, {
                    display: '操作人',
                    name: 'create_psn', minWidth: 80, width: 80
                }, {
                    display: '客户',
                    name: 'client_name', minWidth: 80, width: 80
                }, {
                    display: '客户委托号',
                    name: 'client_bill_no', minWidth: 100, width: 100
                }, {
                    display: '车牌号',
                    name: 'car_no', minWidth: 80, width: 80
                }, {
                    display: '司机',
                    name: 'driver_name', minWidth: 80, width: 80
                }, {
                    display: '订舱单号',
                    name: 'booking_no', minWidth: 100, width: 100
                }, {
                    display: '柜号',
                    name: 'cntr_no', minWidth: 100, width: 100
                }, {
                    display: '车型',
                    name: 'cntr_type', minWidth: 80, width: 80
                }, {
                    display: '货物体积',
                    name: 'cargo_volume', minWidth: 60, width: 60
                }, {
                    display: '货物重量',
                    name: 'cargo_weight', minWidth: 60, width: 60
                }, {
                    display: '创建人',
                    name: '', minWidth: 100, width: 100,
                    render: function (data) {
                        return data.create_psn
                    }
                }, {
                    display: '创建时间',
                    name: 'create_time', minWidth: 150, width: 150
                }],
            url: chargePath + 'loadGrid/' + mstId,  // 请求链接
            checkbox: true,
            width: '100%',
            height: '100%',
            heightDiff: -15,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            localStorageName: "FuleBillChargeGrid" + user.id + param.no,  // 本地存储名字
            selectRowButtonOnly: true  // 是否只能点击复选框才能选中
        });

        receiptGrid = $('#receiptGrid').ligerGrid({
            columns: gridColumnOption,
            url: chargePath + 'loadBillGrid/' + mstId,  // 请求链接
            checkbox: true,
            width: '100%',
            height: '100%',
            heightDiff: -15,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            delayLoad: true,
            localStorageName: "DriverBillReceiptGrid" + user.id + param.no,  // 本地存储名字
            selectRowButtonOnly: true,  // 是否只能点击复选框才能选中
            sortName: 'CAR_NO, SETTLE_DATE',
            sortOrder: 'ASC, DESC'
        });

        checkGrid = $('#checkGrid').ligerGrid({
            columns: checkGridColumnOption,
            url: chargePath + 'loadNotCheckGrid/' + mstId,  // 请求链接
            onSetSuccessData: function (data) {
                var result = data.Rows.map(function (item) {
                    item['hj'] = item['total_amount'] * contract_tc;
                    return item;
                });
                console.log(data, result);
                return result;
            },
            checkbox: true,
            width: '100%',
            height: '100%',
            heightDiff: -15,
            rowHeight: 30,
            headerRowHeight: 28,
            rowSelectable: true,
            selectable: true,
            frozen: true,
            rownumbers: true,
            colDraggable: true,
            delayLoad: true,
            localStorageName: "FuelBillFeeCheckGrid" + user.id + param.no,  // 本地存储名字
            selectRowButtonOnly: true,  // 是否只能点击复选框才能选中
            parms: [{
                name: 'where',
                value: JSON.stringify(where)
            }],
            sortName: 'CAR_NO, SETTLE_DATE',
            sortOrder: 'ASC, DESC'
        });

        chargeSearch = $('#chargeSearch').ligerForm({
            fields: [{
                display: '收付款',
                name: 'charge_or_pay',
                newline: false,
                type: 'select',
                options: {
                    data: [{
                        text: '收费',
                        id: '收'
                    }, {
                        text: '付费',
                        id: '付'
                    }]
                }
            }, {
                display: '费用名称',
                name: 'fee_name',
                type: 'select',
                newline: false,
                options: {
                    valueField: 'text',
                    data: [{
                        text: '提成'
                    }, {
                        text: '基本工资'
                    }]
                }
            }, {
                display: '记账公司',
                name: 'supplier_id',
                type: 'select',
                newline: false,
                options: {
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    data: data_suppliers
                }
            }, {
                display: "记账日期",
                name: "settle_date",
                newline: false,
                type: "date",
                attr: {
                    op: "greaterorequal" //操作符
                }
            }, {
                display: "至",
                name: "settle_date_e",
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
            }, {
                display: '记账月份',
                name: 'settle_month',
                type: 'select',
                newline: false,
                options: {
                    valueField: 'text',
                    data: months
                }
            }, {
                display: '业务类型',
                name: 'bs_type_code',
                type: 'select',
                newline: false,
                options: {
                    data: data_bs_type_name
                }
            }, {
                display: '提柜码头',
                name: 'gate_out_dock',
                type: 'select',
                newline: false,
                options: {
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    data: data_luas
                }
            }, {
                display: '还柜码头',
                name: 'gate_in_dock',
                type: 'select',
                newline: false,
                options: {
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    data: data_luas
                }
            }, {
                display: '客户名称',
                name: 'client_id',
                type: 'select',
                newline: false,
                options: {
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    data: data_clients
                }
            }, {
                display: '司机',
                name: 'driver_id',
                type: 'select',
                newline: false,
                options: {
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    data: data_drivers
                }
            }, {
                display: '车牌号',
                name: 'car_no',
                type: 'select',
                newline: false,
                options: {
                    autocomplete: true,
                    highLight: true,
                    keySupport: true,
                    valueField: 'text',
                    data: data_car
                }
            }, {
                display: '客户委托号',
                name: 'client_bill_no',
                newline: false
            }, {
                display: '柜号',
                name: 'cntr_no',
                newline: false
            }, {
                display: '订舱单号',
                name: 'booking_no',
                newline: false
            }],
            buttons: [{
                text: '搜索',
                click: function () {
                    search(chargeSearch, chargeGrid)
                }
            }, {
                text: '重置',
                click: function () {
                    chargeSearch.reset();
                }
            }],
            prefixID: 'charge_'
        });

        receiptSearch = $('#receiptSearch').ligerForm({
            fields: searchFieldOptions,
            buttons: [{
                text: '搜索',
                click: function () {
                    search(receiptSearch, receiptGrid)
                }
            }, {
                text: '重置',
                click: function () {
                    receiptSearch.reset();
                }
            }],
            prefixID: 'receipt_'
        });

        checkSearch = $('#checkSearch').ligerForm({
            fields: searchFieldOptions,
            buttons: [{
                text: '搜索',
                click: function () {
                    search(checkSearch, checkGrid)
                }
            }, {
                text: '重置',
                click: function () {
                    checkSearch.reset();
                }
            }],
            prefixID: 'check_'
        });

        chargeToolbar = $('#chargeTool').ligerToolBar({
            items: [{
                text: '刷新',
                icon: 'refresh',
                click: function () {
                    search(chargeSearch, chargeGrid)
                }
            },
//                {
//                text: '导出',
//                icon: 'export',
//                click: function () {
//                    LG.showError("暂未开放")
//                }
//            },
                {
                    text: '返回',
                    icon: 'withdraw',
                    click: backPage
                }]
        });

        receiptToolbar = $('#receiptTool').ligerToolBar({
            items: [{
                text: '刷新',
                icon: 'refresh',
                click: function () {
                    search(receiptSearch, receiptGrid);
                }
            }, {
                text: '删除',
                icon: 'delete',
                click: function () {
                    removeCheack()
                }
            }, {
                text: '导出',
                icon: 'export',
                click: function () {
                    //Excel数据下载
                    $("#download").attr("action", chargePath + "excelExport/" + mstId);
                    var weee = receiptSearch.getSearchFormData(false, defaultSearchFilter);
                    xlsUtil.exp($("#download"), checkGrid, '司机计提关联单据' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {where: weee});
                }
            },
//                {
//                text: '打印',
//                icon: 'print',
//                click: function () {
//                    LG.showError('暂未开放');
//                }
//            },
                {
                    text: '返回',
                    icon: 'withdraw',
                    click: backPage
                }]
        });

        checkTool = $('#checkTool').ligerToolBar({
            items: [{
                text: '刷新',
                icon: 'refresh',
                click: function () {
                    search(checkSearch, checkGrid);
                }
            }, {
                text: '追加单据',
                icon: 'add',
                click: function () {
                    addCheack()
                }
            }, {
                text: '返回',
                icon: 'withdraw',
                click: backPage
            }]
        });

        function addCheack() {
            var datas = checkGrid.getSelecteds();
            if (datas.length < 1) {
                LG.showError('请选择数据');
                return false;
            }
            var results = [];
            for (var i = datas.length - 1; i >= 0; i--) {
                var item = datas[i];
                item.pk_id && results.push(item.pk_id)
            }

            $.ligerDialog.confirm('是否追加单据', '追加单据', function (result) {
                if (!result) {
                    return false;
                }
                LG.ajax({
                    url: chargePath + 'add',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        pay_ids: results,
                        bill_id: mstId
                    }),
                    success: function (Data) {
                        checkGrid.loadData();
                    },
                    error: LG.showError
                });
            });
        }

        function removeCheack() {
            var datas = receiptGrid.getSelecteds();
            if (datas.length < 1) {
                LG.showError('请选择数据');
                return false;
            }
            var results = [];
            var fee_codes = [];
            for (var i = datas.length - 1; i >= 0; i--) {
                var item = datas[i];
                item.pk_id && results.push(item.pk_id);
                item.fee_code && fee_codes.push(item.fee_code);
            }

            $.ligerDialog.confirm('是否删除', '删除单据', function (result) {
                if (!result) {
                    return false;
                }
                LG.ajax({
                    url: chargePath + 'remove',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        pay_ids: results,
                        bill_id: mstId,
                        fee_codes: fee_codes
                    }),
                    success: function (result) {
                        receiptGrid.loadData();
                    },
                    error: LG.showError
                });
            });
        }
    });
    /*
     *  搜索
     * @param form : 你搜索的form
     * @param grid : 你需要进行更新的表格
     * */
    function search(form, grid) {
        if (!form || !grid) {
            return;
        }
        if (!form.valid()) {
            form.showInvalid();
            return;
        }
        var where = form.getSearchFormData(false);
        grid.set('parms', [{
            name: 'where',
            value: where
        }]);
        grid.changePage('first');
        grid.loadData();
    }

    //根据url选择左侧菜单
    //需要获得fromtab(url中获得)
    function backPage() {
        var testEq = /urlid=([^&]*)/.exec(window.location.search);
        if (testEq) {
            try {
                top.tab.removeTabItem(top.tab.getSelectedTabItemID()).selectTabItem(testEq[1]);
            }
            catch (e) {
                LG.tip('功能出小差了,请手动返回.');
                console.error(e);
            }
        }
        else {
            top.topBackTrack.back();
        }
    }
</script>
</html>