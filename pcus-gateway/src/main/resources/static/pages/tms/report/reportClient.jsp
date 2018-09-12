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
    <title>客户报表</title>
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
                    text: '高栏散货',
                    pid: null,
                    children: [
                        {
                            text: "船公司日报表",
                            id: "101",
                            pid: null,
                            url: "/tms/report/client/zhongyuanDailyBillQuery"
                        },
                        {
                            text: "BP业务数据汇总表",
                            id: "102",
                            pid: null,
                            url: "/tms/report/client/GLSummaryBillBP"
                        },
                        {
                            text: "客户对账单（散货）",
                            id: "103",
                            pid: null,
                            url: "/tms/report/client/GLClientChargeBillCargo"
                        },
                        {
                            text: "BP对账单(陆运PTA)",
                            id: "104",
                            pid: null,
                            url: "/tms/report/bp/client/bpLandBillQuery"
                        },
                    ]
                },
                {
                    text: '高栏集装箱',
                    pid: null,
                    children: [
                        {
                            text: "业务数据汇总表",
                            id: "32",
                            pid: null,
                            url: "/tms/report/client/GLSummaryBill"
                        },
                        {
                            text: "外协对账单",
                            id: "34",
                            pid: null,
                            url: "/tms/report/client/GLCarrierPayBill"
                        },
                        {
                            text: "外协对账单（合并孖拖）",
                            id: "41",
                            pid: null,
                            url: "/tms/report/client/GLCarrierPayBill2"
                        },
                        {
                            text: "客户对账单（集装箱）",
                            id: "37",
                            pid: null,
                            url: "/tms/report/client/GLClientChargeBillCntr"
                        },
                        {
                            text: "客户对账单（合并孖拖）",
                            id: "42",
                            pid: null,
                            url: "/tms/report/client/GLClientChargeBillCntr2"
                        },
                        {
                            text: "珠海市集外协明细",
                            id: "18",
                            pid: null,
                            url: "/tms/report/client/shiJiWxQuery"
                        },
                        {
                            text: "汇通外协明细",
                            id: "20",
                            pid: null,
                            url: "/tms/report/client/huiTongWxQuery"
                        },
                        {
                            text: "珠海港物流外协明细",
                            id: "21",
                            pid: null,
                            url: "/tms/report/client/gangWuLiuWxQuery"
                        },
                        {
                            text: "汇通收入明细",
                            id: "22",
                            pid: null,
                            url: "/tms/report/client/huiTongIncomeQuery"
                        },
                        {
                            text: "港物流收入明细",
                            id: "23",
                            pid: null,
                            url: "/tms/report/client/gangWuLiuIncomeQuery"
                        },
                        {
                            text: "珠海市集收入明细",
                            id: "24",
                            pid: null,
                            url: "/tms/report/client/shiJiIncomeQuery"
                        },
                        {
                            text: "泛亚",
                            id: "14",
                            pid: null,
                            url: "/tms/report/client/fanYaQueryGL"
                        },
                        {
                            text: "安通",
                            id: "15",
                            pid: null,
                            url: "/tms/report/client/anTongQuery"
                        },
                        {
                            text: "上海中谷进口",
                            id: "16",
                            pid: null,
                            url: "/tms/report/client/zhongGuImpQuery"
                        },
                        {
                            text: "上海中谷出口",
                            id: "17",
                            pid: null,
                            url: "/tms/report/client/zhongGuExpQuery"
                        },
                        {
                            text: "和记(1)",
                            id: "19",
                            pid: null,
                            url: "/tms/report/client/heJiBillQuery1"
                        },
                        {
                            text: "和记(2)",
                            id: "25",
                            pid: null,
                            url: "/tms/report/client/heJiBillQuery2"
                        },
                        {
                            text: "安盈",
                            id: "26",
                            pid: null,
                            url: "/tms/report/client/anYingBillQuery"
                        },
                        {
                            text: "兴通",
                            id: "27",
                            pid: null,
                            url: "/tms/report/client/xingTongBillQuery"
                        },
                        {
                            text: "杨粤",
                            id: "28",
                            pid: null,
                            url: "/tms/report/client/yangYueBillQuery"
                        },
                        {
                            text: "永一峰",
                            id: "29",
                            pid: null,
                            url: "/tms/report/client/yongYiFengBillQuery"
                        },
                        {
                            text: "翔辉",
                            id: "30",
                            pid: null,
                            url: "/tms/report/client/xiangHuiBillQuery"
                        },
                        {
                            text: "广州宏峰",
                            id: "31",
                            pid: null,
                            url: "/tms/report/client/hongFengBillQuery"
                        },
                        {
                            text: "珠海益厚物流",
                            id: "33",
                            pid: null,
                            url: "/tms/report/client/yiHouBillQuery"
                        },
                        {
                            text: "壳牌业务",
                            id: "40",
                            pid: null,
                            url: "/tms/report/client/qiaoPaiBillQuery"
                        },
                        {
                            text: "海之峰",
                            id: "43",
                            pid: null,
                            url: "/tms/report/client/haiZhiFengBillQuery"
                        }
                    ]
                },
                {
                    text: '可乐项目',
                    pid: null,
                    children: [
                        {
                            text: "可乐业务总表",
                            id: "100",
                            pid: null,
                            url: "/tms/report/kele/client/colaTotalBillQuery"
                        },
                        {
                            text: "可乐业务统计表",
                            id: "101",
                            pid: null,
//                            url: "/tms/report/kele/client/keleBillQuery"
                            url: "/tms/report/client/keleBillQuery"
                        },
                        {
                            text: "邓杨金（外协）运输明细表",
                            id: "102",
                            pid: null,
                            url: "/tms/report/kele/client/keleOuterBillQuery"
                        },
                        {
                            text: "汽水运输情况汇总表",
                            id: "103",
                            pid: null,
                            url: "/tms/report/kele/client/keleTotalDetailBillQuery"
                        },
                        {
                            text: "汽水运输情况明细表",
                            id: "104",
                            pid: null,
                            url: "/tms/report/kele/client/keleDetailBillQuery"
                        }
                    ]
                },
                {
                    text: '洪湾',
                    pid: null,
                    children: [
                        {
                            text: "格力",
                            id: "103",
                            url: "/tms/report/client/anYingQuery"
                        },
                        {
                            text: "德豪",
                            id: "104",
                            url: "/tms/report/client/anYingQuery"
                        }
                    ]
                },
                {
                    text: "安盈物流结算清单",
                    id: "1",
                    pid: null,
                    url: "/tms/report/client/anYingQuery"

                },
                {
                    text: "港达进口对账单",
                    id: "2",
                    pid: null,
                    url: "/tms/report/client/gangDaImpQuery"
                },
                {
                    text: "深圳珠港对账单",
                    id: "3",
                    pid: null,
                    url: "/tms/report/client/shenZhenQuery"
                },
                {
                    text: "德豪雷士对账单",
                    id: "4",
                    pid: null,
                    url: "/tms/report/client/deHaoLeiShiQuery"
                },
                {
                    text: "格力对账单",
                    id: "5",
                    pid: null,
                    url: "/tms/report/client/geLiQuery"
                },
                {
                    text: "泛亚(洪湾)对账单",
                    id: "6",
                    pid: null,
                    url: "/tms/report/client/fanYaQuery"
                },
                {
                    text: "德豪润达对账单",
                    id: "7",
                    pid: null,
                    url: "/tms/report/client/deHaoRunDaQuery"
                },
                {
                    text: "港达出口对账单",
                    id: "8",
                    pid: null,
                    url: "/tms/report/client/gangDaExpQuery"
                },
                {
                    text: "业务数据汇总表",
                    id: "9",
                    pid: null,
                    url: "/tms/report/client/faZhanQuery"
                },
                {
                    text: "司机提成",
                    id: "10",
                    pid: null,
                    url: "/tms/report/client/driverBonusQuery"
                },
                {
                    text: "司机补贴",
                    id: "11",
                    pid: null,
                    url: "/tms/report/client/driverBenefitQuery"
                },
                {
                    text: "单车产值",
                    id: "12",
                    pid: null,
                    url: "/tms/report/client/singleCarValueQuery"
                },
                {
                    text: "合同预警",
                    id: "13",
                    pid: null,
                    url: "/tms/report/client/contractQuery"
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