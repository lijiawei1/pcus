//获取QueryString的数组
function getQueryString()
{
    var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
    if (result == null)
    {
        return "";
    }
    for (var i = 0; i < result.length; i++)
    {
        result[i] = result[i].substring(1);
    }
    return result;
}
//根据QueryString参数名称获取值
function getQueryStringByName(name)
{
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1)
    {
        return "";
    }
    return result[1];
}
//根据QueryString参数索引获取值
function getQueryStringByIndex(index)
{
    if (index == null)
    {
        return "";
    }
    var queryStringList = getQueryString();
    if (index >= queryStringList.length)
    {
        return "";
    }
    var result = queryStringList[index];
    var startIndex = result.indexOf("=") + 1;
    result = result.substring(startIndex);
    return result;
}

(function ($)
{

    //全局事件
    $(".l-dialog-btn").on('mouseover', function ()
    {
        $(this).addClass("l-dialog-btn-over");
    }).on('mouseout', function ()
    {
        $(this).removeClass("l-dialog-btn-over");
    });
    $(".l-dialog-tc .l-dialog-close").on('mouseover', function ()
    {
        $(this).addClass("l-dialog-close-over");
    }).on('mouseout', function ()
    {
        $(this).removeClass("l-dialog-close-over");
    });
    //搜索框 收缩/展开
    $(".searchtitle .togglebtn").on('click',function(){
        if($(this).hasClass("togglebtn-down")) $(this).removeClass("togglebtn-down");
        else $(this).addClass("togglebtn-down");
        var searchbox = $(this).parent().nextAll("div.searchbox:first");
        searchbox.slideToggle('fast');
    });

    $(document).keydown(function (e) {
        var doPrevent;
        if (e.keyCode == 8) {
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }
            else
                doPrevent = true;
        }
        else
            doPrevent = false;

        if (doPrevent)
            e.preventDefault();
    });

})(jQuery);

