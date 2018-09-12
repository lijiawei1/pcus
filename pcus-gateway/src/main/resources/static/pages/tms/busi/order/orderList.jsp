<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>客户订单</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link rel="stylesheet" href="${path}/css/tms/listicon.css">
    <style>
        .trans-highlight {
            color: red;
        }
        .l-text-wrapper {

        }
        .l-grid-tree-link{
            margin-right: -1em;
        }
        .l-grid-tree-space{
            width: 1em;
        }
        .jloading{
            position: absolute;
            z-index: 10000;
            left: 46%;
            top:46%;
            background-color: #fff;
            border: 1px solid #000;
            padding: 10px;
        }

        /*未考虑初始化为收缩状态的情况 2016-11-30*/

        .unShowColspace div.l-grid-tree-link {
            display: none;
        }

        .unShowColspace.nextShow.expanded .l-grid-row-cell{
            border-bottom-color: #869099;
        }

        .showColspace.main.expanded .l-grid-row-cell{
            background-color: #e1eef6;
        }

        .showColspace.sub .l-grid-row-cell{
            background-color: #eff2fb;
        }

        .showColspace.sub.l-grid-row-over .l-grid-row-cell,
        .showColspace.main.expanded.l-grid-row-over .l-grid-row-cell{
            background-color: #fcf8e3;
        }

        .showColspace.sub.lastShow .l-grid-row-cell{
            border-bottom-color: #869099;
        }

        .showColspace.sub .l-grid-row-cell-btn-checkbox{
            display: none;
        }

        .state-other {
            color: #fff;
            background-color: #ff0000;
        }

        .state-audit {
            color: #fff;
            background-color: #FC9C12;
        }
        .state-new {
            color: #fff;
            background-color: #32CD32;
        }
        a.row-edit-btn {
            margin-right: 5px
        }
        /* 表格状态完成程度 */
        .red-100,.orange-100,.blue-100,.cyan-100,.pink-100,.gray-100,
        .red-50,.orange-50,.blue-50,.cyan-50,.pink-50,.gray-50{
            position: relative;
            z-index: 4;
        }

        .red-100:before,.orange-100:before,.blue-100:before,.cyan-100:before,.pink-100:before,.gray-100:before,
        .red-50:before,.orange-50:before,.blue-50:before,.cyan-50:before,.pink-50:before,.gray-50:before{
            content: "";
            position: absolute;
            z-index: -1;
            height: 100%;
            left:0;
            top: 0;
        }
        .red-100:before,.orange-100:before,.blue-100:before,.cyan-100:before,.pink-100:before,.gray-100:before{
            width: 100%;
        }
        .red-50:before,.orange-50:before,.blue-50:before,.cyan-50:before,.pink-50:before,.gray-50:before{
            width: 50%;
        }
        /* 各颜色 */
        .qs-item{
            cursor: default;
        }
        .quick-search .qs-item-red,.red-50:before,.red-100:before{
            background-color: #fc9;
        }
        .quick-search .qs-item-orange,.orange-50:before,.orange-100:before{
            background-color: #ffc;
        }
        .quick-search .qs-item-blue,.blue-50:before,.blue-100:before{
            background-color: #cff;
        }
        .quick-search .qs-item-cyan,.cyan-50:before,.cyan-100:before{
            background-color: #cfc;
        }
        .quick-search .qs-item-pink,.pink-50:before,.pink-100:before{
            background-color: #fcc;
        }
        .quick-search .qs-item-gray,.gray-50:before,.gray-100:before{
            background-color: #ccf;
        }
        .operated{
            position: relative;
            z-index: 10;
            color:#000;
        }
        .operated:before{
            content: "";
            background-color: #79e6e6;
            position: absolute;
            width: 20px;
            height: 20px;
            top: 16px;
            left: 14px;
            z-index: -1;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: bgBreadth 2s linear 0s infinite alternate;
        }

        @keyframes bgBreadth {
            from {
                background-color: #30bfff;
            }
            to {
                background-color: #BEE6FF;
            }
        }
        .left-text{
            padding: 0 5px;
            text-align: left !important;
        }
        .haveicon{
            position: relative;
        }
        .haveicon .icon-type{
            top: 50%;
            transform: translateY(-50%);
        }
        .schedule10:before {
            width: 10%;
        }
        .schedule20:before {
            width: 20%;
        }
        .schedule30:before {
            width: 30%;
        }
        .schedule40:before {
            width: 40%;
        }
        .schedule50:before {
            width: 50%;
        }
        .schedule60:before {
            width: 60%;
        }
        .schedule70:before {
            width: 70%;
        }
        .schedule80:before {
            width: 80%;
        }
        .schedule90:before {
            width: 90%;
        }
        .schedule00:before {
            width: 0%;
        }
        .l-grid-row-cell-inner{
            position: relative;
        }
        .in-pay, .in-charge{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            right: 0;
        }
        .in-pay {
            background-color: rgb(169, 209, 234);
        }
        .in-charge{
            background-color: rgb(97, 155, 223);
        }
    </style>
    <link href="${path}/css/tms/listicon.css" rel="stylesheet" type="text/css" />
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div id="layout">
    <div class="content-wrapper single-search history-search-wrapper">
        <div class="advanced-btn limit-select" data-action="open-advanced-search" id="advanced-btn"><span class="text">高级<br>搜索</span></div>
        <form class="history-search-form" id="history-search-form">
        </form>
        <div class="history-search-btn limit-select" id="history-search-btn" title="搜索">&gt;</div>
    </div>
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
        <!-- 快速搜索 -->
        <div class="quick-search" id="quickSearch">
            <span class="qs-item visited qs-item-red" data-state="ALL">全部(<span>0</span>)</span>
            <span class="qs-item qs-item-cyan" data-state="新记录">新记录(<span>0</span>)</span>
            <span class="qs-item qs-item-blue" data-state="已审核">已审核(<span>0</span>)</span>
            <span class="qs-item qs-item-orange" data-state="已完成">已完成(<span>0</span>)</span>
            <span class="qs-item qs-item-pink" data-state="已回单">已回单(<span>0</span>)</span>
            <span class="qs-item qs-item-gray" data-state="已核费用">已核费用(<span>0</span>)</span>
            <%--<span class="qs-item qs-item-void" data-state="已作废">已作废(<span>0</span>)</span>--%>
        </div>
    </div>
