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
    <title>系统运行</title>
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
<script type="text/javascript">
    /**
     * Created by wujian on 2017/2/6.
     */
    $(function () {
        var basePath = "/tms/report/sys/";

        var layout,
                mainTree,
                mainTab;

        var $mainTree = $("#mainTree");


        //初始化界面
        layout = $("#layout").ligerLayout({
            leftWidth: 220,
            height: '100%',
            space: 1,
            heightDiff: 0,
            centerBottomHeight: 200,
            onHeightChanged: function (e) {
            }
        });

        //生成页签
        mainTab = $("#mainTab").ligerTab({
            width: '100%',
            height: '100%',
            heightDiff: 0,
            showSwitchInTab: true,
            showSwitch: true,
            autoMove: true,
            changeHeightOnResize: true,
            onAfterSelectTabItem: selectTabItem
        });

        //生成树
        mainTree = $mainTree.ligerTree({
            data: [
                {
                    text: "单日单量",
                    id: "OQ_day",
                    pid: "orderQuantity",
                    url: "/tms/report/trans/dayBillQuery"
                },
                {
                    text: "月单量",
                    id: "OQ_month",
                    pid: "orderQuantity",
                    url: "/tms/report/trans/monthBillQuery"
                },
                {
                    text: "年度单量",
                    id: "OQ_year",
                    pid: "orderQuantity",
                    url: "/tms/report/trans/yearBillQuery"
                },
                {
                    text: "客户单量",
                    id: "OQ_client",
                    pid: "orderQuantity",
                    url: "/tms/report/trans/clientBillQuery"
                },
                {
                    text: "客户单日单量",
                    id: "OQ_client_day",
                    pid: "orderQuantity",
                    url: "/tms/report/trans/clientDayBillQuery"
                },
                {
                    text: "单量分布",
                    id: "OQ_distribution",
                    pid: "orderQuantity",
                    url: "aaa"
                }
                //节点一
                //{
                //    text: "系统运行分析",
                //    id: "1",
                //    pid: null,
                //    url: ""
                //},
                //{
                //    text: "用户在线统计",
                //    id: "userOnlineQuery",
                //    pid: "1",
                //    url: "userOnlineQuery"
                //},
                //{
                //    text: "用户操作日志",
                //    id: "userOperLogQuery",
                //    pid: "1",
                //    url: "userOperLogQuery"
                //},
                //{
                //    text: "用户修改数据统计",
                //    id: "userDelayLogQuery",
                //    pid: "1",
                //    url: "userDelayLogQuery"
                //},
                //{
                //    text: "录单延时数据",
                //    id: "userDelayQuery",
                //    pid: "1",
                //    url: "userDelayQuery"
                //},
                //{
                //    text: "司机APP使用情况",
                //    id: "driverAppLogQuery",
                //    pid: "1",
                //    url: "driverAppLogQuery"
                //}
            ],
            nodeWidth: 200,
            idFieldName: 'id',
            textFieldName: 'text',
            parentIDFieldName: 'pid',
            slide: true,
            checkbox: false,
            isExpand: 2,
            needCancel: false,
            btnClickToToggleOnly: false,
            onSelect: selectTreeNode
        });

        //缓存所有的可选择节点
        var $mainTreeItem = $mainTree.find(".l-body");

        //选择树节点时，打开新页签
        function selectTreeNode(e) {
            var data = e.data;
            if (data.url) {
                mainTab.addTabItem({
                    tabid: data.id,
                    text: data.text,
                    url: data.url
                });
            }
        }

        //选择页签时，更新树的选择状态（请勿触发点击事件，否则引发循环）
        function selectTabItem(tabid) {
            $mainTreeItem.filter(".l-selected").removeClass("l-selected");
            if (tabid) {
                $("#" + tabid).children(".l-body").addClass("l-selected");
            }
        }
    });
</script>
</body>
</html>
