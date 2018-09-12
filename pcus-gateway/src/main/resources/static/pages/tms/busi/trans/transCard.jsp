<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>任务详细</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style type="text/css">
        ul.ui-autocomplete {
            z-index: 9999;
        }
        .l-text-wrapper {

        }

        .trans-highlight {
            color: red;
        }

        .trans-editor-disabled {
            width: 100%;
            height: 100%;
            background-color: #ebebeb;
        }

        .trans-editor-editable {
            width: 100%;
            height: 100%;
            background-color: #00a2d4;
        }

        .row-copy-btn {
            padding-right: 10px;
            color: #aeaeae;
        }

        .combobox-list-item {
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .combobox-list-item.car_no-item {
            width: 25%;
            min-width: 70px;
        }

        .combobox-list-item.driver_name-item.item1 {
            width: 27%;
        }

        .combobox-list-item.driver_name-item.item2 {
            width: 26%;
        }

        .combobox-list-item.driver_name-item.item3 {
            width: 25%;
        }

        .combobox-list-item.driver_name-item.item4 {
            width: 22%;
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
            <div tabid="detailGridTab" title="货物信息" data-url="${path}/tms/busi/transDetail/loadPage/${pk_id}">
                <iframe frameborder="0" name="detailGrid"></iframe>
            </div>
            <div tabid="lineGridTab" title="线路信息" data-url="${path}/tms/busi/transLine/loadPage/${pk_id}">
                <iframe frameborder="0" name="lineGrid"></iframe>
            </div>
            <div tabid="carMonitorTab" title="车辆监控" data-url="${path}/tms/busi/carMonitor/loadPage/${pk_id}">
                <iframe frameborder="0" name="carMonitor"></iframe>
            </div>
            <div tabid="nodeGridTab" title="节点信息" data-url="${path}/tms/busi/transNode/loadPage/${pk_id}">
                <iframe frameborder="0" name="nodeGrid"></iframe>
            </div>
            <div tabid="relatedGridTab" title="关联订单" data-url="${path}/tms/busi/transRelatedOrder/loadPage/${pk_id}">
                <iframe frameborder="0" name="relatedGrid"></iframe>
            </div>
            <div tabid="logGridTab" title="操作日志" data-url="${path}/tms/bas/log/loadLogCommonPage?bill_id=${pk_id}">
                <iframe frameborder="0" name="logGrid"></iframe>
            </div>
        </div>
    </div>
</div>
<%--子表单列表--%>
<div id="subFormList"></div>
</body>

<script>

    var pk_id = "${pk_id}",
            data_trans = ${trans},
            data_dict = ${dict},
            data_car = ${car}, //车牌
            data_driver = ${driver},
            data_carrier = ${carriers};
    //页面元素
    var $mainTab = $("#mainTab"); //页签

    //单据主键
    var pk_id = "${pk_id}";

    //配置
    var detailTabOption = {
        height: '100%',
        width: '100%',
        heightDiff: -6,
        changeHeightOnResize: true,
        onAfterSelectTabItem: afterSelectTabItem
    };

    $(function () {
        //创建页签
        mainTab = $mainTab.ligerTab(detailTabOption);
        //初始化激活的标签项
//        afterSelectTabItem(mainTab.getSelectedTabItemID());
        $(mainTab.element).find('[tabid="detailGridTab"]').eq(0).click();
    });

    //标签切换事件
    function afterSelectTabItem(tabid) {
        //初始化页签
        var $tg = $(".l-tab-content [tabid='" + tabid + "']");
        if ($tg.attr("data-init") !== "init") {
            $tg.children(".l-tab-loading").show();
            $tg.children("iframe").attr("src", $tg.attr("data-url")).end().attr("data-init", "init");
        }
    };

</script>
<script src="${path}/js/tms/busi/trans/transCard.js?t=${applicationScope.sys_version}"></script>

</html>
