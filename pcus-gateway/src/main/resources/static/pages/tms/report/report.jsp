<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/10/18
  Time: 10:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>报表主页</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        #layout {
            width: 100%;
            margin: 0;
            padding: 0;
        }
        #layout .l-layout-center {
            border-top: 0;
            border-left: 0;
            border-right: 0;
        }
        #layout .l-layout-content {
            background: transparent;
        }
        #layout .content-wrapper{
            height: 100%;
            margin: 0 5px 0 10px;
            padding: 0;
            border-radius: 0;
            box-sizing: border-box;
            position: relative;
        }
        #layout-center .l-layout-content{
            width: 100%;
            height: 100%;
            padding: 0;
            box-sizing: border-box;
        }
        .l-toolbar{
            background-color: #d6dae6;
        }
        /*页签样式*/
        .l-tab-links{
            margin: 0 0;
        }
        .l-tab-links ul{
            width: 9999px;
            top: 1px;
        }
        .l-tab-links-left,
        .l-tab-links-right{
            height: 26px;
            border: none;
            background-color: #eff2f9;
            top: 0;
        }
        .l-tab-links li a{
            color: #999;
        }
        .l-tab-links li.l-selected,
        .l-tab-links li.l-selected:hover{
            background-color: #fff;
        }
        .l-tab-links li:hover a{
            color: #17a0f5;
        }
    </style>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div id="layout">
    <!-- 组列表 -->
    <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="报表统计">
        <div class="tree-wrap" >
            <ul id="mainTree"></ul>
            <div class="left-toggle limit-select" data-action="toggle-left"></div>
        </div>
    </div>
    <div id="layout-center" class="l-layout-center" position="center">
        <!-- 卡片界面 -->
        <div class="l-layout-content">
            <div class="content-wrapper grid-wrapper">
                <div id="mainTab"></div>
            </div>
        </div>
    </div>
</div>
<script src="${path}/js/tms/report/report.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
</body>
</html>
