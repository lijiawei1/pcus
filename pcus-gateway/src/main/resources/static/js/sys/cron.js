
function out(value) {
	alert(JSON2.stringify(value))
}
/**
 * 周期
 */
function cycle(dom) {
	var name = dom.name;
//	var ns = $(dom).parent().find(".numberspinner");
	var ns = $(dom).parent().find(".l-text-field")
	var start = $.ligerui.get(ns.eq(0)).getValue()
	var end = $.ligerui.get(ns.eq(1)).getValue()
	var item = $("input[name=v_" + name + "]");
	item.val(start + "-" + end);
	item.change();
}

/**
 * 不指定
 */
function unAppoint(dom) {
	var name = dom.name;
	var val = "?";
	if (name == "year")
		val = "";
	var item = $("input[name=v_" + name + "]");
	item.val(val);
	item.change();
}

function appoint(dom) {

}

/**
 * 每周期
 */
function everyTime(dom) {
	var item = $("input[name=v_" + dom.name + "]");
	item.val("*");
	item.change();
}

/**
 * 从开始
 */
function startOn(dom) {
	var name = dom.name;
//	var ns = $(dom).parent().find(".numberspinner");
//	var start = ns.eq(0).numberspinner("getValue");
//	var end = ns.eq(1).numberspinner("getValue");
	
	var ns = $(dom).parent().find(".l-text-field")
	var start = $.ligerui.get(ns.eq(0)).getValue()
	var end = $.ligerui.get(ns.eq(1)).getValue()
	
	var item = $("input[name=v_" + name + "]");
	item.val(start + "/" + end);
	item.change();
}

function lastDay(dom){
	var item = $("input[name=v_" + dom.name + "]");
	item.val("L");
	item.change();
}

function weekOfDay(dom){
	var name = dom.name;
//	var ns = $(dom).parent().find(".numberspinner");
//	var start = ns.eq(0).numberspinner("getValue");
//	var end = ns.eq(1).numberspinner("getValue");
	
	var ns = $(dom).parent().find(".l-text-field")
	var start = $.ligerui.get(ns.eq(0)).getValue()
	var end = $.ligerui.get(ns.eq(1)).getValue()
	
	var item = $("input[name=v_" + name + "]");
	item.val(start + "#" + end);
	item.change();
}

function lastWeek(dom){
	var item = $("input[name=v_" + dom.name + "]");
//	var ns = $(dom).parent().find(".numberspinner");
//	var start = ns.eq(0).numberspinner("getValue");
	
	var ns = $(dom).parent().find(".l-text-field")
	var start = $.ligerui.get(ns.eq(0)).getValue()
	
	item.val(start+"L");
	item.change();
}

function workDay(dom) {
	var name = dom.name;
//	var ns = $(dom).parent().find(".numberspinner");
//	var start = ns.eq(0).numberspinner("getValue");
	
	var ns = $(dom).parent().find("input[type!='radio']")
	var start = $.ligerui.get(ns.eq(0)).getValue()
	
	var item = $("input[name=v_" + name + "]");
	item.val(start + "W");
	item.change();
}

function init(exp) {
	
//	var exp = $("input[name='cron']").val();
	if (exp) {
		
		$("input[name='cron']").val(exp);
		
		var regs = exp.split(' ');
        $("input[name=v_second]").val(regs[0]);
        $("input[name=v_min]").val(regs[1]);
        $("input[name=v_hour]").val(regs[2]);
        $("input[name=v_day]").val(regs[3]);
        $("input[name=v_month]").val(regs[4]);
        $("input[name=v_week]").val(regs[5]);
        
        initObj(regs[0], "second");
        initObj(regs[1], "min");
        initObj(regs[2], "hour");
        initDay(regs[3]);
        initMonth(regs[4]);
        initWeek(regs[5]);
        
        if (regs.length > 6) {
            $("input[name=v_year]").val(regs[6]);
            initYear(regs[6]);
        }
        
//        LG.hideLoading()
	}
}

