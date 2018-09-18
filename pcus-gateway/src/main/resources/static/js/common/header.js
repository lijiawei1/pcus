//几个布局的对象
var layout, tab, accordion, headerLayout;
//tabid计数器，保证tabid不会重复
var tabidcounter = 0;

var tabItems = [];
$(function() {

	//布局
	headerLayout = $("#layout1").ligerLayout({
		leftWidth : 197,
		height : '100%',
		heightDiff : -5,
		space : 5,
		onHeightChanged : f_heightChanged,
        onLeftToggle : function (isCollapse) {
			localStorage['isIndexLeftCollapse'] = isCollapse;
        }
	});
    if(localStorage['isIndexLeftCollapse']){
        $(".l-layout-header-toggle").click();
    }
	var height = $(".l-layout-center").height();

	//Tab
	$("#framecenter").ligerTab({
		height : height,
		showSwitchInTab : true,
		showSwitch : true,
		tabMargin:1,//自定义的参数，页签项的margin
		tabWidthDiff:450,//自定义的参数，页签右侧留出的宽度
		autoMove: true,//自定义参数
		changeHeightOnResize: true,
		onAfterAddTabItem : function(tabdata) {
			tabItems.push(tabdata);
			saveTabStatus();
			//保存路径
			var preTrack = topBackTrack.getTrack(tabdata.trackid);
			if(preTrack instanceof Array ){
				preTrack.pop();
				topBackTrack.addTrack(tabdata.tabid,preTrack);
			}
			else{
				preTrack = topBackTrack.getTrack(tabdata.fromTabid);
				if(!(preTrack instanceof Array)){
					preTrack = [];
				}
				topBackTrack.addTrack(tabdata.tabid,preTrack.concat([{
					tabid : tabdata.tabid,
					text : tabdata.text,
					url : tabdata.url,
					module: tabdata.module,
					fun: tabdata.fun,
					fromTabid: tabdata.fromTabid
				}]));
			}
			preTrack = null;
		},
		onAfterRemoveTabItem : function(tabid) {
			for (var i = 0; i < tabItems.length; i++) {
				var o = tabItems[i];
				if (o.tabid == tabid) {
					tabItems.splice(i, 1);
					saveTabStatus();
					break;
				}
			}
			topBackTrack.removeTrack(tabid);
		},
		onBeforeRemoveTabItem : function(tabid) {
			var r = $(".l-tab-content-item[tabid=" + tabid + "] iframe", tab.content)[0].contentWindow.$("body").triggerHandler("beforeRemoveTab");
			if (r === false) {
				return false;
			}
		},
		onReload : function(tabdata) {
			var tabid = tabdata.tabid;
			var r = $(".l-tab-content-item[tabid=" + tabid + "] iframe", tab.content)[0].contentWindow.$("body").triggerHandler("reload");
			if (r === false) {
				return false;
			}
			addFrameSkinLink(tabid);
		},
		onAfterSelectTabItem:function(tabid){
			//修改左侧二级菜单的激活状态
			activeMenuListItem($("#accordion").find("[tabid='"+ tabid +"']"));
		}
	});

	//面板
    /*	$("#accordion").ligerAccordion({
		height : height - 24,
		speed : null
	});*/

	$(".l-link").hover(function() {
		$(this).addClass("l-link-over");
	}, function() {
		$(this).removeClass("l-link-over");
	});
	
	menus_init(height);
	
	tab = liger.get("framecenter");
	accordion = liger.get("accordion");
	$("#pageloading").hide();

	/**
	 * 路径处理（用于返回功能）wujian 2016-11-15
	 * */
	window.topBackTrack = (function topBackTrack(){

		var $backtrack = $("#backtrack");

		return {
			addTrack : addTrack,
			removeTrack : removeTrack,
			getTrack : getTrack,
			back: back,
			backById: backById
		};

		//添加路径
		function addTrack(tabid,track) {
			if(!tabid) return ;
			var backtrackData = $backtrack.data("backtrack") || {};
			backtrackData[tabid]=track;
			$backtrack.data("backtrack",backtrackData);
			backtrackData = null;
		}
		//删除路径
		function removeTrack(tabid) {
			if(!tabid) return;
			var backtrackData = $backtrack.data("backtrack");
			if(!backtrackData) return;
			delete backtrackData[tabid];
			$backtrack.data("backtrack",backtrackData);
			backtrackData = null;
		}
		//获得路径
		function getTrack(tabid){
			if(!tabid) return;
			var backtrackData = $backtrack.data("backtrack");
			if(!backtrackData) return;
			return backtrackData[tabid];
		}
		//返回上一级
		function back(){
			backById(tab.getSelectedTabItemID());
		}
		//根据id返回上一级
		function backById(tabid) {
			var track = getTrack(tabid);
			if(track instanceof Array){
				var pre = track[track.length - 2];
				if(typeof pre === "object"){
					//移除tab项时会删除路径，因此先添加再移除
					f_addTab(pre.tabid, pre.text, pre.url, pre.mod, pre.fun, pre.fromTabid,tabid);
					tab.removeTabItem(tabid);
					//如果页面已经打开了，则在body元素触发事件afterBackTab
					if(tab.isTabItemExist(pre.tabid)){
						$(".l-tab-content-item[tabid=" + pre.tabid + "] iframe", tab.content)[0]
							.contentWindow.$("body").trigger("afterBackTab");
					}
				}
			}
		}
	})();

});


