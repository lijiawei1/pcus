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
    <style>
        #layout-center{
            padding-top: 0;
        }
    </style>
</head>
<body>
    <ol class="breadcrumb container">
        <span>当前位置：</span>
        <li>组织管理</li>
        <li class="active"><a href="javascript:;">公司信息</a></li>
    </ol>
    <div id="layout">
        <!-- 公司列表 -->
        <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="公司目录">
            <div class="tree-wrap">
                <ul id="mainTree"></ul>
                <div class="left-toggle limit-select" data-action="toggle-left"></div>
            </div>
        </div>
        <div id="layout-center" position="center">
            <div class="toolbar-wrapper">
                <div id="toptoolbar"></div>
            </div>
            <!-- 卡片界面 -->
            <%--<div style="min-height: 210px; max-height: 210px; overflow: auto;">--%>
            <div class="content-wrapper">
                <form id="mainform"></form>
            </div>
            <%--</div>--%>
        </div>
    </div>
</body>
<script src="<c:url value='/js/org/corp.js'/>?time=<%=time%>"></script>
</html>