function initObj(strVal, strid) {
    var ary = null;
    var objRadio = $("input[name='" + strid + "']");
    if (strVal == "*") {
        objRadio.eq(0).attr("checked", "checked");
    } else if (strVal.split('-').length > 1) {
        ary = strVal.split('-');
        objRadio.eq(1).attr("checked", "checked");
        $("#" + strid + "Start_0").val(ary[0]);
        $("#" + strid + "End_0").val(ary[1]);
    } else if (strVal.split('/').length > 1) {
        ary = strVal.split('/');
        objRadio.eq(2).attr("checked", "checked");
        $("#" + strid + "Start_1").val(ary[0]);
        $("#" + strid + "End_1").val(ary[1]);
    } else {
        objRadio.eq(3).attr("checked", "checked");
        if (strVal != "?") {
            ary = strVal.split(",");
            for (var i = 0; i < ary.length; i++) {
            	var kk = "." + strid + "List input[value='" + ary[i] + "']";
                $("." + strid + "List input[value='" + ary[i] + "']").attr("checked", "checked");
            }
        }
    }
}

function initDay(strVal) {
    var ary = null;
    var objRadio = $("input[name='day']");
    if (strVal == "*") {
        objRadio.eq(0).attr("checked", "checked");
    } else if (strVal == "?") {
        objRadio.eq(1).attr("checked", "checked");
    } else if (strVal.split('-').length > 1) {
        ary = strVal.split('-');
        objRadio.eq(2).attr("checked", "checked");
        $("#dayStart_0").val(ary[0]);
        $("#dayEnd_0").val(ary[1]);
    } else if (strVal.split('/').length > 1) {
        ary = strVal.split('/');
        objRadio.eq(3).attr("checked", "checked");
        $("#dayStart_1").val(ary[0]);
        $("#dayEnd_1").val(ary[1]);
    } else if (strVal.split('W').length > 1) {
        ary = strVal.split('W');
        objRadio.eq(4).attr("checked", "checked");
        $("#dayStart_2").val(ary[0]);
    } else if (strVal == "L") {
        objRadio.eq(5).attr("checked", "checked");
    } else {
        objRadio.eq(6).attr("checked", "checked");
        ary = strVal.split(",");
        for (var i = 0; i < ary.length; i++) {
            $(".dayList input[value='" + ary[i] + "']").attr("checked", "checked");
        }
    }
}

function initMonth(strVal) {
    var ary = null;
    var objRadio = $("input[name='month']");
    if (strVal == "*") {
        objRadio.eq(0).attr("checked", "checked");
    } else if (strVal == "?") {
        objRadio.eq(1).attr("checked", "checked");
    } else if (strVal.split('-').length > 1) {
        ary = strVal.split('-');
        objRadio.eq(2).attr("checked", "checked");
        $("#monthStart_0").val(ary[0]);
        $("#monthEnd_0").val(ary[1]);
    } else if (strVal.split('/').length > 1) {
        ary = strVal.split('/');
        objRadio.eq(3).attr("checked", "checked");
        $("#monthStart_1").val(ary[0]);
        $("#monthEnd_1").val(ary[1]);

    } else {
        objRadio.eq(4).attr("checked", "checked");

        ary = strVal.split(",");
        for (var i = 0; i < ary.length; i++) {
            $(".monthList input[value='" + ary[i] + "']").attr("checked", "checked");
        }
    }
}

function initWeek(strVal) {
    var ary = null;
    var objRadio = $("input[name='week']");
    if (strVal == "*") {
        objRadio.eq(0).attr("checked", "checked");
    } else if (strVal == "?") {
        objRadio.eq(1).attr("checked", "checked");
    } else if (strVal.split('/').length > 1) {
        ary = strVal.split('/');
        objRadio.eq(2).attr("checked", "checked");
        $("#weekStart_0").val(ary[0]);
        $("#weekEnd_0").val(ary[1]);
    } else if (strVal.split('-').length > 1) {
        ary = strVal.split('-');
        objRadio.eq(3).attr("checked", "checked");
        $("#weekStart_1").val(ary[0]);
        $("#weekEnd_1").val(ary[1]);
    } else if (strVal.split('L').length > 1) {
        ary = strVal.split('L');
        objRadio.eq(4).attr("checked", "checked");
        $("#weekStart_2").val(ary[0]);
    } else {
        objRadio.eq(5).attr("checked", "checked");
        ary = strVal.split(",");
        for (var i = 0; i < ary.length; i++) {
            $(".weekList input[value='" + ary[i] + "']").attr("checked", "checked");
        }
    }
}

