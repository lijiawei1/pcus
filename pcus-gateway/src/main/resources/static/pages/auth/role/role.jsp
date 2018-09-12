<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../../common/pagesV2.jsp"/>
    <link href="${path}/css/auth.css" rel="stylesheet" type="text/css">
    <style>
        .l-tab-content{
            border: 1px solid #d6d6d6;
        }
    </style>
</head>
<body>
    <ol class="breadcrumb container">
        <span>当前位置：</span>
        <li>权限管理</li>
        <li class="active"><a href="javascript:;">角色</a></li>
    </ol>
    <div id="layout">
        <!-- 角色列表 -->
        <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="角色列表">
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
            <div id="content" class="content-wrapper">
                <div position="top">
                    <div class="l-content">
                        <form id="mainform"></form>
                    </div>
                </div>
                <div position="center">
                    <!-- 角色、用户组列表 -->
                    <div id="children-tab">
                        <div tabid="user" title="用户列表" lselected="true">
                            <%--<div id="userGrid" style="margin: 5px; ">--%>
                            <%--</div>--%>
                        </div>
                    </div>
                </div>
            </div>
                <%--<div class="l-content">--%>
                <!-- 卡片界面 -->
                <%--<div>--%>
                    <%--<form id="mainform"></form>--%>
                <%--</div>--%>

                <%--<!-- 防止DIV的越界 -->--%>
                <%--<div class="l-clear"></div>--%>

                <%--<!-- 角色、用户组列表 -->--%>
                <%--<div id="navtab1" class="liger-tab">--%>
                    <%--<div tabid="user" title="用户列表" lselected="true">--%>
                        <%--<div id="userGrid" style="margin: 5px; ">--%>

                        <%--</div>--%>
                    <%--</div>--%>
                <%--</div>--%>
            <%--</div>--%>
        </div>
    </div>
</body>
<script src="<c:url value='/js/auth/role/role.js'/>"></script>

</html>