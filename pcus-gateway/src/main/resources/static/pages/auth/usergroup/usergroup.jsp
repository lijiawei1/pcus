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
    </style>
</head>
<body>
    <ol class="breadcrumb container">
        <span>当前位置：</span>
        <li>权限管理</li>
        <li class="active"><a href="javascript:;">用户组</a></li>
    </ol>
    <div id="layout">
        <!-- 组列表 -->
        <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="用户组">
            <div class="tree-wrap">
                <ul id="mainTree"></ul>
                <div class="left-toggle limit-select" data-action="toggle-left"></div>
            </div>
        </div>
        <div id="layout-center" position="center">
            <div class="toolbar-wrapper">
                <div id="toptoolbar"></div>
            </div>
            <%--<div class="l-container">--%>
                <!-- 卡片界面 -->
                <div class="content-wrapper">
                    <form id="mainform"></form>
                </div>
                <div>

                </div>
                <!-- 防止DIV的越界 -->
                <%--<div class="l-clear"></div>--%>

                <!-- 用户组列表 -->
                <%--<div id="navtab1" style="width: 99%; hidden; border: 1px solid #D3D3d3;" class="liger-tab">--%>

                    <%--<div tabid="user" title="用户列表" lselected="true">--%>
                        <%--<div id="gridMask" class="customMask"--%>
                             <%--style="display: none; height: 100%;background: #777 none repeat scroll 0 0; font-size: 1px; left: 0; opacity: 0.25; overflow: hidden; position: absolute; width: 100%; z-index: 9000;"></div>--%>
                        <%--<div id="userGrid" style="margin: 5px; "></div>--%>
                    <%--</div>--%>
                <%--</div>--%>

            <%--</div>--%>



        </div>
    </div>
<script src="<c:url value='/js/auth/usergroup/usergroup.js'/>"></script>
</body>
</html>