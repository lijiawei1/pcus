<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta name="renderer" content="webkit">
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
    <link rel="shortcut icon" href="/favicon.ico"/>
    <meta name="viewport" content="width=1366,user-scalable=yes">
    <!-- safari -->
    <meta name="format-detection" content="telephone=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <jsp:include page="common/header.jsp"/>
    <title>eport-tms</title>
    <script>
        var rootPath = '${pageContext.request.contextPath}';
        var username = '${user.name}';
    </script>
    <link href="${path}/css/index.css" type="text/css" rel="stylesheet">
    <style>
        .l-accordion-header-downfirst{
            border-top: none;
        }

        /*登录表单*/
        .login-form{
            background-color: #fff;
            position: relative;
            z-index: 15;
            width: calc(100% - 18px);
        }
        /*错误信息*/
        .login-form .login-warning{
            height: 34px;
            padding: 0 15px;
            line-height: 34px;
            margin: 20px 0;
            display: none;
            color: #a94442;
            background-color: #f2dede;
            border-color: #ebccd1;
            border-radius: 4px;
        }
        @-webkit-keyframes ani-lr {
            0% {
                -webkit-transform: translate(0, 0);
            }
            10% {
                -webkit-transform: translate(-20px, 0);
            }
            20% {
                -webkit-transform: translate(20px, 0);
            }
            30% {
                -webkit-transform: translate(-15px, 0);
            }
            40% {
                -webkit-transform: translate(15px, 0);
            }
            50% {
                -webkit-transform: translate(-10px, 0);
            }
            60% {
                -webkit-transform: translate(10px, 0);
            }
            70% {
                -webkit-transform: translate(-2px, 0);
            }
            80% {
                -webkit-transform: translate(2px, 0);
            }
            100% {
                -webkit-transform: translate(0, 0);
            }
        }
        @keyframes ani-lr {
            0% {
                transform: translate(0, 0);
            }
            10% {
                transform: translate(-20px, 0);
            }
            20% {
                transform: translate(20px, 0);
            }
            30% {
                transform: translate(-15px, 0);
            }
            40% {
                transform: translate(15px, 0);
            }
            50% {
                transform: translate(-10px, 0);
            }
            60% {
                transform: translate(10px, 0);
            }
            70% {
                transform: translate(-2px, 0);
            }
            80% {
                transform: translate(2px, 0);
            }
            100% {
                transform: translate(0, 0);
            }
        }
        .login-form .login-warning.ani-lr{
            -webkit-animation: ani-lr 0.9s ease-out 1;/*修改时长需要同步修改js*/
            animation: ani-lr 0.9s ease-out 1;
        }
        .no-ani .login-form .login-warning.ani-lr{
            -webkit-animation: none;
            animation: none;
        }
        @media screen and (max-height: 800px){
            .login-form .login-warning{
                margin: 15px 0;
            }
        }
        /*输入框*/
        .login-form .input-group{
            width: 100%;
            height: 34px;
            margin-top: 20px;
            margin-bottom: 20px;
            position: relative;
        }
        @media screen and (max-height: 800px){
            .login-form .input-group{
                margin-top: 15px;
                margin-bottom: 15px;
            }
        }
        .login-form .input-group-addon{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 5;
            width:34px;
            height: 100%;
            line-height: 34px;
            text-align: center;
            vertical-align: middle;
            background: transparent;
            border: none;
            padding:0;
            color: #c2d1d8;
        }
        .login-form .input-group-addon:before{
            content: "";
            width: 16px;
            height: 16px;
            margin-top: 8px;
            display: inline-block;
            background: url("../../images/login/icon-login.png") no-repeat;
        }
        .login-form .i-user.input-group-addon:before{
            background-position: 0 0;
        }
        .login-form .i-password.input-group-addon:before{
            background-position: 0 -16px;
        }
        .login-form .i-check.input-group-addon:before{
            background-position: 0 -32px;
        }
        .login-form .input-group input{
            width: calc(100% - 51px);
            padding: 6px 12px 6px 35px;
            border: 2px solid #c8cbd2;
            border-radius: 4px;
            background-color: #ecf5fa;
            font-size: 12px;
        }
        .login-form .input-group.check input{
            width:70%;
        }
        .login-form .input-group.check img{
            width:28%;
            height:34px;
            float: right;
        }
        /*登录按钮*/
        .login-form .login-btn{
            display: block;
            width: 55%;
            height: 30px;
            line-height: 30px;
            border-radius: 2px;
            background-color: #4dd17d;
            color: #fff;
            margin: 30px auto;
            padding: 0;
            text-align: center;
            cursor: pointer;
            text-decoration: none;
        }
        .login-form .login-btn:active{
            background-color: #2eb960;
        }
        .login-form .login-btn .space{
            display: inline-block;
            width: 2em;
        }
    </style>
