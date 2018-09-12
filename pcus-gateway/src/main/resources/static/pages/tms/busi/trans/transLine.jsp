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
    <title>任务线路信息</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .form-wrapper{
            padding-bottom:10px;
        }
        .combox-td p{
            display: inline-block;
            vertical-align: middle;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .combox-td .name{
            width: 20%;
        }

        .combox-td .address{
            width: 80%;
        }
    </style>
</head>
<body>

<div id="layout">
    <div class="toolbar-wrapper search-toolbar-wrapper">
        <div class="hidden-search">
            <i class="l-icon l-icon-search" data-action="single-search"></i>
            <input class="hs-input" placeholder="在此输入关键字" data-action="single-search-input">
            <span class="clear">&times;</span>
            <span class="status2 hs-btn limit-select" data-action="single-search">&gt;</span>
            <span class="status1 text">搜索</span>
            <span class="status2 text cancel">取消</span>
        </div>
        <div id="toptoolbar"></div>
    </div>

    <!-- 卡片界面 -->
    <div class="content-wrapper grid-wrapper">
        <!-- 列表界面 -->
        <div id="mainGrid"></div>
    </div>
</div>

</body>
<script>
    var mst_id = '${mst_id}', data_loadOrg = ${loadOrg};
</script>
<script src="${path}/js/tms/busi/trans/transLine.js?t=${applicationScope.sys_version}"></script>
</html>
