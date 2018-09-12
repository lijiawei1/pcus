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
    <title>任务调整</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .trans-highlight {
            color: red;
        }
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
            box-sizing: border-box;
            position: relative;
        }
        #layout-center .l-layout-content{
            width: 100%;
            height: 100%;
            padding: 0;
            box-sizing: border-box;
        }
        .tabWrapper{
            padding-top: 0;
        }
        .tabWrapper .l-tab-content{
            border: none;
        }
        .toolbar-wrapper{
            padding-left: 5px;
            position: relative;
        }
        .grid-wrapper{
            padding: 3px 5px 5px;
        }
        .l-tree-layout.l-layout-left .l-layout-content{
            width: 88%;
        }
        /*表格样式
        ====================================*/
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
        .alert-icon{
            position: relative;
        }
        .alert-icon:before{
            content: "";
            width: 18px;
            height: 18px;
            background: url("../../../../images/tms/alert.png") no-repeat center;
            background-size: contain;
            position: absolute;
            right: 0;
            bottom: 1px;
        }
        /* 表格状态完成程度 */
        .red-100,.orange-100,.blue-100,.cyan-100,.pink-100,.gray-100,.purple-100,.yellow-100{
            position: relative;
            z-index: 4;
        }
        .red-100:before,.orange-100:before,.blue-100:before,.cyan-100:before,.pink-100:before,.gray-100:before,.purple-100:before,.yellow-100:before{
            content: "";
            position: absolute;
            z-index: -1;
            height: 100%;
            width: 100%;
            left:0;
            top: 0;
        }
        /* 各颜色 */
        #adjustGrid .orange-100:before{
            background-color: #ffc;
        }
    </style>
    <link href="${path}/css/tms/listicon.css"  rel="stylesheet" type="text/css" />
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div id="layout">
    <!-- 组列表 -->
    <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="司机列表">
        <div class="tree-wrap" >
            <ul id="mainTree"></ul>
            <div class="left-toggle limit-select" data-action="toggle-left"></div>
        </div>
    </div>
    <div id="layout-center" class="l-layout-center" position="center">
        <!-- 卡片界面 -->
        <div class="l-layout-content">
            <div class="content-wrapper grid-wrapper">
                <div class="tabWrapper">
                    <div class="tabWrapper-inner">
                        <div id="mainTab">
                            <div tabid="adjustTab" title="任务调整" lselected="true">
                                <div class="toolbar-wrapper form-toolbar">
                                    <div class="l-toolbar" id="adjustbar"> </div>
                                </div>
                                <div class="grid-wrapper">
                                    <div id="adjustGrid"></div>
                                </div>
                            </div>

                            <div tabid="assignTab" title="任务指派">
                                <div class="toolbar-wrapper form-toolbar search-toolbar-wrapper">
                                    <div class="hidden-search">
                                        <i class="l-icon l-icon-search" data-action="single-search"></i>
                                        <input class="hs-input" placeholder="在此输入关键字" data-action="single-search-input">
                                        <span class="clear">&times;</span>
                                        <span class="status2 hs-btn limit-select" data-action="single-search">&gt;</span>
                                        <span class="status1 text">搜索</span>
                                        <span class="status2 text cancel">取消</span>
                                    </div>
                                    <div class="l-toolbar" id="assignbar"> </div>
                                </div>
                                <div class="grid-wrapper">
                                    <div id="assignGrid"></div>
                                </div>
                            </div>

                            <div tabid="finishTab" title="已结束任务">
                                <div class="toolbar-wrapper form-toolbar search-toolbar-wrapper">
                                    <div class="hidden-search">
                                        <i class="l-icon l-icon-search" data-action="single-search"></i>
                                        <input class="hs-input" placeholder="在此输入关键字" data-action="single-search-input">
                                        <span class="clear">&times;</span>
                                        <span class="status2 hs-btn limit-select" data-action="single-search">&gt;</span>
                                        <span class="status1 text">搜索</span>
                                        <span class="status2 text cancel">取消</span>
                                    </div>
                                    <div class="l-toolbar" id="finisbar"> </div>
                                </div>
                                <div class="grid-wrapper">
                                    <div id="finishGrid"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>
<script>
    //基础数据
    var data_bs_type_name = ${busiType}, //业务类型
            data_state = ${state}, //单据状态
            data_clients = ${clients}, //客户
            data_suppliers = ${suppliers}, //供应商
            data_carriers = ${carriers}, //供应商
            data_car = ${car}, //车牌
            data_driver = ${driver}, //司机
            data_dict = ${dict} //数据字典
            ;
</script>
<script src="${path}/js/tms/busi/trans/transAdjust.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
</body>
</html>
