<%--
  Created by IntelliJ IDEA.
  User: wujian
  Date: 2016/11/8
  Time: 19:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<jsp:include page="./tms/indexPage/base.jsp"/>
<!DOCTYPE html>
<!--[if lte IE 8 ]><html class="ie8" lang="zh-cn"><![endif]-->
<!--[if IE 9 ]><html class="ie9" lang="zh-cn"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html class="" lang="zh-cn"><!--<![endif]-->
<head>
    <title>eport-tms</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=1366,user-scalable=yes">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
    <!-- safari -->
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <%--<link href="/js/lib/jquery-fullPage/jquery.fullPage.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css">--%>
    <link href="${path}/css/indexPage/indexPage.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css">
    <style id="page-bg-style"></style>
    <!--[if lt IE 9]>
    <script src="${path}/js/lib/respond.min.js?t=${applicationScope.sys_version}"></script>
    <![endif]-->
</head>
<body>
<div class="header">
    <div class="container clearfix">
        <div class="logo fl" data-action="backtop"></div>
        <div class="right fr">
            <a class="btn btn-default" href="${path}/tms/indexPage/indexPage/download">下载APP</a>
            <span class="btn btn-login" id="btn-login">登录</span>
        </div>
    </div>
</div>
<!-- 登录框 -->
<div class="login-fix">
    <div class="container">
        <div class="login-con" id="login-con">
            <div class="tri-up"></div>
            <!-- 登陆表单 -->
            <div class="login-form">
                <div class="title">
                    <span class="cn">用户登录</span>
                    <span class="en">UserLogin</span>
                </div>
                <div class="login-warning" id="login-error">
                    <span>错误信息</span>
                </div>
                <div class="input-group">
                    <div class="input-group-addon i-user"></div>
                    <input id="username" type="text" placeholder="用户名" onkeypress="keyPress();">
                </div>
                <div class="input-group">
                    <div class="input-group-addon i-password"></div>
                    <input id="userpass" type="password" placeholder="密码" onkeypress="keyPress();">
                </div>
                <%--
                <div class="input-group check">
                    <div class="input-group-addon i-check"></div>
                    <input id="userCheck" type="text" placeholder="验证码">
                    <img id="captcha-img" onclick="this.src='/captcha?t=' + Math.random()" src="/captcha.do"/>
                </div>
                --%>
                <a class="btn login-btn limit-select" id="login-btn">登<i class="space"></i>录</a>
            </div>
            <!-- 登录框底部 -->
            <div class="login-bottom limit-select">
                <label class="item limit-select" title="自动登录">
                    <input type="checkbox">
                    <span class="checkbox"></span>
                    自动登陆
                </label>
                <a class="item" href="javascript:;" title="忘记密码">忘记密码</a>
            </div>
        </div>
    </div>