function initYear(strVal) {
    var ary = null;
    var objRadio = $("input[name='year']");
    if (strVal == "*") {
        objRadio.eq(1).attr("checked", "checked");
    } else if (strVal.split('-').length > 1) {
        ary = strVal.split('-');
        objRadio.eq(2).attr("checked", "checked");
        $("#yearStart_0").val(ary[0]);
        $("#yearEnd_0").val(ary[1]);
    }
}

/*********************************************************/
/*********************************************************/
/*********************************************************/
//当前对话框
var dialog = frameElement.dialog;
var complete = false
$(function() {
	
//	$(document).ready(function) 
//	LG.showLoading('定时页面加载中...')
	
	//初始化界面
	$("#layout").ligerLayout({
		height : '100%',
		space : 0,
		/*bottomHeight : 180,
		allowLeftCollapse : false,
		allowRightCollapse : false,
		allowTopResize : false,
		allowBottomResize : false */
	});
	
	/******************对对对**************/
//	var manager = $("#btn").ligerButton({
//		click : function() {
//			init()
//		}
//	})
	
	
	
	/** ****************指定选择秒列表初始化****************** */
	var secondList = $(".secondList").children();
	$("#sencond_appoint").click(function(){
		if (this.checked){
			secondList.eq(0).change()
		}
	});

	secondList.change(function() {
		var sencond_appoint = $("#sencond_appoint").attr("checked");
		if (sencond_appoint) {
			var vals = [];
			secondList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 59) {
				val = vals.join(","); 
			}else if(vals.length == 59){
				val = "*";
			}
			var item = $("input[name=v_second]");
			item.val(val);
			item.change();
		}
	});
	
	/******************指定选择分列表初始化*******************/
	var minList = $(".minList").children();
	$("#min_appoint").click(function(){
		if(this.checked){
			minList.eq(0).change();
		}
	});
	
	minList.change(function() {
		var min_appoint = $("#min_appoint").attr("checked");
		if (min_appoint) {
			var vals = [];
			minList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 59) {
				val = vals.join(",");
			}else if(vals.length == 59){
				val = "*";
			}
			var item = $("input[name=v_min]");
			item.val(val);
			item.change();
		}
	});
	
	/******************指定选择时列表初始化*******************/
	var hourList = $(".hourList").children();
	$("#hour_appoint").click(function(){
		if(this.checked){
			hourList.eq(0).change();
		}
	});
	
	hourList.change(function() {
		var hour_appoint = $("#hour_appoint").attr("checked");
		if (hour_appoint) {
			var vals = [];
			hourList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 24) {
				val = vals.join(",");
			}else if(vals.length == 24){
				val = "*";
			}
			var item = $("input[name=v_hour]");
			item.val(val);
			item.change();
		}
	});
	
	/******************指定选择日列表初始化*******************/
	var dayList = $(".dayList").children();
	$("#day_appoint").click(function(){
		if(this.checked){
			dayList.eq(0).change();
		}
	});
	
	dayList.change(function() {
		var day_appoint = $("#day_appoint").attr("checked");
		if (day_appoint) {
			var vals = [];
			dayList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 31) {
				val = vals.join(",");
			}else if(vals.length == 31){
				val = "*";
			}
			var item = $("input[name=v_day]");
			item.val(val);
			item.change();
		}
	});
	
	var monthList = $(".monthList").children();
	$("#month_appoint").click(function(){
		if(this.checked){
			monthList.eq(0).change();
		}
	});
	
	monthList.change(function() {
		var month_appoint = $("#month_appoint").attr("checked");
		if (month_appoint) {
			var vals = [];
			monthList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 12) {
				val = vals.join(",");
			}else if(vals.length == 12){
				val = "*";
			}
			var item = $("input[name=v_month]");
			item.val(val);
			item.change();
		}
	});
	
	var weekList = $(".weekList").children();
	$("#week_appoint").click(function(){
		if(this.checked){
			weekList.eq(0).change();
		}
	});
	
	weekList.change(function() {
		var week_appoint = $("#week_appoint").attr("checked");
		if (week_appoint) {
			var vals = [];
			weekList.each(function() {
				if (this.checked) {
					vals.push(this.value);
				}
			});
			var val = "?";
			if (vals.length > 0 && vals.length < 7) {
				val = vals.join(",");
			}else if(vals.length == 7){
				val = "*";
			}
			var item = $("input[name=v_week]");
			item.val(val);
			item.change();
		}
	});
	
	
	var mainform = $("#mainform").ligerForm({
        inputWidth: 100, labelWidth: 20, space: 10,
        fields: [
	        { display: "秒", name: "v_second", newline: false, type: "text" }, 
	        { display: "分", name: "v_min", newline: false, type: "text" }, 
	        { display: "时", name: "v_hour", newline: false, type: "text" }, 
	        { display: "日", name: "v_day", newline: false, type: "text" }, 
	        { display: "月", name: "v_month", newline: true, type: "text" }, 
	        { display: "周", name: "v_week", newline: false, type: "text" }, 
	        { display: "年", name: "v_year", newline: false, type: "text", width: 100 },
	        { display: "", name: "cron", newline: true, type: "text", width: 490 }, 
        ],
        toJSON: JSON2.stringify
    });
	
	mainform.setData({
		v_second: '*',v_min: '*',v_hour: '*',v_day: '*',v_month: '*',v_week: '?',v_year: '', cron: ''
	})
	
	var vals = $("input[name^='v_']");
	var cron = $("input[name='cron']");
	vals.change(function() {
		var item = []
		vals.each(function() {
			item.push(this.value);
		});
		cron.val(item.join(" "));
	});
	
	$('input:checkbox').ligerCheckBox();
	
	/*************秒****************/
	$("#secondStart_0").ligerSpinner({ height: 22,  width: 50, type: 'int',isNegative:false, minValue:1,maxValue:58,
		 onChangeValue: function (value) {
			 $("#secondCycle").click()
		}});
	$("#secondEnd_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:2,maxValue:59,
		onChangeValue: function (value) {
			 $("#secondCycle").click()
		}});
	
	$("#secondStart_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false, minValue:0,maxValue:59,
		onChangeValue: function (value) {
			 $("#secondStartOn").click()
		}});
	$("#secondEnd_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:59,
		onChangeValue: function (value) {
			 $("#secondStartOn").click()
		}});
	
	/*************分钟*************/
	$("#minStart_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false, minValue:1,maxValue:58,
		onChangeValue: function (value) {
			 $("#minCycle").click()
		}});
	$("#minEnd_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:2,maxValue:59,
		onChangeValue: function (value) {
			 $("#minCycle").click()
		}});
	
	$("#minStart_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false, minValue:0,maxValue:59,
		onChangeValue: function (value) {
			 $("#minStartOn").click()
		}});
	$("#minEnd_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:59,
		onChangeValue: function (value) {
			if (complete) $("#minStartOn").click()
		}});
	
	/*************小时*************/
	$("#hourStart_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false, minValue:0,maxValue:23,
		onChangeValue: function (value) {
			if (complete) $("#hourCycle").click()
		}});
	$("#hourEnd_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:2,maxValue:23,
		onChangeValue: function (value) {
			if (complete) $("#hourCycle").click()
		}});
	
	$("#hourStart_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false, minValue:0,maxValue:23,
		onChangeValue: function (value) {
			if (complete) $("#hourStartOn").click()
		}});
	$("#hourEnd_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:23,
		onChangeValue: function (value) {
			if (complete) $("#hourStartOn").click()
		}});
	
	/*************日**************/
	$("#dayStart_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false, minValue:1,maxValue:31,
		onChangeValue: function (value) {
			if (complete) $("#dayCycle").click()
		}});
	$("#dayEnd_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:2,maxValue:31,
		onChangeValue: function (value) {
			if (complete) $("#dayCycle").click()
		}});
	
	$("#dayStart_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false, minValue:1,maxValue:31,
		onChangeValue: function (value) {
			 $("#dayStartOn").click()
		}});
	$("#dayEnd_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:31,
		onChangeValue: function (value) {
			if (complete) $("#dayStartOn").click()
		}});
	
	$("#dayStart_2").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:31,
		onChangeValue: function (value) {
			if (complete) $("#dayWorkDay").click()
		}});
	
	/*************月**************/
	$("#monthStart_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:12,
		onChangeValue: function (value) {
			if (complete) $("#monthCycle").click()
		}});
	$("#monthEnd_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:2,maxValue:12,
		onChangeValue: function (value) {
			if (complete) $("#monthCycle").click()
		}});
	
	$("#monthStart_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:12,
		onChangeValue: function (value) {
			if (complete) $("#monthStartOn").click()
		}});
	$("#monthEnd_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:12,
		onChangeValue: function (value) {
			if (complete) $("#monthStartOn").click()
		}});
	
	
	/*************周**************/
