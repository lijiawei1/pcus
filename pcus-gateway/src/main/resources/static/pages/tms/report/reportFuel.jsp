<%--
  Created by IntelliJ IDEA.
  User: MM
  Date: 2017/3/9
  Time: 17:02
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>油耗报表</title>
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

        #layout .content-wrapper {
            height: 100%;
            margin: 0 5px 0 10px;
            padding: 0;
            border-radius: 0;
            box-sizing: border-box;
            position: relative;
        }

        #layout-center .l-layout-content {
            width: 100%;
            height: 100%;
            padding: 0;
            box-sizing: border-box;
        }

        .l-toolbar {
            background-color: #d6dae6;
        }

        /*页签样式*/
        .l-tab-links {
            margin: 0 0;
        }

        .l-tab-links ul {
            width: 9999px;
            top: 1px;
        }

        .l-tab-links-left,
        .l-tab-links-right {
            height: 26px;
            border: none;
            background-color: #eff2f9;
            top: 0;
        }

        .l-tab-links li a {
            color: #999;
        }

        .l-tab-links li.l-selected,
        .l-tab-links li.l-selected:hover {
            background-color: #fff;
        }

        .l-tab-links li:hover a {
            color: #17a0f5;
        }

        .yujing {
            color: #fff;
            background-color: #ff0000;
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
    <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="财务统计">
        <div class="tree-wrap">
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
    $(function () {
        var basePath = "/tms/report/client/";

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
                    text: '油耗报表',
                    pid: null,
                    children: [
                        {
                            text: "车辆月汇总油耗表",
                            id: "101",
                            pid: null,
                            url: "/tms/report/fuel/monthTotal"
                        },
                        {
                            text: "可乐油耗统计表",
                            id: "102",
                            pid: null,
                            url: "/tms/report/fuel/colaFuelTotal"
                        },
                        {
                            text: "BP业务总表",
                            id: "103",
                            pid: null,
                            url: "/tms/report/client/bpBillQuery"
                        },
                        {
                            text: "客户通用对账单",
                            id: "104",
                            pid: null,
                            url: "/tms/report/GLCargo/ClientChargeBill"
                        }
                    ]
                }
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