</head>
<body style="overflow: hidden;">
	<div id="pageloading"></div>
    <div class="z-topmenu" id="top-menu">
        <div class="z-topmenu-welcome">
            <ul class="top-menu" id="navul">
                <%--
                修改项数，或者宽度需要：1.修改tab参数中的tabWidthDiff
                --%>
                <li class="menu-select">
                    <a href="javascript:;" title="${user.name}"><i class="iconfont l-icon-username"></i>${user.name}</a>
                    <ul>
                        <li class="menu-select-item"><a href="javascript:;" onclick="changePwd()" >修改密码</a></li>
                    </ul>
                </li>
                <li><a href="javascript:;" data-action="userManual"><i class="iconfont l-icon-usermanual"></i>用户手册</a></li>
                <li><a href="javascript:;" onclick="logout()" ><i class="iconfont l-icon-exit"></i>安全退出</a></li>
            </ul>
        </div>
    </div>
	<div id="layout1">
		<div position="left" title="">
			<div id="accordion"></div>
		</div>
		<div position="center" id="framecenter">
			<div tabid="home" title="我的主页">
                <iframe frameborder="0" name="home" id="home" src="${path}/tms/index/loadPage?no=005003"></iframe>
			</div>
		</div>
	</div>
    <!-- backtrack用于tab路径回溯 wujian 2016-11-15 -->
    <div id="backtrack" style="display: none"></div>
    <%-- 修改密码表单 --%>
    <form id="changePwdPanel"></form>
<script>
    (function addMenu(){
        var fun=window.onload;
        window.onload=function(){
            //执行已定义的函数
            if(typeof fun === "function") fun();
            //执行新的函数
            //添加薇页签，顶替最右的空隙
            $(".l-tab-links:eq(0)").children().prepend('<li class="close-all" tabid="close-all"><a>关闭所有</a></li>');
            //加入页脚
            var $layoutContent=$(".l-layout-center:eq(0)").children(".l-layout-content");
            $layoutContent.children(".l-tab-content").css("height",($layoutContent.children(".l-tab-content").height()-0)+"px");//28->0
            var resize=debounce(function () {
                //动态调整内容高度
                var height=$layoutContent.parent().height();
                $layoutContent.height(height);
                $layoutContent.children(".l-tab-content").css("height",( height - $layoutContent.children(".l-tab-links").height() - 0 )+"px");//28->0
            }, 200, true);

            $(window).resize(function () {
                resize();
            });
            window.resizeTo(screen.availWidth,screen.availHeight);
        }
    })();

    $(function() {
        $("body").click(function(e){
            var $tg=$(e.target);

            if($tg.attr("tabid")=="close-all"){//关闭所有
                if (tab.trigger('closeall') == false) return;
                tab.removeAll();
                tab.selectTabItem("home");
            }
            else if($tg.hasClass("l-layout-header-toggle") || $tg.hasClass("l-layout-collapse-left-toggle")){
                //重新计算是否显示tab的左右滑动按钮
                tab && tab.setTabButton && tab.setTabButton();
            }
            else if($tg.attr("data-action")=="userManual"){
                typeof f_addTab === "function" && f_addTab("userManual","用户手册","${path}/tms/userCenter/userManual/loadPage");
            }
            else{
                var $menuListItem=$tg.parent().hasClass("menulist")?$tg:$tg.parents("[menuno]");
                if($menuListItem.length>0 && $menuListItem.parent().hasClass("menulist")){//点击左侧二级菜单
                    activeMenuListItem($menuListItem);
                }
            }
        });

        var pagecounter = 0;
        $.ajax({
            url: rootPath + '/auth/admin/loadButtons',
            dataType: 'json',
            type: 'get',
            data: { parentPageNo : "009001" },
            success: function(data) {
                if(data.length != 0 ){return}
                $('<div class="top-page">'
                + '<div class="top-page-iframe"><iframe src="" width="100%" height="100%"></iframe></div>'
                + '<div class="top-page-button top-page-up" title="展开运营数据可视化"><i class="l-icon l-icon-down "></i></div>'
                + '</div>').appendTo($('body'));

                var $topPage = $(".top-page"),
                     $layout = $("#layout1"),
                     $topIframe = $(".top-page-iframe").children('iframe');
                $(".top-page-button").bind('click',function(e){
                    var dom = $(this).children("i");
                    if($(this).hasClass("top-page-up") ){
                        if(pagecounter == 0){
                            $topIframe.attr('src',rootPath +　'/tms/visualData/loadPage');
                            pagecounter += 1;
                        }
                        $(this).removeClass("top-page-up").addClass("top-page-down").attr("title","关闭运营数据可视化");
                        $topPage.removeClass("top-page-hide").addClass("top-page-show");
                        dom.removeClass("l-icon-down").addClass("l-icon-up");
                    }else if($(this).hasClass("top-page-down") ){
                        $(this).removeClass("top-page-down").addClass("top-page-up").attr("title","展开运营数据可视化");
                        $topPage.removeClass("top-page-show").addClass("top-page-hide");
                        dom.removeClass("l-icon-up").addClass("l-icon-down");
                    }
                });
            },
            error: function(data) {
            }
        });
    });

//    $(window).on("beforeunload",function () {
//        return false;
//    });
</script>
</body>
</html>
