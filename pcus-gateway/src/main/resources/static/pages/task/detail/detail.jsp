<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../../common/pagesV2.jsp"/>
    <link href="${path}/css/auth.css" rel="stylesheet" type="text/css">
    <style>
        .content-wrapper{
            margin-left: 5px;
            margin-right: 5px;
        }
        .filter-wrapper{
            padding-left: 0;
        }
    </style>
</head>
<body>
<ol class="breadcrumb container">
    <span>当前位置：</span>
    <li>任务服务</li>
    <li class="active"><a href="javascript:;">任务配置</a></li>
</ol>
<div id="layout">
    <!-- 菜单栏 -->
    <div class="content-wrapper filter-wrapper">
        <form id="filterform"></form>
        <div class="l-clear"></div>
    </div>
    <div class="toolbar-wrapper">
        <div id="toptoolbar"></div>
    </div>
    <!-- 列表界面 -->
    <form id="mainform" class="content-wrapper grid-wrapper">
        <div id="mainGrid"></div>
    </form>
</div>
</body>
<script src="<c:url value='/js/task/taskdetail.js'/>"></script>
</html>