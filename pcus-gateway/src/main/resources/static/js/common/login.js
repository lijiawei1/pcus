/**
 * Created by wujian on 2016/11/17.
 */
var topDialog = null;
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
        // top.$.ligerDialog.error("登录超时,请您重新登录!", "提示信息", toLogin);
        var html = '<div class="login-form"> <div class="login-warning" id="logout-error"> <span>错误信息</span> </div>' +
            ' <div class="input-group"><div class="input-group-addon i-user"></div> <input id="username2" type="text" placeholder="用户名" > </div>' +
            '<div class="input-group"><div class="input-group-addon i-password"></div> <input id="userpass2" type="password" placeholder="密码" > </div> </div>';

        topDialog = top.$.ligerDialog({
            content: html,
            title: '验证过期，需要重新登录',
            type: 'error',
            allowClose: false,
            buttons: [
                {
                    text: '登录',
                    id: 'logout-btn',
                    onclick: function (){
                        f_Login('logout');
                    }
                },
                { text: '取消', onclick: toLogin }
            ],
        });
        $(topDialog.element).find('input').keydown(function(e){
            e= e || event || window.event;
            if (e.keyCode == 13) {
                f_Login('logout');
            }
        });
    }
});

function showLoginError(text, type){
    text = text || "出错了";
    var Dom = type === 'logout' ? $(top.document).find('#logout-error') : $("#login-error");
    Dom.text(text).show();
    setTimeout(function(){
        Dom.addClass("ani-lr");
        setTimeout(function (){
            Dom.removeClass("ani-lr");
        },800);/*和css定义的动画时长同步*/
    },100);
}

function f_Login(type) {
    var body = type === 'logout' ?  $(top.document) : null;
    var $btn= type === 'logout' ? body.find('#logout-btn') : $("#login-btn"),
        uName = type === 'logout' ? body.find('#username2') : $("#username"),
        uPwd = type === 'logout' ? body.find('#userpass2') : $("#userpass"),
        error = type === 'logout' ? body.find('#logout-error'):  $("#login-error");

    if (!uName.val() || !uPwd.val()) {
        showLoginError("账号和密码不能为空", type);
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
        async: false,
        rawResult: false,
        data : {
            username : uName.val(),
            password : uPwd.val()
        },
        beforeSend: function () {
            if($btn.hasClass("disabled")) return;
            $btn.addClass("disabled").html("正在登录...");
        },
        success : function(result) {
            if (result.error) {
                showLoginError(result.message || "登录失败,帐号或密码错误", type);
                    $btn.removeClass("disabled").html('登<i class="space"></i>录');
                return ;
            }

            error.hide();
            $btn.removeClass("disabled").html('登<i class="space"></i>录');
            if (type === 'logout') {
                topDialog.close();
                var SelectedTabID = top.liger.get('framecenter').getSelectedTabItemID(),
                    url = $(window.parent.document).find('iframe[name=' +SelectedTabID + ']').attr('src');
                window.location.href = url;
            } else {
                window.open("/admin/index","TMS","width="+ screen.availWidth +",height="+ screen.availHeight +",top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=yes") ;
            }
        },
        error : function(message) {
            showLoginError("请求错误", type);
            $btn.removeClass("disabled").html('登<i class="space"></i>录');
        }
    });
}
function keyPress(e) {
    e= e || event || window.event;
    if (e.keyCode == 13) {
        f_Login.call(this,e);
    }
}
//跳转登录页面
function toLogin() {
    top.location = "/login.do";
}
