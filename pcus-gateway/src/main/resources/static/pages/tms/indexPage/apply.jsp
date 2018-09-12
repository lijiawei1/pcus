<%--
  Created by IntelliJ IDEA.
  User: wujian
  Date: 2016/11/8
  Time: 19:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<!--[if lte IE 8 ]><html class="ie8" lang="zh-cn"><![endif]-->
<!--[if IE 9 ]><html class="ie9" lang="zh-cn"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html class="" lang="zh-cn"><!--<![endif]-->
<head>
    <title>eport-tms 申请免费试用</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=1366,user-scalable=yes">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
    <!-- safari -->
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <link src="${path}/js/lib/jquery-fullPage/jquery.fullPage.css" rel="stylesheet" type="text/css">
    <link href="${path}/css/indexPage/indexPage.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css">
    <link href="${path}/css/indexPage/apply.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css">
    <!--[if lt IE 9]>
    <script src="/js/lib/respond.min.js?t=${applicationScope.sys_version}"></script>
    <![endif]-->
</head>
<body>
<div class="header">
    <div class="container clearfix">
        <a class="logo fl" href="/login"></a>
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
                    <input id="username" type="text" placeholder="用户名"/>
                </div>
                <div class="input-group">
                    <div class="input-group-addon i-password"></div>
                    <input id="userpass" type="password" placeholder="密码">
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
<!-- 页面主体 -->
<div class="main-wrap">
    <div class="main">
        <div class="main-inner">
            <div class="main-title">免费申请试用</div>
            <div class="apply-form">
                <div class="input-group">
                    <label>公司名称：</label>
                    <input name="corp" type="text" placeholder="请输入公司名称">
                </div>
                <div class="input-group">
                    <label>联  系  人：</label>
                    <input name="linkman" type="text" placeholder="请输入联系人">
                </div>
                <div class="input-group">
                    <label>联系电话：</label>
                    <input name="mobile" type="text" placeholder="请输入联系电话">
                </div>
                <div class="btn btn-default btn-apply">申请免费试用</div>
            </div>
        </div>
    </div>
</div>
<!-- 版权信息 -->
<div class="copy-right">
    <div class="copy-right-inner">
        珠海港信息技术股份有限公司 &copy; 2016&nbsp;&nbsp;&nbsp;&nbsp;版权所有&nbsp;&nbsp;&nbsp;&nbsp;地址：珠海市高栏港经济区榕树湾8号22楼2201-2号&nbsp;&nbsp;&nbsp;&nbsp;联系电话：+86-756-8131883
    </div>
</div>

<script src="${path}/js/lib/jquery/jquery-1.11.1.min.js" type="text/javascript"></script>

<script type="text/javascript">
    $(function(){
        //登录框
        $("#btn-login").on("click",function () {
            $("#login-con").toggleClass("active");
        });

        $(".btn-apply").on("click", function() {

            var form = $(".apply-form");
            var data = {
                corp: form.find("input[name=corp]").val(),
                linkman: form.find("input[name=linkman]").val(),
                mobile: form.find("input[name=mobile]").val(),
            }

            if (!data.corp) alert("请输入公司");
            if (!data.linkman) alert("请输入公司");
            if (!data.mobile) alert("请输入手机号码");

            $.ajax({
                url: rootPath + '/tms/indexPage/indexPage/applyUse',
                data: data,
                cache: false,
                async: true,
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                dataType: 'json',
                type: 'post',
                success: function (result) {
                    if (!result) return;
                    if (!result.error) {
                        alert("申请已提交，请耐心等待客服联系");
                    } else {
                        alert("申请失败、" +
                                "" + result.message);
                    }
                },
                error: function (result) {
                    alert("申请失败");
                }
            });

        });

    });
</script>
<script src="${path}/js/common/login.js" type="text/javascript"></script>
</body>
</html>
