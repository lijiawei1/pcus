<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>订单详细</title>
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
        .l-form .l-text-disabled .l-text-field{
            color: #000;
        }
        .l-form .l-text-readonly, .l-form .l-text-disabled {
            background-color: transparent;
            border-color: transparent;
        }
        .form-wrapper{
            padding-bottom:10px;
        }
        .l-fieldcontainer .icon-type{
            z-index: 10;
            right: -30px;
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
            <div tabid="editTab" title="单据编辑" lselected="true">
                <div class="toolbar-wrapper form-toolbar">
                    <div class="l-toolbar" id="toptoolbar"> </div>
                </div>
                <div class="form-wrapper">
                    <div class="form-wrapper-inner">
                        <form id="mainForm"></form>
                    </div>
                </div>
            </div>
            <div tabid="detailGridTab" title="货物信息" data-url="${path}/tms/busi/orderDetail/loadPage/${pk_id}">
                <iframe frameborder="0" name="detailGrid"></iframe>
            </div>
            <div tabid="transGridTab" title="关联任务" data-url="${path}/tms/busi/orderRelatedTrans/loadPage/${pk_id}">
                <iframe id="transGridTab" frameborder="0" name="transGrid"></iframe>
            </div>
            <div tabid="arapGridTab" title="费用信息" data-url="${path}/tms/busi/orderArap/loadPage/${pk_id}">
                <iframe frameborder="0" name="arapGrid"></iframe>
            </div>
            <div tabid="logGridTab" title="操作日志" data-url="${path}/tms/bas/log/loadLogCommonPage?bill_id=${pk_id}">
                <iframe frameborder="0" name="logGrid"></iframe>
            </div>
        </div>
    </div>
</div>
</body>

<script>
    //页面元素
    var $mainTab = $("#mainTab"); //页签

    var mainTab;
    //单据主键
    var pk_id = "${pk_id}",
        data_order = ${order},
        data_clients = ${clients}, //客户
        data_clientLinkmans = ${clientLinkmans},
        data_suppliers = ${suppliers},
        data_dict = ${dict},
        <%--data_price_base = ${price_base}, //计量属性--%>
        data_loadOrg = ${loadOrg},
        data_region = ${region}; //供应商

    var price_base = priceBaseUtil.processPriceBase(data_dict);
    var remap_price_base = price_base.remap;
    var data_price_base = price_base.base;

    $(function () {
        //配置
        var detailTabOption = {
            height: '100%',
            width: '100%',
            heightDiff: -6,
            changeHeightOnResize: true,
            onAfterSelectTabItem: afterSelectTabItem,
            onBeforeSelectTabItem:function (tabid) {
                if(tabid !== "editTab"){
                    return manager.confirmChanged();
                }
            }
        }
        //创建页签
        mainTab = $mainTab.ligerTab(detailTabOption);
        var text = "";
        switch (data_order.order_state) {
            case "新记录":
                text = 'editTab';
                break;
            case "已审核":
            case "已完成":
                text = 'transGridTab';
                break;
            case "已回单":
            case "已核费用":
                text = 'arapGridTab';
                break;
        }
        //初始化激活的标签项
//        afterSelectTabItem(text);
        $(mainTab.element).find('[tabid='+ text + ']').eq(0).click();
    });

    //标签切换事件
    function afterSelectTabItem(tabid) {
        //初始化页签
        var $tg = $(".l-tab-content [tabid='" + tabid + "']");
        if ($tg.attr("data-init") !== "init") {
            $tg.children(".l-tab-loading").show();
            $tg.children("iframe").attr("src", $tg.attr("data-url")).end().attr("data-init", "init");
        }
    }

    var FORM_CONFIG;
</script>
<script src="${path}/js/lib/city-picker/city-picker.data.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms/jquery-ui.min.js?t=${applicationScope.sys_version}"></script>
<%--<script src="/js/tms/busi/order/orderCardConfig/${clientTemplate}.js?t=${applicationScope.sys_version}"></script>--%>
<script src="${path}/js/tms/busi/order/orderCard.js?t=${applicationScope.sys_version}"></script>

</html>
