
var basePath = rootPath + '/auth/usergroup/';
//空对象
var emptydata = {
	'id' : '',
	'version' : '0',
	'code' : '',
	'groupname' : '',
	'groupcode' : '',
	'pid' : '',
	'pname' : '',
	'creator_name' : '',
	'modifier_name' : '',
	'creator_id' : '',
	'modifier_id' : '',
	'create_time' : '',
	'modify_time' : '',
	'remark' : ''
}

//设置表单状态
var setFormStatus = function(form, enable) {
	form.setEnabled(["groupcode", "groupname", "pid", "remark"], enable);
}

var setLeftStatus = function(enable) {
    if (enable){;
    	$(".customMask").hide();
    }
    else{
    	$(".customMask").show();
    }
};

function addMask(target){
	var mask = $('<div class="customMask" style="display: none; height: 100%;background: #e1e1e1; font-size: 1px; left: 0; opacity: 0.5; overflow: hidden; position: absolute;top :0px; width: 100%; z-index: 9000;"></div>');
	target.append(mask);
}

$(function() {

	//上下文信息
	var ctx = new PageContext()
	
	//初始化界面
	var layout=$("#layout").ligerLayout({
		minLeftWidth:200,
		leftWidth : 200,
		height : '100%',
		space : 1
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
    var mainform = $("form").ligerForm({
        inputWidth: 170, labelWidth: 90, space: 30,
        fields: [
        { name: "id", type: "hidden" },
        { name: "version", type: "hidden" },
        { display: "用户组编码", name: "groupcode", newline: true, type: "text", validate: { required: true }}, 
        { display: "用户组名称", name: "groupname", newline: false, type: "text", validate: { required: true }},
//        { display: "上级用户组", name: "pid",textField: 'pname', newline: false,  type: "select",
//	    	editor: {
//	    		valueField: 'id',
//	    		textField: 'groupname',
//	    		width: 600,
//    			treeLeafOnly: false,
//	    		tree: {
//	    			url: basePath + 'loadGroups.do',
//	    			idFieldName: 'id',
//	    			textFieldName: 'groupname', 
//	    			parentIDFieldName: 'pid',
//	    			slide: false,
//	    			checkbox: false,
//	    			isExpand: true,
//	    		}
//	    	}
//        },
        //审计字段
        { display: "创建人", name: "creator_name", newline: false, type: "text" },
        { display: "创建时间", name: "create_time", newline: false, type: "text" },
        { display: "修改人", name: "modifier_name", newline: false, type: "text" },
        { display: "修改时间", name: "modify_time", newline: false, type: "text" },
        { display: "备注", name: "remark", newline: false, type: "text" ,width:460 },
        { name: "creator_id", type: "hidden" },
        { name: "modifier_id", type: "hidden" },
        { name: "id", type: "hidden" },
        { name: "version", type: "hidden" },
        { name: "dr", type: "hidden" },
        { name: "corp_id", type: "hidden" },
        { name: "dept_id", type: "hidden" }
        ],
        toJSON: JSON2.stringify
    });
	//禁用编辑
	mainform.setEnabled(['id', 'version', 'creator_name', 'create_time', 'modifier_name', 'modifier_name', 'modify_time'], false)
	
	//增加表单校验
	$.metadata.setType("attr", "validate");
    LG.validate($("form"), { debug: true });
	
    var topitems = {
  	      add: { id: 'add',text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'] },
	      update: { id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'] },
	      remove: { id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'] },
	      save: { id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT'] },
	      cancel: { id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT'] },
	      refresh: { id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'] },
    }
    
	//工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar();
	
	//按钮状态控制
	var cm = new CardManager(toptoolbar, uiStatus, topitems)
	cm.setCardStatus('OP_INIT')

	function btnClick(item) {
	    switch (item.id) {
	        case "add":
	     	    cm.setCardStatus('OP_ADD');
	        	add();
	        	break;
	        case "update":
	        	var id = $('#mainform').find('input[name="id"]').val()
	        	if (id) {
	        		cm.setCardStatus('OP_EDIT')
	        	} else {
	        		LG.showError("请选择用户组")
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
	        	mainform.setData(cm.getData(), false)
	     	    cm.setCardStatus('OP_INIT')
	        	break;
	        case "retrieve":
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
    			'corpname' : selected.data.name
    		})
    	}
	}
	
	var remove = function() {
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
			LG.showError("请选择用户组")
		}
	}
	
	//刷新方法
	var refresh = function() {
		//刷新树
		mainTree.reload();
		//刷新卡片
		var formData = mainform.getData()
		if (formData.id) {
			LG.ajax({
                url : basePath + 'loadData',
                data: { id : formData.id },
                success: function (data, msg) {
		        	mainform.setData(data)
		     	    cm.setCardStatus('OP_INIT')
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
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
                //grid.loadData();
                LG.showSuccess('保存成功!')
	        	mainform.setData(data)
	     	    cm.setCardStatus('OP_INIT')
	     	    //重新加载树
                mainTree.reload()
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
	
	//初始化用户组树
	var mainTree = $("#mainTree").ligerTree({
		url: basePath + 'loadGroups',
		//data: corpdata,
		idFieldName: 'id',
		textFieldName: 'groupname', 
		parentIDFieldName: 'pid',
		slide: false,
		checkbox: false,
		isExpand: true,
		onSelect: function onSelect(note) {
			cm.setData(note.data.object);
			mainform.setData(note.data, true);
            userGrid.set('parms', [{
                    name:'group_id',value: note.data.id
                }]);
			userGrid.reload();
		}
	});
	
    //工具栏
    var detailToolbar = {
        items: [{
            text: '添加用户',
            id: 'AddLine',
            click: lineItemClick,
            img: "/icons/silkicons/add.png"
        }, {
            text: '删除用户',
            id: 'DelLine',
            click: lineItemClick,
            img: "/icons/silkicons/delete.png"
        }]
    };
	
    
    //工具栏事件
    function lineItemClick(item) {
    	
    	switch (item.id) {
	        case "AddLine":
	        	var id = $("#id",$("form")).val();
	        	if(id){
	        		f_addUser(id);
	        	}
	        	else{
	        		LG.showError("请选中一个用户组!");
	        	}
	            break;
	        case "DelLine":
	            var selected = userGrid.getSelectedRows();
	            if (!selected || selected.length<=0) {
	                LG.tip('请选择行!');
	                return
	            }
	        	var ids = [];
	        	for(var i in selected){
	        		ids[i]= selected[i].id;
	        	}
	            LG.ajax({
	                url: basePath + "removeUser",
	                loading: '正在删除中...',
	                data: {ids:ids.join(",")},
	                success: function(result) {
	                	userGrid.reload();
	                },
	                error: function(message) {
	                    LG.showError(message);
	                }
	            });
	            
	            break;
    	}
    }
    
	var userGrid = $("#userGrid").ligerGrid({
		columns : [{
            display: "账号",
            name: "account",
            width: 200
        }, {
            display: "用户名",
            name: "name",
            width: 150
        }, {
            display: "公司",
            name: "corpname",
            width: 150
        }, {
			display : '备注',
			name : 'remark',
			id : 'remark',
			width : 300
		}],
    headerRowHeight: 23,
    width: '100%',
    height: '100%',
    heightDiff: -10,
    rowHeight: 22,
    editorTopDiff: 3,
    usePager:false,
    sortName: 'create_time',
    sortOrder: "asc",
    checkbox: true,
    toolbar: detailToolbar,
    enabledEdit: false,
    dataAction: 'server',
    url: basePath + 'loadGroupUserGrid',
    delayLoad: true
});
	
    function selectedUser(data, currentID) {
        if (data) {
        	var ids = [];
        	for(var i in data){
        		ids[i]= data[i].id;
        	}
            LG.ajax({
                url: basePath + "addUser",
                loading: '正在添加中...',
                data: {ids:ids.join(",") ,group_id : currentID},
                success: function(result) {
                    userGrid.set('parms', [{
                        name:'group_id',value: currentID
                    }]);
                	userGrid.reload();
                },
                error: function(message) {
                    LG.showError(message);
                }
            });
        }

    }
	
    function f_addUser(currentID) {
        var fn = $.ligerui.getPopupFn({
            onSelect: function(e) {
            	selectedUser(e.data, currentID);
            },
            condition: {
                fields: [{
                    name: 'account',
                    label: '账号',
                    width: 220,
                    type: 'text'
                }]
            },
            grid: {
                columns: [{
                    display: "账号",
                    name: "account",
                    width: 200
                }, {
                    display: "用户名",
                    name: "name",
                    width: 150
                }, {
                    display: "公司",
                    name: "corpname",
                    width: 150
                }],
                parms:[{name:'currentID',value: currentID}],
                rowHeight: 22,
                url: basePath + 'loadUserGrid',
                pageSize: 20,
                sortName: 'create_time',
                checkbox: true
            }
        });
        fn()
    }
});