<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/12/19
  Time: 10:23
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<head>
    <title>应收账单制作明细</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
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
            <div tabid="editTab" title="账单制作" lselected="true"
                 data-url="${path}/tms/settle/makebilldetail/loadPage?pk_id=${client_id}&supplier_id=${supplier_id}">
                <iframe frameborder="0" name="editTab"></iframe>
            </div>
            <div tabid="linkmanGridTab" title="结算信息"
                 data-url="${path}/tms/settle/settleInfo/loadCard?pk_id=${client_id}&type=1">
                <iframe frameborder="0" name="linkmanGrid"></iframe>
            </div>
        </div>
    </div>
</div>

</body>

<script>

    //页面元素
    var $mainTab = $("#mainTab"); //页签

    var mainTab;

    //配置
    var detailTabOption = {
        height: '100%',
        width: '100%',
        heightDiff: -6,
        changeHeightOnResize: true,
        onAfterSelectTabItem: afterSelectTabItem
    }

    $(function () {
        //创建页签
        mainTab = $mainTab.ligerTab(detailTabOption);
        //初始化激活的标签项
        afterSelectTabItem(mainTab.getSelectedTabItemID());
    });

    //标签切换事件
    function afterSelectTabItem(tabid) {
        //初始化页签
        var $tg = $(".l-tab-content [tabid='" + tabid + "']");
        if ($tg.attr("data-init") !== "init") {
            $tg.children(".l-tab-loading").show();
            var url = $tg.attr("data-url");
            $tg.children("iframe").attr("src", url).end().attr("data-init", "init");
        }
    }

</script>
</html>
