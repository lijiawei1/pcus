<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="java.util.Date"%>
<%
	Long time = new Date().getTime();
%>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="../../common/pagesV2.jsp"/>
    <link href="${path}/css/auth.css" rel="stylesheet" type="text/css">
	<script src="<c:url value='/js/sys/dict/dict.js'/>?time=<%=time%>"></script>
    <style>
        #layout-center{
            padding-top: 0;
        }
    </style>
</head>

<body >
<ol class="breadcrumb container">
    <span>当前位置：</span>
    <li>系统管理</li>
    <li class="active"><a href="javascript:;">数据字典</a></li>
</ol>
    <input type="hidden" id="MenuNo" value="Dictionary" />
    
    <!-- 弹窗界面 -->
    <div id="formDlg" style="display: none"></div>
    
    <div id="layout">
        <div parent-class="l-tree-layout" collapse-class="l-tree-layout" position="left" title="数据字典类型" id="mainmenu">
            <div class="tree-wrap">
                <ul id="maintree"></ul>
                <div class="left-toggle limit-select" data-action="toggle-left"></div>
            </div>
        </div>
        <div id="layout-center" position="center">
            <div class="toolbar-wrapper">
                <div id="toptoolbar"></div>
            </div>
            <form id="mainform" class="content-wrapper grid-wrapper">
                <div id="maingrid">
                </div>
            </form>
            <div id="detail" style="display: none;">
                <form id="detailform" method="post"></form>
            </div>
        </div>
    </div>
</body>
</html>