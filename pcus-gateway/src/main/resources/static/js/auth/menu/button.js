var basePath = rootPath + '/menu/';

//设置列表状态
var setGridStatus = function(grid, enable, filter) {

}

//设置左侧树状态
var setLeftStatus = function(enable) {
	$('.l-layout-left').css('z-index', enable ? 0 : -1)
	$('.l-layout-left').css('opacity', enable ? 1 : 0.4)
}

var setTopStatus = function(grid, enable) {

}

var getGdata = function(grid) {

}

var filterRecord = function(record) {
	delete record.__id 
	delete record.__previd
	delete record.__index
	delete record.__status
	delete record._editing
	delete record.children
	delete record.creator_name
	delete record.modifier_name
	return record
}

var out = function(value) {
	alert(JSON2.stringify(value))
}

var complete = false;

var visibleData = [{ visible: 'true', text: '显示' }, { visible: 'false', text: '隐藏' }];

//初始化数据
var initMenuData = {
		pid : "", name: "", no: "", morder: "", url: "", visible: true, mlevel: ""
}

$(function() {

	//上下文信息
	var ctx = new PageContext()
	
	//初始化界面
	$("#layout").ligerLayout({
		leftWidth : 200,
		height : '100%',
		space : 0,
		bottomHeight : 180,
		allowLeftCollapse : false,
		allowRightCollapse : false,
		allowTopResize : false,
		allowBottomResize : false
	});

	//界面状态改变触发
	var uiStatus = {
			'OP_INIT': function() {
				setLeftStatus(true)
			},
			'OP_EDIT': function() {
				setLeftStatus(false)
			},
			'OP_ADD': function() {
				setLeftStatus(false)
			}
	}

	var maingform = $("#mainform");
	$.metadata.setType("attr", "validate");
	LG.validate(maingform, { debug: true });

	var mainGrid = $("#mainGrid").ligerGrid({
//		headerImg: rootPath + '/icons/silkicons/table.png',title: '菜单模块',
		columns: [{ display: '按钮名称', name: 'name', align: 'center', width: '10%', minWidth: 60, validate: { required: true }, editor: { type: 'text' }},
		          { display: '按钮编码', name: 'code', align: 'center', width: '10%', minWidth: 60, validate: { required: true }, editor: { type: 'text' } },
		          { display: '排序号', name: 'morder', align: 'center', width: '10%', minWidth: 60, validate: { required: true, digits:true }, editor: { type: 'text' }},
		          { display: '是否显示', name: 'visible', align: 'center', isSort: false, width: '5%', minWidth: 60
		        	  , editor: { type: 'select', data: visibleData, valueColumnName: 'visible' }
		          , render: function (item) { return item.visible ? "显示" : "隐藏" }},
		          { display: '类型', name: 'mlevel', align: 'center', isSort: false, width:'5%', minWidth: 60
//		        	  , editor: { type: 'select', data: IsMenuData, valueColumnName: 'IsMenu' }
	        	  , render: function (item) {
	        		  return "按钮"
	        	  }},
	        	  { display: '权限地址', name: 'intercept_url', isSort: false, align: 'left', width: '12%', minWidth: 150, validate: { required: true }, editor: { type: 'text' }},
	        	  { display: '请求地址', name: 'url', isSort: false, align: 'left', width: '12%', minWidth: 200, validate: { required: true }, editor: { type: 'text' }},

		          { display: '图标', name: 'icon', align: 'center', isSort: false, width: '5%', minWidth: 50
		        	  , editor: { type: 'select', ext: function (rowdata) {
		        		  return { onBeforeOpen: function () {
		        			  currentComboBox = this
		        			  grid = mainGrid
		        			  f_openIconsWin()
		        			  return false;
		        		  },
		        		  render: function () {
		        			  return rowdata.icon;
		        		  }
		        		  }
		        	  }}
		          , render: function (item) { return !!item.icon ? "<div style='width:100%;height:100%;'><img src='" + item.icon + "' /></div>" : ""; }
		        },
	      ], 
    	  dataAction: 'server', pageSize: 10,
    	  //toolbar: {}, 
    	  sortName: 'no',
    	  width: '100%', height: '100%', //heightDiff: -5, 
    	  checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
    	  fixedCellHeight: true, rowHeight: 25,

    	  url: basePath + 'loadPageMenus',
    	  parms: {
    		  pid: parentId
    	  }
//    	  delayLoad: true,		//初始化不加载数据

	})

	//编辑前事件，校验
	mainGrid.on('beforeSubmitEdit', function (e) {
		if (!LG.validator.form()) {
			LG.showInvalid();
			return false;
		}
		return true;
	});

	//编辑后事件
	mainGrid.on('afterSubmitEdit', function (e) {
		var isAddNew = e.record['__status'] == "add";
		var data = {}
		if (isAddNew){
			data = $.extend({ pid: parentId, no: parentNo, mlevel: mlevel }, e.newdata)
		} else {
			//新增
			data = $.extend(filterRecord(e.record), e.newdata)
			data.modifier_id = ctx.user_id
		}
		
		LG.ajax({
			loading: '正在保存数据中...',
			url: basePath+(isAddNew ? "add" : "update") + ".do",
			data: data,
			success: function () {
//				LG.tip('保存成功!');
				LG.showSuccess("保存成功")
				cm.setCardStatus("OP_INIT")
				refresh()
			},
			error: function (message) {
				LG.showError(message);
			}
		});
	});
	
	var refresh = function() {
		mainGrid.setParm('pid', parentId)
		mainGrid.reload()
	}
	
	var remove = function(selected) {
		$.ligerDialog.confirm('确定删除吗?', function (confirm) {
			if (!confirm) return

			if (!selected.no) {
				mainGrid.deleteRow(selected);
				return;
			}
			LG.ajax({
				url: rootPath + 'remove.do',
				loading: '正在删除中...',
				data:{ id : selected.id },
				success: function () {
					LG.showSuccess('删除成功')
					
					mainGrid.reload()
				},
				error: function (message) {
					LG.showError(message);
				}
			});
		});
	}
	

	//工具栏
    var topitems = {
	      add: { id: 'add',text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT'] },
	      edit: { id: 'edit', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT'] },
	      remove: { id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT'] },
	      save: { id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT'] },
	      cancel: { id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT'] },
	      refresh: { id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT'] },
//    	  { id: 'retrieve', text: '取数', click: btnClick, icon: 'view', status: ['OP_INIT', 'OP_ADD', 'OP_EDIT'] },{ line:true },
    }
	
	//工具栏
	var toptoolbar = $("#toptoolbar").ligerToolBar();

	var cm = new CardManager(toptoolbar, uiStatus, topitems)
	cm.setCardStatus('OP_INIT')

	function btnClick(item) {

		var editingrow = mainGrid.getEditingRow();

		switch (item.id) {
		case "add":
			if (editingrow == null) {
				if (!parentId) {
					LG.showError("请选择父功能节点")
					return
				}
				mainGrid.addEditRow(initMenuData);
				cm.setCardStatus('OP_ADD')
			}
			break;
		case "edit":
			if (editingrow == null) {
				var row = mainGrid.getSelectedRow();
				if (!row) { LG.showError('请选择行'); return; }
				mainGrid.beginEdit(row);
				cm.setCardStatus('OP_EDIT')
			}
			break;

		case "remove":
			var selected = mainGrid.getSelected();
			if (selected) {
				
				if (selected.mlevel == 1) {
					//查看是否有子节点
					LG.ajax({
						loading: '检查数据中...',
						url: basePath + "beforeRemove.do",
						data: {
							pid: selected.id
						},
						success: function (data, message) {
							remove(selected)
						},
						error: function (message) {
							LG.showError('存在子菜单，请清空后删除');
						}
					});
				} else {
					remove(selected)
				}
			}
			else {
				LG.showError('请选择行!');
			}
			break;
		case "save":
			if (editingrow != null) {
				mainGrid.endEdit(editingrow);
			}
			break;
		case "cancel":
			if (editingrow != null) {
				mainGrid.cancelEdit(editingrow);
				if (editingrow.__status == "add") {
					mainGrid.remove(editingrow)
				}
			}
			cm.setCardStatus('OP_INIT')
			break;
		case "refresh":
			mainGrid.setParm('pid', parentId)
			mainGrid.reload()
			break;
		case "retrieve":
			alert(parentId + '#' + parentNo + '#' + mlevel)
			break;
		}

	}
	
	/**
	 * 完成加载
	 */
	complete = true;
});