/*	$("#weekStart_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:7 });
	$("#weekEnd_0").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:2,maxValue:7 });
	
	$("#weekStart_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:4 });
	$("#weekEnd_1").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:7 });

	$("#weekStart_2").ligerSpinner({ height: 22, width: 50, type: 'int',isNegative:false,minValue:1,maxValue:7 });
		*/
	
	$("#weekStart_0").ligerComboBox({ width: 50,  initValue: '2',
		data: [ { text: '一', id: '2' }, { text: '二', id: '3' }, { text: '三', id: '4' },
		       { text: '四', id: '5' }, { text: '五', id: '6' }, { text: '六', id: '7' },
		       { text: '日', id: '1' } ],
		onSelected: function(value,text) {
			if (complete) $('#weekStartOn').click()
		}
	}); 
	$("#weekEnd_0").ligerComboBox({ width: 50,  initValue: '2',
		data: [ { text: '一', id: '2' }, { text: '二', id: '3' }, { text: '三', id: '4' },
	           { text: '四', id: '5' }, { text: '五', id: '6' }, { text: '六', id: '7' } ],
   		onSelected: function(value,text) {
   			if (complete) $('#weekStartOn').click()
		}
	});
	
	$("#weekStart_1").ligerComboBox({ width: 50,  initValue: '1',
		data: [ { text: '一', id: '1' }, { text: '二', id: '2' }, { text: '三', id: '3' },
		       { text: '四', id: '4' } ],
		onSelected: function(value,text) {
			if (complete) $('#wweekOfDay').click()
		}
		       
	}); 
	$("#weekEnd_1").ligerComboBox({ width: 50,  initValue: '2',
		data: [ { text: '一', id: '2' }, { text: '二', id: '3' }, { text: '三', id: '4' },
			       { text: '四', id: '5' }, { text: '五', id: '6' }, { text: '六', id: '7' },
			       { text: '日', id: '1' } ],
		onSelected: function(value,text) {
			if (complete) $('#wweekOfDay').click()
		}
	});
	
	$("#weekStart_2").ligerComboBox({ width: 50,  initValue: '2',
		data: [ { text: '一', id: '2' }, { text: '二', id: '3' }, { text: '三', id: '4' },
			       { text: '四', id: '5' }, { text: '五', id: '6' }, { text: '六', id: '7' },
			       { text: '日', id: '1' } ],
		onSelected: function(value,text) {
			if (complete) $('#weekLastWeek').click()
		}
	});
	
	/*************年**************/
	$("#yearStart_0").ligerSpinner({ height: 25, width: 50, type: 'int',isNegative:false,minValue:2015,maxValue:3000,
		onChangeValue: function (value) {
			if (complete) $("#yearCycle").click()
		}});
	$("#yearEnd_0").ligerSpinner({ height: 25, width: 50, type: 'int',isNegative:false,minValue:2016,maxValue:3000,
		onChangeValue: function (value) {
			if (complete) $("#yearCycle").click()
		}});
	
	complete = true
	//反解析
	if (dialog) {
		var box = dialog.get('selectComboBox');
		var v = box.valueField && box.valueField.val()
		init(v ? v : '* * * * * ?');
	}
});
