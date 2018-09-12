<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="${path}/css/tvs.css" rel="stylesheet" type="text/css">
    <%--<script type="text/javascript"--%>
            <%--src="http://api.map.baidu.com/api?v=2.0&ak=2332ad22cda691b6bcceb955533bf76a"></script>--%>
    <script type="text/javascript"
            src="http://api.map.baidu.com/api?v=2.0&ak=Y1SFdaMIGUwIrLXutyEURTQB"></script>
    <title>车辆监控</title>
</head>
<body>
<ol class="breadcrumb">
    <span>当前位置：</span>
    <li class="active"><a href="javascript:;">我的主页</a></li>
</ol>
<div id="layout">
    <div parent-class="l-tree-layout" collapse-class="l-tree-layout" id="layout-left" position="left" title="车辆信息">
        <div class="tree-wrap" id="mainTreeWrapper">
            <ul id="mainTree"></ul>
            <div class="left-toggle limit-select" data-action="toggle-left"></div>
        </div>
    </div>
    <div id="layout-center" class="l-layout-center" position="center">
        <!-- 卡片界面 -->
        <div position="center" class="l-layout-content">
            <div class="toolbar-wrapper">
                <div id="toptoolbar"></div>
            </div>
            <div class="content-wrapper" id="centerWrapper">
                <div id="mapWrapper" class="wrapper">
                    <%--存放地图--%>
                    <div id="allmap"></div>
                </div>
                <div class="tabPanelWrapper" id="wrapper">
                    <div id="monitTab">
                        <div tabid="mainGridTab" title="全部" lselected="true">
                            <div class="gridWrapper">
                                <div id="mainGrid"></div>
                            </div>
                        </div>
                        <div tabid="runningGridTab" title="运行">
                            <div class="gridWrapper">
                                <div id="runningGrid"></div>
                            </div>
                        </div>
                        <div tabid="parkingGridTab" title="停车">
                            <div class="gridWrapper">
                                <div id="parkingGrid"></div>
                            </div>
                        </div>
                        <div tabid="warningGridTab" title="报警">
                            <div class="gridWrapper">
                                <div id="warningGrid"></div>
                            </div>
                        </div>
                        <div tabid="abnormalGridTab" title="异常">
                            <div class="gridWrapper">
                                <div id="abnormalGrid"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
<script id="markerInfo" type="text/html">
<div class="map-content">
    <table>
        <tbody>
        {{if TransData }}
            <tr>
                <td align="right"><h2>司机-车牌号：</h2></td>
                <td>
                    {{TransData.driver_name}}
                    -
                    {{Vehicle}}
                </td>
            </tr>
            <tr>
                <td align="right"><h2>柜号：</h2></td>
                <td>
                    {{TransData.cntr_no}}
                </td>
            </tr>
            <tr>
                <td align="right"><h2>任务状态：</h2></td>
                <td>
                    {{TransData.state_name}}
                </td>
            </tr>
            <tr>
                <td align="right"><h2>单据号：</h2></td>
                <td>
                    <a href="javascript:;" onclick="jumpDetail(this)">{{TransData.bill_no}}</a>
                    <span class="iconlist">{{TransData.pk_id}}</span>
                </td>
            </tr>
            <tr>
                <td align="right"><h2>客户：</h2></td>
                <td>
                    {{TransData.client_name}}
                </td>
            </tr>
            <tr>
                <td align="right"><h2>预抵时间：</h2></td>
                <td>
                    {{TransData.cntr_work_time}}
                </td>
            </tr>
            <tr>
                <td align="right">
                    <h2>货物信息：</h2>
                </td>
                <td>
                    {{TransData.cargo_info}}
                </td>
            </tr>
            <tr>
                <td align="right">
                    <h2>货物类型：</h2>
                </td>
                <td>
                   {{TransData.cargo_type}}
                </td>
            </tr>
            <tr>
                <td align="right">
                    <h2>货物数量：</h2>
                </td>
                <td>
                    {{TransData.cargo_qty}}
                </td>
            </tr>
            <tr>
                <td align="right">
                    <h2>货物单位：</h2>
                </td>
                <td>
                   {{TransData.cargo_unit}}
                </td>
            </tr>
        {{ /if}}
            <tr>
                <td align="right"><h2>定位时间：</h2></td>
                <td>{{GPSTime}}</td>
            </tr>
            <tr>
                <td align="right"><h2>里程：</h2></td>
                <td>{{Odometer}} km</td>
            </tr>
            <tr>
                <td align="right"><h2>速度：</h2></td>
                <td>{{Speed}} km/h</td>
            </tr>
            <tr>
                <td align="right"><h2>位置：</h2></td>
                <td>{{Provice}}{{City}}{{District}}</td>
            </tr>
            <tr>
                <td align="right"><h2>道路：</h2></td>
                <td>{{RoadName}}</td>
            </tr>
            <tr>
                <td align="right"><h2>地标：</h2></td>
                <td>{{AreaName}}</td>
            </tr>
            <tr>
                <td align="right"><h2>报警状态：</h2></td>
                <td>{{none}}</td>
            </tr>
            <tr>
                <td align="right"><h2>车辆状态：</h2></td>
                <td>{{Status}}</td>
            </tr>
            <tr>
                <td align="right"><h2>经度：</h2></td>
                <td>{{Lon}}</td>
            </tr>
            <tr>
                <td align="right"><h2>纬度：</h2></td>
                <td>{{Lat}}</td>
            </tr>
        </tbody>
    </table>
</div>
</script>
<script type="text/javascript" src="${path}/js/lib/utils/template.js?t=${applicationScope.sys_version}"></script>
<script type="text/javascript" src="${path}/js/tvs/index/index.js?t=${applicationScope.sys_version}"></script>
<script>
    function jumpDetail(e){
        var $this = $(e);
        jumpDetailEdit($this.next().text(), $this.text());
    }
    /**
     * 跳转到具体的页签
     * @param data
     */
    function jumpDetailEdit(identifier, name) {
        top.f_addTab(identifier, '任务[' + name + ']', rootPath + '/tms/busi/trans/loadCard/' + identifier
            + '?module=运输管理&function=调度任务&urlid=home');
    }
</script>
</html>
