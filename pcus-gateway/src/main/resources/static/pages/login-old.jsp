<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=1300,user-scalable=yes">
    <meta name="renderer" content="webkit">
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
    <title>eport-tms</title>
    <script src="/js/lib/jquery/jquery-1.11.1.min.js" type="text/javascript"></script>
    <link href="/css/tms/login.css" rel="stylesheet" type="text/css" />
</head>
<body>
<header class="header">
    <div class="container">
        <div class="logo"></div>
        <div class="links">
            <a href="javascript:;" title="物流e港">物流e港</a>
            <a href="javascript:;" title="帮助中心">帮助中心</a>
        </div>
    </div>
</header>
<main class="main">
    <div class="login-con s-form">
        <!-- 切换提示 -->
        <div class="login-switch-tips tips-qr">
            点击扫码，下载APP
        </div>
        <div class="login-switch-tips tips-form">
            返回登录
        </div>
        <!-- 切换按钮 -->
        <div class="login-switch limit-select" >
            <div class="login-switch-inner" id="login-switch"></div>
        </div>
        <!-- 二维码 -->
        <div class="login-qr">
            <div class="title">扫一扫下载APP</div>
            <img class="qr-img" src="/images/login/app-qr.png" alt="APP下载二维码" title="扫一扫下载APP">
        </div>
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
</main>
<footer class="footer">
    <div class="container">
        <div class="link-etc">
            <ul class="clearfix">
                <li>
                    <div class="title">友情链接：</div>
                    <ul class="content">
                        <li><a href="http://www.zhport.com.cn/" title="珠海港控股集团有限公司" target="_blank">珠海港控股集团有限公司</a></li>
                        <li><a href="http://www.0507.com.cn" title="珠海港股份有限公司" target="_blank">珠海港股份有限公司</a></li>
                        <li><a href="http://www.zphit.com/" title="珠海港信息技术股份有限公司" target="_blank">珠海港信息技术股份有限公司</a></li>
                    </ul>
                </li>
                <li>
                    <div class="title">合作伙伴：</div>
                    <ul class="content">
                        <img src="/images/login/zph.png" alt="珠海港" title="珠海港" height="25"/>
                    </ul>
                </li>
                <li>
                    <div class="title">微信关注我们：</div>
                    <ul class="content">
                        <img src="/images/login/weixin.png" alt="物流E港二维码" title="物流E港二维码"/>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
    <div class="copy-right">
        <div class="copy-right-inner">
            珠海港信息技术股份有限公司 &copy; 2016 版权所有  地址：珠海市高栏港经济区榕树湾8号22楼2201-2号  联系电话：+86-756-8131883
        </div>
    </div>
</footer>
<script type="text/javascript">
    $(function() {
        //placeholder修复
        (function fixedPlaceHolder() {
            var $inputArr = $("input[placeholder]");
            //当没有input或者input支持placeholder时退出
            if ($inputArr.length <= 0 || "placeholder" in $inputArr[0]) return;
            //添加元素到dom
            $inputArr.each(function () {
                var $this = $(this);
                $this.after('<span class="placeholder">' + $this.attr("placeholder") + '</span>');
            });
            //事件监听
            $("body").on("click", ".placeholder", function () {
                var $this = $(this);
                $this.hide().siblings("input").focus();
            });
            $inputArr.on({
                "focus":function(){
                    $(this).siblings(".placeholder").hide();
                },
                "blur":function () {
                    var $this = $(this);
                    if (!$this.val()) {
                        $this.siblings(".placeholder").show();
                    }
                }
            });
        })();
        //登录按钮点击
        $("#login-btn").on("click",f_Login);
        //这段是遗留代码，当在系统中登录超时后，点击菜单，框架中会加载这个登陆页
        if (top.tab) {//通过判断这个登陆页是不是被框架加载，来控制跳转
            document.execCommand("stop");
            top.$.ligerDialog.error("登录超时,请您重新登录!", "提示信息", toLogin);
        }
        //登陆切换
        $("#login-switch").on({
            "click":function(){
                var $parent=$(this).parents(".login-con");
                if($parent.hasClass("s-form")){
                    $parent.removeClass("s-form").addClass("s-qr");
                }
                else{
                    $parent.removeClass("s-qr").addClass("s-form");
                }
                $parent.removeClass("zoomout099");
            },
            "mousedown":function () {
                $(this).parents(".login-con").addClass("zoomout099");
            },
            "mouseleave ":function () {
                var $parent=$(this).parents(".login-con");
                if($parent.hasClass("zoomout099")){
                    $(this).trigger("click");
                }
            }
        });
    });

    function showLoginError(text){
        text = text || "出错了";
        $("#login-error").text(text).show();
        setTimeout(function(){
            $("#login-error").addClass("ani-lr");
            setTimeout('$("#login-error").removeClass("ani-lr")',800);/*和css定义的动画时长同步*/
        },100);
    }

    function f_Login() {
        var $btn=$("#login-btn");

        var uName = $("#username").val();
        var uPwd = $("#userpass").val();
        if (!uName || !uPwd) {
            showLoginError("账号和密码不能为空");
            return false;
        }
        //提交
        $.ajax({
            url : "/checklogin",
            async: true,
            cache: false,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            dataType: 'json',
            type: 'post',
            rawResult: false,
            data : {
                username : uName,
                password : uPwd
            },
            beforeSend: function () {
                if($btn.hasClass("disabled")) return;
                $btn.addClass("disabled").html("正在登录...");
            },
            success : function(result) {
                if (result.error) {
                    showLoginError("登录失败,帐号或密码错误");
                    $btn.removeClass("disabled").html('登<i class="space"></i>录');
                }
                else{
                    $("#login-error").hide();
                    $btn.html('登录成功，正在跳转');
                    location.href = "/admin/index";
                }
            },
            error : function(message) {
                showLoginError("请求错误");
                $btn.removeClass("disabled").html('登<i class="space"></i>录');
            }
        });
    }

    //回车登录
    $(document).keydown(function(e) {
        if (e.keyCode == 13) {
            f_Login();
        }
    });
    //跳转登录页面
    function toLogin() {
        top.location = "/login.do";
    }

</script>
</body>
</html>