function logout() {
	$.ligerDialog.confirm('确定注销吗?', function (confirm) {
		if (confirm) {
			location.href = rootPath + "/logout";
		}
	});
}

function changePwd() {
	
	if (!window.changePwdWin) {
		
	    $(document).on('keydown.changePwd', function (e) {
	        if (e.keyCode == 13) {
	            doChangePwd();
	        }
	    });

		
		var changePwdPanel = $("#changePwdPanel");
		changePwdPanel.ligerForm({
            fields: [
				 { display: '旧密码', name: 'OldPassword',space: 10, type: 'password', validate: { maxlength: 20, required: true, messages: { required: '请输入密码'}} },
				 { display: '新密码', name: 'NewPassword',space: 10, type: 'password', validate: { maxlength: 20, required: true, messages: { required: '请输入密码'}} },
				 { display: '确认密码', name: 'NewPassword2', space: 10,type: 'password', validate: { maxlength: 20, required: true, equalTo: 'input[name="NewPassword"]', messages: { required: '请输入密码', equalTo: '两次密码输入不一致'}} }
			 ]
		});
		
		//校验
		$.metadata.setType("attr", "validate");
//		$.metadata.setType("attr", "validate");
		LG.validate(changePwdPanel, { debug: true });
        changePwdPanel.appendTo($('body'));
        // debugger;
		window.changePwdWin = $.ligerDialog.open({
			width: 330,
            height: 175, top: 200,
            isResize: true,
            title: '用户修改密码',
            target: changePwdPanel,
            buttons: [
            { text: '确定', onclick: function () {
                doChangePwd();
                $("input[name =OldPassword]").val("");
                $("input[name =NewPassword]").val("");
                $("input[name =NewPassword2]").val("");
            }
            },
            {
                text: '取消', onclick: function () {
                window.changePwdWin.hide();
                $("input[name =OldPassword]").val("");
                $("input[name =NewPassword]").val("");
                $("input[name =NewPassword2]").val("");
                $(document).unbind('keydown.changePwd');
            }
            }
            ]
			
		})
	} else {
        window.changePwdWin.show();
    }
	
	function doChangePwd() {
		var oldPwd = $("input[name =OldPassword]").val();
        var newPwd = $("input[name =NewPassword]").val();
        if (changePwdPanel.valid()) {
            LG.ajax({
               url: rootPath + '/changePwd',
                data: { oldPwd: oldPwd, newPwd: newPwd },
                success: function () {
                    LG.showSuccess('密码修改成功');
                    window.changePwdWin.hide();
                    $(document).unbind('keydown.changePwd');
                },
                error: function (message) {
                    LG.showError("密码修改失败，请核对旧密码是否正确");
                }
            });
        }
	}
}

