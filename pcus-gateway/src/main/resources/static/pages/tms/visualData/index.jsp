<%--
  Created by IntelliJ IDEA.
  User: wujian
  Date: 2017/2/27
  Time: 16:55
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<head>
    <title>运营数据可视化</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=1366,user-scalable=yes">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
    <!-- safari -->
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link href="/css/visualData/index.css" rel="stylesheet" type="text/css">
    <script>
        var rootPath = '${pageContext.request.contextPath}';
    </script>
    <style>
        .page-star{
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
        }
        @-webkit-keyframes starappear {
            0% {opacity: 0}
            55% {opacity: 0.7}
            100% {opacity: 0}
        }
        @keyframes starappear{
            0% {opacity: 0}
            55% {opacity: 0.7}
            100% {opacity: 0}
        }
        .page-star-item{
            width: 5px;
            height: 5px;
            border-radius: 100%;
            background-color: #eee;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;

            -webkit-animation: starappear 4s linear 0s infinite both;
            animation: starappear 4s linear 0s infinite both;
        }
    </style>
</head>
<body>
<div class="page-container" id="main-page">
    <div class="header">
        <div class="header-title">
            <div class="header-title-inner">运营数据可视化</div>
        </div>
    </div>
    <div class="main clearfix">
        <div class="main-left fl">
            <div class="main-left-top">
                <div class="main-left-top-inner data-img-item" id="chart-left-top"></div>
            </div>
            <div class="main-left-bottom data-img-item" id="chart-left-bottom"></div>
        </div>

        <div class="main-center fl">
            <div class="main-center-top">
                <div class="main-center-top-inner data-img-item"  id="chart-center-top"></div>
            </div>
            <div class="main-center-bottom clearfix">
                <div class="main-center-bottom-left fl">
                    <div class="main-center-bottom-left-inner data-img-item" id="chart-center-bottom-left"></div>
                </div>
                <div class="main-center-bottom-right fl data-img-item" id="chart-center-bottom-right"></div>
            </div>
        </div>

        <div class="main-right fl">
            <div class="main-right-top">
                <div class="main-right-top-inner data-img-item" id="chart-right-top"></div>
            </div>
            <div class="main-right-bottom data-img-item"  id="chart-right-bottom"></div>
        </div>
    </div>
    <div class="copy-right">
        <div class="copy-right-inner">
            珠海港信息技术股份有限公司 &copy; 2016&nbsp;&nbsp;&nbsp;&nbsp;版权所有&nbsp;&nbsp;&nbsp;&nbsp;地址：珠海市高栏港经济区榕树湾8号22楼2201-2号&nbsp;&nbsp;&nbsp;&nbsp;联系电话：+86-756-8131883
        </div>
    </div>
</div>
<div class="page-star" id="page-star">
</div>
<script type="text/html" id="left-top-template">
    <div class="data-img-item-title">运作情况一览</div>
    <div class="list-top-con">
        <div class="list-con-inner list-top-inner">
            <div class="list-item list-title list-top-title">人员信息</div>
            <div class="list-item">
            </div>
            <div class="list-item">
                <div class="list-item-inner">在线用户：<span class="number-wrap">{{USER_INFO.USER_QTY}}</span></div>
            </div>
            <div class="list-item">
                <div class="list-item-inner">排班司机：<span class="number-wrap">{{USER_INFO.DRIVER_QTY}}</span></div>
            </div>
            <div class="list-item">
                <div class="list-item-inner">车辆状态：<span class="number-wrap">{{vehcileInfo.TOTAL}}</span>
                    <div class="list-item-sub">（运行：<span class="number-wrap">{{vehcileInfo.RUNNING}}</span>&nbsp;停车：<span class="number-wrap">{{vehcileInfo.PARKING}}</span>）<br>（报警：<span class="number-wrap">{{vehcileInfo.WARNING < 0 ? 0 : vehcileInfo.WARNING}}</span>&nbsp;异常：<span class="number-wrap">{{vehcileInfo.ERROR}}</span>）</div>
                </div>
            </div>
            <div class="list-item">
            </div>
        </div>
    </div>
    <div class="list-bottom-con">
        <div class="list-con-inner list-bottom-inner">
            <div class="list-item list-title list-bottom-title">订单信息</div>
            <div class="list-item">
            </div>
            <div class="list-item">
                <div class="list-item-inner">订单数量：<span class="number-wrap">{{BILL_INFO.ORDER_YESTERDAY_QTY + BILL_INFO.ORDER_TODAY_QTY}}</span>
                    <div class="list-item-sub">（昨日：<span class="number-wrap">{{BILL_INFO.ORDER_YESTERDAY_QTY}}</span>&nbsp;今日：<span class="number-wrap">{{BILL_INFO.ORDER_TODAY_QTY}}</span>）</div>
                </div>
            </div>
            <div class="list-item">
                <div class="list-item-inner">任务数量：<span class="number-wrap">{{BILL_INFO.TRANS_YESTERDAY_QTY + BILL_INFO.TRANS_TODAY_QTY}}</span>
                    <div class="list-item-sub">（昨日：<span class="number-wrap">{{BILL_INFO.TRANS_YESTERDAY_QTY}}</span>&nbsp;今日：<span class="number-wrap">{{BILL_INFO.TRANS_TODAY_QTY}}</span>）</div>
                </div>
            </div>
            <div class="list-item">
            </div>
        </div>
    </div>
</script>
<script src="${path}/js/lib/jquery/jquery-1.11.1.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/throttle.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/template.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/echarts/echarts.min.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/echarts/theme/starbg.js?t=${applicationScope.sys_version}"></script>
<script>
    $(function () {
        (function resizePage() {
            //页面按比例缩放
            var $mainPage=$("#main-page"),
                    $body = $("body"),
                    minRatio = 1920/1080,
                    maxRatio = 1280/563;

            var resize=debounce(function () {
                var bodyWidth = $body.width(),
                        bodyHeight = $body.height(),
                        ratio = bodyWidth / bodyHeight;
                if(ratio > maxRatio){
                    $mainPage.css({
                        width:  maxRatio * bodyHeight,
                        height: bodyHeight
                    });
                }
                else if(ratio < minRatio){
                    $mainPage.css({
                        width:  bodyWidth,
                        height: bodyWidth / minRatio
                    });
                }
                else{
                    $mainPage.css({
                        width:  bodyWidth,
                        height: bodyHeight
                    });
                }
                $mainPage.trigger("pageResize");
            }, 200, true);
            resize();

            $(window).resize(function () {
                resize();
            });
        })();

        (function star() {
            //星星闪动
            function Star() {
                var $con = $("#page-star"),
                        x = Math.random() * $con.width(),
                        y = Math.random() * $con.height();
                var str = '<span class="page-star-item" style="-webkit-transform: translate('+ x +'px,'+ y +'px);transform: translate('+ x +'px,'+ y +'px);"></span>';
                this.$elem=$(str).appendTo("#page-star");
            }

            if(("animation" in document.body.style) || ("webkitAnimation" in document.body.style)){
                for(var i = 0; i < 50; i++){
                    setTimeout(function () {
                        new Star();
                    }, Math.random() * 3000);
                }
            }
        })();
    });
</script>
<script src="${path}/js/tms/visualData/index.js?t=${applicationScope.sys_version}"></script>
</body>
</html>
