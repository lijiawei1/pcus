<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/12/20
  Time: 14:33
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>应收账单</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .tabWrapper .l-tab-content{
            border: none;
        }
        .tabWrapper .l-tab-links ul{
            background-color: transparent;
        }
        .tabWrapper .l-tab-links li{
            float: left;
            width: 50%;
            background-color: transparent;
            box-sizing: border-box;
        }
        .tabWrapper .l-tab-links li:first-child{
            padding-right: 3px;
        }
        .tabWrapper .l-tab-links li:last-child{
            padding-left: 3px;
        }
        .tabWrapper .l-tab-links li:hover{
            background-color: transparent;
        }
        .tabWrapper .l-tab-links li a{
            width: 100%;
            margin: 0;
            color: #9a9a9c;
            border-radius: 10px;
            background-color: #f0f3fa;
        }
        .tabWrapper .l-tab-links li.l-selected,
        .tabWrapper .l-tab-links li.l-selected:hover{
            background-color: transparent;
        }
        .tabWrapper .l-tab-links li:hover{

        }
        .tabWrapper .l-tab-links li.l-selected a{
            color: #17a0f5;
            background-color: #fff;
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
            <div tabid="maintab1" title="应付账单"data-url="${path}/tms/settle/pay/loadPage" >
                <iframe frameborder="0" name="makebillpay"></iframe>
            </div>
            <div tabid="maintab2" title="应付账单制作" data-url="${path}/tms/settle/makebillpay/loadPage">
                <iframe frameborder="0" name="makebillpay2"></iframe>
            </div>
        </div>
    </div>
</div>
<script>
    $("#mainTab").ligerTab({
        height: '100%',
        width: '100%',
        changeHeightOnResize: true,
        onAfterSelectTabItem: afterSelectTabItem
    });
    afterSelectTabItem("maintab1");
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
</body>
</html>