function menus_init(height) {
	
	var mainmenu = $('#accordion');

    var iconFont = {
    	sys: 'xitong',
        auth: 'permissions1',
        org: 'organize',
        bas: 'ziliao',
        busi: 'yunshu',
        sett: 'zhangdan',
        report: 'statistics',
        fuel: 'ic_computer_fuel',
        dataMon: 'monitorsettings'
	};
	// 添加缩小后的导航栏
    headerLayout.leftCollapse.append('<div class="l-layout-collapse-left-inner"></div>');

	var shrink = $('.l-layout-collapse-left-inner',headerLayout.leftCollapse);

    $.getJSON(rootPath + '/auth/admin/loadMenus', { random: Math.random() }, function (menus) {
		for(var i = 0, len = menus.length; i < len; i++){
			var item = menus[i];
			if(!item.children || item.children.length == 0) continue;
			var Dom = $('<div title="' + item.name + '"><ul class="menulist"></ul></div>');
			var shrinkDom = $('<div class="shrink-menu-inner"><p class="shrenk-menu-title"><span class="l-icon l-icon-' + iconFont[item.code] + '"></span></p><div class="shrenk-menu-conter"></div></div>');
			for (var j = 0, jlen = item.children.length; j < jlen; j++){
				var submenu = item.children[j];
				var subitem = $('<li><img/><span></span><div class="menuitem-l"></div><div class="menuitem-r"></div></li>');
				var shrinkItem = $('<p><img/><span></span></p>');
				var attr = {
						url: rootPath + submenu.url,
						menuno: submenu.no,
						fun: submenu.name,
						module: item.name,
						tabid: submenu.no
					},
					iocn = submenu.icon || submenu.MenuIcon,
					text = submenu.name || submenu.text;

				subitem.attr(attr);
				shrinkItem.attr(attr);
				$("img", subitem).attr("src", iocn);
				$("img", shrinkItem).attr("src", iocn);
				$("span", subitem).html(text);
				$("span", shrinkItem).html(text);
				$("ul:first", Dom).append(subitem);
				$('div',shrinkDom).append(shrinkItem);
			}
			mainmenu.append(Dom)
			shrink.append(shrinkDom)
		}

        //Accordion
		accordion = $("#accordion").ligerAccordion({height: height - 40, speed: null});
        addMenuListClick(shrink);
		(function(){
			//修改高度
			var $content=$("#accordion").children(".l-accordion-content"),
				height=0,
				itemHeight=$content.eq(0).children().children().eq(0).height() || 33,
				maxHeight=getMaxHeight();
			$content.each(function(){
				var h=$(this).children().children().length*itemHeight || 0;
				if(h>height) height=h;
			});
			$content.css({"height":(height+30)+"px","max-height":maxHeight + "px"});

			function getMaxHeight(){
				var $layout=$("#layout1"),
					$laheader=$layout.find(".l-accordion-header"),
					firstHeight = $layout.children(".l-layout-left:eq(0)").height();
				var maxNmber = firstHeight - $layout.find(".l-layout-header:eq(0)").height() - ($laheader.eq(0).height() + 1 ) * $laheader.length - 1;//-1，首个项有个margin-top
				return maxNmber
			}
		})();

//        $("#pageloading").hide();
    });

}

function addMenuListClick(shrink){
    //菜单初始化
    $("body").on('click', 'ul.menulist li',function () {
        var jitem = $(this);
        var tabid = jitem.attr("tabid");
        //原始菜单后面没有参数
        var url = jitem.attr("url");

        //如果url为空
        if (!url) return;
        //如果tabid为空
        if (!tabid) {
            tabidcounter++;
            tabid = "tabid" + tabidcounter;
            jitem.attr("tabid", tabid);
        }

        //给url附加menuno/module/function
        if (url.indexOf('?') > -1) url += "&";
        else url += "?";

        url += "no=" + jitem.attr("menuno");
        url += "&module=" + jitem.attr("module");
        url += "&function=" + jitem.attr("fun");

        if(jitem.attr("add-search")){
            url += "&" + jitem.attr("add-search");
        }
        f_addTab(tabid, $("span:first", jitem).html(), url, "", "", "home");
    }).on('mouseover', function () {
        var jitem = $(this);
        jitem.addClass("over");
    }).on('mouseout', function () {
        var jitem = $(this);
        jitem.removeClass("over");
    });

    shrink.on('click','.shrenk-menu-conter p',function(){
        var $this = $(this);
        var tabid = $this.attr("tabid");
        var url = $this.attr("url");
        if (!url) return;
        if (!tabid){
            tabidcounter++;
            tabid = "tabid" + tabidcounter;
            $this.attr("tabid", tabid);
        }
        url +=  url.indexOf('?') > -1 ? "&" :"?";
        url += "no=" + $this.attr("menuno");
        url += "&module=" + $this.attr("module");
        url += "&function=" + $this.attr("fun");

        if($this.attr("add-search")){
            url += "&" + $this.attr("add-search");
        }

        f_addTab(tabid, $("span:first", $this).html(), url, "", "", "home");
    });
}

