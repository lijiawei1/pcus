<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/2
  Time: 18:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>客户模板</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="/css/city-picker/city-picker.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <link href="/css/jquery-ui-css/Gray/jquery-ui-1.8.21.custom.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <style type="text/css">
        ul.ui-autocomplete {
            z-index: 9999;
        }

        /*更改普通输入框样式*/
        .l-form .l-text,
        .l-form .l-textarea,
        .l-form .l-textarea:hover,
        .l-form .l-textarea:focus {
            border-color: #cecece;
            background-image: none;
        }

        /*更改只读样式*/
        .l-form .l-text-readonly .l-text-field,
        .l-form .l-text-disabled .l-text-field {
            color: #000;
        }

        .l-form .l-text-readonly, .l-form .l-text-disabled {
            background-color: transparent;
            border-color: transparent;
        }

        .form-wrapper {
            width: 100%;
            height: 100%;
            padding-top: 0px;
            padding-bottom: 35px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
<%--<ol class="breadcrumb container" id="breadcrumb">--%>
    <%--<span>当前位置：</span>--%>
    <%--<li>${pp.module}</li>--%>
    <%--<li class="active">${pp.function}</li>--%>
    <%--<li class="active"><a href="javascript:void(0);">${pp.detailFunction}</a></li>--%>
<%--</ol>--%>

<div id="layout">
    <div class="toolbar-wrapper">
        <div class="l-toolbar" id="topToolBar">
            <!-- <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon l-panel-btn-refresh" onclick="refresh();" id="btnRefresh">
                <span>刷新</span>
                <div class="l-icon l-icon-refresh"></div>
            </div>
            <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" onclick="save();">
                <span>保存</span>
                <div class="l-icon l-icon-save"></div>
            </div>
            <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" onclick="setState();">
                <span id="stateName">失效</span>
                <div id="stateIcon" class="l-icon l-icon-stop"></div>
            </div>
            <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" onclick="myback();">
                <span>返回</span>
                <div class="l-icon l-icon-backtrack"></div>
            </div> -->
        </div>
    </div>
    <div class="form-wrapper">
        <div class="form-wrapper-inner">
            <form id="mainForm"></form>
        </div>
    </div>
</div>
</body>

<script src="${path}/js/lib/city-picker/city-picker.data.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms/jquery-ui.min.js?t=${applicationScope.sys_version}"></script>
<script type="text/javascript">
    var basePath = rootPath + '/tms/bas/template/';
    var $mainForm = $("#mainForm");

    //页面-父容器(考虑滚动条),labelWidth,space
    var defaultFieldWidth = (function getInputWidth(diff, lw, sw) {
        var clientWidth = document.documentElement.clientWidth,
                w,
                n;
        if (clientWidth > 1366) {
            n = 4;
        }
        else {
            n = 3;
        }
        w = Math.floor((clientWidth - ((lw + sw) * n + diff)) * (Math.floor(100 / n)) / 100);//截取小数点后两位（向下取整）

        var o = {
            lw: lw,
            sw: sw,
            w1: w,
            w2: (w << 1) + lw + sw, //2倍
            w3: (w + lw + sw) * 2 + w,//3倍
            wA: (w + lw + sw) * (n - 1) + w//整行
        };

        if (o.w3 > o.wA) o.w3 = o.wA;

        return o;
    })(89, 120, 30);

    var data_dict = ${dict};
    var price_base = priceBaseUtil.processPriceBase(data_dict);
    var data_cargo_unit = priceBaseUtil.processCargoUnit(price_base.remap);

    var remap_price_base = price_base.remap,
        data_price_base = price_base.base,
        template = ${template},
        bs_type_code = template.type,
        data = {
            data_clients: ${clients},
            data_clientLinkmans: ${clientLinkmans},
            data_suppliers: ${suppliers},
            data_dict: ${dict},
            data_loadOrg: ${loadOrg},
            data_cargo_unit: data_cargo_unit
        },
        form_group = null,
        form_template = null;
</script>
<script src="${path}/js/tms/busi/order/orderTemplate.js?t=${applicationScope.sys_version}"></script>
<script>
    var toptoolbar = LG.powerToolBar($('#topToolBar'), {
        items: [
            { id: 'save', text: '保存', click: save, icon: 'save'},
            { id: 'unUse', text: template.state === 'STATE_11_USE'? '失效' : '使用', click: setState, icon: template.state === 'STATE_11_USE'? 'stop' : 'use', status: ['OP_INIT']},
            { id: 'refresh', text: '刷新', click: refresh, icon: 'refresh'},
            { id: 'hasicon', text: '返回', click: myback, icon: 'backtrack'}
        ]
    });
    fields[0].options.readonly = true;

    var mainForm = $mainForm.ligerForm({
        inputWidth: defaultFieldWidth.w1,
        labelWidth: defaultFieldWidth.lw,
        space: defaultFieldWidth.sw,
        labelAlign: "right",
        fields: fields, //加载不同的单据类型
        validate: true,
        toJSON: JSON2.stringify
    });

    mainForm.setFieldValidate("supplier_name", {required: true});
   // mainForm.setEnabled(['client_name'], false);

    //条件判断
    $mainForm.find('input[name="cntr_drop_trailer"]').on('change', function (e) {

        //判断选中甩挂
        if ($(this).prev().hasClass("l-checkbox-checked")) {
            //甩挂，不需要填还柜地址
            mainForm.setFieldValidate('gate_in_dock_c', {required: false});
        } else {
            mainForm.setFieldValidate('gate_in_dock_c', {required: true});
        }
    });

    var $unload_citypicker = $mainForm.find("input[name=unload_pca]");
    var $unload_citypicker_parent = $unload_citypicker.parent();
    var $load_citypicker = $mainForm.find("input[name=load_pca]");
    var $load_citypicker_parent = $load_citypicker.parent();
    (function () {
        //初始化扩展的控件
        $mainForm.find('input[name="unload_address"]').autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: rootPath + "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="unload_address"]').val())
                    + "&region=" + encodeURIComponent($unload_citypicker_parent.find('span[data-count=city]').text()),
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) {
                        return data;
                    },
                    success: function (data) {
                        response($.map(data.data, function (item) {

                            return {
                                label: item.address,
                                value: item.address,
                                province: item.province,
                                city: item.city,
                                area: item.district
                            }
                        }))
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },

                });
            },
            select: function (event, ui) {
                // 判断是否为空
                // if ($('span[data-count=province]').text().length == 0) {
                setCityData($unload_citypicker, {
                    province: ui.item.province,
                    city: ui.item.city,
                    district: ui.item.area
                });
            }
        });

        //初始化扩展的控件
        $mainForm.find('input[name="load_address"]').autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: rootPath + "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="load_address"]').val())
                    + "&region=" + encodeURIComponent($load_citypicker_parent.find('span[data-count=city]').text()),
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) {
                        return data;
                    },
                    success: function (data) {
                        response($.map(data.data, function (item) {

                            return {
                                label: item.address,
                                value: item.address,
                                province: item.province,
                                city: item.city,
                                area: item.district
                            }
                        }))
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },

                });
            },
            select: function (event, ui) {
                // 判断是否为空
                // if ($('span[data-count=province]').text().length == 0) {
                setCityData($load_citypicker, {
                    province: ui.item.province,
                    city: ui.item.city,
                    district: ui.item.area
                });
            }
        });

        //初始化城市选择
        $unload_citypicker.citypicker();
        $load_citypicker.citypicker();
    })()

    function setCityData($dom, data) {
        $dom.citypicker('reset');
        $dom.citypicker('destroy');
        $dom.citypicker(data);

    }

    //返回
    function myback() {
        var p$ = parent.$;
        p$("#templateGridSub").remove();
        p$("#templateGrid").show()[0].contentWindow.$("body").trigger("backFromSubPage");
    }
    //刷新
    function refresh() {
        LG.ajax({
            url: basePath + "loadData/" + template.pk_id,
            // data: {pk_id: pk_id},
            success: function (agg, msg) {
                var data = agg.data;
                template = agg.template;
                toptoolbar._render();
                mainForm.setData(data);
                mainForm.setData({
                    'load_linkman': data.load_linkman,
                    'load_mobile': data.load_mobile,
                    'load_address': data.load_address,
                    'load_region': data.load_region
                });
                setCityData($unload_citypicker, {
                    province: data.unload_province,
                    city: data.unload_city,
                    district: data.unload_area
                });

                setCityData($load_citypicker, {
                    province: data.load_province,
                    city: data.load_city,
                    district: data.load_area
                });
            },
            error: function (msg) {
            }
        });
    }

    //回单
    function save() {
        if (mainForm.valid()) {

            //省市区数据
            var pcaData = {
                unload_province: $unload_citypicker_parent.find("span[data-count=province]").text(),
                unload_city: $unload_citypicker_parent.find("span[data-count=city]").text(),
                unload_area: $unload_citypicker_parent.find("span[data-count=district]").text(),
                load_province: $load_citypicker_parent.find("span[data-count=province]").text(),
                load_city: $load_citypicker_parent.find("span[data-count=city]").text(),
                load_area: $load_citypicker_parent.find("span[data-count=district]").text()
            };


            var mainData = mainForm.getData();

            //获取客户和揽货公司主键
            var clients = $.grep(data.data_clients, function (d, i) {
                return d.text == mainData.client_name;
            });
            var suppliers = $.grep(data.data_suppliers, function (d, i) {
                return d.text == mainData.supplier_name;
            });
            var idset = {
                client_id: clients.length > 0 ? clients[0].id : '',
                supplier_id: suppliers.length > 0 ? suppliers[0].id : ''
            };

            var formData = $.extend({}, manager.data, mainForm.getData(), pcaData, idset,
                    {template_id: template.pk_id});

            LG.ajax({
                url: basePath + "save",
                data: JSON.stringify(formData, DateUtil.datetimeReplacer),
                contentType: "application/json",
                success: function (data, msg) {
                    refresh();
                    LG.tip('保存成功!');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        }
    }

    function setState() {

        if (mainForm.valid()) {


            //省市区数据
            var pcaData = {
                unload_province: $unload_citypicker_parent.find("span[data-count=province]").text(),
                unload_city: $unload_citypicker_parent.find("span[data-count=city]").text(),
                unload_area: $unload_citypicker_parent.find("span[data-count=district]").text(),
                load_province: $load_citypicker_parent.find("span[data-count=province]").text(),
                load_city: $load_citypicker_parent.find("span[data-count=city]").text(),
                load_area: $load_citypicker_parent.find("span[data-count=district]").text()
            };

            var formData = $.extend({}, manager.data, mainForm.getData(), pcaData, {
                template_id: template.pk_id
            });

            var newState = template.state == TMS_STATE.STATE_11_USE ? TMS_STATE.STATE_15_INVALID : TMS_STATE.STATE_11_USE;
            template = $.extend(template, {state: newState});

            LG.ajax({
                url: basePath + "changeState",
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify({ template: template, data: formData}),
                success: function (state, message) {
                    LG.showSuccess('操作成功!', function () {
                         location.reload();
                    });
                    // refresh();
                    // 按钮
                    // if (state == "STATE_11_USE") {
                    //     $("#stateName").text("失效");
                    //     $("#stateIcon").removeClass("l-icon-use").addClass("l-icon-stop");
                    //     //隐藏按钮
                    //     $("#btn_add").remove();
                    // }
                    // else {
                    //     $("#stateName").text("使用");
                    //     $("#stateIcon").removeClass("l-icon-stop").addClass("l-icon-use");
                    //     //显示按钮
                    // }
                    // LG.tip('操作成功')
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        }
    }

    //加载数据
    refresh();
</script>
</html>
