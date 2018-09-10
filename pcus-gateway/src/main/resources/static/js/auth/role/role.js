var basePath = rootPath + '/auth/role/';
//空对象
var emptydata = { 'id': '', 'version': '0', 
		'rolecode': '', 'rolename': '',
		'corp_id': '', 'corpname': '',
		'creator_name':'', 'modifier_name': '',
		'creator_id':'', 'modifier_id': '',
		'create_time':'', 'modify_time': '', 
		'remark': ''}
	
//设置表单状态
var setFormStatus = function(form, enable, filter) {
	form.setEnabled(['rolecode', 'rolename','remark'], enable);
	setLeftStatus(!enable)
	setTopStatus(filter, !enable)
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
};

var setTopStatus = function(form, enable) {
//	$('#filterform').).css('z-index', enable ? 0 : -1)
	$('#filterform').css('opacity', enable ? 1 : 0.4)
	form.setEnabled(['filtercorp', 'filtername'], enable);
}

function out(value) {
	alert(JSON2.stringify(value));
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
		//heightDiff: -74
	});

	var contentLayout = $("#content").ligerLayout({
		allowTopResize:false,
		topHeight: 200,
		height: '100%',
		space: 0,
		heightDiff: -20
	});
	
	$("#selectRole").ligerLayout({
		leftWidth : 200,
		height : '100%',
		space : 0,
		/*bottomHeight : 180,
		allowLeftCollapse : false,
		allowRightCollapse : false,
		allowTopResize : false,
		allowBottomResize : false */
	});

	addMask($(".l-layout-left"));

	$("#children-tab").ligerTab({
		height: '100%',
		width: '100%',
		changeHeightOnResize: true,
		//heightDiff: -29
	});

	//界面状态改变触发事件
	var uiStatus = {
		//进入初始状态
		'OP_INIT' : function() {
			setFormStatus(mainform, false, filterform);
		},
		//进入编辑状态
		'OP_EDIT' : function() {
			//缓存当前页面的数据
			cm.setData(mainform.getData())
			//启用编辑
			setFormStatus(mainform, true, filterform)
		},
		//进入新增状态
		'OP_ADD' : function() {
			cm.setData(mainform.getData())
			setFormStatus(mainform, true, filterform)
		}
	}
	
	var loadData = function() {
		   var filterData = {
				   corp_id : filterform.getEditor('filtercorp').getValue(),
				   rolename : filterform.getEditor('filtername').getValue(),
		   }
		   mainTree.clear()
		   mainTree.loadData(null, basePath + 'loadRoles', filterData)
	}
	
	//用户表单
	var mainformid = '#mainform'
	var mainform = $(mainformid).ligerForm({
		inputWidth: 170, labelWidth: 90, space: 30,
		fields: [
		         { name: "id", type: "hidden" },
		         { name: "version", type: "hidden" },
		         
		         //TODO  查询太频繁，可能存在性能问题
		         { display: "角色编码", name: "rolecode", newline: true, type: "text", 
		        	 validate: { required: true, checkRoleUnique: true, messages: { required: "角色编码不能为空", checkRoleUnique: "角色编码在系统已存在" } }
		         }, 
		         { display: "角色名称", name: "rolename", newline: false, type: "text", 
		        	 validate: { required: true, checkRoleUnique: true, messages: { required: "角色名称不能为空", checkRoleUnique: "角色名称在系统已存在" } },
//		        	remote 太弱？
//	        	 	validate: { remote: {
//	        		    url: basePath + "checkRoleUnique.do",     //后台处理程序
//	        		    type: "get",               //数据发送方式
//	        		    dataType: "json",      //接受数据格式  
//	        		    data: {                     	//要传递的数据
//	        		    	rolename: $('#mainform').find('input[name="rolename"]').val(),
//	        		        rolecode: $('#mainform').find('input[name="rolecode"]').val(),
//	        		        id: $('#mainform').find('input[name="id"]').val(),
//	        		    }
		         },

		         { name: "corp_id", type: "hidden" },
		         { display: "建立公司", name: "corpname", newline: false,  type: "text", validate: { required: true }},

		         //审计字段
		         { display: "备注", name: "remark", newline: false, type: "text" ,width:460 },

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
	mainform.setEnabled(['id', 'version','corp_id', 'corpname', 'creator_name', 'create_time', 'modifier_name', 'modifier_name', 'modify_time', 'last_login_ip', 'last_login_time'], false)
	
	
	/****************************************************工具栏********************************************/
	//工具栏,
    var topitems = {
	      add: { id: 'add',text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'] },
	      update: { id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'] },
	      remove: { id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'] },
	      save: { id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT'] },
	      cancel: { id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT'] },
	      refresh: { id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'] },
//    	  { id: 'retrieve', text: '取数', click: btnClick, icon: 'view', status: ['OP_INIT', 'OP_ADD', 'OP_EDIT'] },{ line:true },
    }
    
    var toptoolbar = $("#toptoolbar").ligerToolBar();
	
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
	        		f_validate()
	        	} else {
	        		LG.showError("请选择角色")
	        	}
	            break;
	        case "remove":
	        	$.ligerDialog.confirm('确定删除吗?', function (confirm) {
	        		if (confirm)
	        			remove()
	        	})
	        	break;
	        case "save":
	        	save()
	        	break;
	        case "refresh":
	        	loadData()
	        	break;
	        case "cancel":
	        	mainform.setData(cm.getData(), false)
	     	    cm.setCardStatus('OP_INIT')
	        	break;
	        case "retrieve":
	        	alert(JSON2.stringify(mainform.getData()))
	        	break;
	    }
	}
	
	function add() {
		
		//设置默认的公司
		var selected = filterform.getEditor("filtercorp")
		
		mainform.setData($.extend(emptydata, {
			//默认公司
			corp_id: selected ? selected.getValue() : ctx.corp_id, 
			corpname: selected ?  selected.getText() : ctx.corpname,
			//默认创建人
			creator_id: ctx.user_id,
			creator_name: ctx.name,
		}))
		
		f_validate()
	}
	
	function remove() {
		//刷新卡片
		var id = $('#mainform').find('input[name="id"]').val();
		var version = $('#mainform').find('input[name="version"]').val();
		if (id) {
			LG.showLoading('正在删除...');
			LG.ajax({
                url : basePath + 'remove',
                data: { id : id, version : version },
                success: function (data, msg) {
                	LG.hideLoading();
		        	mainform.setData(emptydata)
		        	//刷新树
					//mainTree.reload()
		        	loadData()
		        	LG.showSuccess("删除成功")
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
		} else {
			LG.showError("请选择人员")
		}
	}
	
	//保存方法
	function save() {
        if (!LG.validator.form()) {
            LG.showInvalid();
            return;
        }
        var status = cm.getCardStatus()
        var url = basePath
        if (status == 'OP_EDIT') {
        	url += 'update.do'
        } else if (status == 'OP_ADD') {
        	url += 'add.do'
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
	     	    loadData()
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    }
	
	/*************************************************************validator******************************************************/
	function f_validate() {
		//增加表单校验
		$.metadata.setType("attr", "validate");
	    LG.validate($('#mainform'), { debug: true });
	}
	
	 //异步验证用户名
    $.validator.addMethod("checkRoleUnique", function(value, element){
    	
        var result = false;
        
        var id_data = {
    	    	rolename: $('#mainform').find('input[name="rolename"]').val(),
    	        rolecode: $('#mainform').find('input[name="rolecode"]').val(),
    	        id: $('#mainform').find('input[name="id"]').val(),
    	}
        $.ajax({
            cache: false,
            async: false,
            url: basePath + "checkRoleUnique",
            data: id_data,
            dataType: 'json',
            type: 'get',
            success: function (data) {
            	result = data
            },
            error: function (result, b) {
            	result = true
            }
        })
        return result
    }, "角色编码或名已经存在");
	
	var validator = $('#mainform').validate({
		//调试状态，不会提交数据的
		debug : true,
		onsubmit: true,//是否提交表单时触发
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
	
	//初始化角色
	var mainTree = $("#mainTree").ligerTree({
		idFieldName: 'id',
		textFieldName: 'rolename', 
		parentIDFieldName: 'pid',
		slide: false,
		checkbox: false,
		isExpand: true,
		nodeWidth: 150,
		onSelect: function onSelect(note) {
			cm.setData(note.data)
			mainform.setData(note.data)
		},
		onSuccess: function(data) {
			//加载角色树成功后选中上次的节点
			var obj = (cm  ? cm.getData() : null)
			if (obj && obj.id)
				mainTree.selectNode(obj.id)
		}
	
	})
	
	/**************************************************************filterform*********************************************/
	//过滤框
	var filterform = $('#filterform').ligerForm({
		inputWidth: 150, labelWidth: 70, space: 10,
		fields: [
			{ display: "公司", name: "filtercorp", textField: 'filtercorpname', newline: false,  type: "select",
				editor: {
					valueField: 'id',
					textField: 'name',
			        treeLeafOnly: false,
			        width : 300, 
			        selectBoxWidth: 300,
			        selectBoxHeight: 250,
			        cancelable: false,
					tree: {
						url: basePath + 'loadCorps',
						idFieldName: 'id',
						textFieldName: 'name', 
						parentIDFieldName: 'pid',
						slide: false,
						checkbox: false,
						isExpand: true,
						onSuccess: function(data) {
							filterform.getEditor("filtercorp")._changeValue(ctx.corp_id, ctx.corpname, true)
						}
					},
					onSelected: function (newvalue) {
			    		loadData()
					}
				}
			},
			{ display: "角色名称", name: "filtername", newline: false,  type: "text", editor: {
				 onBlur: function() {
					 loadData()
				 }
			} },
		]
	})
	
	//按钮状态控制
	var cm = new CardManager(toptoolbar, uiStatus, topitems);
	cm.setCardStatus('OP_INIT');

	//高度自适应
	(function autoSetGridHeight(){
		var $filterForm=$("#filterform"),
			$layoutCenter=$("#layout-center"),
			$content=$("#content"),
			$contentForm=$("#mainform"),
			$tabContent=$("#children-tab").children(".l-tab-content:eq(0)");
		var debounceResetHeight = debounce(function () {
			var contentHeight = $layoutCenter.height()-$filterForm.height()-98,
				contentFormHeight = $contentForm.height() + 23;
			if(contentFormHeight>180) contentFormHeight=165;
			var centerHeight = contentHeight - contentFormHeight -1;
			$content.height(contentHeight);
			$content.children(".l-layout-top:eq(0)").height(contentFormHeight);
			$content.children(".l-layout-center:eq(0)").height(centerHeight);
			$content.children(".l-layout-center:eq(0)").children(".l-layout-content").height(centerHeight);
			$tabContent.height(centerHeight-27);
		}, 200, true);
		debounceResetHeight();
		$(window).resize(function () {
			debounceResetHeight();
		});
	})();
});