</div>
<div id="fullpage">
    <!-- 首屏 -->
    <div class="section">
        <div class="banner-wrap">
            <div class="container banner">
                <div class="item item1"></div>
                <div class="item item2"></div>
                <div class="item item3"></div>
                <a class="btn btn-default" href="${path}/tms/indexPage/indexPage/apply">申请免费试用</a>
            </div>
        </div>
        <div class="banner-bottom">
            <div class="banner-bottom-txt"></div>
        </div>
    </div>
    <!-- 第一页-->
    <div class="section">
        <div class="page-bg">
            <div class="bg page-bg1"></div>
        </div>
        <div class="page-content page-content1">
            <div class="big-container clearfix">
                <div class="left fl">
                    <div class="title2">订单流转/在线协同/过程管控/全程追踪</div>
                    <div class="normal-text">货车司机---物流公司---货主</div>
                    <ul class="item-list clearfix">
                        <li class="item normal-text i1">订单流转</li>
                        <li class="item normal-text i2">在线协同</li>
                        <li class="item normal-text i3">过程管控</li>
                        <li class="item normal-text i4">全程追踪</li>
                    </ul>
                    <a class="btn btn-default" href="${path}/tms/indexPage/indexPage/apply">申请免费试用</a>
                </div>
                <div class="right fr"></div>
            </div>
        </div>
    </div>
    <!-- 第二页-->
    <div class="section">
        <div class="page-bg">
            <div class="bg page-bg2"></div>
        </div>
        <div class="page-content page-content2">
            <div class="big-container clearfix">

                <div class="left fl">

                    <div class="left-item left-item1">
                        <div class="top clearfix">
                            <div class="mask"></div>
                            <div class="v-line fr"></div>
                        </div>
                        <div class="bottom">
                            <div class="mask"></div>
                            <div class="text normal-text">基础信息接口</div>
                            <div class="text-line">
                                <div class="circle l-circle"></div>
                                <div class="h-line"></div>
                            </div>
                        </div>
                    </div>

                    <div class="left-item left-item2">
                        <div class="top">
                            <div class="mask"></div>
                            <div class="v-line"></div>
                        </div>
                        <div class="bottom">
                            <div class="mask"></div>
                            <div class="text-line">
                                <div class="h-line"></div>
                                <div class="circle r-circle"></div>
                            </div>
                            <div class="text normal-text">订单信息接口</div>
                        </div>
                    </div>

                    <div class="left-item left-item3">
                        <div class="top">
                            <div class="mask"></div>
                            <div class="v-line"></div>
                        </div>
                        <div class="bottom">
                            <div class="mask"></div>
                            <div class="text-line">
                                <div class="h-line"></div>
                                <div class="circle r-circle"></div>
                            </div>
                            <div class="text normal-text">监控数据接口</div>
                        </div>
                    </div>

                    <div class="left-item left-item4">
                        <div class="top">
                            <div class="mask"></div>
                            <div class="v-line"></div>
                        </div>
                        <div class="bottom">
                            <div class="mask"></div>
                            <div class="text-line">
                                <div class="h-line"></div>
                                <div class="circle r-circle"></div>
                            </div>
                            <div class="text normal-text">运输计划接口</div>
                        </div>
                    </div>

                </div>

                <div class="right fr">
                    <div class="title2">社交商圈/运力支持/信誉积累/品质征信</div>
                    <ul class="item-list clearfix">
                        <li class="item i1 normal-text">开放KPI</li>
                        <li class="item i2 normal-text">简易操作</li>
                        <li class="item i3 normal-text">数据保密</li>
                        <li class="item i4 normal-text">客户放心</li>
                    </ul>
                    <a class="btn btn-default" href="${path}/tms/indexPage/indexPage/apply">申请免费试用</a>
                </div>

            </div>
        </div>
    </div>
    <!-- 第三页-->
    <div class="section">
        <div class="page-bg">
            <div class="bg page-bg3"></div>
        </div>
        <div class="page-content page-content3">
            <div class="big-container clearfix">
                <div class="left fl">
                    <div class="title1">产品支持</div>
                    <div class="title2">PC端</div>
                    <div class="normal-text">提供专属账号，操作简单，支持全方位、全要素、全过程管理物流业务</div>
                    <div class="title2">APP</div>
                    <div class="normal-text">司机专属应用，实时连接司机</div>
                    <div class="title2">微信公众服务号</div>
                    <div class="normal-text">实现随时、随地跟踪收发货业务</div>
                    <a class="btn btn-default" href="${path}/tms/indexPage/indexPage/apply">申请免费试用</a>
                </div>
                <div class="right fr"></div>
            </div>
        </div>
    </div>
    <!-- 第四页-->
    <div class="section">
        <div class="page-bg">
            <div class="bg page-bg4"></div>
        </div>
        <div class="page-content page-content4">
            <div class="big-container">
                <div class="step-content">
                    <div class="title title1">步骤流程</div>
                    <div class="step step1" title="申请试用"></div>
                    <div class="step step2" title="上门演示"></div>
                    <div class="step step3" title="现场培训"></div>
                    <div class="step step4" title="远程支持"></div>
                    <div class="step step5" title="定期迭代"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- 第五页-->
    <div class="section">
        <div class="page-content page-content5">
            <div class="content">
                <div class="normal-text">因为专业/所以信赖</div>
                <div class="title1">更多惊喜，邀<span class="c-orange">您</span>体验....</div>
                <a class="btn btn-default" href="${path}/tms/indexPage/indexPage/apply">申请免费试用</a>
            </div>
        </div>
        <!-- 版权信息 -->
        <div class="copy-right">
            <div class="copy-right-inner">
                珠海港信息技术股份有限公司 &copy; 2016&nbsp;&nbsp;&nbsp;&nbsp;版权所有&nbsp;&nbsp;&nbsp;&nbsp;地址：珠海市高栏港经济区榕树湾8号22楼2201-2号&nbsp;&nbsp;&nbsp;&nbsp;联系电话：+86-756-8131883
            </div>
        </div>
    </div>
</div>

<div class="backtop" title="返回顶部" data-action="backtop"></div>

<script src="${path}/js/lib/jquery/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-fullPage/jquery.fullPage.min.js"></script>
<script>
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, thisArg) {
            var T, k;
            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }
            var O = Object(this);
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32
            if ({}.toString.call(callback) != "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }
            if (thisArg) {
                T = thisArg;
            }
            k = 0;
            while (k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }
</script>
<script src="${path}/js/lib/utils/throttle.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script>

    var rootPath = '${path}';
    $(function(){

        if(!("animation" in document.body.style)){
            $("body").addClass("no-ani");
        }

        $('#fullpage').fullpage({
            scrollingSpeed : 500,
            afterLoad:function(anchorLink, index){
                if(index===1){
                    $(".backtop").hide();
                }
                else{
                    $(".backtop").show();
                }
            }
        });

        //登录框
        $("#btn-login").on("click",function () {
            $("#login-con").toggleClass("active");
        });

        //返回顶部
        $("body").on("click","[data-action='backtop']",function () {
            $.fn.fullpage.setScrollingSpeed(500*$("#fullpage").children(".section.active:eq(0)").index());
            $.fn.fullpage.moveTo(1);
            $.fn.fullpage.setScrollingSpeed(500);
        });

        //背景图高度
        var $pageContent=$(".page-content:eq(0)");
        var resize=debounce(function () {
            $("#page-bg-style").html('.page-bg{padding-bottom:'+ $pageContent.outerHeight() +'px;}');
        }, 200, true);
        resize();

        $(window).resize(function () {
            resize();
        });
    });
</script>
<script src="${path}/js/common/login.js" type="text/javascript"></script>
</body>
</html>