function f_heightChanged(options) {
	if (tab)
		tab.addHeight(options.diff);
	if (accordion && options.middleHeight - 24 > 0)
		accordion.setHeight(options.middleHeight - 24);
}
/**
 * 调用此函数时，fromTabid实际上传入的是当前页面的tabid
 * */
function f_addTab(tabid, text, url, mod, fun, fromTabid, trackid) {
	tab.addTabItem({
		tabid : tabid,
		text : text,
		url : url,
		module: mod,
		fun: fun,
		fromTabid: fromTabid || tab.getSelectedTabItemID(),
		trackid: trackid,
		callback : function() {
			addFrameSkinLink(tabid);
		}
	});
}
function addFrameSkinLink(tabid) {
	var prevHref = getLinkPrevHref(tabid) || "";
	var skin = getQueryString("skin");
	if (!skin)
		return;
	skin = skin.toLowerCase();
	attachLinkToFrame(tabid, prevHref + skin_links[skin]);
}
var skin_links = {
	"gray2014": "/js/lib/ligerUI/skins/Gray2014/css/all.css",
	"aqua" : "/js/lib/ligerUI/skins/Aqua/css/ligerui-all.css",
	"gray" : "/js/lib/ligerUI/skins/Gray/css/all.css",
	"silvery" : "/js/lib/ligerUI/skins/Silvery/css/style.css"

};
function pages_init() {
	var tabJson = $.cookie('liger-home-tab');
	if (tabJson) {
		var tabitems = JSON2.parse(tabJson);
		for (var i = 0; tabitems && tabitems[i]; i++) {
			f_addTab(tabitems[i].tabid, tabitems[i].text, tabitems[i].url, tabitems[i].module, tabitems[i].fun);
		}
	}
}
function saveTabStatus() {
	$.cookie('liger-home-tab', JSON2.stringify(tabItems));
}
function css_init() {
	var css = $("#mylink").get(0), skin = getQueryString("skin");
	$("#skinSelect").val(skin);
	$("#skinSelect").change(function() {
		if (this.value) {
			location.href = "index.do?skin=" + this.value;
		} else {
			location.href = "index.do";
		}
	});

	if (!css || !skin)
		return;
	skin = skin.toLowerCase();
	$('body').addClass("body-" + skin);
	$(css).attr("href", skin_links[skin]);
}
function getQueryString(name) {
	var now_url = document.location.search.slice(1), q_array = now_url
			.split('&');
	for (var i = 0; i < q_array.length; i++) {
		var v_array = q_array[i].split('=');
		if (v_array[0] == name) {
			return v_array[1];
		}
	}
	return false;
}
function attachLinkToFrame(iframeId, filename) {
	if (!window.frames[iframeId])
		return;
	var head = window.frames[iframeId].document.getElementsByTagName('head')
			.item(0);
	var fileref = window.frames[iframeId].document.createElement("link");
	if (!fileref)
		return;
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", filename);
	head.appendChild(fileref);
}
function getLinkPrevHref(iframeId) {
	if (!window.frames[iframeId])
		return;
	var head = window.frames[iframeId].document.getElementsByTagName('head')
			.item(0);
	var links = $("link:first", head);
	for (var i = 0; links[i]; i++) {
		var href = $(links[i]).attr("href");
		if (href && href.toLowerCase().indexOf("ligerui") > 0) {
			return href.substring(0, href.toLowerCase().indexOf("lib"));
		}
	}
}
//左侧二级菜单激活状态控制，传入的是将要目标的jq元素
function activeMenuListItem($menuListItem){
	if($menuListItem.length>0){
		var parent = $menuListItem.parents(".l-accordion-content"),
			header = parent.prev('.l-accordion-header'),
			grandfather = parent.parent('.l-accordion-panel');
		$menuListItem.addClass("active").siblings(".active").removeClass("active");
		parent.show().addClass("select").siblings(".l-accordion-content").hide().removeClass("select");
		grandfather.find('.l-accordion-header').removeClass("active");
		grandfather.find('.l-accordion-toggle').removeClass('l-accordion-toggle-open').addClass("l-accordion-toggle-close");
		header.addClass("active");
		header.children('.l-accordion-toggle').addClass('l-accordion-toggle-open').removeClass("l-accordion-toggle-close");
	} else{
		$("#accordion").children(".select").removeClass("select");
	}
}