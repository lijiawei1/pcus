var basePath = rootPath + '/sys/dict/';
//设置列表状态
var setGridStatus = function(grid, enable, filter) {

}

var ctx = new PageContext()

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
	delete record.__id;
	delete record.__previd;
	delete record.__index;
	delete record.__status;
	delete record._editing;
	delete record.children;
	delete record.creator_name;
	delete record.modifier_name;
	delete record.ischecked;
	return record;
}

//当前选中的父菜单编码
var mst_id;

var visibleData = [{ visible: 'true', text: '显示' }, { visible: 'false', text: '隐藏' }];

//初始化数据
var initMenuData = {
		pid : "", dictmx_name: "", dictmx_code: "", morder: "",mst_id :""
}
var newdata = {version:0,creator_id:ctx.user_id,corp_id:ctx.corp_id,dept_id:ctx.dept_id};
$(function() {

	//初始化界面
	$("#layout").ligerLayout({
		leftWidth : 200,
		height : '100%',
		space : 0
		/* centerBottomHeight: 200,
		bottomHeight : 180,
		allowLeftCollapse : false,
		allowRightCollapse : false,
		allowTopResize : false,
		allowBottomResize : false*/
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
	
	//工具栏,
    var topitems = {
		items : [
			{ id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT'] },
			{ id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT'] },
			{id: 'add', text: '增加类型', click: btnClick, icon: 'add', status: ['OP_INIT']},
			{ id: 'edit', text: '修改类型', click: btnClick, icon: 'edit', status: ['OP_INIT'] },
			{ id: 'remove', text: '删除类型', click: btnClick, icon: 'delete', status: ['OP_INIT'] },
			{ id: 'addmx', text: '增加字典', click: btnClick, icon: 'add', status: ['OP_INIT'] },
			{ id: 'editmx', text: '修改字典', click: btnClick, icon: 'edit', status: ['OP_INIT'] },
			{ id: 'removemx', text: '删除字典', click: btnClick, icon: 'delete', status: ['OP_INIT'] },
            { id: 'clearcache', text: '清缓存', click: btnClick, icon: 'delete', status: ['OP_INIT'] }
		]
    };
	
	function btnClick(item) {
		var editingrow = grid.getEditingRow();
		switch (item.id) {
			case "add":
                LG.openFormDialog("#formDlg", fields, validate, options, newdata, save,true);
				break;
			case "edit":
				var selectedNode = tree.getSelected();
				if(!selectedNode)
					LG.showError("请选择需要修改的字典类型!")
                LG.openFormDialog("#formDlg", fields, validate, options, selectedNode.data, save,false);
				break;
			case "remove":
				var selectedNode = tree.getSelected();
				if(!selectedNode)
					LG.showError("请选择需要删除的字典类型!")
				remove(selectedNode.data);
				break;
			case "addmx":
				var selectedNode = tree.getSelected();
				if(!selectedNode){
					LG.showError("请选择需要增加的字典类型!")
					return;
				}
				//initMenuData.mst_id = selectedNode.data.id;
				grid.addEditRow();
				// cm.setCardStatus('OP_ADD');
				break;
			case "editmx":
				if (editingrow == null) {
					var row = grid.getSelectedRow();
					if (!row) { LG.showError('请选择行'); return; }
					
					grid.columns[2].editor.grid.parms={mst_id: mst_id,id:row.id};
					grid.beginEdit(row);
					// cm.setCardStatus('OP_EDIT')
				}
				break;
			case "removemx":
				var selected = grid.getSelected();
				if (selected) {
					
					//查看是否有子节点
					LG.ajax({
						loading: '检查数据中...',
						url: basePath + "beforeRemoveMx.do",
						data: {
							pid: selected.id
						},
						success: function (data, message) {
				    		$.ligerDialog.confirm('确定删除吗?', function (confirm) {
				    			if (!confirm) return

				    			LG.ajax({
				    				url: rootPath + 'removeMx.do',
				    				loading: '正在删除中...',
				    				data:{ id : selected.id, version: selected.version },
				    				success: function () {
				    					LG.showSuccess('删除成功')
				    					grid.reload();
				    				},
				    				error: function (message) {
				    					LG.showError(message);
				    				}
				    			});
				    		});
						},
						error: function (message) {
							LG.showError('存在子菜单，请清空后删除');
						}
					})
				}
				else {
					LG.showError('请选择行!');
				}
				break;
			case "save":
				if (editingrow != null) {




					grid.endEdit(editingrow);
				}
				break;
			case "cancel":
				if (editingrow != null) {
					grid.cancelEdit(editingrow);
					if (editingrow.__status == "add") {
						grid.remove(editingrow)
					}
				}
				// cm.setCardStatus('OP_INIT')
				break;
			case "clearcache":
                LG.ajax({
                    loading: '检查数据中...',
                    url: "/tms/cache/clearDict",
                    success: function (data, message) {
                       LG.tip('清除成功');
                    },
                    error: function (message) {
                        LG.tip('清除失败');
                    }
                });
				break;
		}
	};
	
	var toptoolbar = $("#toptoolbar").ligerToolBar(topitems);
	
	// var cm = new CardManager(toptoolbar, uiStatus, topitems)
	// cm.setCardStatus('OP_INIT');
	var treeDatas = {};
	//左侧树结构
    var tree = $("#maintree").ligerTree({
        url: basePath + 'loadDictTree.do',
        checkbox: false,
		idFieldName: 'id',
		textFieldName: 'dict_name', 
        onClick: function (node) {
        	//点击左侧树事件..
			if (!node.data || !node.data.id) return;
			mst_id = node.data.id;
			grid.setParm('mst_id', mst_id);
			//设置弹出框grid的mst_id 
			grid.columns[2].editor.grid.parms={mst_id: mst_id};
			grid.reload();
			toptoolbarFn(node.data.id);
        },
		onAfterAppend : function(node,data){
			data.forEach(function(treeData,treeIndex){
				treeDatas[treeData.id] = {
					add : treeData.add || false,
					addmx : treeData.addmx || false,
					edit : treeData.edit || false,
					editmx : treeData.editmx || false,
					remove : treeData.remove || false,
					removemx : treeData.removemx || false
				}
			})
		}
    });

	function toptoolbarFn(id) {
		for(var i in treeDatas[id]){
			if(treeDatas[id][i] == 'true'){
				toptoolbar.setEnabled(i);
			}else{
				toptoolbar.setDisabled(i);
			}
		}
	}
    var grid = $("#maingrid").ligerGrid({
        columns:
                [
                    { display: '名称', name: 'dictmx_name', id:'dictmx_name', width: '40%', align: 'center', type: 'text' , editor: { type: 'text' }},
                    { display: '编码', name: 'dictmx_code', width: '30%', align: 'center', type: 'text' , editor: { type: 'text' }},
                    { display: '父名称', name: 'pid', align: 'center', width: '20%', minWidth: 60, textField: 'pname',
                    	editor: {
                            type: 'popup',
                            valueField: 'id', textField: 'dictmx_name',
                            grid: {
                                columns: [
                                          { display: '名称', name: 'dictmx_name', width: 250 },
                                          { display: '编码', name: 'dictmx_code', width: 150 }
                                          ], 
                                usePager: false,   headerRowHeight :23,rowHeight :22,checkbox: false,
                                url: basePath + 'loadDictMxGrid.do'
                                }
                    	}
                    },

                    { display: '排序号', name: 'morder', align: 'center', width: '10%', minWidth: 60, editor: { type: 'number' }}
                ], 
                width: '100%', height: '100%',autoStretch: true, heightDiff: -20,rowHeight :30,editorTopDiff :3,
                pageSize: 50, usePager: false,sortName: 'morder',checkbox: false,enabledSort:false,
                dataAction: 'server', url: basePath + 'loadDictMxTree.do',delayLoad: true ,
                enabledEdit: true, clickToEdit: false,
                tree: {
                    columnId: 'dictmx_name',
                    //columnName: 'name',
                    idField: 'id',
                    parentIDField: 'pid'
                }
    });

    grid.bind('beforeSubmitEdit', function (e) {
    	var isAddNew = e.record['__status'] == "add";
		var data = {}
		if (isAddNew){
			//新增
			data = $.extend({ mst_id: mst_id }, e.newdata);

		} else {
			//新增
			data = $.extend(filterRecord(e.record), e.newdata);
		}

		LG.ajax({
			loading: '正在保存数据中...',
			url: basePath+(isAddNew ? "addMx" : "updateMx") + ".do",
			data: data,
			async: false,
			success: function () {
				LG.tip("保存成功");
				// cm.setCardStatus("OP_INIT");
				refresh();
				return true;
			},
			error: function (message) {
				if ((message || '').indexOf('违反唯一约束条件') != -1) {
					LG.showError("字典分类编码[" + data['dictmx_code'] + "]已存在");
					return false;
				} else {
					LG.tip(message);
				}
			}
		});

		return false;
    });
    
    
    //弹出框fields 
    var fields = [
        { name: "id", type: "hidden" },
        { name: "version",type: "hidden" },
        { name: "creator_id" ,type: "hidden" },
        { name: "modifier_id" ,type: "hidden" },
        { name: "corp_id",type: "hidden" },
        { name: "dept_id",type: "hidden" },
        { display: "编码", name: "dict_code", type: "text"},
        { display: "名称", name: "dict_name", type: "text"}
        ];
    var validate = {
		rules: {
			dict_code: { required: true },
			dict_name: { required: true }
		},
		messages: {
			dict_code: { required: "编码不能为空" },
			dict_name: { required: "名称不能为空" }
		}
	};
	var options = {
		width: 390,
		title: '增加类型'
	};
        
	function save(panel, form, isAdd) {

		var data = form.getData();

		if (data) {
			//校验
			if (!form.valid()) {
				form.showInvalid();
				return;
			}

			//提交数据
			LG.ajax({
				url: basePath + (isAdd ? "add.do" : "update.do"),
				data: data,
				success: function () {
					//grid.loadData();
					tree.reload();
					panel.close();
					LG.tip('保存成功!');
				},
				error: function (message) {

					if ((message || '').indexOf('违反唯一约束条件') != -1) {
						LG.showError("字典分类编码[" + data['dict_code'] + "]已存在");
					} else {
						LG.tip(message);
					}

				}
			});
		}
	}

	var remove = function(selected) {
		$.ligerDialog.confirm('确定删除吗?', function (confirm) {
			if (!confirm) return

			LG.ajax({
				url: rootPath + 'remove.do',
				loading: '正在删除中...',
				data:{ id : selected.id },
				success: function () {
					LG.showSuccess('删除成功')
					tree.reload()
				},
				error: function (message) {
					LG.showError(message);
				}
			});
		});
	}

	var refresh = function() {
		//tree.reload();
		//tree.selectNode();
		grid.setParm('mst_id', mst_id);
		grid.reload();
	}
});