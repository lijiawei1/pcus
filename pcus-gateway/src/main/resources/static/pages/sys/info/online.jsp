<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/1/19
  Time: 10:55
  To change this template use File | Settings | File Templates.
--%>
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
      padding-left: 5px;
      height: 100%;
    }
  </style>
</head>
<body>
<ol class="breadcrumb">
  <span>当前位置：</span>
  <li>系统管理</li>
  <li class="active"><a href="javascript:;">在线人员</a></li>
</ol>

<!-- 菜单栏 -->
<div class="l-page-top">
  <div id="toptoolbar"></div>
</div>
<div id="editFormWrapper" class="l-page-top">
  <form id="editForm"></form>
</div>
<div id="layout">
  <div id="layout-center" position="center">
    <!-- 列表界面 -->
    <form id="mainform" class="content-wrapper grid-wrapper">
      <div id="mainGrid"></div>
    </form>
  </div>
</div>

<script src="<c:url value='/js/sys/info/online.js'/>?time=<%=time%>"></script>
</body>
</html>
