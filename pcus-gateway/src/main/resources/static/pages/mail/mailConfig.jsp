<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/1/12
  Time: 11:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.util.Date" %>
<%
    Long time = new Date().getTime();
%>
<html>
<head>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
</head>
<head>
    <title>邮箱配置</title>
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
    <div class="content-wrapper single-search">
        <div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span class="text">高级<br>搜索</span>
        </div>
        <div class="search-box">
            <div class="input-box">
                <input type="text" placeholder="在此输入关键词" data-action="single-search-input">
                <span class="clear">&times;</span>
                <span class="search-btn limit-select" data-action="single-search"><i class="iconfont l-icon-search"></i>搜索</span>
            </div>
            <div class="search-history" style="display:none;">
                <a href="javascript:;">珠海港</a>
                <a href="javascript:;">更多 &gt;</a>
            </div>
        </div>
    </div>
    <div class="toolbar-wrapper">
        <div id="toptoolbar"></div>
    </div>
    <!-- 卡片界面 -->
    <div class="content-wrapper grid-wrapper">
        <!-- 列表界面 -->
        <div id="mainGrid"></div>
    </div>
</div>
<script src="<c:url value='/js/mail/mailConfig.js'/>?time=<%=time%>"></script>
</body>
</html>
