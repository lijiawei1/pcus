<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/26
  Time: 15:25
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>订单明细</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .content-wrapper{
            height: calc( (100vh - 55px) / 2);
        }
        .l-panel-header-text{
            padding-left: 0;
        }

        .l-panel-header{
            display: none;
        }
        .grid-wrapper{
            font-size: 0;
        }
        .l-panel-title{
            width: 24px;
            height:100%;
            display: inline-block;
            vertical-align: top;
            margin-top: -1px;
            font-size: 12px;
            font-weight: bold;
            line-height: 200%;
            background-color: #e1edfc;
            border: 1px solid #d6d6d6;
            border-right: none;
            /*border-bottom-right-radius: 15px;;*/
        }
        .l-panel-title p{
            writing-mode: tb-rl;
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            padding: 10px  0;
        }
        .l-panel{
            display: inline-block;
            font-size:12px;
        }

        .combobox-list-item {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
        }


        .combobox-list-item.car_no-item {
            width: 20%;
            min-width: 60px;
        }

        .combobox-list-item.car_no-item.seq {
            width: 5%;
            min-width: 10px;
        }

        .combobox-list-item.driver_name-item.item1 {
            width: 15%;
        }

        .combobox-list-item.driver_name-item.item2 {
            width: 25%;
        }

        .combobox-list-item.driver_name-item.item3 {
            width: 25%;
        }

        .combobox-list-item.driver_name-item.item4 {
            width: 22%;
        }
    </style>
</head>
<body>
<div id="layout">
    <div class="toolbar-wrapper">
        <div id="toptoolbar"></div>
    </div>
    <!-- 卡片界面 -->
    <div class="content-wrapper grid-wrapper">
        <!-- 应收列表界面 -->
        <div class="l-panel-title"><p>应收列表</p></div>
        <div id="chargeGrid"></div>
    </div>
    <div class="content-wrapper grid-wrapper">
        <!-- 应付列表界面 -->
        <div class="l-panel-title"><p>应付列表</p></div>
        <div id="payGrid"></div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
</body>
<script>

    //主表主键
    var mst_id = "${mst_id}";
    var data_order = ${order};


    //字典数据
    var data_dict = ${dict};

    //车辆数据
    var data_car = ${car};

    //承运方数据
    var data_suppliers = ${suppliers};
    var data_carriers = ${carriers};
    var data_clients = ${clients};

    var price_base = priceBaseUtil.processPriceBase(data_dict);
    var remap_price_base = price_base.remap;
    var data_price_base = price_base.base;

    //获取计量单位联动map
    // var remap_price_base = {};

    //计价基准:获取计量单位
    // var data_price_base = $.grep(data_dict.price_base, function(item) {
     //    return !item.pdictmx_code;
    // });

    // var array_price_unit = $.grep(data_dict.price_base, function (item) {
    //     return !!item.pdictmx_code;
    // });
    // for (var i = 0; i < data_price_base.length; i++) {
    //    var base = data_price_base[i];
    //    remap_price_base[base.id] = base;
    //    base.unitMap = {};
    //    base.unitList = $.grep(array_price_unit, function(item) {
    //        var flag = item.pdictmx_code === base.id;
    //       if (flag) {
    //            base.unitMap[item.id] = item;
    //        }
    //       return flag;
    //    });
    // };

</script>
<script src="${path}/js/tms/busi/front/frontOrderArap.js?t=${applicationScope.sys_version}"></script>
</html>
