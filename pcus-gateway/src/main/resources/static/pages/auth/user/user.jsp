<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../../common/pagesV2.jsp"/>
    <link href="${path}/css/auth.css" rel="stylesheet" type="text/css">
    <style>
        [tabid="usergroup"]{
            outline: 1px solid #d6d6d6;
        }
    </style>
</head>
<body>
    <ol class="breadcrumb container">
        <span>当前位置：</span>
        <li>权限管理</li>
        <li class="active"><a href="javascript:;">用户</a></li>
    </ol>
    <div id="layout">
        <!-- 组列表 -->
        <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="用户列表">
            <div class="tree-wrap">
                <div id="mainTreeWrapper">
                    <ul id="mainTree"></ul>
                </div>
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
            <!-- 卡片界面 -->
            <div class="content-wrapper" id="content">
                <div position="top">
                    <form id="mainform"></form>
                </div>
                <div position="center">
                    <div id="children-tab">
                        <div tabid="role" title="角色" lselected="true">
                            <div id="roleGrid" ></div>
                        </div>

                        <div tabid="usergroup" title="用户组" >
                            <div id="groupGrid"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 角色选择框 -->
    <div id="selectRole" style="display: none; width:200px; height: 300px; :3px;">
        <ul id="roleTree"></ul>
    </div>

</body>
<script src="<c:url value='/js/auth/user/user.js'/>"></script>
</html>