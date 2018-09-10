/**
 * 上下文路径
 */
var basePath = rootPath + '/org/corp/'
//空对象
var emptydata = { 'id': '', 'version': '0', 'code': '', 'name': '', 'shortname': '', 'foreignname':'', 'pid': '','pname':'', 
		'creator_name':'', 'modifier_name': '',
		'creator_id':'', 'modifier_id': '',
		'create_time':'', 'modify_time': '', 
		'ext': '', 'ext_id': '',
		'remark': '', 'sn': ''}
//var emptydata = { 'id': '', 'version': '0', 'code': 'ZPHIT', 'name': '珠海港信息', 'shortname': '港信息', 'foreignname':'', 'pid': '','pname':'', 'remark': '', 'sn': ''}

//设置表单状态
var setFormStatus = function(form, enable) {
//	form._setReadonly(enable)
	form.setEnabled(["code", "name", "shortname", "foreignname", "pid", "remark"], enable);
};

function addMask(target){
	var mask = $('<div class="customMask" style="display: none; height: 100%;background: #e1e1e1; font-size: 1px; left: 0; opacity: 0.5; overflow: hidden; position: absolute;top :0px; width: 100%; z-index: 9000;"></div>');
	target.append(mask);
}

var setLeftStatus = function(enable) {
	if (enable){;
		$(".customMask").hide();
	}
	else{
		$(".customMask").show();
	}
}

function out(value) {
	alert(JSON2.stringify(value))
}