</div>
<!-- 高级搜索 -->
<div class="advanced-search-wrap" id="advanced-search-wrap">
    <div class="rect border"></div>
    <div class="circle big border"></div>
    <div class="circle big inner"></div>
    <div class="circle small border"></div>
    <div class="circle small inner close limit-select" data-action="close-advanced-search">&times;</div>
    <div class="advanced-search" id="advanced-search">
        <div class="advanced-search-title">高级搜索</div>
        <div class="advanced-search-content">
            <form id="filterForm"></form>
        </div>
        <ul class="search-btn-con">
            <li class="search-btn s-btn limit-select" id="searchBtn"></li>
            <li class="search-btn r-btn limit-select" id="resetBtn"></li>
        </ul>
    </div>
</div>

<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
<%--弹出合并选择主单--%>
<div id="mergeDialog" style="display: none;">
    <div id="mergeListBox"></div>
</div>
<!-- 弹出复制框 -->
<div id="copyDialog" style="display: none;">
    <form id="copyForm"></form>
</div>

<%-- 弹出 表格 --%>
    <div id="detailGrid"></div>

<!--导出失败-->
<div id="importFailDialog" style="display: none;">
    <form id="failForm" method="POST" target="_blank" action="">
    </form>
</div>

<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/busi/order/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="where"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
        <input type="text" name="contract_id"/>
    </form>
</div>

<!--Excel导入-->
<div id="uploadDlg" style="display: none;">
    <form id="uploadForm" enctype="multipart/form-data">
        <table style="height: 100%; width: 100%">
            <tr style="height: 40px">
                <td><input type="file" style="width: 200px" id="fileupload" name="fileupload"/></td>
            </tr>
        </table>
    </form>
</div>

<div id="infoList">
    <div id="otherGird"></div>
</div>
</body>
<script>

    var data_bs_type_name = ${busiType}, //业务类型
            data_state = ${state}, //单据状态
            data_clients = ${clients}, //客户
            data_suppliers = ${suppliers}, //供应商
            data_clientLinkmans = ${clientLinkmans},
            data_dict = ${dict};
</script>
<script src="${path}/js/tms/busi/order/orderList.js?t=${applicationScope.sys_version}"></script>
</html>