$(function newCommon() {
    //input粘贴事件，去掉首尾空白字符
    $("body").on("paste","input[type=text]",function (e) {
        e.preventDefault();
        var text = null,textRange,sel;

        if(window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text');
        } else {
            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
        }
        
        //去掉首尾空格
        text = $.trim(text);

        if (document.body.createTextRange) {
            if (document.selection) {
                textRange = document.selection.createRange();
            } else if (window.getSelection) {
                sel = window.getSelection();
                var range = sel.getRangeAt(0);

                // 创建临时元素，使得TextRange可以移动到正确的位置
                var tempEl = document.createElement("span");
                tempEl.innerHTML = "&#FEFF;";
                range.deleteContents();
                range.insertNode(tempEl);
                textRange = document.body.createTextRange();
                textRange.moveToElementText(tempEl);
                tempEl.parentNode.removeChild(tempEl);
            }
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
        } else {
            // Chrome之类浏览器
            document.execCommand("insertText", false, text);
        }
    });

    //动画效果
    (function addAnimate() {
        var fun = window.onload;
        window.onload = function () {
            if (typeof fun === "function") {
                fun();
            }
            if(parent !== top) {
                $("body").addClass("in-iframe");
                return;
            }
            if(getQueryStringByName("ani")==="no"){
                return;
            }
            if (Math.round(Math.random()) & 1) {
                if ($(".l-container").addClass("animation appearRTL").length <= 0) {
                    $("body").addClass("animation appearRTL");
                }
            }
            else {
                if ($(".l-container").addClass("animation appearBTT").length <= 0) {
                    $("body").addClass("animation appearBTT");
                }
            }
        }
    })();

    //placeholder修复
    (function fixedPlaceHolder() {
        var $inputArr = $("input[placeholder]");
        //当没有input或者input支持placeholder时退出
        if ($inputArr.length <= 0 || "placeholder" in $inputArr[0]) return;
        //添加元素到dom
        $inputArr.each(function () {
            var $this = $(this);
            $this.after('<span class="placeholder" style="position: absolute;">' + $this.attr("placeholder") + '</span>');
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

    //隐藏式搜索框状态控制
    (function hiddenSearchCtrl(){
        var $hiddenSearch=$(".hidden-search");
        $hiddenSearch.on("click",function () {
            if($(this).hasClass("hover")) return;
            $(this).addClass("hover")
        });
        $hiddenSearch.find(".cancel").on("click",function(e){
            $(this).parents(".hidden-search").removeClass("hover");
            e.stopPropagation();
        });
    })();

    //单框搜索事件
    $("body").on("click","[data-action='single-search']",function(e){
        $("body").trigger("single-search",[$(this).siblings("[data-action='single-search-input']:eq(0)").val(),this,e]);
    });
    $("body").on("keypress","[data-action='single-search-input']",function(e){
        if(e.keyCode == 13){
            $("body").trigger("single-search",[$(this).val(),this,e]);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    //单框搜索清除按钮
    $(".search-box .input-box").add(".hidden-search").find(".clear").on("click",function () {
        $(this).siblings("input").val("");
    });

    //返回上一级
    $("body").on("click","[data-action='select-menu']",backtrackFun);
    
    //垂直列表组件
    window.verticalList=(function verticalList(){

        setStatus();
        
        var resize=debounce( setStatus, 200, true);

        $(window).resize(function () {
            resize();
        });

        //事件监听
        $("body").on("click","[data-action='vertical-list-slide']",function(){
            var $this=$(this);
            //按钮被禁用
            if($this.hasClass("disabled")) return;

            var $listWrap=$this.siblings(".vertical-list"),
                $list=$listWrap.children("ul:eq(0)"),
                maxTop=$list.height()-$listWrap.height(),
                itemHeight=$list.children("li:eq(1)").outerHeight(true) || 200,
                currentTop=$list.position().top,
                $up,
                $down;

            if(!maxTop) return;

            if($this.hasClass("up")){
                currentTop+=itemHeight*1;
                $up=$this;
                $down=$up.siblings(".down[data-action='vertical-list-slide']");
            }
            else if($this.hasClass("down")){
                currentTop-=itemHeight*1;
                $down=$this;
                $up=$down.siblings(".up[data-action='vertical-list-slide']");
            }
            $list.animate({top:currentTop + "px"},300);
            setTimeout(function(){
                var top=currentTop;
                if(currentTop>0 || maxTop<0){
                    top=0;
                }
                else if(currentTop+maxTop<=0){
                    top=-maxTop;
                }
                if(top !== currentTop){
                    $list.stop();
                    $list.animate({top:top+"px"},200);
                }
                //更新状态
                _setStatus($up,$down,top,maxTop);
            },200);
        });

        //暴露方法
        return {
            setStatus:setStatus
        };

        function _setStatus($up,$down,currentTop,maxTop){
            if(currentTop>=0){
                $up.addClass("disabled");
            }
            else{
                $up.removeClass("disabled");
            }
            if(currentTop+maxTop<=0){
                $down.addClass("disabled");
            }
            else{
                $down.removeClass("disabled");
            }
        }

        //设置按钮状态
        function setStatus(){
            $(".up[data-action='vertical-list-slide']").each(function(){
                var $up=$(this),
                    $listWrap=$up.siblings(".vertical-list"),
                    $list=$listWrap.children("ul"),
                    maxTop=$list.height()-$listWrap.height(),
                    currentTop=$list.position().top;
                var $down=$up.siblings(".down[data-action='vertical-list-slide']");
                _setStatus($up,$down,currentTop,maxTop);
            });
        }
    })();

    //高级搜索框控制
    (function advancedSearch(){
        $("body").on("click",'[data-action="open-advanced-search"]',function () {
            $("#advanced-search-wrap").removeClass("ani-hide").addClass("active ani-show");
        });
        $("body").on("click",'[data-action="close-advanced-search"]',function () {
            $("#advanced-search-wrap").removeClass("ani-show").addClass("ani-hide");
            $("#advanced-btn>.text").addClass("ani");
            if("animation" in document.body.style){
                setTimeout(function(){
                    $("#advanced-search-wrap").removeClass("ani-hide active");
                    $("#advanced-btn>.text").removeClass("ani");
                },500);
            }
            else{
                $("#advanced-search-wrap").removeClass("ani-hide active");
                $("#advanced-btn>.text").removeClass("ani");
            }
        });
    })();

});
//根据url选择左侧菜单
//需要获得fromtab(url中获得)
function backtrackFun(){
    var testEq = /urlid=([^&]*)/.exec(window.location.search);
    if (testEq) {
        try {
            top.tab.removeTabItem(top.tab.getSelectedTabItemID()).selectTabItem(testEq[1]);
        }
        catch (e) {
            console.error(e);
        }
    }
    else {
        top.topBackTrack.back();
    }
}
// 获取屏幕缩放比例
function detectZoom (windowX) {
    var ratio = 0;
    windowX = windowX || window;
    if (windowX.outerWidth !== undefined && windowX.innerWidth !== undefined) {
        ratio = windowX.outerWidth / windowX.innerWidth;
    }
    return parseFloat(ratio.toString().replace(/([0-9]+\.[0-9]{2})[0-9]*/,"$1"));
};