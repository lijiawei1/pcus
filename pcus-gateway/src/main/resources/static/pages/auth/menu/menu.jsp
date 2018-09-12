<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.util.Date" %>
<%
    Long time = new Date().getTime();
%>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../../common/pagesV2.jsp"/>
    <link href="${path}/css/auth.css" rel="stylesheet" type="text/css">
</head>
<body>
    <ol class="breadcrumb">
        <span>当前位置：</span>
        <li>权限管理</li>
        <li class="active"><a href="javascript:;">菜单</a></li>
    </ol>
    <div id="layout">
        <!-- 组列表 -->
        <div parent-class="l-tree-layout" collapse-class="l-tree-layout" position="left"  id="layout-left" position="left" title="模块">
            <div class="tree-wrap">
                <ul id="mainTree"></ul>
                <div class="left-toggle limit-select" data-action="toggle-left"></div>
            </div>
        </div>
        <div id="layout-center" position="center">
            <div class="content-wrapper filter-wrapper">
                <form id="filterform"></form>
            </div>
            <div class="toolbar-wrapper">
                <div id="toptoolbar"></div>
            </div>
            <form id="mainform" class="content-wrapper grid-wrapper">
                <div id="mainGrid"></div>
            </form>
            <%--<div style="width: 100%;display: inline-block;">--%>
                <%--<form id="btnform">--%>
                <%--<div id="btnGrid"></div>--%>
                <%--</form>--%>
            <%--</div>--%>
        </div>

        <!-- 防止DIV的越界 -->
        <%--<div id="layout-centerbottom" position="centerbottom" title="按钮">--%>
            <%--<form id="btnform">--%>
                <%--<div id="btnGrid"></div>--%>
            <%--</form>--%>
        <%--</div>--%>
        <ul class="iconlist"></ul>
    </div>
</body>
<script src="<c:url value='/js/auth/menu/menu.js'/>?t=<%=time%>"></script>
<script src="<c:url value='/js/lib/iconselector.js'/>"></script>
</html>