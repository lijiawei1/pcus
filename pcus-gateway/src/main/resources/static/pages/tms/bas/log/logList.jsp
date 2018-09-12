<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.Date" %>
<%
    Long time = new Date().getTime();
%>
<!DOCTYPE html>
<html>
<head>
    <title>操作日志</title>
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
<div id="layout">
    <div class="content-wrapper filter-wrapper">
        <div class="filterTitle">
            <span class="title"></span>
            <div class="togglebtn limit-select" title="折叠/展开"></div>
        </div>
        <div class="filterBox">
            <form id="filterForm"></form>
            <ul class="search-btn-con">
                <li class="search-btn s-btn limit-select" id="searchBtn">

                </li>
                <li class="search-btn r-btn limit-select" id="resetBtn"></li>
            </ul>
            <div class="l-clear"></div>
        </div>
    </div>
    <div class="toolbar-wrapper">
        <div id="toolbar"></div>
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
    var bill_id = '${bill_id}';
</script>
<script src="${path}/js/tms/bas/log/logCommon.js?t=${applicationScope.sys_version}"></script>
</html>