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
<body>
<div class="l-container">
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
      <form id="mainform">
        <div id="mainGrid"></div>
      </form>
    </div>
  </div>
</div>
<script src="<c:url value='/js/mail/mailConfig.js'/>?time=<%=time%>"></script>
</body>
</html>
