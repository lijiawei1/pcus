/**
 * 数据结构
 *		[{ id: '',status : ['', '', ''] }, {}],*
 * 页面所有状态
 *	OP_INIT 初始
 * OP_EDIT 编辑
 * OP_ADD 增加
 * OP_NOTEDIT 非编辑
 * OP_ALL 所有
 *
 * 初始化参数列表
 * d:每个按钮对应的可用状态列表
 * t:按钮管理器
 * u:每个状态界面的回调
 
 */
function CardManager(toptoolbar, uistatus, topitems) {
	//初始化
	this.toolbar = toptoolbar
	this.buttons = loadToolItems(topitems)
	//
	this.btnstatus = {}
	this.extstatus = {}
	
	if (topitems) {
		var that = this
		$.each(topitems, function(key, value) {
			//界面状态[INIT,ADD,EDIT]
			that.btnstatus[key] = value.status
			
			that.extstatus[key] = value.extstatus
			
		})
	}
	this.triggers = uistatus
	
	//初始状态
	this.status = 'OP_INIT'
	//当前所有按钮
	this.current = {}
}
 
CardManager.prototype = {
		
		contructor : CardManager,
		
//		setCardExtStatus: function(status) {
//			var that = this
//			$.each(this.btnstatus, function(id, value) {
//				
//			})
//		},
		
		//更新扩展状态
		updateExtStatus : function(item) {
			var that = this
			var vs = item
			if (vs) {
				if (that.toolbar && that.toolbar.updateExtStatus) {
					//获取更新后的状态
					vs=that.toolbar.updateExtStatus(item)
				}
				$.each(that.extstatus, function(id, value) {
					that.setBtnStatus(id, value ? ($.inArray(vs, value) != -1) : true)
				})
			} else {
				$.each(that.extstatus, function(id, value) {
					that.setBtnStatus(id, true)
				})
			}
		},
		
		//设置界面状态
		setCardStatus : function(status) {
			var that = this
			$.each(this.btnstatus, function(id, value) {
				//判断按钮可用状态是否包含当前界面状态
//				that.setBtnStatus(id, $.inArray(status, value) != -1)
				//添加删减按钮
				if ($.inArray(status, value) == -1) {
					that.toolbar.removeItem(id)
					that.current[id] = false
				} else {
					if (that.buttons[id] && !that.current[id]) {
						that.toolbar.addItem(that.buttons[id])
						that.current[id] = true
					}
				}
			});
			
			//状态改变动作
			if (that.triggers[status]) {
				that.triggers[status]()
			}
			
			that.status = status
		},
		getCardStatus : function() {
			return this.status
		},
		setBtnStatus : function(id, status) {
			if (status) {
				this.toolbar.setEnabled(id)
			} else {
				this.toolbar.setDisabled(id)
			}
		},
		/*
		 * 第三方按钮
		 */
		addBtnStatus : function(id, status) {
			this.datas[id] = status
		},
		setData : function(obj) {
			this.obj = obj
		},
		getData : function() {
			return this.obj
		},
		showDatas : function() {
			alert(JSON2.stringify(this.datas))
		}
}


function PageContext() {
	return {
		user_id : $('#login_user_id').val(),
		corp_id: $('#login_corp_id').val(),
		corpname: $('#login_corpname').val(),
		dept_id: $('#login_dept_id').val(),
		deptname: $('#login_deptname').val(),
		account: $('#login_account').val(),
		name: $('#login_name').val(),
	}
}

function FormPlus(form,formid, fields) {
	return {
		getData : function() {
			var data = form.getData()
			var datetimes = {}
			if (fields && fields.length > 0) {
				for (var i = 0; i < fields.length; i++) {
					datetimes[fields[i]] = $(formid).find('input[name="' + fields[i] + '"]').val()
				}
				data = $.extend(data, datetimes)
			}
			return data
		}
	}
}

function loadToolItems(topitems) {
	var result = {};
	$.ajax({
		async: false,
		url: rootPath + '/admin/loadButtons',
		dataType: 'json',
		type: 'get',
		data: { parentPageNo: param.no },
		success: function(data) {
			//获得权限列表
			$.each(topitems, function(key, value) {
				if ($.inArray(key, data) == -1) {
					result[key] = value
				}
			})
		},
		error: function(data) {
			$.each(topitems, function (key, value) {
				result[key] = value
			})
		}
	});
	return result
}


/** 
 * 时间对象的格式化; 
 */
Date.prototype.format = function(format) {
	/*
	 * eg:format="yyyy-MM-dd hh:mm:ss";
	 */
	//默认格式
	format = (format ? format : 'yyyy-MM-dd hh:mm:ss')

	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}


