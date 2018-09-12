<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2017/3/17
  Time: 9:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../../common/pagesV2.jsp"/>
    <link href="${path}/css/auth.css" rel="stylesheet" type="text/css">
    <style>
        #layout-center{
            padding-top: 0;
        }
        /*.content-wrapper{*/
            /*height: calc(100% - 60px);*/
            /*overflow: auto;*/
        /*}*/
    </style>
</head>
<body>

<ol class="breadcrumb container">
    <span>当前位置：</span>
    <li>权限管理</li>
    <li class="active"><a href="javascript:;">授权</a></li>
</ol>
<div id="layout">
    <!-- 组列表 -->
    <div parent-class="l-tree-layout" collapse-class="l-tree-layout"  id="layout-left" position="left" title="角色列表">
        <div  class="tree-wrap">
            <ul id="mainTree"></ul>
            <div class="left-toggle limit-select" data-action="toggle-left"></div>
        </div>
    </div>
    <div id="layout-center" position="center">
        <div class="toolbar-wrapper">
            <div id="toptoolbar"></div>
        </div>
        <div class="content-wrapper">
            <div id="mainGrid"></div>
        </div>
        <ul class="iconlist"></ul>
    </div>
</div>

</body>

<script src="${path}/js/auth/dict/dictAccess.js"></script>
</html>