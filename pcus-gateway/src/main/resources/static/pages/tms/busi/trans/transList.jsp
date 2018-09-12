<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>调度任务</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="${path}/css/tms/listicon.css" rel="stylesheet" type="text/css" />
</head>
<style>
    .trans-highlight {
        color: red;
    }
    .trans-editor-disabled {
        width: 100%;
        height: 100%;
        background-color: #ebebeb;
        display: block;
    }

    .trans-editor-editable {
        width: 100%;
        height: 100%;
        background-color: #00a2d4;
        display: block;
    }

    .trans-state-other {
        color: #fff;
        background-color: #ff0000;
    }

    .trans-state-new {
        color: #fff;
        background-color: #32CD32;
    }

    a.row-edit-btn {
        margin-right: 5px
    }

    .combobox-list-item{
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .combobox-list-item.car_no-item{
        width: 25%;
        min-width: 70px;
    }
    .combobox-list-item.driver_name-item.item1{
        width: 27%;
    }
    .combobox-list-item.driver_name-item.item2{
        width: 26%;
    }
    .combobox-list-item.driver_name-item.item3{
        width: 25%;
    }
    .combobox-list-item.driver_name-item.item4{
        width: 22%;
    }
    .icon-type{
        display: none;
        top: 6px;
    }
    .haveicon{
        position: relative;
    }
    .haveicon .icon-type{
        display: block;
    }
    /* 表格状态完成程度 */
    .red-100,.orange-100,.blue-100,.cyan-100,.pink-100,.gray-100,.purple-100,.yellow-100,.void-100{
        position: relative;
        z-index: 4;
    }
    .red-100:before,.orange-100:before,.blue-100:before,.cyan-100:before,.pink-100:before,.gray-100:before,.purple-100:before,.yellow-100:before,.void-100:before{
        content: "";
        position: absolute;
        z-index: -1;
        height: 100%;
        width: 100%;
        left:0;
        top: 0;
    }
    /* 各颜色 */
    .qs-item{
        cursor: default;
    }
    .quick-search .qs-item-red,.red-100:before{
        background-color: #fc9;
    }
    .quick-search .qs-item-orange,.orange-100:before{
        background-color: #ffc;
    }
    .quick-search .qs-item-blue,.blue-100:before{
        background-color: #cff;
    }
    .quick-search .qs-item-cyan,.cyan-100:before{
        background-color: #cfc;
    }
    .quick-search .qs-item-pink,.pink-100:before{
        background-color: #fcc;
    }
    .quick-search .qs-item-gray,.gray-100:before{
        background-color: #ccf;
    }
    .quick-search .qs-item-purple,.purple-100:before{
        background-color: #f9f;
    }
    .quick-search .qs-item-yellow,.yellow-100:before{
         background-color: #cf6;
     }
    .qs-item-void,.void-100:before{
        background-color: #dfdfdf;
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
</style>


<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/busi/trans/excelExport">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="where"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

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
            <span class="qs-item visited qs-item-red" data-tab="ALL" data-state="ALL">全部(<span>0</span>)</span>
            <span class="qs-item qs-item-cyan" data-tab="STATE_40_NEW" data-state="STATE_40_NEW">新任务(<span>0</span>)</span>
            <span class="qs-item qs-item-blue" data-tab="PLAN" data-state="STATE_41_SUBMITTED,STATE_45_NOTICED">计划中(<span>0</span>)</span>
            <span class="qs-item qs-item-orange" data-tab="DISPATCH" data-state="STATE_60_ACCEPTED,STATE_61_DEPART">调度中(<span>0</span>)</span>
            <span class="qs-item qs-item-pink" data-tab="TRANSPORT" data-state="STATE_71_PICKUP_CNTR,STATE_73_LOAD,STATE_75_UNLOAD,STATE_76_UNLOAD_CNTR,STATE_77_RETURN_CNTR,STATE_79_FINISH">运输中(<span>0</span>)</span>
            <span class="qs-item qs-item-gray" data-tab="STATE_90_RECEIPTED" data-state="STATE_90_RECEIPTED">已回单(<span>0</span>)</span>
            <span class="qs-item qs-item-purple" data-tab="STATE_69_REFUESED" data-state="STATE_69_REFUESED">已拒绝(<span>0</span>)</span>
            <span class="qs-item qs-item-yellow" data-tab="STATE_91_STOPPED" data-state="STATE_91_STOPPED">已中止(<span>0</span>)</span>
            <span class="qs-item qs-item-void" data-tab="STATE_92_CANCEL" data-state="STATE_92_CANCEL">已作废(<span>0</span>)</span>
            <%--<a class="qs-item qs-item-void" href="javascript:;"  data-tab="MODIFIED" data-state="MODIFIED">本次操作(<span>0</span>)</a>--%>
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

<!-- 弹出复制框 -->
<div id="copyDialog" style="display: none;">
    <form id="copyForm"></form>
</div>

</body>
<script>

    //基础数据
    var data_bs_type_name = ${busiType}, //业务类型
            data_state = ${state}, //单据状态
            data_clients = ${clients}, //客户
            data_suppliers = ${suppliers}, //供应商
            data_car = ${car}, //车牌
            data_driver = ${driver} //司机
            data_dict = ${dict} //数据字典
            data_carriers = ${carriers};

</script>
<script src="${path}/js/tms/busi/trans/transList.js?t=${applicationScope.sys_version}"></script>
</html>