$(function() {
	
	//上下文信息
	var ctx = new PageContext()
	
	//初始化界面
	var layout=$("#layout").ligerLayout({
		minLeftWidth:200,
		leftWidth : 200,
		height : '100%',
		space : 1,
		/*bottomHeight : 180,
		allowLeftCollapse : false,
		allowRightCollapse : false,
		allowTopResize : false,
		allowBottomResize : false */
	});

	addMask($(".l-layout-left"));
	
	//界面状态改变触发事件
	var uiStatus = {
		//进入初始状态
		'OP_INIT' : function() {
			setFormStatus(mainform, false);
			setLeftStatus(true)
		},
		//进入编辑状态
		'OP_EDIT' : function() {
			//缓存当前页面的数据
			cm.setData(mainform.getData())
			//启用编辑
			setFormStatus(mainform, true)
			setLeftStatus(false)
		},
		//进入新增状态
		'OP_ADD' : function() {
			cm.setData(mainform.getData())
			setFormStatus(mainform, true)
			setLeftStatus(false)
		}
	}

	//初始化表单
    var mainform = $("#mainform").ligerForm({
        inputWidth: 170, labelWidth: 90, space: 30,
        fields: [
        { name: "id", type: "hidden" },
        { name: "version", type: "hidden" },
        { name: "sn", type: "hidden" },
        { display: "公司编码", name: "code", newline: true, type: "text", validate: { required: true }}, 
        { display: "公司名称", name: "name", newline: false, type: "text", validate: { required: true }},
        { display: "公司简称", name: "shortname", newline: false, type: "text", validate: { required: true }},
        { display: "外文名称", name: "foreignname", newline: false, type: "text", validate: { required: true }},
        { display: "上级公司", name: "pid",textField: 'pname', newline: false,  type: "select",
	    	editor: {
	    		valueField: 'id',
	    		textField: 'name',
	    		width: 600,
    			treeLeafOnly: false,
	    		tree: {
	    			url: basePath + 'loadCorps',
	    			idFieldName: 'id',
	    			textFieldName: 'name', 
	    			parentIDFieldName: 'pid',
	    			slide: false,
	    			checkbox: false,
	    			isExpand: true,
	    		}
	    	}
        },
        { display: "备注", name: "remark", newline: false, type: "text" ,width:460 },
        
        { name: "ext_type", type: "hidden" },
        { name: "ext_id", type: "hidden" },
        
        { name: "creator_id", type: "hidden" },
        { display: "创建人", name: "creator_name", newline: false, type: "text" },
        { display: "创建时间", name: "create_time", newline: false, type: "text" },
        { name: "modifier_id", type: "hidden" },
        { display: "修改人", name: "modifier_name", newline: false, type: "text" },
        { display: "修改时间", name: "modify_time", newline: false, type: "text" }
        ],
        toJSON: JSON2.stringify
    });
	
	//审计字段
	mainform.setEnabled(['id', 'version','corp_id', 'creator_name', 'create_time', 'modifier_name', 'modifier_name', 'modify_time'], false)
	
	//增加表单校验
	$.metadata.setType("attr", "validate");
    LG.validate($("form"), { debug: true });
	
	//工具栏,
    //TODO 增加权限过滤控制
    var topitems = {
	      add: { id: 'add',text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'] },
	      update: { id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'] },
	      remove: { id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'] },
	      save: { id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT'] },
	      cancel: { id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT'] },
	      refresh: { id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'] },
//    	  { id: 'retrieve', text: '取数', click: btnClick, icon: 'view', status: ['OP_INIT', 'OP_ADD', 'OP_EDIT'] },{ line:true },
    }
    
	//工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar();
	
	//按钮状态控制
	var cm = new CardManager(toptoolbar, uiStatus, topitems)
	cm.setCardStatus('OP_INIT')

	function btnClick(item) {
	    switch (item.id) {
	        case "add":
	     	    cm.setCardStatus('OP_ADD')
	        	add()
	        	break;
	        case "update":
	        	var id = $('#mainform').find('input[name="id"]').val()
	        	if (id) {
	        		cm.setCardStatus('OP_EDIT')
	        	} else {
	        		LG.showError("请选择公司")
	        	}
	            break;
	        case "remove":
	        	remove()
	        	break;
	        case "save":
	        	save()
	        	break;
	        case "refresh":
	        	refresh()
	        	break;
	        case "cancel":
	        	mainform.setData(cm.getData())
	     	    cm.setCardStatus('OP_INIT')
	        	break;
	        case "retrieve1":
	        	alert(JSON2.stringify(mainform.getData()))
	        	break;
	    }
	}
	
	var add = function() {
    	mainform.setData(emptydata, true)
    	var selected = mainTree.getSelected()
    	if (selected && selected.data && selected.data.id) {
    		//设置公司字段
    		mainform.setData({
    			'pid' : selected.data.id,
    			'pname' : selected.data.name,
    			//默认创建人
    			creator_id: ctx.user_id,
    			creator_name: ctx.name,
    		})
    	}
	}
	
	//删除
	var remove = function(formData) {
		var formData = mainform.getData()
		if (formData.id) {
			
        	$.ligerDialog.confirm('确定删除吗?', function (confirm) {
    		if (confirm)
    			//查看是否有子节点
				LG.ajax({
					loading: '检查数据中...',
					url: basePath + "removeBefore",
					data: {
						pid: formData.id
					},
					success: function (data, message) {
						LG.showLoading('正在删除...');
						LG.ajax({
				            url : basePath + 'remove',
				            data: $.extend(formData, { modifier_id: ctx.user_id }),
				            success: function (data, msg) {
					        	mainform.setData(emptydata)
					        	//刷新树
								mainTree.reload()
								mainform.getEditor('pid').getTree().reload()
								
								LG.hideLoading();
					        	LG.showSuccess("删除成功")
				            },
				            error: function (message) {
				                LG.showError(message);
				            }
				        });
					},
					error: function (message) {
						LG.showError(message);
					}
				})
        	})
		} else {
			LG.showError("请选择公司")
		}
	}
	
	//刷新方法
	var refresh = function() {
		//刷新树
		mainTree.reload()
		mainform.getEditor('pid').getTree().reload()
		//刷新卡片
		var formData = mainform.getData()
		//alert(formData.id)
		if (formData.id) {
			LG.ajax({
                url : basePath + 'loadData',
                data: { id : formData.id },
                success: function (data, msg) {
		        	mainform.setData(data)
		     	    cm.setCardStatus('OP_INIT')
                },
                error: function (message) {
                    LG.tip(message);
                }
            });
		} else {
			mainform.setData(emptydata)
		}
	}
	//保存方法
	var save = function() {
        if (!LG.validator.form()) {
            LG.showInvalid();
            return;
        }
        var status = cm.getCardStatus()
        var url = basePath
        if (status == 'OP_EDIT') {
        	url += 'update'
        } else if (status == 'OP_ADD') {
        	url += 'add'
        } else {
        	LG.showError("非法界面状态")
        }
        
        LG.ajax({
            url : url,
            data: mainform.getData(),
            success: function (data, msg) {
                LG.showSuccess('保存成功!')
                cm.setData(data)
	     	    cm.setCardStatus('OP_INIT')
	     	    //重新加载树
                mainTree.reload()
                //加载公司参照
                mainform.getEditor('pid').getTree().reload()
            },
            error: function (message) {
                LG.tip(message);
                //detailWin.hide();
            }
        });
    }
	
	var validator = $("form").validate({
		//调试状态，不会提交数据的
		debug : true,
		errorPlacement : function(lable, element) {

			if (element.hasClass("l-textarea")) {
				element.addClass("l-textarea-invalid");
			} else if (element.hasClass("l-text-field")) {
				element.parent().addClass("l-text-invalid");
			}
			$(element).removeAttr("title").ligerHideTip();
			$(element).attr("title", lable.html()).ligerTip();
		},
		success : function(lable) {
			var element = $("#" + lable.attr("for"));
			if (element.hasClass("l-textarea")) {
				element.removeClass("l-textarea-invalid");
			} else if (element.hasClass("l-text-field")) {
				element.parent().removeClass("l-text-invalid");
			}
			$(element).removeAttr("title").ligerHideTip();
		},
		submitHandler : function() {
			alert("Submitted!");
		}
	});
	
	//初始化公司树
	var mainTree = $("#mainTree").ligerTree({
		url: basePath + 'loadCorps',
		//data: corpdata,
		idFieldName: 'id',
		textFieldName: 'name', 
		parentIDFieldName: 'pid',
		slide: false,
		checkbox: false,
		isExpand: true,
		onSelect: function onSelect(note) {
			cm.setData(note.data)
			mainform.setData(note.data)
		},
		onSuccess: function(data) {
			var obj = cm.getData()
			if (obj && obj.id)
				mainTree.selectNode(obj.id)
		}
	
	});
	
});